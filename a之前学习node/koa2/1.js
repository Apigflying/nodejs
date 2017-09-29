const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

//每接收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数。

//koa吧很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数，

//每个async函数叫做middleware（中间件）

app.use(async(ctx, next) => {

    //用async标记的函数称为：异步函数，在异步函数中，用await来调用另一个异步函数

    //其中，参数ctx是由koa传入的封装了request和response的变量，我们可以通过它访问request和response，next是koa传入的将要处理的下一个异步函数
    await next();
    //ctx上下文对象的响应类型：是html文档
    ctx.response.type = 'text/html';
    //ctx
    ctx.response.body = '<h1>无论什么文件进来。都返回这个信息</h1>'
})
app.listen(8088);
console.log('server start')