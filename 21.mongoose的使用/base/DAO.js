
import userModel from '../modules/user';
import articleModel from '../modules/article';
import commentModel from '../modules/comment';


export default class DAO {
  async errornofond (error) {
    return new Promise((resolve, reject) => {
      resolve({
        error
      })
    })
  }
  // 通过用户名查找用户同时填充对应的文章列表
  async findUserByName (name) {
    return userModel.findOne({
      name
    }).populate('articles');
  }
  // 通过用户名查找用户同时填充对应的文章列表
  async findUserById (id) {
    return userModel.findById({
      id
    }).populate('articles');
  }
  // 通过文章id查找文章，同时填充文章作者和文章评论，在文章评论中深填充评论发布者
  async findArticleById (id) {
    return articleModel.findById(id).populate({
      path: 'author comments',
      populate: {
        path: 'commenter'
      }
    })
  }
  // 通过文章标题模糊搜索文章
  async findArticlesByTitle (title) {
    const regex = new RegExp(title, 'i');
    return articleModel.find({
      title: regex
    }).populate({
      path: 'author comments',
      populate: {
        path: 'commenter'
      }
    });
  }
  // 通过用户名创建用户
  /**
   * @param {String} name 
   * @returns
   * @memberof DAO
   */
  async createUserByName (name) {
    const user = await this.findUserByName(name);
    if(!!user){
      return new Promise(res=>res({
        message:'用户已经存在了！'
      }))
    }
    return userModel.create({
      name, // 用户名
      articles: [], // 自己编写的文章id
      comments: [] // 评论别人的文章的Id
    });
  }

  /**
   * @param {String} title 文章标题
   * @param {String} username 作者用户名
   * @param {String} content 文章内容
   * @returns 创建后的文章document
   * @memberof DAO
   */
  async createArticle ({ title, username, content }) {
    const user = await this.findUserByName(username);
    if (!user) {
      return this.errornofond('用户没找到!')
    }
    const article = await articleModel.create({
      title,
      author: user._id,
      content,
      comments: []
    });
    console.log('articleId',article);
    // 用户的文章列表中填充生成的文章的id
    user.articles.push(article._id);
    // 保存用户的文章列表
    return await user.save();
  }
  /**
   * @param {ObjectId} articleId 文章标题
   * @param {ObjectId} commenterId 作者用户名
   * @param {String} commentcontent 文章内容
   * @memberof DAO
   */
  async createCommentById ({
    articleId, // 文章Id
    commenterId, // 评论者的 user._id
    commentcontent // 评论内容
  }) {
    const article = this.findArticleById(articleId);
    const user = this.findUserById(commenterId);
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
    const userUpdate = await user.save();
    // 保存到文章评论
    const articleUpdate = await article.save();
    return new Promise((res) => res({
      user: userUpdate,
      article: articleUpdate
    }))
  }
  async createCommentByName({
    username,
    articleId,
    commentcontent
  }){
    const article = await this.findArticleById(articleId);
    const user = await this.findUserByName(username);
    console.log('article', article);
    console.log('user', user);
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
    const userUpdate = await user.save();
    // 保存到文章评论
    const articleUpdate = await article.save();
    return new Promise((res) => res({
      user: userUpdate,
      article: articleUpdate
    }))
  }
}