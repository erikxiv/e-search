define(['plugins/router', 'jquery','activities', 'logsearch'], function (router, jquery, activities, logsearch) {
	var active = false;
	var cities = [];
	var countries = [];
	var nationalities = [];
	var zp = function(s,l) { return "000".substring(0, l-(s+"").length)+s;};
	var formatDate = function(d) {
		return zp(d.getFullYear(),4)+"-"+
			zp(d.getMonth()+1,2)+"-"+
			zp(d.getDate(),2)+" "+
			zp(d.getHours()+1,2)+":"+
			zp(d.getMinutes()+1,2)+":"+
			zp(d.getSeconds(),2);
	};

	var addResults = function(results) {
		if (active) {
			$.each(results, function(index, value) {
				$('#logresults tbody').append(
					'<tr><td>'+value[0]+'</td>'+
					'<td><span class="fvalue" data-fkey="country">'+value[1]+'</span>&nbsp;<span class="btn-xs btn-link glyphicon glyphicon-filter"></span></td>'+
					'<td><span class="fvalue" data-fkey="city">'+value[2]+'</span>&nbsp;<span class="btn-xs btn-link glyphicon glyphicon-filter"></span></td>'+
					'<td><span class="fvalue" data-fkey="Nationality">'+value[3]+'</span>&nbsp;<span class="btn-xs btn-link glyphicon glyphicon-filter"></span></td>'+
					'</tr>');
			});
		}
	};
	var generateResults = function() {
		if (active) {
			var start = new Date();
			var fcity = logsearch.getFilterValueByType("city");
			var fcountry = logsearch.getFilterValueByType("country");
			var fnationality = logsearch.getFilterValueByKey("Nationality");
			// Pretend that more filters produce less results by adding to date interval
			var interval = 15 * (fcity ? 10 : 1) * (fcountry ? 10 : 1) * (fnationality ? 10 : 1);
			for (var i=1; i<=20; i++) {
				var d = new Date(start.getTime() - i*interval*1000);
				var city = fcity ? fcity : cities[Math.floor((Math.random()*cities.length))].value;
				var country = fcountry ? fcountry : countries[Math.floor((Math.random()*countries.length))].value;
				var nationality = fnationality ? fnationality : nationalities[Math.floor((Math.random()*nationalities.length))].value;
				addResults([[formatDate(d), country, city, nationality]]);
			}
		}
	};
	var searchMore = function() {
		if (active) {
			console.log("log searchMore");
			if (!activities.isActive("logsearch")) {
				activities.setWorking(true, "logsearch");
				setTimeout(function() {
					generateResults();
					activities.setWorking(false, "logsearch");
				}, 1000);
			}
		}
	};
	var newSearch = function() {
		if (active) {
			$('#logresults tbody').html("");
			searchMore();
		}
	};

	return {
		router: router,
		activities: activities,
		activate: function() {
			active = true;
			console.log("active logs");
			logsearch.mode('Logs');
			$.getJSON("data/cities.json", function(data) { cities = data; });
			$.getJSON("data/countries.json", function(data) { countries = data; });
			$.getJSON("data/nationalities.json", function(data) { nationalities = data; });
			// Do a fresh search
			setTimeout(function() {
				newSearch();
			}, 10);
		},
		deactivate: function() {
			active = false;
			console.log("deactive logs");
			// logsearch.clear();
		},
		compositionComplete: function (view, parent) {
			console.log("cc logs");
			// Subscribe to changes to the search filters
			logsearch.filters.subscribe(function(v) {newSearch();});
			// Add filter-click functionality
			$('#logresults tbody').on("click", ".btn-link", function(e) {
				var fv = $(e.target).parent().children('.fvalue');
				logsearch.filters.push({
					key: fv.data('fkey'),
					type: fv.data('fkey') === 'Nationality' ? 'key-value' : fv.data('fkey'),
					value: fv.text(),
					label: fv.data('fkey')+" = "+fv.text()
				});
			});
			// Infinite scroll
			$(window).scroll(function() {
				if($(window).scrollTop() == $(document).height() - $(window).height()) {
					searchMore();
				}
			});
		}
	};
});