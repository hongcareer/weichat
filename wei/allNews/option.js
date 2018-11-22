const {url} = require('../config')
module.exports =async function(message){
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
    if(message.Content === '预告片'){//可以直接获取，不响应用户的时候，不需要优化数据
      options.msgType = 'news';
      //以下的数据通过msgType的类型进行添加
      options.title = 'movies~';
      options.description = 'click here to get more ~~~';
      options.picUrl = 'http://mmbiz.qpic.cn/mmbiz_jpg/zWRcEvfW2STB0qfP13pU6hvqC6VHLTTGJvuj57o8ujH4KwicwJfvHqPzoOHoTBROSHib9eKJ9asRvaXvYhia6InFA/0?wx_fmt=jpeg';
      options.url = `${url}/movie`;
    }else if(message.Content === '语音电影'){
      options.msgType = 'news';
      //以下的数据通过msgType的类型进行添加
      options.title = 'voice movies~';
      options.description = 'click here to get more ~~~';
      options.picUrl = 'http://mmbiz.qpic.cn/mmbiz_jpg/zWRcEvfW2STB0qfP13pU6hvqC6VHLTTGJvuj57o8ujH4KwicwJfvHqPzoOHoTBROSHib9eKJ9asRvaXvYhia6InFA/0?wx_fmt=jpeg';
      options.url = `${url}/search`;
    }else{
      const url = `http://api.douban.com/v2/movie/search`;
      const {subjects} = await rp({method:'GET',url,json:true,qs: {count: 1, q: message.Content}});
      options.msgType = 'news';
      //以下的数据通过msgType的类型进行添加
      options.title = subjects[0].title;
      options.description = `grade：${subjects[0].rating.average}`;
      options.picUrl = subjects[0].images.small;
      options.url = subjects[0].alt;
    };
  } else if(message.MsgType === 'voice'){
    //识别语音--使用微信的语音识别功能
    const url = `http://api.douban.com/v2/movie/search`;
    const {subjects} = await rp({method: 'GET',url,json:true,qs: {count:1,q:message.translateResult}});
    options.msgType = 'news';
    //以下的数据通过msgType的类型进行添加
    options.title = subjects[0].title;
    options.description = `grade：${subjects[0].rating.average}`;
    options.picUrl = subjects[0].images.small;
    options.url = subjects[0].alt;
  } else if(message.MsgType === 'event'){
    if(message.Event === 'subscribe'){
      news = `欢迎您关注硅谷电影公众号~ /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
    }else if(message.Event === 'unsubscribe'){
      news = `好难过~~`;
    }else if(message.Event === 'CLICK'){
      if (message.EventKey === 'help') {
        news = `硅谷电影公众号： /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
      }
    }
  }
  options.news = news;
  return options;
}

