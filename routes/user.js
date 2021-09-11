const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();
// follow관계 헷갈릴수 있으니 주석 달아주면서 작업하기.
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });//내가 누군지를 찾고
    if (user) {
      await user.addFollowings([parseInt(req.params.id, 10)]); //setFollowings : 기존에 등록되어있던것들 다 제거하고 추가함, 데이터 날라갈 위험 있음. , removeFollowings
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });//내가 누군지를 찾고
    if (user) {
      await user.removeFollowings([parseInt(req.params.id, 10)]); //setFollowings : 기존에 등록되어있던것들 다 제거하고 추가함, 데이터 날라갈 위험 있음. , removeFollowings
      res.send('언팔하였습니다.');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router; //exports는 router로 설정해주기.