const helper = require('../helper.js');

async function parse(context) {
    return new Promise(function(resolve,reject) {
      // Process Single Command
      if(context=='airbnb'){
        helper.getRequest('http://localhost:8888/api/roomCount',function(result){
            if(result!=undefined){
                const body = JSON.parse(result.body);
		let count = body.count;
		const message = [{type:'text', text:count}];
                resolve(message);
            }
        })
      }
      else {
          reject();
      }
  });
}

exports.parse = parse;
