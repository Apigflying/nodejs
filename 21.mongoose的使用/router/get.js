import Router from 'koa-router';

import GetController from '../controllers/get';
const getInstance = new GetController();

const get = new Router();

get.get('/getUser', getInstance.getUser)
  // .get('/testget', getInstance.testGet)
  .get('/getArticleById', getInstance.getArticleById)
  .get('/getArticleByTitle', getInstance.getArticleByTitle)
  .get('/getCommentById', getInstance.getCommentById)


export default get;
