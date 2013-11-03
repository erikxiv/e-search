define(['knockout', 'jquery'], function (ko, jquery) {
	var _working = ko.observable(false);
	var _tasks = {};
	return {
		isWorking: ko.computed(function() {
			return _working();
		}),
		isDone: ko.computed(function() { 
			return !_working();
		}),
		isActive: function(task) {
			return _tasks[task];
		},
		setWorking: function(state, task) { 
			var taskname = task ? task : "no name task";
			if (state)
				_tasks[taskname] = true;
			else
				delete _tasks[taskname];
			_working(! $.isEmptyObject(_tasks));
		}
	};
});
