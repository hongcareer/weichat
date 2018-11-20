const db = require('../db');
const modu = require('../models/module');
const crawler = require('./crawler');
const upload = require('./upload');

(async ()=>{
  // const movies = await crawler();
  // console.log(movies)
  await db;
  // for (let i = 0; i < movies.length; i++) {
  //   let item =  movies[i];
  //   await modu.create(item);
  // };
  await upload();
})()
