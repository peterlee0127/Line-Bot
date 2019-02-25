const request = require('request');
const key = require('./key.js');

function getProfile(userId,callback) {
        const options = {
            method:'GET',
            url: 'https://api.line.me/v2/bot/profile/'+userId,
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+key.ACL
            },
        };
        request.get(options,function(error,response,body){
            //console.log(body);
            if(error){
		callback(null);
	    }else {
		callback(body);
	    }	
	 });
}
         
exports.getProfile = getProfile;
