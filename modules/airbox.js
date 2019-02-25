async function parse(context) {

    var request = require('request');
    return new Promise(function(resolve,reject) {
      // Process Single Command
      if(context=="空氣" || context=="air"){
      request.get({url:'http://127.0.0.1:3333'}, function(err,httpResponse,body){
            if(err || !body){
	    	const message = [{type:'text', text:"airBox error"}];
		resolve(message);return;
	     }
	    var result = JSON.stringify(JSON.parse(body),null,2);  
            result = result.replace(/\"/g,"").replace(/,/g,"");
            result = result.replace("{","").replace("}","");
	    result = result.replace("temperature","氣溫");
	    result = result.replace("humidity","濕度");

	    const message = [{type:'text', text:result}];
            resolve(message);
        })

      }else {
	reject();
      }
});
}

exports.parse = parse;
