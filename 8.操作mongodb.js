const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
app.use('/', (req, res) => {
  const url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log(err)
      throw new Error(err)
    }

    db.collection('cxy').insertOne({
      "name": "cxy",
      "age": (Number.parseInt((Math.random() * 100) + 10))
    }, function(err, result) {
      if (err) {
        res.send('存入数据库失败')
      }
      db.close();
      res.send('插入数据库成功')
    })

  })

})
app.listen(8000);