const path = require('path');
const Koa = require('koa');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  // koa 设置cookie到前端
  ctx.cookies.set('SessionId', 1234, {
    domain: 'localhost',  // 写cookie所在的域名
    path: '/',       // 写cookie所在的路径 domain和path一起来限制 cookie 能被哪些 URL 访问。
    maxAge: 1*60 * 1000, // cookie有效时长 (毫秒) 设置过期时间，在该时间过期之后，前端保存的cookie会自动过期
    // expires: new Date('2018-12-15'),  // cookie失效时间(到过期时间，该条cookie会被自动删除)
    httpOnly: true,  // 是否只用于http请求中获取(设置为true，在前端无法通过document.cookie获取)
    overwrite: false  // 是否允许重写
  });
  /**
   * 一句话概括：
   * 某cookie的 domain为“baidu.com”, path为“/ ”，
   * 若请求的URL(URL 可以是js/html/img/css资源请求，但不包括 XHR 请求)
   * 的域名是“baidu.com”或其子域如“api.baidu.com”、
   * “dev.api.baidu.com”，且 URL 的路径是“/ ”
   * 或子路径“/home”、“/home/login”，
   * 则浏览器会将此 cookie 添加到该请求的 cookie 头部中。
   */
  await next();
})


app.use(async (ctx, next) => {
  // koa 设置cookie到前端
  ctx.cookies.set('suibian', 'suibian', {
    domain: 'localhost',  // 写cookie所在的域名
    path: '/',       // 写cookie所在的路径
    maxAge: 1 * 60 * 1000, // cookie有效时长 (毫秒) 设置过期时间，在该时间过期之后，前端保存的cookie会自动过期
    // expires: new Date('2017-02-15'),  // cookie失效时间(到过期时间，该条cookie会被自动删除)
    httpOnly: false,  // 是否只用于http请求中获取(设置为true，在前端无法通过document.cookie获取)
    overwrite: false  // 是否允许重写
  });
  await next();
})

router.post('/test', async (ctx, next) => {
  const { request: req, response: res } = ctx;
  var name = req.body.name || '', password = req.body.password || '';
  if (name === 'koa' && password === '12345') {
    res.body = `<h1>Welcome, ${ name }!</h1>`;
  } else {
    res.body = `<h1>Login failed!</h1><p><a href="/">Try again</a></p>`;
  }
})

app.use(router.routes());

app.use(koaStatic(path.join(__dirname, './dist')));

app.listen(3000, () => {
  console.log('http://localhost:3000');
})
