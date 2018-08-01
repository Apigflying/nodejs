import express from "express";
// import router from 'router/index.js';
import configLite from 'config-lite';
import formidable from 'formidable';
const config = configLite(__dirname);
const app = express();
//允许跨域请求
if (config.alloworigin) {
  app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  });
}

// router(app)
var n=0;;

app.get('/',(req,res)=>{
  console.log(req);
  res.send({});
})

app.get('/test',(req,res)=>{
  console.log('接收到请求了');
  res.send({
    type:'success'
  })
})

app.listen(config.port);
