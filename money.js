// Description:
//   Allows hubot convert value to different currency
//
// Dependencies:
//   money : * 
//
// Configuration:
//   none
//
// Commands:
//   hubot convert <value> <symbol from> <symbol to> 
//
// Notes: 
// 	- convert value from the currency given in the first argument to the last one
//  - symbol* are national identifier (like USD , GBP, EUR) OR most common symbol : € $ £ руб
//
// Author:
//   edznux
//

var fx = require('money');
fx.base = "EUR";


//list common currency and symbol
var currency = {"USD":"$", "GBP":"£","EUR":"€", "RUB":"руб"};
var currencyReversed = {"$":"USD", "£":"GBP","€":"EUR", "руб":"RUB"};

function main(robot){
	/*
		Fetch every 24h + at startup
	*/
	getCurrency(robot);
	setInterval(function(){
		getCurrency(robot);
	}, 60*60*24*1000);

	robot.hear(/^convert( (.*) (.*) (.*))?/, function(res){
		var amount = res.match[2];
		var from = res.match[3];
		var to = res.match[4];

		if(res.match[1]){
			if(amount && from && to){
				var value = convertFromTo(from, to, amount);
				res.send(amount+" "+from +" => "+value+" "+to);
				return;
				// robot.send(convertFromTo(res.match[2], res.match[3], res.match[4]);
			}
		}
		res.send(getHelp());
	});
}

module.exports = main;

function convertFromTo(from,to,amount){
	console.log(from,to,amount);

	// add support for symbol ($ = USD);
	if(currencyReversed.hasOwnProperty(from)){
		from = currencyReversed[from];
	}
	if(currencyReversed.hasOwnProperty(to)){
		to = currencyReversed[to];
	}
	
	return fx.convert(amount, {from: from, to: to}).toFixed(2);
}

function getCurrency(robot){
	robot.http("http://api.fixer.io/latest").get()(function(err,res,body){
		data = JSON.parse(body);
		if(data.rates){
			console.warn("Rates successfully fetched");
			fx.rates = data.rates;
		}
	});
}

function getHelp(){
	return ["Convert usage : ",
			"convert <amout> <from currency> <to currency>",
			"Example : ",
			"convert 10 £ $"].join('\n');
}
