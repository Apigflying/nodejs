const express = require('express');
const app = express();
const fs = require('fs')
app.use(ReadStaticFile);

function ReadStaticFile(req, res, next) {
  const filePath = req.originalUrl;
  fs.readFile('./static' + filePath, (err, data) => {
    if (err) {
      next();
      return
    }
    res.send(data.toString())
  })
}
app.listen(80, '172.16.2.117')