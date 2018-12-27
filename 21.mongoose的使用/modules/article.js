import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  title: String,
  content: String
});

const ArticleModel = mongoose.model('Article', ArticleSchema, 'articlelist');

export default ArticleModel;