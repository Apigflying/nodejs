# README

标签（空格分隔）： MongoDB

---

## 1.使用mongoose连接数据库
```js
'use strict';
//使用mongoose
import mongoose from 'mongoose';
//config配置文件
const config = {
  mongoUrl: 'mongodb://localhost:27017/test',
}
mongoose.connect(config.mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log('连接数据库成功')
})

db.on('error', function (error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('close', function () {
  console.log('数据库断开，重新连接数据库');
  mongoose.connect(config.mongoUrl, {
    server: {
      auto_reconnect: true
    }
  });
});

export default db;
```
## 2.使用mongoose做DAO层处理博客模型
### 2.1博客模型
1.用户模型
```js
const UserSchema = new Schema({
  // 用户名，唯一
  name: { type: String, unique: true },
  // 该用户发布的文章的集合
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  // 该用户发布的评论的集合
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});
```
2.文章模型
```js
const ArticleSchema = new Schema({
  // 文章作者
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  // 该文章下的评论列表
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  title: String,
  content: String
});
```
3.评论模型
```js
const CommentSchema = new Schema({
  // 该评论对应的文章
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  // 发布评论者
  commenter: { type: Schema.Types.ObjectId, ref: 'User' },
  // 子评论列表
  comments:[{
    type:Schema.Types.ObjectId,ref:'Comment'
  }],
  content: String
});
```
### 2.2引用关系
|左对右|user|article|comment|
|:--:|:--:|:--:
|user||多|多|
|article|1||多|
|commet|1|1||

#### comment自引用
由上面的Schema（comment）可知，一个comment可能会有多个子评论
这时会形成树形结构
子评论由于自己引用自己，所以会有深入嵌套。这时在填充的时候会有深入嵌套，如：
```js
async findArticleById (id) {
    return articleModel.findById(id).populate({
      path: 'author comments'
      populate: {
        path: 'commenter comments'
        populate:{
          path: 'commenter comments'
          populate: {
            path: 'commenter comments'
          }
          // ...
        }
      }
    })
  }
```
嵌套较深的时候，会形成递归引用，但是需要知道的是，**每个comment都是独立存在表中，而每个comment对应一个子评论列表**
解决方式：
不想使用上面的递归引用
前端在第一次获取数据的时候，只获取一级评论内容
然后根据二级的comment重新请求。获取二级的comment以此类推

根据commentId再次获取它ben'shen