import DAO from '../base/DAO';
export default class PostReq extends DAO {
  constructor() {
    super();
    this.postUser = this.postUser.bind(this);
    this.postSummary = this.postSummary.bind(this);
    this.postArticle = this.postArticle.bind(this);
    this.postComment = this.postComment.bind(this);
    this.testPost = this.testPost.bind(this);
  }
  // 创建用户 通过用户名（用户名不能重复）
  async postUser (ctx, next) {
    const { request: req, response: res } = ctx;
    const { username, password, picture } = req.body;
    if (!username) {
      res.body = {
        message: '必填项没有填写'
      }
      return;
    }
    const user = await this.createUserByName({
      username, password, picture
    });
    ctx.body = user;
  }
  // 创建简介
  async postSummary (ctx, next) {
    const { request: req, response: res } = ctx;
    const { username, tags, title, content, picture } = req.body;
    if (!username) {
      res.body = {
        message: '必填项没有填写'
      }
      return;
    }
    const summary = await this.createSummary({ username, tags, title, content, picture });
    ctx.body = summary;
  }
  // 创建文章
  async postArticle (ctx, next) {
    const { request: req, response: res } = ctx;
    const { content, status, summaryId } = req.body;
    const article = await this.createArticle({ content, status, summaryId });
    ctx.body = article;
  }
  // 创建评论
  async postComment (ctx, next) {
    const { request: req, response: res } = ctx;
    // commentId可选如果传了，就表示添加子评论
    const { username, articleId, commentId, content } = req.body
    const comment = await this.createComment({ username, articleId, commentId, content })
    res.body = comment;
  }
  // 测试函数
  async testPost (ctx) {
    const { request: req, response: res } = ctx;
    res.body = {
      a: 123
    }
  }
}