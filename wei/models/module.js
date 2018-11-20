const mongoose = require('mongoose');
const trailersSchema = new mongoose.Schema({
  src:String,
  cover:String,
  title:String,
  rating:String,
  director:String,
  summary:String,
  cast:[String],
  genre:[String],
  releaseDate:String,
  image:String,
  doubanId:String
});
const Trailers = mongoose.modle('trailers',trailersSchema);
module.exports = Trailers;
