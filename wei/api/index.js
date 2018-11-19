
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
  }
}