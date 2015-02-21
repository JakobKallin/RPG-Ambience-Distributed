'use strict';

Ambience.distributed = (function() {
	var server;
	
	function start() {
		server = prompt('Please enter the URL of your Ambience server.');
		return new EventSource(server);
	}
	
	function trigger(event, data) {
		var request = new XMLHttpRequest();
		request.open(
			'POST',
			server
			+ '?event=' + encodeURIComponent(event)
			+ '&data=' + encodeURIComponent(data)
		);
		request.send();
	}
	
	return {
		start: start,
		trigger: trigger
	};
})();