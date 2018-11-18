const express = require('express');
const app = express();
const handleRequest = require('./allNews/handleRequest.js')

// { signature: '9e8a36058a071ac8cc497d1bc859d7dc31e21087',
//   echostr: '6618271436772470748',
//   timestamp: '1542352844',
//   nonce: '1149727169' }
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

