import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  commenter: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String
});

const CommentModel = mongoose.model('Comment', CommentSchema, 'commentlist');

export default CommentModel;
