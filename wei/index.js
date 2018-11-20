const express = require('express');
const app = express();
const handleRequest = require('./allNews/handleRequest.js');
const {appID,url} = require('./config');
const Wechat = require('./wechat/wechat');
const wechat = new Wechat();
const sha1 = require('sha1');
// { signature: '9e8a36058a071ac8cc497d1bc859d7dc31e21087',
//   echostr: '6618271436772470748',
//   timestamp: '1542352844',
//   nonce: '1149727169' }
const path = require('path');
app.set('views','./views');
app.set('view engine','ejs');


app.get('/search',async (req,res) =>{
  const {ticket} = await wechat.fetchTicket();
  const noncestr = Math.random().toString().split('.')[1];
  const timestamp = parseInt(Date.now()/1000);
  // console.log(timestamp,noncestr,ticket)
  // const appId = appID;
  const arr = [
    `noncestr=${noncestr}`,
    `jsapi_ticket=${ticket}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ];
  //拼接成字符串进行加密
  const signature = sha1(arr.sort().join('&'));
  res.render('search.ejs',{
    signature,
    timestamp,
    noncestr,
    appID
  });

});

app.use(handleRequest());

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

