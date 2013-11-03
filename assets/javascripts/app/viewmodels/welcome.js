define(['plugins/router', 'activities', 'logsearch'], 
	function (router, activities, logsearch) {
	var myjsonpfunction = function(data) {
		$('body').prepend("Got data");
	};
	return {
		router: router,
		activities: activities,
		activate: function() {
			logsearch.mode('All');
		},
        compositionComplete: function (view, parent) {
        }
	};
});