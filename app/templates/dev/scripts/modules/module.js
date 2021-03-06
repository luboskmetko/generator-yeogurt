/*
*   module.js
*   This is just an example file showing basic module creation
*/
<% if (jsOption ==='RequireJS') { %>define([
    // module dependencies
    'jquery'
], function ($) {

    'use strict';

    // private function
    var init = function(msg) {
        var $ele = $('<p></p>');

        $ele.append('Module loaded! - Message: ' + msg);
        console.log($ele.text());
        return $ele.text();
    };

    // Public API
    return {
        // run private initialize function
        init: init
    };

});
<% } %><% if (jsOption ==='Browserify') { %>'use strict';

// private function
var someModule = {
    init: function() {
        var $ele = $('<p></p>');

        $ele.append('Module loaded!');
        console.log($ele.text());
    }
};

module.exports = someModule;<% } %>