
import DOA from '../base/DAO';

export default class GetReq extends DOA {
  constructor() {
    super();
    this.getUser = this.getUser.bind(this);
    this.getArticleListByUser = this.getArticleListByUser.bind(this);
    this.getArticleDetail = this.getArticleDetail.bind(this);
    this.getArticleByTitle = this.getArticleByTitle.bind(this);
  }
  // 通过用户名获取用户信息
  async getUser (ctx) {
    const { request: req, response: res } = ctx;
    const { username } = req.query;
    const user = await this.findUserByName(username);
    res.body = user;
  }
  // 通过用户名查找用户的所有文章摘要（列表）
  async getArticleListByUser (ctx) {
    const { request: req, response: res } = ctx;
    // 通过id查找文章
    const { username } = req.query;
    const summarys = await this.findUserArticlesByName(username);
    if (summarys) {
      res.status = 200;
      res.body = summarys;
    } else {
      res.status = 404;
    }
  }
  // 通过summaryId获取文章详细信息
  async getArticleDetail (ctx) {
    const { request: req, response: res } = ctx;
    // 通过id查找文章
    const { id } = req.query;
    const article = await this.findSummaryById(id);
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
    const articles = await this.findArticlesByTitle(title);
    if (articles) {
      res.status = 200;
      res.body = articles
    } else {
      res.status = 404;
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

