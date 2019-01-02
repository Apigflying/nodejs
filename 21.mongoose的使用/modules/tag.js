import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  // 标签
  tag:{
    type:String
  },
  // 该标签下的文章
  summary:[{
    type: Schema.Types.ObjectId, ref: 'Summary'
  }]
});

const tagModel = mongoose.model('Tag', tagSchema,'tag');

export default tagModel;
