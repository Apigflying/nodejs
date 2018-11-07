const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();

// 日志系统
app.use(async (ctx,next)=>{
  const {request:req} = ctx;
  console.log(`Process ${JSON.stringify(req)}`);
  await next();
})

router.get('/hello/:name',async (ctx,next)=>{
  const {request:req,response:res,params} = ctx;
  const {name = 'abc'} = params;
  res.body = `<h1>${name}<h1>`;

})

router.get('/',async(ctx,next)=>{
  const { request: req, response: res, params } = ctx;
  res.body = '<h1>Index</h1>';
  
})

app.use(router.routes());

app.listen(3000,()=>{
  console.log(`http://localhost:3000`);
  
});