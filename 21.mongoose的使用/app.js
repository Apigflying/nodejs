
import db from './mongo/db.js';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, unique: true },
  posts: [{ type: Schema.Types.Number, ref: 'Post' }]
});

const PostSchema = new Schema({
  poster: { type: Schema.Types.Number, ref: 'User' },
  comments: [{ type: Schema.Types.Number, ref: 'Comment' }],
  title: String,
  content: String
});

const CommentSchema = new Schema({
  post: { type: Schema.Types.Number, ref: "Post" },
  commenter: { type: Schema.Types.Number, ref: 'User' },
  content: String
});

const User = mongoose.model('User', UserSchema, 'userlist');
const Post = mongoose.model('Post', PostSchema ,'postlist');
const Comment = mongoose.model('Comment', CommentSchema,'commentlist');

createData();
async function createData () {
  const userIds = [1, 2, 3];
  const postIds = [1, 2, 3];
  const commentIds = [1, 2, 3];

  let users = [];
  let posts = [];
  let comments = [];

  users.push({
    _id: userIds[0],
    name: 'aikin',
    posts: [postIds[0]]
  });
  users.push({
    _id: userIds[1],
    name: 'luna',
    posts: [postIds[1]]
  });
  users.push({
    _id: userIds[2],
    name: 'luajin',
    posts: [postIds[2]]
  });

  posts.push({
    _id: postIds[0],
    title: 'post-by-aikin',
    poster: userIds[0],
    comments: [commentIds[0]]
  });
  posts.push({
    _id: postIds[1],
    title: 'post-by-luna',
    poster: userIds[1],
    comments: [commentIds[1]]
  });
  posts.push({
    _id: postIds[2],
    title: 'post-by-luajin',
    poster: userIds[2],
    comments: [commentIds[2]]
  });

  comments.push({
    _id: commentIds[0],
    content: 'comment-by-luna',
    commenter: userIds[1],
    post: postIds[0]
  });
  comments.push({
    _id: commentIds[1],
    content: 'comment-by-luajin',
    commenter: userIds[2],
    post: postIds[1]
  });
  comments.push({
    _id: commentIds[2],
    content: 'comment-by-aikin',
    commenter: userIds[1],
    post: postIds[2]
  });
  const userlist = await User.create(users);
  console.log(userlist);
  // const postlist = await Post.create(posts);
  // console.log(userlist);
  // const commentlist = await Comment.create(comments);
  // console.log(userlist);
  
}




