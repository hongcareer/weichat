const {url} = require('../config')
module.exports = function(message){
  let options ={
    //通过解析用户用户发送的数据确定options的属性值
    toUserName:message.FromUserName,
    fromUserName:message.ToUserName,
    createTime:Date.now(),
    msgType:'text'
  };
  let news = 'hello，小仙女';

  if(message.MsgType === 'text'){
    //用户发送的数据类型为文本
    if(message.Content === '1'){//可以直接获取，不响应用户的时候，不需要优化数据
      news = '一路顺风';
      options.msgType = 'text';
    }else if(message.Content === '2'){
      options.msgType = 'news';
      //以下的数据通过msgType的类型进行添加
      options.title = '微信公众号开发~';
      options.description = 'class0810~';
      options.picUrl = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
      options.url = 'http://www.atguigu.com';
    }else if (message.Content === '4') {
      news = `<a href="${url}/search">search页面</a>`;
    };
  } else if(message.MsgType === 'voice'){
    news = `是这个吗：${message.Recognition}`;
  } else if(message.MsgType === 'location'){
    news = `您的地理位置是：维度--${message.Location_X} 经度-- ${message.Location_Y}`
  } else if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      news = `感谢您的关注`;
    }else if(message.Event === 'unsubscribe'){
      news = `好难过~~`;
    }else if(message.Event === 'CLICK'){
      news = `用户点击了：${message.EventKey}`;
    }
  }
  options.news = news;
  return options;
}

