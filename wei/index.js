const express = require('express');
const app = express();
const sha1 = require('sha1')

const {getUserData,xmlToJs,getMessage} = require('./methods/userData.js')
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
  let news = 'hello，小仙女';
  if(message.Content === '1'){
    news = '一路顺风';
  }else if(message.Content === '我'){
    news = '你好漂亮';
  }else if(message.Content.includes('8')){
    news = '88~~~';
  }

  let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${news}]]></Content>
      </xml>`;
  res.send(replyMessage);
  // console.log(jsMessage.Content)
}

});

app.listen(3000,err=>{
  if(!err){
    console.log('open');
  }
})
