import Router from 'koa-router';

import DeleteController from '../controllers/delete';
const delInstance = new DeleteController();
let deletes = new Router();

deletes.del('/deleteComment', delInstance.deleteComment)
  .del('/deleteArticleBySummaryId', delInstance.deleteArticleBySummaryId)

export default deletes;
