const mongoose = require('mongoose');

module.exports = new Promise(((resolve, reject) => {
  mongoose.connect('mongodb://localhost:27017/movies',{useNewUrlParser: true});
  mongoose.connection.once('open',(err)=>{
    if(!err){
      console.log('数据库开启成功');
    }
  })
}));