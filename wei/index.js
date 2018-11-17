const express = require('express');
const app = express();
const sha1 = require('sha1')

const {getUserData,xmlToJs,getMessage} = require('./methods/userData.js');
const templete = require('./allNews/tempelate.js');
const choose = require('./allNews/option.js')
// { signature: '9e8a36058a071ac8cc497d1bc859d7dc31e21087',
//   echostr: '6618271436772470748',
//   timestamp: '1542352844',
//   nonce: '1149727169' }
const config ={
  appID:'wx09fbd862663ccce5',
  appsecret:'7ff9a773ffe444cebd1004a854574772',
  token:'xiaohong'
};
app.use(async (req,res,next)=>{
const {signature,echostr,timestamp,nonce} = req.query;
const {token} = config;
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
  console.log(replyMessage)
}
});

app.listen(3000,err=>{
  if(!err){
    console.log('open');
  }
});

//{ ToUserName: 'gh_4fe7faab4d6c',
// FromUserName: 'oAsoR1iP-_D3LZIwNCnK8BFotmJc',
// CreateTime: '1542356422',
// MsgType: 'text',
// Content: '333',
// MsgId: '6624370391693488478' }

