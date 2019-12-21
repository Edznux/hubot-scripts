// Description:
//   hear a list of message and react with emoji
//
// Dependencies:
//
// Configuration:
//   none
// Commands:
//   hear a list of message and react with emoji
//
// Author:
//   edznux
//


var https = require("https");
var { WebClient } = require('@slack/web-api');
var URL = process.env.GSHEET_REACTION 
var INTERVAL = 1000*60*10
var csvReaction = ""

function main(robot){
	robot.hear(/^!reaction update/i, function(msg){
		console.log("updating reactions!")
		getSheet(function(data){
			console.log("Data :", data)
			csvReaction = data
			reactionsRows = csvReaction.split("\n")
			updateTriggers(reactionsRows, robot)
		})
	})

	robot.hear(/^!reaction link/i, function(msg){
		console.log("!reaction link called, sending url")
		msg.send(URL.replace(/\/export.*$/, ""))
	})

	getSheet(function(data){
		console.log("Callback'd:\n", data)
		var reactionRows = []
		var listTrigger = []
		csvReaction = data
		reactionsRows = csvReaction.split("\n")
		updateTriggers(reactionsRows, robot)
	})
}

module.exports = main;

function updateTriggers(reactionsRows, robot){
	for(var i in reactionsRows){
		row = reactionsRows[i]
		splitted = row.split(",")
		trigger = splitted[0]
		emoji = splitted[1]
		console.log("emoji", emoji)
		console.log("trigger", trigger)
		addEmoji(robot, emoji, trigger)
	}
}

function addEmoji(robot, emoji, trigger){	
	var web = new WebClient(robot.adapter.options.token);
	var triggerRegexp =  new RegExp(trigger, "i");
	console.log("Regexp: ", triggerRegexp)
	robot.hear(triggerRegexp, function(msg){
		robot.logger.info("attempting to react. name:" + emoji + ", channel: "+ msg.message.rawMessage.channel +", timestamp: "+msg.message.rawMessage.ts)
		try {
			web.reactions.add({
				name:emoji,
				channel: msg.message.rawMessage.channel,
				timestamp: msg.message.rawMessage.ts
			})
		}catch(e){
			console.log(e)
		};
	})
}

function getSheet(callback){
	var csvReaction = "";
	console.log("start getSheet (reactions pull from gsheet)")
	https.get(URL, function(res){
		csvReaction = ""
		console.log("Get reaction list from GSheets")
		res.on("data", function(data){
			csvReaction += data
		})
		res.on("end", function(end){
			callback(csvReaction)
		})
	})
	.on("error", function(e){
		console.error("HTTPs error:", e)
		callback("")
	})
}
