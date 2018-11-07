const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();

/*
 * 使用koa-bodyparser解析post的请求体
 * 用法与bodyparser相同
 *    
*/
app.use(bodyParser());

router.get('/testGet/:id', async (ctx, next) => {
  const { request: req, response: res, params: { id = 0 } } = ctx;
  res.body = `<h1>hello ${ id }</h1>`
})
// 解析请求体
router.post('/testPost', async (ctx, next) => {
  const { request: { body }, response: res } = ctx;
  // 在这要读取数据库 需要调用 /testGet的返回结果
  if (JSON.stringify(body) === '{}') {
    res.body = {
      test: 'abc'
    }
  } else {
    res.body = body;
  }
})
router.get('/', async (ctx, next) => {
  const { request: req, response: res, params } = ctx;
  res.body = `<h1>hello world</h1>`
})

app.use(router.routes());

app.listen(3000, () => {
  console.log('http://localhost:3000');

})