import Router from 'koa-router';

import get from './get.js';
import deletes from './delete.js';
import post from './post.js';
import put from './put.js';

const router = new Router();

router.use('/get', get.routes(), get.allowedMethods())

router.use('/deletes', deletes.routes(), deletes.allowedMethods())

router.use('/post', post.routes(), post.allowedMethods())

router.use('/put', put.routes(), put.allowedMethods())


export default router;
