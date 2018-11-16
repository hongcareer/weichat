const express = require('express');
const app = express();
const sha1 = require('sha1')

// { signature: '9e8a36058a071ac8cc497d1bc859d7dc31e21087',
//   echostr: '6618271436772470748',
//   timestamp: '1542352844',
//   nonce: '1149727169' }
const config ={
  appID:'wx09fbd862663ccce5',
  appsecret:'7ff9a773ffe444cebd1004a854574772',
  token:'xiaohong'
};
app.use((req,res,next)=>{
const {signature,echostr,timestamp,nonce} = req.query;
const {token} = config;
const arr = [timestamp,nonce,token].sort();
const str = sha1(arr.join(''));
if(signature === str){
  res.end(echostr);
}else{
  res.end('err');
}

})

app.listen(3000,err=>{
  if(!err){
    console.log('open');
  }
})
