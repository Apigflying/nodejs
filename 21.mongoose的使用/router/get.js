import Router from 'koa-router';

import GetController from '../controllers/get';
const getInstance = new GetController();

const get = new Router();

get.get('/getUser', getInstance.getUser)
  // .get('/testget', getInstance.testGet)
  .get('/getArticleListByUser', getInstance.getArticleListByUser)
  .get('/getArticleDetail', getInstance.getArticleDetail)
  .get('/getArticleByTitle', getInstance.getArticleByTitle)
  
export default get;
