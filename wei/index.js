const express = require('express');
const app = express();
const sha1 = require('sha1')

const {getUserData,xmlToJs,getMessage} = require('./methods/userData.js');
const templete = require('./allNews/tempelate.js')
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
  let options ={
    //通过解析用户用户发送的数据确定options的属性值
    toUserName:message.FromUserName,
    fromUserName:message.ToUserName,
    createTime:Date.now(),
  };
  let news = 'hello，小仙女';
  if(message.Content === '1'){//可以直接获取，不响应用户的时候，不需要优化数据
    news = '一路顺风';
    options.msgType = 'text';
    options.content = news;
  }else if(message.Content === '2'){
    options.msgType = 'news';
    //以下的数据通过msgType的类型进行添加
    options.title = '微信公众号开发~';
    options.description = 'class0810~';
    options.picUrl = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
    options.url = 'http://www.atguigu.com';
  }
  const replyMessage = templete(options)
  res.send(replyMessage);
  // console.log(jsMessage.Content)
}
});

app.listen(3000,err=>{
  if(!err){
    console.log('open');
  }
})
