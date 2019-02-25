async function parse(context) {
    return new Promise(function(resolve,reject) {
      // Process Single Command
      if(context=="運勢"){
          var luck = ["大吉","吉","小吉","兇","大凶"];
          var index = Math.floor((Math.random()*luck.length)+0);
	  const message = [{type:'text', text:luck[index]}];  
	  resolve(message);
      }

      //Process Multiple Command
      var array = context.split(" ");
      var response = "";
      if(array.length>0) {
          var first = array[0];
          var args = "";
          for(var i=1;i<array.length;i++) {
              args = args + array[i];
              if(i<array.length-1) {
                  args += "%20";
              }
          }
        if(first==="問") {
          const message = [{type:'text', text:"https://www.google.com.tw/?client=safari#q="+args}];
	  resolve(message);    
        }
        else if(first=="影片"){
		const message = [{type:'text', text:"https://www.youtube.com/results?search_query="+args}];
	  	resolve(message);    
        }else {
          reject();
        }
      }
      else {
          reject();
      }
  });
}

exports.parse = parse;
