async function parse(context) {
    return new Promise(function(resolve,reject) {
      // Process Single Command
      if(context=="天氣"){
	    let res = "latest";
	    let prefix = 'https://linebot.peterlee0127.com/';
	    let originalContentUrl = prefix + res + '-ori.jpg';
	    let previewImageUrl = prefix + res + '-pre.jpg';
	    let message = [{type:'image', 
				originalContentUrl:originalContentUrl,
				previewImageUrl:previewImageUrl}];
	    console.log(message);	
	    resolve(message);
      }
      else {
          reject();
      }
  });
}


const phantom = require('phantom');
const crypto = require('crypto');
const sharp = require('sharp');

let done = false;
function doRender(page,instance) {
     var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    //let hash = crypto.createHash('sha1').update(current_date + random).digest('hex');  
    let hash = 'latest'; 
    if(done){
	return;
    }
    done = true;
    let filePath = './public/'+hash+'-ori.jpg';    
    page.render(filePath); 
    console.log("finish");
    setTimeout(function() {	
	sharp(filePath).resize(240,135).toFile('./public/'+hash+'-pre.jpg', (err,info2) =>{
		    //callback(hash);
		    instance.exit();	

		    })
    },2000);



}

async function getImage(callback) {
  
  const instance = await phantom.create();
  const page = await instance.createPage();
  let count = 0, forcedRenderTimeout=0, renderTimeout =0;
  let resourceWait  = 80000,
      maxRenderWait = 25000;
  await page.property('viewportSize', {width: 1920, height: 1080}).then(function() {

   });
  await page.on('onResourceRequested', function(requestData) {
    count += 1;
//    console.log('> ' + requestData.id + ' - ' + requestData.url);
    clearTimeout(renderTimeout);
  });
  await page.on('onResourceReceived',function (res) {
    if (!res.stage || res.stage === 'end') {
        count -= 1;
//        console.log(res.id + ' ' + res.status + ' - ' + res.url);
        if (count === 0) {
            renderTimeout = setTimeout(doRender, resourceWait,page,instance);
        }
    }
  });

  await page.on('onLoadFinished',function(status){
    forcedRenderTimeout = setTimeout(function () {
        doRender(page,instance);
       }, maxRenderWait); 

  });

const fs = require('fs');
let key;
let exist = fs.existsSync('key.js');
if(exist){
	key = require('./../key.js');
}else {
	key = require('/var/secrets/key.js');
}
let url = key.airboxURL;
const status = await page.open(url);
  const content = await page.property('content');
};


exports.getImage = getImage;
exports.parse = parse;
