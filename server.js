'use strict';

var http = require('http');

var clients = {};

var server = http.createServer(function(request, response) {
	if ( request.method === 'GET' ) {
		get(request, response);
	}
	else if ( request.method === 'POST' ) {
		post(request, response);
	}
	else if ( request.method === 'HEAD' ) {
		head(request, response);
	}
});

server.listen(1337, '127.0.0.1');

function get(request, response) {
	response.writeHead(200, {
		'content-type': 'text/event-stream',
		'access-control-allow-origin': '*'
	});
	
	var client = request.socket.remoteAddress;
	if ( !(client in clients) ) {
		clients[client] = response;
		console.log('Adding client ' + client);
	}
}

function post(request, response) {
	var query = parseUrl(request.url).query;
	var client = request.socket.remoteAddress;
	Object.keys(clients).forEach(function(otherClient) {
		if ( otherClient !== client ) {
			sendEvent(query.event, query.data, clients[otherClient]);
			console.log('Sending ' + query.event + ' event to ' + otherClient + ': ' + query.data);
		}
	});
	
	response.writeHead(200, {
		'access-control-allow-origin': '*'
	});
	response.end();
}

function head(request, response) {
	response.writeHead(200, {
		'content-type': 'text/event-stream',
		'access-control-allow-origin': '*'
	});
	response.end();
}

var validEvents = ['action', 'scene'];
function sendEvent(userEvent, userData, response) {
	if ( validEvents.indexOf(userEvent) > -1 ) {
		var event = userEvent;
		var data = userData.replace(/\r|\n/g, '');
		response.write('event: ' + event + '\n');
		response.write('data: ' + data + '\n');
		response.write('\n');
	}
}

function parseUrl(url) {
	return require('url').parse(url, true);
}