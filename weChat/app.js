const express = require('express');
const app = express();
const wx = require('./wechat/wxVerify.js')
// app.use(express.static(__dirname + '/dist'))
app.get('/accesstoken', (req, res) => {
  wx.getAccessToken().then(token => {
    console.log(token);
    res.send(token)
  })
})
app.get('/ticket', (req, res) => {
  wx.getTicket().then(ticket => {
    res.send(ticket)
  })
})
app.get('/', (req, res) => {

})
app.listen(4000)