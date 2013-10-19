define(['plugins/router', 'durandal/app', 'typeahead'], function (router, app, typeahead) {
    var MyEngine = {
        compile: function(template) {
            return {
                render: function(context) {
                    return template.replace(/\{\{(\w+)\}\}/g,
                        function(match, p1) {
                             return jQuery('<div/>').text(context[p1] || '').html();
                        });
                }
            };
        }
    };
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true }
            ]).buildNavigationModel();
            return router.activate();
        },
        autocompleted: function(obj, datum) {
            // Note: this function will be called as a jquery event trigger ("this" will be a html element)
            // Clear the field for next input
            $('#search').typeahead('setQuery', '');
            // Check if this is a link, if so, follow it
            if (datum.type=='link')
                window.location = datum.url;
            // $('body').append(datum.type+':"'+datum.value+'"<br/>');
            $('#filters').append('<div class="filter label label-success">'+datum.value+'&nbsp;<span>&times;</span></div>');
        },
        compositionComplete: function (view, parent) {
            // Initialize search-bar
            $('#search').typeahead([
                {
                  name: 'links',
                  template: '<div><span><b>{{value}}</b></span>&nbsp;<span class="text-muted">{{url}}</span><span class="pull-right text-muted">Link</span></div>',
                  engine: MyEngine,
                  prefetch: { url: 'data/links.json', ttl: 60 }
                },
                {
                  name: 'countries',
                  template: '<div><span><b>{{value}}</b>, {{code}}</span><span class="pull-right text-muted">Country</span></div>',
                  engine: MyEngine,
                  prefetch: { url: 'data/countries.json', ttl: 60 }
                },
                {
                  name: 'cities',
                  template: '<div><span><b>{{value}}</b>, {{country}}</span><span class="pull-right text-muted">City</span></div>',
                  engine: MyEngine,
                  prefetch: { url: 'data/cities.json', ttl: 60 }
                }
            ]);
            // Subscribe to complete events
            // $('#search').on("typeahead:opened", function() {$('body').append('opened<br/>')});
            // $('#search').on("typeahead:closed", function() {$('body').append('closed<br/>')});
            $('#search').on("typeahead:selected", this.autocompleted);
            // $('#search').on("typeahead:autocompleted", function() {$('body').append('autocompleted<br/>')});
        }
    };
});