var http = require('http'),
	fs = require('fs');

//  Read existing file if it exists
//  Parse its JSON for unique point IDs
//  Request latest from api
//  Parse its JSON for unique point IDs
//  append new points to read JSON
//  write the file to disk
var responseJson = '',
	jsonMaster = { response: { feedMessageResponse: { messages: { message: [] } } } },
	jsonNew = {},
	options = {
		host: 'share.findmespot.com',
		port: 80,
		path: '/spot-adventures/rest-api/1.0/public/feed/' + process.argv[2] +
			'/message?feedPassword=' + process.argv[3] + '&sort=timeInMili&dir=DESC'
	};

//  Begin with a file exist check on the master list of points
fs.exists('/home/ap/dev/www/spot/spotJson.txt', function(exists) {
	if(exists) {
		fs.readFile('/home/ap/dev/www/spot/spotJson.txt', 'utf8', function(err, data) {
			jsonMaster = JSON.parse(data);
		});
	}

	//  Perform an http request from the spot rest api, compare
	//  the list of points to the master list in the jsonMaster object,
	//  then write the new master list back to the file
	var req = http.get(options, function(res) {
		res.setEncoding('utf8');

		res.on('data', function(chunk) {
			responseJson += chunk;
		});

		res.on('end', function() {
			jsonNew = JSON.parse(responseJson);

			if(!(jsonNew && jsonNew.response && jsonNew.response.feedMessageResponse &&
				jsonNew.response.feedMessageResponse.messages)) {
				console.log(jsonNew);
				fs.writeFileSync('/home/ap/dev/www/spot/spotJson.txt', JSON.stringify(jsonMaster));
				return;
			}

			var points = jsonNew.response.feedMessageResponse.messages.message;
			
			if(!points)
				return;
			else if(!points.length)
				points = [points];
			
			for(var i=points.length-1; i >= 0; --i) {
				if(!PointInMaster(points[i], jsonMaster)) {
					jsonMaster.response.feedMessageResponse.messages.message.push(points[i]);
					console.log('Added new point.');
				}
			}

			fs.writeFileSync('/home/ap/dev/www/spot/spotJson.txt', JSON.stringify(jsonMaster));
		});
	});

	req.on('error', function(e) {
		console.log('error: ' + e.message);
	});
});

//  Check if newPoint's id matches any id's in masterList
function PointInMaster(newPoint, masterList) {
	for(var i=0; i < masterList.response.feedMessageResponse.messages.message.length; ++i) {
		if(masterList.response.feedMessageResponse.messages.message[i].id === newPoint.id)
			return true;
	}

	return false;
}
