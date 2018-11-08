const path = require('path');
const Koa = require('koa');
const router = require('koa-router');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());



// 使用koa-static 提供静态服务
app.use(koaStatic(path.join(__dirname, './dist')));

app.listen(3000,()=>{
  console.log('http://localhost:3000');
})
