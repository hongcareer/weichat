const db = require('../db');
const modu = require('../models/module');
const crawler = require('./crawler');
const uploadC = require('./upload/index');
const save = require('./save/index');

!(async ()=>{
  // const movies = await crawler();
  // console.log(movies);
  await db;
  // await save(movies);
  // 将图片和视频上传到七牛中
  // console.log(movies)
  await uploadC();
})()
