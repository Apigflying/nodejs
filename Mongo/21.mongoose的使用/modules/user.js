import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // 作者姓名
  username: {
    type:String,
    unique:true,
    index:true
  },
  password:String,// 用户密码
  authority:Array,// 权限
  picture:String,// 头像照片
  level:String, // 级别
  message:String,// 说明
  // 通知事件
  notice:Array,
  summarys:[{
    type: Schema.Types.ObjectId, ref: 'Summary'
  }],// 文章列表
  comments:[{
    type: Schema.Types.ObjectId, ref: 'Comment'
  }],// 评论过别人的文章，链接文章id
  extend:Object // 后续扩展
});

const userModel = mongoose.model('user', userSchema,'user');

export default userModel;
