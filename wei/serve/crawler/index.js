const puppeteer = require('puppeteer');

module.exports = async () => {
  //打开浏览器
  const browser = await puppeteer.launch(
    {headless: false}
  );
  //打开标签页
  const page = await browser.newPage();
  await page.goto('https://movie.douban.com/coming', {waitUntil: 'load'});
  const result = await page.evaluate(() => {
    //定义一个容器
    let result = [];
    //开始爬取数据
    const $tds = $('.coming_list>tbody>tr').find('td:last');
    for (let i = 0; i < $tds.length; i++) {
      let $td = $($tds[i]);
      let num = +$td.text().split('人')[0];
      if (num >= 1000) {
        const href = $td.parent().find('td:nth(1)>a').attr('href');
        result.push(href);
      };
    };
    //将数据返回出去
    return result;
  });
  // console.log(result);
  //第二次
  let movies = [];
  for (var i = 0; i < result.length; i++) {
    let item = result[i];

    try{
      //跳转到爬取到的网址
      await page.goto(item,{waitUntil: 'load'});
      //开始爬取数据
      const data = await page.evaluate(()=>{
        const $video = $('.related-pic-video');
        if(!$video.length){
          return null;
        };
        const href = $video.attr('href');
        const cover = $video.css('background-image').split('"')[1].split('?')[0];
        const title= $($('[property="v:itemreviewed"]')).text();
        const rating = $($('[property="v:average"]')).text();
        const director = $($('[rel="v:directedBy"]')).text();
        const summary = $($('[property="v:summary"]')).text().trim();
        let cast = [];
        //爬取演员
        const $star = $('[rel="v:starring"]');
        let length = $star.length>3?3:$star.length;
        for (var j = 0; j <length; j++) {
          cast.push($($star[j]).text())
        };
        //影片类型
        const genre = [];
        const $scp = $('[property="v:genre"]');
        for (var j = 0; j < $scp.length; j++) {
          genre.push($($scp[j]).text())
        };
        //上映日期
        const releaseDate = $($('[property="v:initialReleaseDate"]')[0]).text();
        //海报
        const image = $('[rel="v:image"]').attr('src');
        return{
          href,
          cover,
          title,
          rating,
          director,
          summary,
          cast,
          genre,
          releaseDate,
          image
        }
      });
      if(!data){
        continue;
      };
      data.doubanId = item.split('subject/')[1].split('/')[0];
      movies.push(data)
    }catch (e) {}
    // console.log(movies)
  }
  //第三次，爬取视频链接
  for (var i = 0; i < movies.length; i++) {
    let item = movies[i];
    await page.goto(item.href,{waitUntil: 'load'});
    const data = await page.evaluate(() => {
      return $('video>source').attr('src');
    });
    item.src = data;
    delete item.href;
  };
  // console.log(movies)
  await browser.close();
  //返回获取的值
  return movies;
};

