const request = require('request');
const qs = require('querystring');
const fs = require('./fs')
const wechat = require('./wechat.json'); //保存appid和secret
const token_mes = require('./access_token.json'); //保存access_token和过期时间
const ticket_mes = require('./ticket.json'); //保存ticket和过期时间
//获取accesstoken的参数
const TokenParams = {
  'grant_type': 'client_credential',
  'appid': wechat.appId,
  'secret': wechat.appSecret
};
let currentToken = token_mes.access_token;
//向微信发送请求，获取access_token
const _getAccessToken = () => {
  //请求地址
  const wxGetAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(TokenParams);
  //请求的配置
  let options = {
    method: 'GET',
    url: wxGetAccessTokenUrl
  };
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      //这里对http请求和https请求进行了封装，所以可以直接使用
      if (res) {
        //获取微信返回的数据
        const result = JSON.parse(body);
        //设置过期时间为两个小时候之后
        const expires_time = Date.now() + (parseInt(result.expires_in) - 200) * 1000;
        //将access_token保存到json文件中
        fs.writefile(__dirname + '/access_token.json', JSON.stringify({
          "access_token": result['access_token'],
          "expires_time": expires_time
        })).then(() => {
          resolve({
            access_token: result['access_token'],
            expires_time
          });
        })
      } else {
        reject(err);
      }
    });
  })
}
const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    fs.readfile(__dirname + '/access_token.json').then(token => {
      //读取文件，看access_token是否存在，看时间是否过期
      var currentTime = Date.now();
      let tokens = JSON.parse(token);
      if (!tokens.access_token || tokens.access_token == "" || tokens.expires_time < currentTime) {
        //重新获取access_token
        console.log('重新获取token')
        return _getAccessToken()
      } else {
        console.log('从文件读取token')
        return new Promise((re) => { re(token) })
      }
    }).then(token => {
      console.log(token);
      currentToken = token.access_token;
      resolve(token)
    })
  })
}
const _getTicket = () => {
  //获取ticket的参数
  const TicketParams = {
      'type': 'jsapi',
      'access_token': currentToken
    }
    //请求地址
  const wxGetTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' + qs.stringify(TicketParams);
  //请求的配置
  let options = {
    method: 'GET',
    url: wxGetTicketUrl
  };
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (res) {
        const result = JSON.parse(body);
        //设置过期时间为两个小时候之后
        const expires_time = Date.now() + (parseInt(result.expires_in) - 200) * 1000;
        //将access_token保存到json文件中
        fs.writefile(__dirname + '/ticket.json', JSON.stringify({
          "ticket": result['ticket'],
          "expires_time": expires_time
        })).then(() => {
          resolve({
            ticket: result['ticket'],
            expires_time
          });
        })
      } else {
        reject(err);
      }
    });
  })
}
const getTicket = () => {
  return new Promise((resolve, reject) => {
    fs.readfile(__dirname + '/ticket.json').then(ticket => {
      //读取文件，看access_token是否存在，看时间是否过期
      var currentTime = Date.now();
      let tokens = JSON.parse(ticket);
      if (!tokens.ticket || tokens.ticket == "" || tokens.expires_time < currentTime) {
        //重新获取Ticket
        console.log('重新获取Ticket')
        return _getTicket()
      } else {
        console.log('从文件读取Ticket')
        return new Promise((re) => { re(ticket) })
      }
    }).then(ticket => {
      resolve(ticket)
    })
  })
}

exports.getAccessToken = getAccessToken;
exports.getTicket = getTicket;