define(['knockout'], function (ko) {
	return {
		filters: ko.observableArray(),
		mode: ko.observable("All"),
		getFilterValueByType: function(type) {
			var result = null;
			for (var i=0;i<this.filters().length&&result===null;i++)
				if (this.filters()[i].type===type)
					result = this.filters()[i].value;
			return result;
		},
		getFilterValueByKey: function(key) {
			var result = null;
			for (var i=0;i<this.filters().length&&result===null;i++)
				if (this.filters()[i].key===key)
					result = this.filters()[i].value;
			return result;
		},
		remove: function(label) {
			this.filters.remove(function(item) {return item.label===label});
		},
		clear: function() {
			this.filters.removeAll();
		}
	}
});
