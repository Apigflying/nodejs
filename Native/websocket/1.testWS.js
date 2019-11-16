const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server;
//股票
var stocks = {
  "AAPL": 95.0,
  "MSFT": 50.0,
  "AMZN": 300.0,
  "GOOG": 550.0,
  "YHOO": 35.0
}

function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var stockUpdater;
var randomStockUpdater = function() {
    for (var symbol in stocks) {
      if (stocks.hasOwnProperty(symbol)) {
        var randomizedChange = randomInterval(-150, 150);
        var floatChange = randomizedChange / 100;
        stocks[symbol] += floatChange;
      }
    }
    var randomMSTime = randomInterval(500, 2500); //每0.5~2.5随机秒更新一次，每次更新改变上面stocks的数据
    stockUpdater = setTimeout(function() {
      randomStockUpdater();
    }, randomMSTime);
  }
  //这个函数自动更新stocks中的数据
randomStockUpdater();

//-----------------------------------------------------------------------------
//创建websocket服务，监听5001端口
wss = new WebSocketServer({ port: 5001 });

//客户端与服务器简历TCP链接后，会执行这个函数
wss.on('connection', ws => {
  var sendStockUpdates = ws => {
      if (ws.readyState == 1) {
        var stocksObj = {};
        for (var i = 0; i < clientStocks.length; i++) {
          var symbol = clientStocks[i]; //symbol 是 stocks的所有的key
          stocksObj[symbol] = stocks[symbol];
        }
        if (stocksObj.length !== 0) {
        	//需要将对象转成字符串。WebSocket只支持文本和二进制数据
          ws.send(JSON.stringify(stocksObj)); 
        }

      }
    }
  //当第一次建立连接的时候，用定时器模拟数据来源变化，每隔几秒更新一次数据
  var clientStockUpdater = setInterval(function() {
    sendStockUpdates(ws);
  }, 2000);
  //客户端发送请求,一般只发送一个连接的请求数据
  ws.on('message', function(message) {
    //根据请求过来的数据来更新。
    var stockRequest = JSON.parse(message);
    console.log("收到消息", stockRequest);
    //["AAPL", "MSFT", "AMZN", "GOOG", "YHOO"]
    clientStocks = stockRequest['stocks'];
    //处理客户端请求
    sendStockUpdates(ws);
  });
});