define(['knockout'], function (ko) {
	var _working = ko.observable(false);
	return {
		isWorking: ko.computed(function() { return _working(); }),
		isDone: ko.computed(function() { return !_working(); }),
		// isBusy: function() { return busy; },
		setWorking: function(v) { _working(v); }
	}
});
