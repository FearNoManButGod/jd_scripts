const $ = new Env('搞基大神-发财挖宝help');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const fcwbCode = $.isNode() ? (process.env.fcwbCode ? process.env.fcwbCode : null) : null ;
const JD_API_HOST = 'https://api.m.jd.com';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
$.inviteCode = ["b293d8495a884ef3b2b80be21df5260571671635618965557@xlOvyZbXqs0mu_R2jZ0fdqu9XpGJJ-oWRMA39Czna48"];



if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      
      await TaskList();
      await home();
      if($.blood>1){
        for (let i = 0; i <  $.chunks.length ; i++) {
            console.log(`挖宝${i}次`) 
            await $.wait(3000);
            chunks = $.chunks[Math.floor(Math.random() * $.chunks.length)]
            console.log(chunks);
            await wb(chunks)
            if( $.blood>1 ){
              continue;
            }else{
              break;
            }
        }
      }
      await home(true);
      
    }

    for (let i = 0; i < cookiesArr.length; i++) {
      if (!fcwbCode) {
        console.log(`环境变量中没有检测到助力码,进行内部助力`)
        for (let i = 0; i < $.inviteCode.length; i++) {
          const element = $.inviteCode[i];
          console.log(`去助力${element}`);
          await help(element.split("@")[0], element.split("@")[1])
          await $.wait(3000);
        }
      } else {
        console.log(`环境变量中检测到助力码,进行指定助力`)
          fcwbHelp = fcwbCode.split("&");
          for (let i = 0; i < fcwbHelp.length; i++) {
            const element = fcwbHelp[i];
            console.log(`去助力${element}`);
            await help(element.split("@")[0], element.split("@")[1])
            await $.wait(3000);

          }
      }
    }
    
  
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function TaskList(){
  return new Promise((resolve) => {
    const nm= {
        url: `${JD_API_HOST}/?functionId=apTaskList&body={"linkId":"SS55rTBOHtnLCm3n9UMk7Q"}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0`,
        headers: {
          "Accept": "application/json,text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Cookie": cookie,
          "Host": "api.m.jd.com",
          "Origin": "https://bnzf.jd.com/?activityId=SS55rTBOHtnLCm3n9UMk7Q",
          "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;")
        }
      }
      $.get(nm, async (err, resp, data) => {
          try {
            if (err) {
              console.log(`${JSON.stringify(err)}`)
              console.log(`${$.name} API请求失败，请检查网路重试`)
            } else {
              if (safeGet(data)) {
                data = JSON.parse(data);
                if(data.success==true){
                  console.log(`去做发财挖宝浏览任务`);
                  for (let key of Object.keys(data.data)) {
                    let vo = data.data[key];
                    if(vo.id === 360){
                      $.taskLimitTimes = vo.taskLimitTimes;
                      $.taskDoTimes = vo.taskDoTimes;
                      $.needDoTimes = $.taskLimitTimes - $.taskDoTimes;
                      console.log(`${vo.taskShowTitle}任务,做多完成${$.taskLimitTimes}次,已完成${$.taskDoTimes}次,还需完成${$.needDoTimes}次`);
                      if($.needDoTimes === 0){
                        console.log(`浏览任务:${vo.taskShowTitle}已完成`);
                      }else{
                        console.log(`去做${vo.taskShowTitle}`);
                        await BROWSE_CHANNEL(vo.id,vo.taskSourceUrl);
                      }
                    }
                    if(vo.id=== 357){
                      $.taskLimitTimes = vo.taskLimitTimes;
                      $.taskDoTimes = vo.taskDoTimes;
                      $.needDoTimes = $.taskLimitTimes - $.taskDoTimes;
                      console.log(`${vo.taskShowTitle}任务,做多完成${$.taskLimitTimes}次,已完成${$.taskDoTimes}次,还需完成${$.needDoTimes}次`);
                      if($.needDoTimes === 0){
                        console.log(`浏览任务:${vo.taskShowTitle}已完成`);
                      }else{
                        console.log(`请手动去京东极速版-我的-发财挖宝做${vo.taskShowTitle}任务,可增加三滴生命值！我是菜鸟搞不懂sign算法,无法自动进行。`);
                        //await apTaskDetail(vo.id,$.needDoTimes);
                      }
                      
                    }

                  }
                  
                }else if(data.success==false){
                    console.log(data.errMsg)
                }
                

      
              }
            }
          } catch (e) {
            $.logErr(e, resp)
          } finally {
            resolve(data);
          }
        })
  })

}









function wb(chunks) {
 return new Promise((resolve) => {
    const nm= {
        url: `${JD_API_HOST}/?functionId=happyDigDo&body={"round":${$.curRound},"rowIdx":${chunks.split(",")[0]},"colIdx":${chunks.split(",")[1]},"linkId":"SS55rTBOHtnLCm3n9UMk7Q"}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0`,
        headers: {
          "Accept": "application/json,text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Cookie": cookie,
          "Host": "api.m.jd.com",
          "Origin": "https://bnzf.jd.com/?activityId=SS55rTBOHtnLCm3n9UMk7Q",
          "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;")
        }
      }
      $.get(nm, async (err, resp, data) => {
          try {
            if (err) {
              console.log(`${JSON.stringify(err)}`)
              console.log(`${$.name} API请求失败，请检查网路重试`)
            } else {
              if (safeGet(data)) {
                data = JSON.parse(data);
                if(data.success==true){
                  if(data.data.chunk.type=== 4){
                    console.log(`恭喜获得炸弹一枚,生命值-1`);
                    $.blood--;
                    console.log($.blood);
                  }else if(data.data.chunk.type=== 3){
                    console.log(`恭喜获得微信现金，金额为：${data.data.chunk.value}`);
                  }else if(data.data.chunk.type=== 2){
                    console.log(`恭喜获得无门槛红包一个，金额为：${data.data.chunk.value}`);
                  }else if(data.data.chunk.type=== 1){
                    console.log(`恭喜获得优惠卷一个，金额为：${data.data.chunk.value}`);
                  }
                }else if(data.success==false){
                console.log(data.errMsg)}
              }
            }
          } catch (e) {
            $.logErr(e, resp)
          } finally {
            resolve(data);
          }
        })
  })
}
function home(flag=false) {
  return new Promise((resolve) => {
    let body = {"linkId":"SS55rTBOHtnLCm3n9UMk7Q"}
    $.get(taskurl('happyDigHome',body), async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
              if (safeGet(data)) {
                  data = JSON.parse(data);
                  if(data.success==true){
                    if(!flag){
                      console.log(`您的助力码为:${data.data.inviteCode}@${data.data.markedPin}`);
                      console.log(`添加环境变量:export fcwbCode="" 。定义多个请用&分割。温馨提示一个账号貌似只有两次助力机会`);
                      $.inviteCode.push(`${data.data.inviteCode}@${data.data.markedPin}`)
                      $.curRound = data.data.curRound;
                      $.blood = data.data.blood;
                      console.log(`您的生命值为:${$.blood}`);
                      console.log(`您当前处于第${$.curRound}关`);
                      $.roundList = data.data.roundList[$.curRound -1];
                      if( $.roundList.state===2 ){
                        console.log(`您已放弃挖宝,跳过`);
                      }else{
                        $.chunks =[];
                        console.log(`当前开启情况`);
                        for (let key of Object.keys($.roundList.chunks)) {
                          let vo = $.roundList.chunks[key];
                          if(vo.state === 1 ){
                            if(vo.type=== 4){
                              console.log(`坐标：${vo.rowIdx},${vo.colIdx},炸弹一枚`);
                            }else if(vo.type=== 3){
                              console.log(`坐标：${vo.rowIdx},${vo.colIdx},微信现金，金额为：${vo.value}`);
                            }else if(vo.type=== 2){
                              console.log(`坐标：${vo.rowIdx},${vo.colIdx},红包一个，金额为：${vo.value}`);
                            }else if(vo.type=== 1){
                              console.log(`坐标：${vo.rowIdx},${vo.colIdx},优惠卷一个，金额为：${vo.value}`);
                            }
                          }else{
                            console.log(`坐标：${vo.rowIdx},${vo.colIdx},暂未开启，拿起你的小铲子，开挖！！！`);
                            $.chunks.push(`${vo.rowIdx},${vo.colIdx}`);
                          }
                        }
                      }
                    }else{
                      for (let key of Object.keys(data.data.roundList)) {
                        let vo = data.data.roundList[key]
                        if (vo.state === 1) {
                            console.log(`你第${vo.round}已通关,获得红包金额为:${vo.redAmount},获得现金金额为:${vo.cashAmount}`)
                        }else{
                          console.log(`你第${vo.round}关未通过,获得红包金额为:${vo.redAmount},获得现金金额为:${vo.cashAmount}`)
                          break;
                        }
                      }
                    }
                 }
              }else if(data.success==false){
                  console.log('黑号 快去买吧 叼毛')
              }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
}



function BROWSE_CHANNEL(taskId,itemId) {
 return new Promise((resolve) => {
  let body = {"linkId":"SS55rTBOHtnLCm3n9UMk7Q","taskType":"BROWSE_CHANNEL","taskId": taskId ,"channel": 4,"itemId": itemId ,"checkVersion":false};
  $.get(taskurl('apDoTask',body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
             if(data.success==true){
               console.log('任务已完成')  
             }else if(data.success==false){
              console.log(`任务失败:${data.errMsg}`)  
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function help(inviteCode,markedPin) {
  return new Promise((resolve) => {
  const nm= {
    url: `${JD_API_HOST}/?functionId=happyDigHelp&body={"linkId":"SS55rTBOHtnLCm3n9UMk7Q","inviter":"${markedPin}","inviteCode":"${inviteCode}"}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0`,
    headers: {
        "Accept": "application/json,text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "api.m.jd.com",
        "Origin": "https://bnzf.jd.com/?activityId=SS55rTBOHtnLCm3n9UMk7Q",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;")
    }
  }     
  $.get(nm, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data);
             if(data.success==true){
               console.log('助力：'+data.errMsg)  
             }else if(data.success==false){
             console.log('助力：'+data.errMsg)}
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
  
  function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

  
function taskurl(functionId,body) {
   return {
    url: `${JD_API_HOST}/?functionId=${functionId}&body=${escape(JSON.stringify(body))}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0`,
    headers: {
        "Accept": "application/json,text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "api.m.jd.com",
        "Origin": "https://bnzf.jd.com/?activityId=SS55rTBOHtnLCm3n9UMk7Q",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;")
    }
  }
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}