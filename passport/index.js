const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //세션의 user의 id만 저장 . 메모리 문제때문. 실무에서는 메모리에도 저장하면 안됨.
  });

  
  passport.deserializeUser((id, done) => {
    User.findOne(
      { where: { id },
        include:[{
          model:User,
          attributes: ['id','nick'],
          as:'Followers'
        },{
          model:User,
          attributes:['id','nick'],
          as:'Followings',
        }] })
      .then(user => done(null, user)) //req.user , req.isAuthenticated
      .catch(err => done(err));
  });

  local();
  kakao();
};