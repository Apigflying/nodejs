const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const app = new Koa();
// 解析post请求
app.use(bodyParser());

// 导入controller middleware:
app.use(controller());

app.listen(3000,()=>{
  console.log(`http://localhost:3008`);
})