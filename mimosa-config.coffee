exports.config =

  # 0.14.12 is needed for optimization to work properly
  minMimosaVersion:'0.14.12'

  modules: [
    'server'
    'require'
    'minify'
    'live-reload'
    'lint'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'web-package'
  ]

  watch:
    javascriptDir: 'javascripts/app'

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"javascripts"
    patterns: ['app/**/*.js', 'vendor/durandal/**/*.js']

  bower:
    copy:
      mainOverrides:
        "knockout.js":["knockout.js","knockout-2.3.0.debug.js"]
        "bootstrap": [
          "dist/js/bootstrap.js"
          "dist/css/bootstrap.css"
          {"dist/fonts" : "../../fonts"}
        ]
        "durandal": [
          {
            img: "../../images"
            js: "durandal"
            css: "durandal"
          }
        ]

  combine:
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/durandal/durandal.css'
          'starterkit.css'
          'typeahead-bootstrap-fix.css'
        ]
      }
    ]

  server:
    path: "server.js"
    views:
      compileWith: 'handlebars'
      extension: 'hbs'

  require:
    optimize:
      overrides:
        name: '../vendor/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true