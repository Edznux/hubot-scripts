// Description:
//   Allows hubot to eval math query
//
// Dependencies:
//	mathjs
// Configuration:
//   none
// Commands:
// /math <expr> [all] [doudou] - expr math expression - all for posting in channel - doudou for fake
//
// Author:
//   edznux
//

var express = require('express');
var bodyParser = require('body-parser');
var math = require('mathjs');

function main(robot) {
	robot.router.post("/hook/math", function(req,res){
		console.log("REQ ==========", req.body)
		var cmd = req.body;
		var result, channel, rnd;
		var resPossible = ["42","dieu","maître","Créateur"];
		var isFake = false;
		var isPublic = false;
		var post = {}
		
		if(cmd.text.match(/all/)){
			isPublic = true;
			cmd.text = cmd.text.replace("all", "");
		}
		if(cmd.text.match(/doudou/)){
			isFake = true;
			cmd.text = cmd.text.replace("doudou", "");
		}
		result = math.eval(cmd.text);

		if(isFake){
			rnd = Math.floor(Math.random()*resPossible.length+1);
			result = resPossible[rnd];
		}

		if(isPublic){
			// res.send("ok, posting to public");+
			post.channel = cmd.channel_id;
			post.text = cmd.text + " = " + result;
			console.log(post);
			robot.adapter.customMessage(post);	
		}

		res.send(cmd.text + " = " + result);
	});
}
module.exports = main;