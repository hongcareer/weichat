const express = require('express')
const modu = require('../models/module');
const {appID,url} = require('../config');
const Wechat = require('../wechat/wechat');
const wechat = new Wechat();
const sha1 = require('sha1');
const router = new express.Router();

router.get('/search',async (req,res) =>{
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
router.get('/movie', async (req, res) => {
  //去数据库中找到所有数据
  const movies = await modu.find({}, {_id: 0, __v: 0})
  res.render('movie', {movies});
});
module.exports = router;