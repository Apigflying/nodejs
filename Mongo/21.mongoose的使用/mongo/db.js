'use strict';
//使用mongoose
import mongoose from 'mongoose';
//config配置文件
const config = {
  mongoUrl: 'mongodb://localhost:27017/test',
}

mongoose.connect(config.mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log('连接数据库成功')
})

db.on('error', function (error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('close', function () {
  console.log('数据库断开，重新连接数据库');
  mongoose.connect(config.mongoUrl, {
    server: {
      auto_reconnect: true
    }
  });
});

export default db;
