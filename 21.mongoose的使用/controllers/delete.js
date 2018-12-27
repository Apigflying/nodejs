import articleModel from '../modules/article';
import userModel from '../modules/user';
import commentModel from '../modules/comment';

class DeleteReq {
  // 删除图片，然后将控制权交个下个中间件
  async deleteArticle (ctx, next) {
    const { request: req, response: res } = ctx;

    // await next();
  }
}

export default new DeleteReq();
