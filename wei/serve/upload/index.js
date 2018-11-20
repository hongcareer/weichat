const nanoid = require('nanoid');
const upload = require('./uploadToQiNiu.js');
const modu = require('../../models/module');

module.exports = async ()=>{
  const movies = await modu.find({});
  for (let i = 0; i < movies.length; i++) {
    let movie  = movies[i];
    const coverKey= nanoid(10)+'.jpg';
    const imageKey= nanoid(10)+'.jpg';
    const srcKey= nanoid(10)+'.jpg';
    await Promise.all([upload(movie.cover, coverKey), upload(movie.image, imageKey), upload(movie.src, srcKey)]);
    movie.coverKey = coverKey;
    movie.imageKey = imageKey;
    movie.srcKey = srcKey;

    await movie.save()
    console.log(movie.srcKey);
  }
}