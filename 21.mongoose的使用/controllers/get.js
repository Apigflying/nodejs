
import DOA from '../base/DAO';

export default class GetReq extends DOA {
  constructor() {
    super();
    this.getUser = this.getUser.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
    this.getArticleByTitle = this.getArticleByTitle.bind(this);
    this.getCommentById = this.getCommentById.bind(this);
  }
  // 通过用户名获取用户信息
  async getUser (ctx) {
    const { request: req, response: res } = ctx;
    const { username } = req.query;
    const user = await this.findUserByName(username);
    res.body = user;
  }
  // 通过Id获取文章
  async getArticleById (ctx) {
    const { request: req, response: res } = ctx;
    // 通过id查找文章
    const { id } = req.query;
    const article = await this.findArticleById(id);
    if (article) {
      res.status = 200;
      res.body = article;
    } else {
      res.status = 404;
    }
  }
  // 通过文章标题检索文章
  async getArticleByTitle (ctx) {
    const { request: req, response: res } = ctx;
    const { title } = req.query;
    const article = await this.findArticlesByTitle(title);
    if (article) {
      res.status = 200;
      res.body = article
    } else {
      res.status = 404;
    }
  }
  async getCommentById (ctx) {
    ctx.body = {
      list:[]
    }
  }
  async testGet (ctx) {
    const { request: req, response: res } = ctx;
    const { username } = req.query;
    res.body = {
      username
    }
  }
  async testGet2 (ctx) {
    const { request: req, response: res } = ctx;
    const { title } = req.query;
    res.body = {
      title: title + 'abc'
    }
  }
}

