import Router from 'koa-router';

import PostController from '../controllers/post';
const postInstance = new PostController();
let post = new Router();

post.get('/createUser', postInstance.createUser)

export default post;
