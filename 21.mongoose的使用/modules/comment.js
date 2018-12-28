import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  article: { type: Schema.Types.ObjectId, ref: "Article" },// 评论所属文章Id
  commenter: { type: Schema.Types.ObjectId, ref: 'User' },// 发布评论作者
  comments:[{
    type:Schema.Types.ObjectId,ref:'Comment'
  }],
  content: String // 评论内容
});

const CommentModel = mongoose.model('Comment', CommentSchema, 'commentlist');

export default CommentModel;
