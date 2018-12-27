import Router from 'koa-router';

import GetController from '../controllers/get';
const getInstance = new GetController();

const get = new Router();

get.get('/getUser', getInstance.getUser) // 获取天气信息
  // .get('/testget', getInstance.testGet)
  .get('/getArticle', getInstance.getArticleByTitle) // 获取七牛云图片

export default get;
