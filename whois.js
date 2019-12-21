// Description:
//   Allows hubot query whois
//
// Dependencies:
//   knife installed in your $PATH
//
// Configuration:
//   none
// Commands:
//   hubot whois <domain> - domain: domain to query
//
// Author:
//   edznux
//

var whois = require("whois");

function main(robot){
	robot.hear(/whois( (http:\/\/.*))?$/i, function(res){
		if(res.match[2]){
			var hostname = res.match[2].split('http://')[1]; 
			console.log(hostname);
			getWhois(hostname, function(err,data){
				if(err){
					throw err;
				}
				res.send("```"+data+"```");
			});
		}else{
			res.send(getHelp());
		}
	});
}

module.exports = main;

function getWhois(name,callback){
	whois.lookup(name, function(err, data) {
		callback(err,data);
	});
}

function getHelp(){
	return [
			"Whois commands : ",
			"Usage : whois <example.com>"
			].join("\n");
}