const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  // ctx上下文
  ctx.body = 'Hello World';
});

app.listen(3000);