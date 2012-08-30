var http  = require('http'),
	fs    = require('fs'),
	url   = require('url');

var server = http.createServer(function(req, res) {
	var qs   = url.parse(req.url, true).query,
		path = url.parse(req.url, true).path;

	if(path === '/map/edit') {
		if(req.method === 'POST') {
			var postBody = [];

			req.on('data', function(chunk) {
				postBody.push(chunk.toString());
			});

			req.on('end', function() {
				var jsonBody = JSON.parse(postBody);



				var jsonMaster = {
					response: {
						feedMessageResponse: {
							/*count: jsonBody.points.length,
							feed: {
								id           : '1oB6iVTMYgA9WcUjL8eFSDIoGqQGrAZ3B',
								link         : 'https://share.findmespot.com/shared/faces/viewspots.jsp?glId=1oB6iVTMYgA9WcUjL8eFSDIoGqQGrAZ3B',
								usage        : '',
								status       : 'ACTIVE',
								linkMode     : 'PRIVATE',
								linkName     : 'Test for API',
								linkDesc     : 'Test for API',
								showCustomMsg: 'Y',
								daysRange    : 7
							},
							totalCount   : 1,
							activityCount: 1,*/
							messages: {
								message: []
							}
						}
					}
				};

				for(var i=0; i < jsonBody.points.length; ++i) {
					jsonMaster.response.feedMessageResponse.messages.message.push({
						createDate   : new Date(),
						dateTime     : jsonBody.points[i].dateTime,
						id           : '',
						latitude     : jsonBody.points[i].latitude,
						longitude    : jsonBody.points[i].longitude,
						messageDetail: '',
						messengerId  : '',
						messengerName: '',
						showCustomMsg: '',
						timeInSec    : '',
						type         : ''
					});
				}

				fs.writeFileSync('/home/ap/dev/www/spot/hi.txt', JSON.stringify(jsonMaster));
				res.end('Update successful: ' + postBody);
			});
		}
		else {
			res.writeHead(200);

			var fileStream = fs.createReadStream('addpoint.html');
			fileStream.pipe(res);
		}
	}
	else {
		res.writeHead(200, 'OK', {
			'Content-Type': 'application/javascript'
		});

		fs.exists('/home/ap/dev/www/spot/spotJson.txt', function(exists) {
			if(exists) {
				fs.readFile('/home/ap/dev/www/spot/spotJson.txt', 'utf8', function(err, data) {
					if(path === '/map/json') {
						res.end(data);
					}
					else {
						if(!qs.callback) {
							res.end('\'You must specify a callback parameter.\' ' + path);
							return;
						}
						else {
							//  Format json file into a json-p response
							res.end(qs.callback + '(' + data + ')');
						}
					}
				});
			}
			else {
				res.end(qs.callback + '(\'Points file not found.\')');
			}
		});
	}
});

server.listen(4446);
console.log('* listening on port 4446');