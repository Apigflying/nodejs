const request = require('request')
const qs = require('querystring')
const fs = require('./fs')
const wechat = require('./wechat.json') //保存appid和secret
const token_mes = require('./access_token.json') //保存access_token和过期时间
const axios = require('axios')
const ticket_mes = require('./ticket.json') //保存ticket和过期时间
//获取accesstoken的参数
const TokenParams = {
  grant_type: 'client_credential',
  appid: wechat.appId,
  secret: wechat.appSecret
}
let currentToken = token_mes.access_token
//向微信发送请求，获取access_token
const _getAccessToken = async () => {
  //请求地址
  const getAccessTokenUrl =
    'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(TokenParams)
  const { data: result } = await axios.get(getAccessTokenUrl)
  if (result.errcode) {
    /*
      errcode 对应错误信息
      -1	    系统繁忙，此时请开发者稍候再试
      0	      请求成功
      40001	  AppSecret错误或者AppSecret不属于这个公众号，请开发者确认AppSecret的正确性
      40002	  请确保grant_type字段值为client_credential
      40164	  调用接口的IP地址不在白名单中，请在接口IP白名单中进行设置。（小程序及小游戏调用不要求IP地址在白名单内。）
    */
  } else {
    //设置过期时间为两个小时候之后
    const expires_time = Date.now() + (parseInt(result.expires_in) - 200) * 1000
    //将access_token保存到json文件中
    await fs.writefile(
      __dirname + '/access_token.json',
      JSON.stringify({
        access_token: result['access_token'],
        expires_time: expires_time
      })
    )
  }
  return {
    access_token: result['access_token'],
    expires_time
  };
}

const getAccessToken = async () => {
  const token = await fs.readfile(__dirname + '/access_token.json')
  const currentTime = Date.now()
  let tokens = JSON.parse(token)
  if (
    !tokens.access_token ||
    tokens.access_token == '' ||
    tokens.expires_time < currentTime
  ) {
    //重新获取access_token
    console.log('token已经过期或者不存在token,需要重新获取')
    return await _getAccessToken()
  } else {
    console.log('token未过期')
    return token;
  }
}
const _getTicket = () => {
  //获取ticket的参数
  const TicketParams = {
    type: 'jsapi',
    access_token: currentToken
  }
  //请求地址
  const wxGetTicketUrl =
    'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' +
    qs.stringify(TicketParams)
  //请求的配置
  let options = {
    method: 'GET',
    url: wxGetTicketUrl
  }
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (res) {
        const result = JSON.parse(body)
        //设置过期时间为两个小时候之后
        const expires_time =
          Date.now() + (parseInt(result.expires_in) - 200) * 1000
        //将access_token保存到json文件中
        fs.writefile(
          __dirname + '/ticket.json',
          JSON.stringify({
            ticket: result['ticket'],
            expires_time: expires_time
          })
        ).then(() => {
          resolve({
            ticket: result['ticket'],
            expires_time
          })
        })
      } else {
        reject(err)
      }
    })
  })
}
const getTicket = () => {
  return new Promise((resolve, reject) => {
    fs.readfile(__dirname + '/ticket.json')
      .then(ticket => {
        //读取文件，看access_token是否存在，看时间是否过期
        var currentTime = Date.now()
        let tokens = JSON.parse(ticket)
        if (
          !tokens.ticket ||
          tokens.ticket == '' ||
          tokens.expires_time < currentTime
        ) {
          //重新获取Ticket
          console.log('重新获取Ticket')
          return _getTicket()
        } else {
          console.log('从文件读取Ticket')
          return new Promise(re => {
            re(ticket)
          })
        }
      })
      .then(ticket => {
        resolve(ticket)
      })
  })
}

exports.getAccessToken = getAccessToken
exports.getTicket = getTicket
