// Description:
//   Allows hubot query whois
//
// Dependencies:
//
// Configuration:
//   none
// Commands:
//   hubot xkcd <domain> - domain: domain to query
//
// Author:
//   edznux
//

var https = require("https");

function main(robot){
	robot.hear(/xkcd( .*)?/i, function(res){
		if(res.message.rawText.match(/^xkcd/i)){
			switch(true){ // need to do this for handle number range
				case res.match[1] == "?":
					console.log("random comic generation :");
					getRandomComicId(function(err,id){
						if(err){
							res.send("Impossible de recuperer un comic aleatoire");
							return;
						}

						console.log("random id :", id);

						getComicById(id,function(err,data){
							if(err){
								res.send("Impossible de recuperer le comic generer aleatoirement ("+ id + " : "+err+")");
								return;
							}
							postComic(data, res.envelope, robot);
						});
					});
				break;

				case /[0-9]+/.test(res.match[1]):
					console.log(res.match[1]);
					getComicById(res.match[1], function(err, comic){
						if(err){
							res.send("Impossible de recuperer le comic "+ res.match[1]+ " ( "+err+" )");
							return;
						}
						postComic(comic, res.envelope, robot);
					});
				break;
				case res.match[1] == "help":
					res.send(getHelp());
				break;
				case res.match[1] == undefined:
					getLastComic(function(err, comic){
						if(err){
							res.send("Impossible de recuperer le dernier comic ( "+err+" )");
							return;
						}
						postComic(comic, res.envelope, robot);
					});
				break;
				default:
					console.log("switch default");
					getLastComic(function(err, comic){
						if(err){
							res.send("Impossible de recuperer le dernier comic ( "+err+" )");
							return;
						}
						postComic(comic, res.envelope, robot);
					});

				break;
			}
		}
	});
}

module.exports = main;

function getLastComic(callback){
	https.get("https://xkcd.com/info.0.json",function(res){
		var data="";
		var err = null;

		res.on('data', function(d) {
			data+=d;
		});

		res.on('end', function(){
			try{
				data = JSON.parse(data);
			}catch(e){
				console.log('Erreur dans getLastComic : ', e);
				console.log(data);
				callback("Erreur dans le json.parse getLastComic", null);
			}
			callback(err, data);
		});
	});
}

function getComicById(id, callback){
	// remove space
	id = id.trim();

	https.get("https://xkcd.com/"+id+"/info.0.json",function(res){
		var data="";
		var err = null;
		console.log(res.statusCode);

		if(res.statusCode == 404){
			err = "404";
			callback(err,null);
			return;
		}
		res.on('data', function(d) {
			data+=d;
		});

		res.on('end', function(){
			try{
				data = JSON.parse(data);
			}catch(e){
				console.log('Erreur dans getComicById : ', e);
				console.log(data);
				callback("Erreur dans le json.parse getComicById", null);
				return;
			}
			callback(null, data);
		});
	});
}

function getRandomComicId(callback){
	getLastComic(function(err, data){
		if(err){
			callback(err,null);
		}
		var _lastNum = data.num;
		console.log("last num =",_lastNum);
		var id = Math.floor(Math.random()*_lastNum)+1;
		callback(null, id);
	});
}

function postComic(comic, envelope, robot){
	var post = {};
		post.attachments = [];
	var attach = {};


	attach.fallback = "XKCD #"+comic.num;
	attach.unfurl_links = true;
	attach.color="#FF5500";
	attach.author_name = "XKCD :";
	attach.title = comic.safe_title;
	attach.title_link = "https://xkcd.com/"+comic.num;
	attach.text = comic.alt;
	attach.thumb_url = comic.img;
	post.attachments.push(attach);
	post.channel = envelope.room;
	post.text  = comic.safe_title;
	robot.adapter.customMessage(post);
	return post;
}

function getHelp(){
	return [
			"xkcd commands : ",
			"Usage	: xkcd (get last comic)",
			"		: xkcd <comic id> (return comic id link)",
			"		: xkcd ? (random comic link)",
			"		: xkcd help (get this help)",
			].join("\n");
}