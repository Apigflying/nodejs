const path = require('path');
const Koa = require('koa');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

router.post('/test',async (ctx,next)=>{
  const { request: req, response: res } = ctx;
  var name = req.body.name || '', password = req.body.password || '';
  if (name === 'koa' && password === '12345') {
    res.body = `<h1>Welcome, ${ name }!</h1>`;
  } else {
    res.body = `<h1>Login failed!</h1><p><a href="/">Try again</a></p>`;
  }
})

app.use(router.routes());

// 使用koa-static 提供静态服务
app.use(koaStatic(path.join(__dirname, './dist')));

app.listen(3000,()=>{
  console.log('http://localhost:3000');
})
