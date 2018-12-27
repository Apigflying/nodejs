import articleModel from '../modules/article';
import userModel from '../modules/user';
import commentModel from '../modules/comment';

class PutReq {
  constructor() {

  }
  async reviseArticle (ctx, next) {
    ctx.body = {
      test: 234
    }
  }
}


export default new PutReq();
