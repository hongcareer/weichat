const rp = require('request-promise-native');
const fs = require('fs');
const {appID,appsecret} = require('../config');

class Wechat{
  //获取
  async getAccessToken(){
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
    //使用模板发送GET请求给微信浏览器器，获取access_token
    const result = await rp({method:'GET',url,json:true});
    result.expires_in =Date.now()+3600000*2 - 300000;
    // console.log(result)
    return result;
  };
  //保存
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
  //读取
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
  }
};

(async ()=>{
  const w = new Wechat();
  let result = await w.fetchAccessToken();
  console.log(result)
  result = await w.fetchAccessToken();
  console.log(result)
})();