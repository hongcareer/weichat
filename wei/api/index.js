
module.exports = {
  access_token:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&',
  menu:{
    create:`https://api.weixin.qq.com/cgi-bin/menu/create?`,
    delete:`https://api.weixin.qq.com/cgi-bin/menu/delete?`
  },
  userTag:{
    create:`https://api.weixin.qq.com/cgi-bin/tags/create?`,
    batch:`https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging?`,
    get:`https://api.weixin.qq.com/cgi-bin/user/tag/get?`,
    getCreatedTags:`https://api.weixin.qq.com/cgi-bin/tags/get?`,
    deleteCreatedTags:`https://api.weixin.qq.com/cgi-bin/tags/delete?`
  },
  ticket:`https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&`,
  setAllNew:`https://api.weixin.qq.com/cgi-bin/message/mass/sendall?`,
  type:{
    new:`https://api.weixin.qq.com/cgi-bin/material/add_news?`,
    pic:`https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN`,
    others:`https://api.weixin.qq.com/cgi-bin/material/add_material?`
  }

}