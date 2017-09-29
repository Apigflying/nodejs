const express = require('express');
const app = express();

var shujuku = [{
  "title": "标题1",
  "shijian": "123456",
  "zuozhe": "abc"
}, {
  "title": "标题2",
  "shijian": "23456",
  "zuozhe": "def"
}, {
  "title": "标题3",
  "shijian": "345567",
  "zuozhe": "ghi"
}]
app.set('view engine', 'ejs')
app.get('/news/:id', (req, res) => {
  var id = parseInt(req.params.id);
  console.log(id)
  res.render('1', shujuku[id])

})
app.listen(3000, '192.168.1.111')