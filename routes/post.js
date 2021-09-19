const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({ 
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); //파일명은 업로드한 날짜.(덮어쓰기 방지)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //파일 용량 제한.
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file); 
  res.json({ url: `/img/${req.file.filename}` }); //업로드 완료 후 url을 프론트에 보내줌.
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url, //이미지를 가져오기.
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    //[#노드, #익스프레스 ]
    //[노드, 익스프레스]
    //[findOrCreate(노드),findOrCreate(익스프레스)]
    //[해시태그,false],[해시태그,true] :false면 있던것임.
    //배열 안에는 객체만 넣어줘도 됨.
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.delete('/:id', async(req,res,next)=>{
  try{
    await Post.destroy({where :{ id : req.params.id, userId: req.user.id}});
    res.send('OK');
  }catch(error){
    console.error(error);
    next(error);
  }
})
router.post('/:id/like',async (req,res,nex)=>{
  try {
    const user = await User.findOne({ where: { id: req.user.id } });//내가 누군지를 찾고
    if (user) {
      await Post.addLike([parseInt(req.params.id, 10)]); //게시글아이디
      res.send('좋아요를 눌렀습니다.');
    } else {
      res.status(404).send('실패');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }

});
router.delete('/:id/like',async(req,res,next)=>{
  try {
    const user = await User.findOne({ where: { id: req.user.id } });//내가 누군지를 찾고
    if (user) {
      await Post.removeLike([parseInt(req.params.id, 10)]); //게시글아이디
      res.send('좋아요를 취소했습니다.');
    } else {
      res.status(404).send('실패');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }

});
module.exports = router;