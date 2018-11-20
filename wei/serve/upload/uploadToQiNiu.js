const qiniu = require('qiniu');

const accessKey = 'hRqRX441o4ksgFElLzhKMeZKluaoKM9xM7AO4kpR';
const secretKey = 'K7NyOSj2C2JhFj5L4MgMGnWjq7EkOH6QaUjpB-sf';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);
const bucket =  'weichat';
//resUrl  网络资源地址
//bucket  七牛中对象存储空间名称
//key     要保存的网络资源名称（重命名）  唯一的
module.exports = (resUrl, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
        //throw err;
        reject(err);
      } else {
        if (respInfo.statusCode == 200) {
          resolve();
        }
      }
    });
  })
}
