const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser_email = await User.findOne({ where: { email  } });
    const exUser_nick = await User.findOne({where : {nick}   }); 
    if (exUser_email) {
      return res.redirect('/join?error=exist'); 
    }
    if (exUser_nick) {
      return res.redirect('/join?error2=exist'); 
    }
    const hash = await bcrypt.hash(password, 12); //비밀번호 해쉬화.
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/'); 
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { //미들웨어 확장 패턴. , 프론트에서 post login 요청 순간 첫 줄 실행 ->localStrategy 실행
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {      //세션쿠키를 브라우저로 보내줌.
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log(user.nick);

      return res.redirect('/'); // 로그인 최종 성공

    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao')); //실행되는 순간 카카오로그인을 하게되면, 카카오가 auth/kakao/callback을 쏴줌.

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
