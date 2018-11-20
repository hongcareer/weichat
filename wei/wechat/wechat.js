const rp = require('request-promise-native');
const fs = require('fs');
const {appID,appsecret} = require('../config');
const menu = require('./Menu')
const api = require('../api')

class Wechat{
  //获取AccessToken
  async getAccessToken(){
    const url = `${api.access_token}appid=${appID}&secret=${appsecret}`
    //使用模板发送GET请求给微信浏览器器，获取access_token
    const result = await rp({method:'GET',url,json:true});
    result.expires_in =Date.now()+3600000*2 - 300000;
    // console.log(result)
    return result;
  };
  //保存AccessToken
  saveAccessToken(filePath,accessToken){
    return new Promise((res,rej)=>{
      //accessToken是一个json的数据，默认会转成js文件，js文件无法保存，所以还需要在转换成json的字符串
      fs.writeFile(filePath,JSON.stringify(accessToken),err=>{
        if(!err){
          res();
        }else{
          rej('saveAccessToken方法出了一些小问题呦~~：'+err);
        };
      });
    });
  };
  //读取AccessToken
  readAccessToken(filePath){
    return new Promise((res,rej)=>{
      fs.readFile(filePath,(err,data)=>{
        if(!err){
          res(JSON.parse(data.toString()))
        }else{
          rej('readAccessToken方法出了一些问题呦~~~：'+err)
        }
      })
    })
  };
  //判断是否过期
  isvalidAccessToken({expires_in}){
    if(expires_in <= Date.now()){
      return false;
    }else{
      return true;
    }
  };
  //获取真正的access_token
  fetchAccessToken(){
    //判断是否过期
    if(this.access_token && this.expires_in && this.isvalidAccessToken(this)){
      return Promise.resolve({access_token: this.access_token, expires_in: this.expires_in})
    }
    //返回有效的access_token
    return this.readAccessToken('./accessToken.txt')
      .then(async ress =>{
        if(this.isvalidAccessToken(ress)){
          //没有过期，返回一个？值
          return ress;
        }else{
          //过期了重新获取，并且保存
          const accessToken = await this.getAccessToken();
          await this.saveAccessToken('./accessToken.txt',accessToken);
          return accessToken;
        }
      })
      .catch(async err =>{
        const accessToken = await this.getAccessToken();
        await this.saveAccessToken('./accessToken.txt',accessToken);
        return accessToken;
      })
      .then(ress=>{
        this.access_token = ress.access_token;
        this.expires_in = ress.expires_in;
        return Promise.resolve(ress);
      })
  };

  //获取jsapi_ticket
  async getTicket(){
    const {access_token} = await this.fetchAccessToken();
    // console.log(access_token)
    const url =`${api.ticket}access_token=${access_token}`;
    // console.log(url);
    const result = await rp({method:'GET',url,json:true});
    // console.log(result)
    result.expires_in =Date.now()+3600000*2 - 300000;
    return {
      ticket:result.ticket,
      ticket_expires_in: result.expires_in
    };
  };
  //保存jsapi_ticket
  saveTicket(filePath,ticket){
    return new Promise((res,rej)=>{
      //accessToken是一个json的数据，默认会转成js文件，js文件无法保存，所以还需要在转换成json的字符串
      fs.writeFile(filePath,JSON.stringify(ticket),err=>{
        if(!err){
          res();
        }else{
          rej('saveTicket方法出了一些小问题呦~~：'+err);
        };
      });
    });
  };
  //读取jsapi_ticket
  readTicket(filePath){
    return new Promise((res,rej)=>{
      fs.readFile(filePath,(err,data)=>{
        if(!err){
          res(JSON.parse(data.toString()))
        }else{
          rej('readAccessToken方法出了一些问题呦~~~：'+err)
        }
      })
    })
  };
  //判断是否过期
  isvalidTicket({ticket_expires_in}){
    if(ticket_expires_in <= Date.now()){
      return false;
    }else{
      return true;
    }
  };
  //获取真正的jsapi_ticket
  fetchTicket(){
    //判断是否过期
    if(this.ticket && this.ticket_expires_in && this.isvalidTicket(this)){
      return Promise.resolve({ticket: this.ticket, ticket_expires_in: this.ticket_expires_in})
    }
    //返回有效的access_token
    return this.readTicket('./ticket.txt')
      .then(async ress =>{
        if(this.isvalidTicket(ress)){
          //没有过期，返回一个？值
          return ress;
        }else{
          //过期了重新获取，并且保存
          const ticket = await this.getTicket();
          await this.saveTicket('./ticket.txt',ticket);
          return ticket;
        }
      })
      .catch(async err =>{
        const ticket = await this.getTicket();
        console.log(ticket)
        await this.saveTicket('./ticket.txt',ticket);
        return ticket;

      })
      .then(ress=>{
        this.ticket = ress.ticket;
        this.ticket_expires_in = ress.ticket_expires_in;
        return Promise.resolve(ress);
      })
  };



  /**
   * 创建自定义菜单
   * @param menu
   * @returns {Promise<void>}
   */
  async createMenu(menu){
    const {access_token} =await this.fetchAccessToken()
    const url = `${api.menu.create}access_token=${access_token}`;
    const result = await rp({method: 'POST', url, json: true, body: menu});
    return result;
  };

  /**
   * 删除菜单
   * @returns {Promise<void>}
   */
  async delMenu(){
    const {access_token} =await this.fetchAccessToken();
    const url = `${api.menu.delete}access_token=${access_token}`;
    const result = await rp({method: 'get', url, json: true});
    return result;
  };

  /**
   * 创建用户标签
   * @param name
   * @returns {Promise<string>}
   */
  async creatUserTag(name){
    try{
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.userTag.create}access_token=${access_token}`;
      return await rp({method:'POST',url,json:true,body:{tag:{name}}})
    }catch (e) {
      return 'creatUserTag方法出了问题：'+e;
    }
  };

  /**
   * 为用户打标签
   * @param openid_list
   * @param tagid
   * @returns {Promise<string>}
   */
  async batchUsersTag(openid_list,tagid){
    try{
      const {access_token} = await this.fetchAccessToken();
      const url =`${api.userTag.batch}access_token=${access_token}` ;
      return await rp({method:'POST',url,json:true,body:{openid_list,tagid}})
    }catch (e) {
      return 'batchUsersTag方法出了问题：'+e;
    }
  };

  /**
   * 获取标签下的用户
   * @param tagid
   * @param next_openid
   * @returns {Promise<string>}
   */
  async getTagUser(tagid,next_openid = ''){
    try{
      const {access_token} = await this.fetchAccessToken();
      const url =`${api.userTag.get}access_token=${access_token}` ;
      return await rp({method:'POST',url,json:true,body:{tagid,next_openid}})
    }catch (e) {
      return 'getTagUser方法出了问题：'+e;
    }
  };
  /**
   * 获取已经创建的标签
   * @returns {Promise<string>}
   */
  async getCreatedTags(){
    try{
      const {access_token} = await this.fetchAccessToken();
      const url =`${api.userTag.getCreatedTags}access_token=${access_token}` ;
      return await rp({method:'GET',url,json:true})
    }catch (e) {
      return 'getTagUser方法出了问题：'+e;
    }
  };
  /**
   * 删除已经创建的标签
   * @param id
   * @returns {Promise<string>}
   */
  async deleteCreatedTags(id){
    try{
      const {access_token} = await this.fetchAccessToken();
      const url =`${api.userTag.deleteCreatedTags}access_token=${access_token}` ;
      return await rp({method:'POST',url,json:true,body:{tag:{id}}})
    }catch (e) {
      return 'getTagUser方法出了问题：'+e;
    }
  }


  //群发消息
  async setAllNews(options){
    try{
      const {access_token}  = await this.fetchAccessToken();
      const url =`${api.setAllNew}access_token=${access_token}` ;
      return await rp({method:'POST',url,json:true,body:options});
    }catch (e) {
      return 'setAllNews方法出了问题：'+e;
    }
  }
  //图文消息

};

(async ()=>{
  const w = new Wechat();
  //群发消息
  // let result = await w.setAllNews({
  //   "filter":{
  //     "is_to_all":false,
  //     "tag_id":105
  //   },
  //   "text":{
  //     "content":"你真的好帅啊"
  //   },
  //   "msgtype":"text"
  // });
  // console.log(result)
  //
  // 获取ticket
  // let result = await w.delMenu();
  // result = await w.createMenu(menu);

  //管理用户
  //创建id标签
  // const userTag = await w.creatUserTag('family');
  // //打标签
  // const batchTag = await w.batchUsersTag([
  //   'oQhJ61Lv8R7jGHrKGWZnMe1VbBnA',
  //   'oQhJ61CyZ_ipYcSXm-im3gGY5UQ4'
  // ],userTag.tag.id)
  //获取用户标签
  // const getTag = await w.getTagUser(userTag.tag.id);
  // console.log(getTag);

  //删除标签
  // const result1 = await w.deleteCreatedTags(104);
  // console.log(result1);
  //得到已经创建的标签
  // const CreatedTags = await w.getCreatedTags();
  // console.log(CreatedTags);

})();

module.exports = Wechat;