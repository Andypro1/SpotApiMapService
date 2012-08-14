var http = require('http'),
	fs   = require('fs'),
	url  = require('url');

var server = http.createServer(function(req, res) {
	var qs =   url.parse(req.url, true).query,
		path = url.parse(req.url, true).path;

	if(path === '/map/edit') {
		if(req.method === 'POST') {
			res.end('POSTed!');
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

		if(!qs.callback) {
			res.end('\'You must specify a callback parameter.\' ' + path);
			return;
		}
		
		fs.exists('/home/ap/dev/www/spot/spotJson.txt', function(exists) {
			if(exists) {
				fs.readFile('/home/ap/dev/www/spot/spotJson.txt', 'utf8', function(err, data) {
					//  Format json file into a json-p response
					res.end(qs.callback + '(' + data + ')');
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