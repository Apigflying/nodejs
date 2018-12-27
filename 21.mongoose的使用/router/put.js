import Router from 'koa-router';

import putController from '../controllers/put';

let put = new Router();

put.post('/reviseArticle', putController.reviseArticle) // 创建文章


export default put;
