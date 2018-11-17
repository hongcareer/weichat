module.exports = function(options){
  let replyMessage =`<xml>
  <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
  <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
  <CreateTime>${options.createTime}</CreateTime>
  <MsgType><![CDATA[${options.msgType}]]></MsgType>`;

  if(options.msgType === 'text'){
    replyMessage += `<Content><![CDATA[${options.news}]]></Content>`;
  }else if(options.msgType === 'news'){
    replyMessage += `<ArticleCount>1</ArticleCount>
      <Articles>
      <item>
      <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
      <Url><![CDATA[${options.url}]]></Url>
      </item>
      </Articles>`
  }
  // else if (options.msgType === 'voice') {
  //   replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`;
  // }
  replyMessage +='</xml>';
  return replyMessage;
}

