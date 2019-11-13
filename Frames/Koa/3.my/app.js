import path from 'path';
import Koa from 'koa';
// koa静态资源
import koaStatic from 'koa-static';
// 配置信息
import configLite from 'config-lite';

// 连接数据库
import mongodb from './DB/mongodb.js';

const config = configLite(__dirname);
const app = new Koa();

// 静态资源文件目录
app.use(koaStatic(path.join(__dirname, '..', '/dist')));

app.listen(config.port, () => {
  console.log('http://localhost:' + config.port);
});
