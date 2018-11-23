const {url} = require('../config');
module.exports =  {
  "button":[
    {
      "type":"view",
      "name":"预告片🎥",
      "url": `${url}/movie`
    },
    {
      "type":"view",
      "name":"语音识别🎤",
      "url":`${url}/search`
    },
    {
      "name":"戳我啊👈",
      "sub_button":[
        {
          "type": "click",
          "name": "帮助",
          "key": "help",
        },
        {
          "name": "官网",
          "type": "view",
          "url": "http://www.atguigu.com"
        }
      ]
    }
  ]
}