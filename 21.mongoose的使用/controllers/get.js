
import articleModel from '../modules/article';
import userModel from '../modules/user';
import commentModel from '../modules/comment';

export default class GetReq {
  // 通过用户名获取用户信息
  async getUser (ctx) {
    const { request: req, response: res } = ctx;
    const {username} = req.query;
    const user = await userModel.findOne({
      name: username
    }).populate('posts');
    res.body = user || false;
  }
  async getArticleById (ctx) {
    const { request: req, response: res } = ctx;
    // 通过id查找文章
    const { id } = req.query;
    const article = await articleModel.findById(id).populate({
      path: 'user comments',
      populate: {
        path: 'user'
      }
    });
    if(article){
      res.status = 200;
      res.body = article
    }else{ 
      res.status = 404;
    }
  }
  async getArticleByTitle(ctx){
    const { request: req, response: res } = ctx;
    const { title } = req.query;
    var regex = new RegExp(title, 'i');
    const article = await articleModel.find({
      title: regex
    });
    if (article) {
      res.status = 200;
      res.body = article
    } else {
      res.status = 404;
    }
  }
  async getCommentById(){
    
  }
  async testGet(ctx){
    const { request: req, response: res } = ctx;
    const { username } = req.query;
    res.body = {
      username
    }
  }
  async testGet2(ctx) {
    const { request: req, response: res } = ctx;
    const { title } = req.query;
    res.body = {
      title:title+'abc'
    }
  }
}

