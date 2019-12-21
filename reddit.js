// Description:
//   Auto complete reddit
//
// Dependencies:
//
// Configuration:
//   none
// Commands:
//   hear /r and /u url
//
// Author:
//   edznux
//

var https = require("https");

function main(robot){
	robot.hear(/\/r\/(.*)/i, function(res){
		// ignore full url
		if(res.message.text.match(/(https?:\/\/)?reddit.com\/r\/(.*)/i)){
			return;
		}
		console.log(res.match[1].split(" ")[0]);
		res.send("https://reddit.com/r/"+res.match[1].split(" ")[0]);
	});
	robot.hear(/\/u\/(.*)/i, function(res){
		// ignore full url
		if(res.message.text.match(/(https?:\/\/)?reddit.com\/u\/(.*)/i)){
			return;
		}
		console.log(res.match[1].split(" ")[0]);
		res.send("https://reddit.com/u/"+res.match[1].split(" ")[0]);
	});
}

module.exports = main;
