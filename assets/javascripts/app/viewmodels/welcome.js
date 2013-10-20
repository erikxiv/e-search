define(['plugins/router', 'activities', 'logsearch'], 
	function (router, activities, logsearch) {
    return {
        router: router,
        activities: activities,
        activate: function() {
        	logsearch.mode('All');
        }
    };
});