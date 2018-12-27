import Router from 'koa-router';

import PostController from '../controllers/post';
const postInstance = new PostController();
let post = new Router();

post.post('/postUser', postInstance.postUser)
  .post('/postArticle', postInstance.postArticle)
  .post('/postComment', postInstance.postComment)
  .post('/testPost', postInstance.testPost)


export default post;
