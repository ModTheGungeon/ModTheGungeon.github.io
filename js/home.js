var main = document.getElementById("main");
var mainY;
var updateMainY = function() {
    mainY = main.offsetTop;
};
updateMainY();

var coverDown = document.getElementById("cover-down");
coverDown.outerHTML = "<div id=\"cover-down\"></div>";
coverDown = document.getElementById("cover-down");

(function() {
    var scrollOvershoot = 64;
    var scrolling = false;

    var lastFrame = new Date().getTime();
    var scrollFrame = function() {
        var scrollY = window.scrollY;
        if (0 <= scrollY - mainY) {
            window.scrollTo(0, mainY);
            scrolling = false;
            return;
        }
        
        var currentFrame = new Date().getTime();
        var dt = (currentFrame - lastFrame) / 1000;
        lastFrame = currentFrame;

        window.scrollTo(0, scrollY + ((mainY + scrollOvershoot) - scrollY) * 4 * dt);

        setTimeout(scrollFrame, 0);
    };

    coverDown.addEventListener("click", function() {
        if (scrolling) {
            return;
        }
        scrolling = true;
        
        lastFrame = new Date().getTime();
        scrollFrame();
    });
})();

var header = document.getElementsByTagName("header")[0];
header.style.position = "absolute";

var _updateHeaderPos = true;
var updateHeaderPos = function() {
    var scrollY = window.scrollY;
    if (0 <= scrollY - mainY) {
        if (!_updateHeaderPos) {
            _updateHeaderPos = true;
            header.style.position = "fixed";
        }
    } else if (_updateHeaderPos) {
        _updateHeaderPos = false;
        header.style.position = "absolute";
    }
};
updateHeaderPos();

window.addEventListener("scroll", updateHeaderPos);

window.addEventListener("resize", updateMainY);
