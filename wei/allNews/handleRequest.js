
const sha1 = require('sha1')

const {getUserData,xmlToJs,getMessage} = require('../methods/userData.js');
const templete = require('./tempelate.js');
const choose = require('./option.js');
const {token} = require('../config/index')
module.exports = ()=>{

  return async (req,res,next)=>{
    const {signature,echostr,timestamp,nonce} = req.query;
    // const {token} = config;
//将timestamp,nonce,token组合起来，形成微信签名
    const arr = [timestamp,nonce,token].sort();
    const str = sha1(arr.join(''));
    if(req.method === 'GET'){
      //验证微信签名
      if(signature === str){
        res.end(echostr);
      }else{
        res.end('err');
      }
    }else if(req.method === 'POST'){
      //转发用户的消息
      //验证微信签名
      if(signature !== str){
        res.end('error');
        return;
      };

      //接受用户发送的数据
      const data = await getUserData(req);
      //xml to js
      const content = await xmlToJs(data);

      //优化js数据格式
      const message = getMessage(content);
      const options = choose(message);
      const replyMessage = templete(options)
      res.send(replyMessage);
      // console.log(replyMessage)
    }
  };
}

