import mongoose from 'mongoose'
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  // unique：boolean，是否在此属性上定义唯一索引
  name: { type: String, unique: true },
  // 类型 Schema.Types.ObjectId(Id类型)、 Schema.Types.Mixed(混合或嵌套类型)
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const UserModel = mongoose.model('User', UserSchema, 'userlist');

export default UserModel;