const express = require('express');
const app = express();
const db = require('./model/db.js')


app.get('/', (req, res) => {
  res.send('首页')
})
app.get('/insert', (req, res) => {
  db.insertOne('陈宣宇', { "name": "陈宣宇", age: parseInt(26 + Math.random() * 74) }).then((result) => {
    res.send("success")
  }).catch(err => {
    res.send('fail')
  })
})

app.get('/find', (req, res) => {
  const pages = {
      page: req.query.page || 1,
      n: 8,
      sort: { 'age': 1 }
    }
    //第二个参数是查找的条件
    //第三个参数是用来做分页的
  db.find('陈宣宇', {}, pages).then((result) => {
    res.json(result)
  }).catch(err => {
    res.send('fail')
  })
})
app.get('/delete', (req, res) => {
  //找到所有的匹配项，然后删除
  db.deleteMany('陈宣宇', { name: '陈宣宇' }).then((result) => {
    res.send("success")
  }).catch(err => {
    res.send('fail')
  })
})
app.get('/update', (req, res) => {
  //第二个参数是所有的匹配项，第三个参数是要将匹配项改成什么
  db.updateMany('陈宣宇', { age: 49 }, { 'name': 'cxy', 'abc': 'change' }).then((result) => {
    res.send("success")
  }).catch(err => {
    res.send('fail')
  })
})

app.get('/count', (req, res) => {
  const searchCount = { name: 'cxy' }
    //查询数据库中满足第二个条件的数据的个数
  db.getCount('陈宣宇', searchCount).then((result) => {
    res.json(result)
  }).catch(err => {
    res.send(err)
  })
})
app.listen(8000);