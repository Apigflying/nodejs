import DAO from '../base/DAO';
export default class PostReq extends DAO {
  constructor() {
    super();
    this.postUser = this.postUser.bind(this);
    this.postArticle = this.postArticle.bind(this);
    this.postComment = this.postComment.bind(this);
    this.testPost = this.testPost.bind(this);
  }
  // 创建用户
  async postUser (ctx, next) {
    const { request: req, response: res } = ctx;
    const { username } = req.body;
    if (!username) {
      res.body = {
        message: '必填项没有填写'
      }
      return;
    }
    const user = await this.createUserByName(username);
    ctx.body = user;
  }

  // 创建文章
  async postArticle (ctx, next) {
    const { request: req, response: res } = ctx;
    const article = await this.createArticle(req.body);
    ctx.body = article;
  }
  // 创建评论
  async postComment (ctx, next) {
    const { request: req, response: res } = ctx;
    const result = await this.createCommentById(req.body)
    res.body = result;
  }
  // 测试函数
  async testPost (ctx) {
    const { request: req, response: res } = ctx;
    res.body = {
      a:123
    }
  }
}