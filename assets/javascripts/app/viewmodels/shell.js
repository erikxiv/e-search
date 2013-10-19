define(['plugins/router', 'durandal/app', 'typeahead', 'jquery-text-selection'], function (router, app, typeahead, jts) {
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
    var validate = function(s) {
      var re_date = /^\s*date\s*(<|>)=?\s*\d\d\d\d-\d\d-\d\d\s*$/;
      var re_time = /^\s*time\s*(<|>)=?\s*\d\d:\d\d:\d\d\s*$/;
      var re_datetime = /^\s*datetime\s*(<|>)=?\s*\d\d\d\d-\d\d-\d\d\s+\d\d:\d\d:\d\d\s*$/;
      var re_keyvalue = /^\s*[a-zA-Z]+\s*=\s*"[^"]*"\s*$/;
      return re_date.test(s) ? 'time'
        : re_time.test(s) ? 'time'
        : re_datetime.test(s) ? 'time'
        : re_keyvalue.test(s) ? 'key-value'
        : 'none';
    }
    var add = function(label) {
      $('#search').typeahead('setQuery', '');
      $('#filters').append('<div class="filter label label-success">'+label+'&nbsp;<span>&times;</span></div>');
    }
    var trytoadd = function() {
      s = $('#search').val();
      type = validate(s);
      if (type !== 'none') {
        add(s);
      }
    }

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
            // Check if this is a link, if so, follow it
            if (datum.type=='link') {
              window.location = datum.url;
            }
            else if (datum.type=='time') {
              // Lets start by replacing tokens
              var s = datum.pattern;
              var d = new Date();
              s = s.replace(/\${YYYY}/g, d.getFullYear());
              s = s.replace(/\${MM}/g, d.getMonth() < 9 ? '0' + (d.getMonth()+1) : d.getMonth()+1);
              s = s.replace(/\${DD}/g,   d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
              s = s.replace(/\${HH}/g,   d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
              s = s.replace(/\${mm}/g,   d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
              s = s.replace(/\${ss}/g,   d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
              // Set input text to new value
              s = $(this).addTabStops(s);
            }
            else if (datum.type=='key-value') {
              // Lets start by replacing tokens
              var s = datum.pattern;
              // Set input text to new value
              s = $(this).addTabStops(s);
            }
            else {
              add(datum.value);
            }
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
                  name: 'time',
                  template: '<div><span><b>{{value}}</b></span><span class="pull-right text-muted">Time</span></div>',
                  engine: MyEngine,
                  prefetch: { url: 'data/time.json', ttl: 60 }
                },
                {
                  name: 'custom',
                  template: '<div><span><b>{{value}}</b></span><span class="pull-right text-muted">{{type}}</span></div>',
                  engine: MyEngine,
                  prefetch: { url: 'data/custom.json', ttl: 60 }
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
            $('#search').on("typeahead:autocompleted", this.autocompleted);
            // $('#search').on("typeahead:autocompleted", function() {$('body').append('autocompleted<br/>')});
            // $('#search').popover({content: "Popover", placement: "bottom"}).popover("show");
            $('#search').on("keyup", function() {$('#message').html(validate($(this).val()))});
            $('#search').on("keydown", function(e) {if (e.which===13) trytoadd();});
        }
    };
});