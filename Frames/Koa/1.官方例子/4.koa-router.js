const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');


const app = new Koa();

app.use(bodyParser());

router.get('/', (ctx, next) => {
  ctx.body = `
    <form action="/signUp" method="POST">
      <p>Name: <input name="name" value="koa"></p>
      <p>Password: <input name="password" type="password"></p>
      <p><input type="submit" value="Submit"></p>
    </form>
  `
})

router.post('/signUp', async (ctx, next) => {
  const { request: req, response: res } = ctx;
  res.data = 123;
  console.log('1同步');
  await next();
  console.log('1异步');
  // 相同的处理函数，先走await前面的，再走后面的函数，然后走这里，最后返回给前端的数据由最后一个next()之后的res.body决定
  res.body = { a: 123 }
})

router.post('/signUp', async (ctx, next) => {
  const { request: req, response: res } = ctx;
  var name = req.body.name || '', password = req.body.password || '';
  if (name === 'koa' && password === '12345') {
    res.body = `<h1>Welcome, ${ name }!</h1>`;
  } else {
    res.body = `<h1>Login failed!</h1><p><a href="/">Try again</a></p>`;
  }
  console.log('2同步');
  await next();
  console.log('2异步')
  res.body = {
    abc: 234
  }
})



router.post('/signUp', async (ctx, next) => {
  console.log('3同步');
  await next();
  console.log('3异步')
})

/*

上面处理请求的函数，最后的执行结果如下
  1同步
  2同步
  3同步
  3异步
  2异步
  1异步

  第一个异步，会在最后被处理
  最后一个同步函数处理完之后，会优先处理最近的（最后一个）同步函数
*/

app.use(router.routes());

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
})