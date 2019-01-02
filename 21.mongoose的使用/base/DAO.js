import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken'

import userModel from '../modules/user';
import summaryModel from '../modules/summary';
import articleModel from '../modules/article';
import commentModel from '../modules/comment';
import tagModel from '../modules/tag';




export default class DAO {
  // 错误处理
  async error (error) {
    return {
      message: error
    }
  }

  // 读取私钥，加密payload，生成token
  async generateToken (payload) {
    // 使用私钥加密
    let data = fs.readFileSync(path.resolve(path.dirname(__filename), '..', 'config/token_private.pem'));
    // 过期时间(当前时间+1天)
    let exp = Date.now() + 86400000;
    return jwt.sign({ payload, exp }, data, { algorithm: 'RS256' })
  }
  /*=============================*\
                查
  \*==============================*/
  // 通过用户名查找用户,同时填充对应的文章摘要
  async findUserByName (username) {
    return userModel.findOne({
      username
    });
  }
  // 通过用户名查找用户创建的文章摘要
  async findUserArticlesByName (name) {
    const user = await this.findUserByName(name);
    return summaryModel.find({
      creater: user._id
    })
  }
  // 通过summaryId获取文章详情
  async findSummaryById (id) {
    // 查询文章简介，同时填充文章详情
    return summaryModel.findById(id).populate({
      path: 'article tags',
      populate: {
        path: 'comments'
      }
    })
  }
  // 通过title模糊查询文章摘要
  async findArticlesByTitle (title) {
    const regex = new RegExp(title, 'i');
    return summaryModel.find({
      title: regex
    });
  }
  // 通过articleId获取文章内容，同时填充文章的评论
  async findArticleById (id) {
    return articleModel.findById(id).populate({
      path: 'comments'
    });
  }
  async findCommentById (id) {
    return commentModel.findById(id);
  }
  /*=============================*\
                增
  \*==============================*/
  // 通过用户名创建用户
  async createUserByName ({ username, password, picture, level = '1', message = '1' }) {
    // 查看用户是否存在
    const user = await this.findUserByName(username);
    if (!!user) {
      return {
        message: '用户已经存在了，用户名不能重复'
      }
    }
    const newuser = await userModel.create({
      username,
      password,// 用户密码
      authority: [],// 权限
      picture,
      level, // 级别
      message,// 说明
      // 通知事件
      notice: [],
      summarys: [],// 文章列表
      comments: []
    });
    return {
      username: newuser.username,
      authority: [],// 权限
      picture: newuser.picture,
      level, // 级别
      message,// 说明
      // 通知事件
      notice: [],
      summarys: [],// 文章列表
      comments: []
    }
  }

  // 创建文章简介
  async createSummary ({ username, tags, title, content, picture }) {
    // 找到用户document
    const user = await this.findUserByName(username);
    // 多个标签document
    const taglist = await Promise.all(tags.map(async tag => {
      const tagDoc = await tagModel.findOne({
        tag
      })
      // 如果标签文档不存在，那么新建一个标签doc，返回
      if (!tagDoc) {
        return await tagModel.create({
          tag,
          summary: []
        })
      }
      return tagDoc;
    }));
    // 创建简介
    const summary = await summaryModel.create({
      creater: user._id,
      tags: taglist.map(t => t._id),// summary会添加多个tag
      createtime: Date.now(),
      title,
      content,
      picture
    });

    // 创作者的列表中添加一个
    user.summarys.push(summary._id);
    await user.save();
    // 一个summary对应多个tag,所以每个tag都要保留该生成的summary的id
    await Promise.all(taglist.map(async tag => {
      tag.summary.push(summary._id);
      return tag.save();
    }));
    return summary;
  }

  // 创建article，保存到summary的article
  async createArticle ({ content, status, summaryId }) {
    const summary = await summaryModel.findById(summaryId);
    const article = await articleModel.create({
      comments: [],
      content,
      status,
      browseTimes: 0
    });
    summary.article = article._id;
    await summary.save();
    return article;
  }

  // 创建评论，commentId如果存在，那么就是添加子评论
  async createComment ({ username, articleId, commentId, content }) {
    const article = await this.findArticleById(articleId);
    const user = await this.findUserByName(username);
    const newcomment = await commentModel.create({
      article: article._id,
      commenter: user._id,
      content,
      createtime: Date.now(),
      comments: []
    });
    // commentId存在，说明添加的是子评论
    if (!!commentId) {
      const comment = await commentModel.findById(commentId);
      comment.comments.push(newcomment._id);
      comment.save();
    } else {
      // 非子评论才放到文章评论列表中
      article.comments.push(newcomment._id);
      await article.save();
    }
    // 评论者的comments添加一条记录
    user.comments.push(newcomment._id);
    await user.save();
    return newcomment;
  }
  /*=============================*\
              删
  \*==============================*/
  // 通过id,递归删除评论及子评论
  async delCommentById (id) {
    const comment = await this.findCommentById(id);
    if (!comment) {
      return {
        message: '该评论不存在'
      }
    }
    const commentList = comment.comments;
    if (commentList.length) {
      await this.delCommetsByIdArr(commentList);
    }
    const user = await userModel.findById(comment.commenter);
    user.comments = user.comments.filter(i=>i.toString()!==comment._id);
    await user.save();
    await commentModel.deleteOne({
      _id: id
    })
  }
  // 参数：commets 数组  
  async delCommetsByIdArr (arr) {
    if (arr.length) {
      return Promise.all(arr.map(async item => this.delCommentById(item)))
    }
  }
  // 通过summaryId删除文章summary 和article
  async delSummaryArticleById (id) {
    // 找到对应的summary
    const summary = await summaryModel.findById(id);
    if(summary){
      const { tags: tagList, article: articleId, creater:userId} = summary;
      // summary对应的article的id
      if (articleId) {
        // 找到article
        const article = await articleModel.findById(articleId);
        if(article){
          const commentList = article.comments;
          if (commentList.length) {
            // 删除文章的子评论
            await this.delCommetsByIdArr(commentList);
          }
          await article.remove();
        }
      }
      // 删除该标签对应的文章summeryId
      if (tagList.length){
        await Promise.all(tagList.map(async item => {
          const tag = await tagModel.findById(item);
          tag.summary = tag.summary.filter(i=>i.toString()!==id);
          await tag.save();
        }))
      }
      await summary.remove();
    }
  }
}
