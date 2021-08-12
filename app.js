const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
//   name: 'session-cookie',
// }));

dotenv.config();  // dotenv 사용때 필요함.
app.set('port', process.env.PORT || 3000);


app.use('/', express.static(path.join(__dirname)));  // 주소창에 '/' 다음 입력된 것이 현재 폴더 안에 있으면 그 파일을 불러다줌.

const indexRouter = require('./routes');
app.use('/routes',(req,res)=>{
  console.log("라우터 실행중.")
  indexRouter;
})
app.get('/', (req, res) => {
  res.sendFile('index.html');
  console.log('get 요청에서 실행');
  res.send('이건 get에서 걸치는거');
});


app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// app.use((err,req,res)=>{
//   console.log(err);
// });    -------------------->에러 처리할 때는 매개변수 4개를 다 써야함.

app.use((req,res,next)=>{

  res.send('404임')
  next();
});

app.use((err,req,res,next)=>{
  console.log(err);
  res.send("에러 발생.")
}) //에러 처리 미들웨어 : 모든 에러가 여기로 옴.



//send file, send jason 두번 이상 하면 에러가 남.
//응답보내고 끝나는데 한번 더 보내려고 하면 에러가 남
//원칙은 요청 한번에 응답 한번이기 때문
//
