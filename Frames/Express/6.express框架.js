const express = require('express');
const app = express();
const fs = require('fs');

// app.use('/', (req, res, next) => {
//   res.send('111');
//   next();
// })
// app.use('/:username/:id', (req, res, next) => {
//   console.log('第一个')
//   var username = req.params.username;
//   var id = req.params.id;
//   //这里的next必须手动调用，默认是执行到第一个匹配的路由之后就停止
//   //懒惰模式
//   next();
// })
app.use('/abc/:id', (req, res, next) => {
  console.log('第3个')
  res.send('sucess')
})
app.listen(2000)