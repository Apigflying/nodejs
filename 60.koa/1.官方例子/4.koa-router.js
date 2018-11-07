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
  await next();
  console.log(res.body);
})

router.post('/signUp', async (ctx, next) => {
  var name = ctx.request.body.name || '', password = ctx.request.body.password || '';
  console.log(ctx.response.data);
  if (name === 'koa' && password === '12345') {
    ctx.response.body = `<h1>Welcome, ${ name }!</h1>`;
  } else {
    ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
  }
})

app.use(router.routes());

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
})