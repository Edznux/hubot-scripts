  module.exports = function(robot) {
    return robot.hear(/(!ud) (.*)/i, function(msg) {
      return urbanDict(msg, msg.match[2], function(found, entry) {
        if (!found) {
          msg.send("\"" + msg.match[2] + "\" not found");
          return;
        }
        msg.send("" + entry.definition);
      });
    });
  };

  function urbanDict(msg, query, callback) {
    msg.http("http://api.urbandictionary.com/v0/define?term=" + (escape(query))).get()(function(err, res, body) {
      var result;
      result = JSON.parse(body);
	  if (result.error){
		  return callback(false);
	  }
      if (result.list && result.list.length) {
        return callback(true, result.list[0]);
      }else{
    	return callback(false);
	  }
    });
  };
