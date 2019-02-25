const request = require('request');

let server = require('./server.js');

async function test_channel()  {
    return new Promise( (resolve,reject) => {
            let target_url = "http://localhost:8081/"
            request.get({url:target_url}, function(err,httpResponse,body){
                if(err){
                    console.error(err);
                    reject(err);
                }else {
                    console.log(body);
                    resolve(body);
                }
            });
    });
}

async function startTest() {
    await test_channel();
    process.exit(1);
}
startTest();
