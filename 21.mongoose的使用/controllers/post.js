import GetReq from './get';


import articleModel from '../modules/article';
import userModel from '../modules/user';
import commentModel from '../modules/comment';

export default class PostReq extends GetReq {
  constructor() {
    super();
    this.createUser = this.createUser.bind(this);
    this.createArticle = this.createArticle.bind(this);
    this.createComment = this.createComment.bind(this);
    this.testPost = this.testPost.bind(this);
  }
  // 创建用户
  async createUser (ctx, next) {
    const { request: req, response: res } = ctx;
    const { username } = req.query;
    if (!username) {
      res.body = {
        message: '必填项没有填写'
      }
      return;
    }
    req.query.username = username;
    await this.getUser(ctx);
    const isUserExit = res.body;
    if (isUserExit){
      res.body = {
        message:'用户已存在，请换个名字吧'
      }
      return;
    }
    ctx.body = 123;
    // const user = await userModel.create({
    //   name: username, // 用户名
    //   articles: [], // 自己编写的文章id
    //   comments: [] // 评论别人的文章的Id
    // });
    // ctx.body = {
    //   id:user._id
    // };
    console.log('body2', ctx.body);

  }

  // 创建文章
  async createArticle (ctx, next) {
    const { request: req, response: res } = ctx;
    const { username, content, title } = req.body;
    req.query = {
      username
    }
    await this.getUser(ctx);
    const user = ctx.body;
    // 创建文章的时候关联用户
    const article = await articleModel.create({
      title,
      user: user._id,
      content,
      comments: []
    });
    // 用户的文章列表中填充生成的文章的id
    user.posts.push(article._id);
    // 保存用户的文章列表
    const result = await user.save();
    res.body = result;
  }
  // 创建评论
  async createComment (ctx,next) {
    const { request: req, response: res } = ctx;

    const { username, title , commentcontent } = req.body;
    req.query = {
      username
    }
    // 提交评论的用户名
    await this.getUser(ctx);
    const user = ctx.body;
    // 要评论的文章
    req.query = {
      title
    }
    await this.getArticleByTitle(ctx);
    const article = ctx.body;
    // 创建评论
    const comment = await commentModel.create({
      article: article._id,
      commenter: user._id,
      content: commentcontent
    });
    // 添加到评论列表
    article.comments.push(comment._id);
    // 添加到用户个人评论中心
    user.comments.push(comment._id);
    // 保存到用户添加的评论
    await user.save();
    // 保存到文章评论
    await article.save();
    res.body = {
      result:'评论成功！'
    }
  }
  // 测试函数
  async testPost (ctx) {
    const { request: req, response: res } = ctx;
    const { username,title } = req.body;
    req.query = {
      username
    }
    await this.testGet(ctx);
    const user = ctx.body;
    req.query = {
      title
    }
    await this.testGet2(ctx);
    const titleObj = ctx.body;
    res.body = {
      user,
      titleObj
    }
  }
}