import DOA from '../base/DAO';


export default class DeleteReq extends DOA {
  constructor() {
    super();
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteArticleBySummaryId = this.deleteArticleBySummaryId.bind(this);
  }
  // 删除图片，然后将控制权交个下个中间件
  async deleteComment (ctx, next) {
    const { request: req, response: res } = ctx;
    const {id} = req.body;
    console.log(id);
    if(!id){
      ctx.body = {
        message:'必传参数没有传'
      }
    }
    await this.delCommentById(id);
    ctx.body = {
      message:'删除成功'
    }
  }
  async deleteArticleBySummaryId(ctx,next){
    const { request: req, response: res } = ctx;
    const {id} = req.body;
    await this.delSummaryArticleById(id);
    ctx.body = {
      message:'删除成功'
    }
  }
}