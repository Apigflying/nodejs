const express = require('express');
const app = express();

app.use(express.static(__dirname+'/dist'))

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
},function(req,res,next){
  console.log(req.headers.authorization);
  // res.send({success:'123'})
  next();
},function(req,res,next){
  console.log('这是第三个中间件');
  next();
});

app.get('/pie',function(req,res,next){
	var options = {
    root: __dirname + '/dist/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', 'pie');
    }
  });
})
app.get('/timeselect',function(req,res,next){
	var options = {
    root: __dirname + '/dist/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', 'pie');
    }
  });
})
app.get('/text',(req,res)=>{
  res.send({abc:123})
})
app.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route');
  // 否则将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  res.send({abcd:123});
});

// 处理 /user/:id， 渲染一个特殊页面
app.get('/user/:id', function (req, res, next) {
  res.send('special');
});
app.listen(4000)