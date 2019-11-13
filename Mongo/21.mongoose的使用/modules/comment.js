import mongoose from 'mongoose'
const Schema = mongoose.Schema;


const commentSchema = new Schema({
  // 评论人
  commenter: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  article :{
    type: Schema.Types.ObjectId, ref: 'Article'
  },
  // 评论内容
  content: {
    type: String
  },
  // 创建时间
  createtime: {
    type: Date
  },
  // 子评论
  comments: [
    {
      type: Schema.Types.ObjectId, ref: 'Comment'
    }
  ]
});

const commentModel = mongoose.model('Comment', commentSchema,'comment');

export default commentModel;
