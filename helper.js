//Helpers
Date.prototype.getFullMinutes = function () {
   if (this.getMinutes() < 10) {
       return '0' + this.getMinutes();
   }
   return this.getMinutes();
};


const request = require('request');

function getRequest(url,callback) {
      var options = {
          url: url
      };
      request.get(options,function(error,response,body){
          callback(response);
      });
}
exports.getRequest = getRequest;
