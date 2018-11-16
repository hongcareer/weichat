const parseStrings = require('xml2js').parseString;
module.exports = {
  getUserData(req){
    let result = '';
    return new Promise((resolve) =>{
      req.
      on('data',data =>{
        result += data.toString();
      }).
      on('end',()=>{
        resolve(result);
      })
    });
  },
  xmlToJs(data){
    return new Promise((resolve) =>{
      parseStrings(data,{trim: true},(err, result)=>{
        if(!err){
          resolve(result);
        };
      });
    });
  },
  getMessage(content){
    const {xml} = content;
    let result = {};
    for(let key in xml){
      let value = xml[key];
      result[key] = value[0];
    };
    return result;
  }



};


//xml to js
//var parseString = require('xml2js').parseString;
// var xml = "<root>Hello xml2js!</root>"
// parseString(xml, function (err, result) {
//     console.dir(result);
// });


