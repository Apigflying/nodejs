import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const summarySchema = new Schema({
  // 创建文章的用户
  creater: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  // 分类列表
  tags: [
    {
      type: Schema.Types.ObjectId, ref: 'Tag'
    }
  ],
  // 创建时间
  createtime: {
    type: Date
  },
  // 文章详情
  article: {
    type: Schema.Types.ObjectId, ref: 'Article'
  },
  title:String, // 文章标题
  content: String, // 文章简介
  picture:String, // 文章图片
});

const summaryModel = mongoose.model('Summary', summarySchema,'summary');

export default summaryModel;
