import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  // 评论列表
  comments: [
    {
      type: Schema.Types.ObjectId, ref: 'Comment'
    }
  ],
  content: String, // 文章内容
  status: String, // 状态
  browseTimes: Number, // 浏览次数
});

const articleModel = mongoose.model('Article', articleSchema,'article');

export default articleModel;
