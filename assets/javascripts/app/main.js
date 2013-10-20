requirejs.config({
    paths: {
        'text': '../vendor/requirejs-text/text',
        'jquery-base64': '../vendor/jquery-base64/jquery.base64',
        'knockout': '../vendor/knockout.js/knockout',
        'jquery': '../vendor/jquery/jquery',
        'bootstrap': '../vendor/bootstrap/bootstrap',
        'bootstrap-tabs': '../vendor/bootstrap/bootstrap-tabs',
        'typeahead': '../vendor/typeahead.js/typeahead',
        // 'jquery-text-selection': 'jquery-text-selection',
        'durandal':'../vendor/durandal',
        'plugins' : '../vendor/durandal/plugins',
        'transitions' : '../vendor/durandal/transitions'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'bootstrap-tabs': {
            deps: ['jquery', 'bootstrap'],
            exports: 'jQuery'
        },
        'typeahead': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'jquery-text-selection': {
            deps: ['bootstrap'],
            exports: 'jQuery'
        },
        'jquery-base64': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'e-search';

    app.configurePlugins({
        router:true,
        dialog: true,
        widget: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});