
import Koa from 'koa';
import bodyParser from 'koa-bodyparser'

import db from './mongo/db.js';
import router from './router/index.js';

const app = new Koa();

app.use(bodyParser());
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3005);