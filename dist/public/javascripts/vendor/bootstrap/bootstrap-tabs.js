!function(e){"use strict";function t(e,t){t.find("> .active").removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),e.addClass("active"),e.parent(".dropdown-menu")&&e.closest("li.dropdown").addClass("active")}function n(n){var r,i,o=e(this),a=o.closest("ul:not(.dropdown-menu)"),s=o.attr("href");if(/^#\w+/.test(s)){if(n.preventDefault(),o.parent("li").hasClass("active"))return;r=a.find(".active a").last()[0],i=e(s),t(o.parent("li"),a),t(i,i.parent()),o.trigger({type:"change",relatedTarget:r})}}e.fn.tabs=e.fn.pills=function(t){return this.each(function(){e(this).delegate(t||".tabs li > a, .pills > li > a","click",n)})},e(document).ready(function(){e("body").tabs("ul[data-tabs] li > a, ul[data-pills] > li > a")})}(window.jQuery||window.ender);