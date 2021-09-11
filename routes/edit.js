const express = require('express');
const { isLoggedIn } = require('./middlewares');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');



router.post('/',isLoggedIn, async (req,res,next)=>{
    console.log(req.body);
    // const { edit_nick } = req.body
    const nick = req.body.edit_nick;   
    try {
        const exUser_nick = await User.findOne ( {where : { nick }   }); 
        if(exUser_nick){
          return res.redirect('/edit?error=exist'); 
        }
        const user =await User.findOne({ where: { id: req.user.id } });//내가 누군지를 찾고
        if(user) {
          user.update({nick : req.body.edit_nick}); //성공
          res.redirect('/');
                  // await user.update({nick: req.body.deit_nick});   
                  // res.redirect('/');
        } else {
          res.status(404).send('error');
        }
      } catch (error) {
        console.error(error);
        next(error);
      }
    });




module.exports = router;