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
	    let status = fs.statSync('./public/latest-ori.jpg').ctime;	    
	    let ctime = new Date(status).toLocaleString('en-US', { timeZone: 'Asia/Taipei'});
	    console.log(message);	
	    resolve(message);
      }
      else {
          reject();
      }
  });
}


const sharp = require('sharp');
const puppeteer = require('puppeteer');
const request = require('request');


function timeout() {
	if(!done){
		let ctime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei'});
	}
}
let canvas = require('./overlayCanvas.js');

async function resizeImage(filepath) {
  return new Promise((resolve, reject) => {
    let text = new Date().toString();
    let nfilepath = './public/latest-ori.jpg';
    canvas.addOverLay(filepath, text, nfilepath);

    sharp(nfilepath).resize(240,135).toFile('./public/latest-pre.jpg', (err,info2) =>{
 	resolve();
    });
  });
}

let done = false;
let browser;
async function getImage() {
    //setTimeout(timeout,20*1000);    
    try{
     browser = await puppeteer.launch({args: ['--headless','--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage()
	 
    await page.setViewport({ width: 1920, height: 1920 })
    await page.goto(url, {timeout: 1000*60*3});
    
    await page.waitFor(2000);
   
    const navigationPromise = page.waitForNavigation()//["kibana-body"])
    
    await navigationPromise

    await page.waitFor(8000);

    let filepath = './public/latest-ori-temp.jpg';
    await page.screenshot({path: filepath});

    await resizeImage(filepath)
    done = true;
    await browser.close(); 

    console.log("get image complete");
  
    }catch(error) {
	console.log(error);	
	await browser.close(); 
	getImage((item)=> {});
     }
}; 

const fs = require('fs');
let key;
let exist = fs.existsSync('key.js');
if(exist){
	key = require('./../key.js');
}else {
	key = require('/var/secrets/key.js');
}
let url = key.airboxURL;


exports.getImage = getImage;
exports.parse = parse;
