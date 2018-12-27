import Router from 'koa-router';

import deleteController from '../controllers/delete';

let deletes = new Router();

deletes.del('/deleteArticle', deleteController.deleteArticle)

export default deletes;
