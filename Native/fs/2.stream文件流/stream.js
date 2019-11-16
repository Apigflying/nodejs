const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
/*

var datas = '';
//流是依托于文件存在的一种格式
rs.on('data', (chunk) => {
  // data事件可能会有多次，每次传递的chunk是流的一部分数据。
  datas += chunk;
})
rs.on('end', (err) => {
  console.log(datas)
  //fs.writeFile 
  //第一个参数是将数据保存的  路径 + 文件名 + 后缀名（path.extname）
  //第二个参数是所有文件流即 datas，如果是图片那么得到的就是base-64数据流
  //第三个参数是数据的编码类型
  fs.writeFile('./2.txt', datas, 'utf-8')
})

*/

/*
//这么写会报错
// const readfile = (path) => {
//   return new Promise((resolve, reject) => {
//     //fs模块创建读写文件流，传入的参数是要读取的文件的绝对路径
//     let stream = fs.createReadStream(path);
//     let data = {};
//     stream.pipe(data);
//     resolve(data)
//   })
// };

*/


//readStream.pipe() 方法接收一个对象，将当前文件数据传给它
app.get('/', function(req, res, next) {
  let filePath = path.join(__dirname, 'firefly.apk');
  let readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
  //这么写会报错
  // readfile(filePath).then(result => {
  //   res.send(result)
  // })
})



app.listen(4000)