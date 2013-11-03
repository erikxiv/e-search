define(['plugins/router', 'jquery','activities', 'logsearch'], function (router, jquery, activities, logsearch) {
	var active = false;
	var _resultSize = 8;
	var _nextResult = 0;
	var _maxStart = 8;
	var addResult = function(result) {
		if (active) {
			console.log("repo add");
			$('#reporesults').append(
				'<p><h5><a href="'+result.unescapedUrl+'">'+result.title+'</a></h5>'+
				'<span>'+result.content+'</span><br/>'+
				'<a class="text-muted" href="'+result.unescapedUrl+'">'+result.url+'</a>'+
				'</p><br/>');
		}
	};
	var searchMore = function() {
		if (active) {			
				console.log("reposearch start: working " + activities.isActive("reposearch"));
			if (!activities.isActive("reposearch") && _maxStart > _nextResult) {
				activities.setWorking(true, "reposearch");
				var q = $.map(logsearch.filters(), function(n, i) {return encodeURIComponent(n.value);}).join("%20");
				console.log("reposearch "+q);
				setTimeout(function() {
					$.ajax({
						url: "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="+q+"&rsz="+_resultSize+"&start="+_nextResult,
						dataType: 'jsonp',
						success: function (data) {
							if (data.responseStatus==200) {
								$.each(data.responseData.results,function(i,row){
									addResult(row);
									_nextResult = _nextResult + 1;
								});
								var pages = data.responseData.cursor.pages;
								if (pages) {
									var last_start = pages[pages.length-1].start;
									_maxStart = last_start > _maxStart ? last_start : _maxStart;
								}
							}
							activities.setWorking(false, "reposearch");
						}
					});
				}, 10);
			}
		}
	};
	var newSearch = function() {
		if (active) {
			$('#reporesults').html("");
			_nextResult = 0;
			searchMore();
		}
	};

	return {
		router: router,
		activities: activities,
		activate: function() {
			active = true;
			console.log("active repo");
			logsearch.mode('Repositories');
			_nextResult = 0;
			_maxStart = 8;
			// Do a fresh search
			setTimeout(function() {
				newSearch();
			}, 10);
		},
		deactivate: function() {
			active = false;
			console.log("deactive repo");
		},
		compositionComplete: function (view, parent) {
			console.log("cc repo");
			// Subscribe to changes to the search filters
			logsearch.filters.subscribe(function(v) {newSearch();});
			// Infinite scroll
			$(window).scroll(function() {
				if($(window).scrollTop() == $(document).height() - $(window).height()) {
					searchMore();
				}
			});
		}
	};
});