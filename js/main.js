/*
jsonp("//example.com/a?callback=", {
    onSuccess: function(json) {
    },
    onTimeout: function(){
    },
    timeout: 5000
});
*/
var jsonp = function(src, options) {
    var script;

    options = options || { };
    options.callback = options.callback || "callback",
    options.onSuccess = options.onSuccess || function() { },
    options.onTimeout = options.onTimeout || function() { },
    options.timeout = options.timeout || 1000;

    var timeoutTrigger = window.setTimeout(function() {
        options.onTimeout();
        document.head.removeChild(script);
    }, options.timeout);

    window[options.callback] = window[options.callback] || function(data) {
        window.clearTimeout(timeoutTrigger);
        options.onSuccess(data);
        document.head.removeChild(script);
    };

    script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = src + options.callback;
    document.head.appendChild(script);
};

var main = document.getElementById("main");
var mainY;
var updateMainY = function() {
    mainY = main.offsetTop;
};
updateMainY();
window.addEventListener("resize", updateMainY);
