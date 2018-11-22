const modu = require('../../models/module');
module.exports = async movies => {
  for (var i = 0; i < movies.length; i++) {
    let item = movies[i];
    await modu.create(item);
  }
}
