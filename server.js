const http = require('http');
const koa = require('koa');
const app = new koa();
const koaBody = require('koa-body');

const fs = require('fs');

let key;
let exist = fs.existsSync('./key.js');
if(exist){
	key = require('./key.js');
}else {
	key = require('/var/secrets/key.js');
}
const request = require('request');
const serve = require('koa-static');

const normalizedPath = require('path').join(__dirname, 'modules');
const modules = [];
fs.readdirSync(normalizedPath).forEach(function(file) {
    const module = require(__dirname+'/modules/'+file);
    modules.push({
        'name':file,
        'module':module
    });
});

app.use(serve('public'));
app.use(koaBody({formidable:{uploadDir: __dirname}}));

const tool = require('./getProfile.js');

app.use(async (ctx, next) => {
    if(ctx.request.method=='POST') {
        const payload = ctx.request.body.events[0];
        console.dir(payload,{depth:null});
        if(payload.type=='beacon'){
            const body = {};
            body.replyToken = payload.replyToken;
            let userId = payload.source.userId;
            tool.getProfile(userId,function (info) {
	    let message = "Hello "+ JSON.parse(info).displayName;
	    message += "\n"+JSON.parse(info).pictureUrl;
	    message += '\ntype: '+payload.beacon.type+'\nLine Beacon Info: '+payload.beacon.hwid;
            const messages = {type:'text', id:'', text:message};
            body.messages = [messages];
            reply(body);
	    });
        }
        else{
            const body = {};
            delete payload.message.id;
            body.replyToken = payload.replyToken;	
	    var res = await commandHandler(payload.message.text);
	    console.log(res);
	    if(res!=undefined){
	    	const message = res;
	    	body.messages = message;
	    	reply(body);
	    }
        }
    }
    ctx.body = 'Line Bot';
});

function reply(body) {
        const options = {
            method:'POST',
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+key.ACL
            },
            body: JSON.stringify(body)
        };
        request.post(options,function(error,response,body){
            //console.log(body);
        });
}

async function commandHandler(content) {
  for(var i=0;i<modules.length;i++){
      const module = modules[i];
      if(module.module.parse!=undefined){
      let response = await module.module.parse(content).then((result) =>{
        console.log(module.name+': '+result);
        return result;
      }).catch((err) => {
          //console.log('fail', err);
     	 return null;
     });
     if(response) {
	return response;
     }
     } //end module.module.parse check
  }
}

http.createServer(app.callback()).listen(8081);
