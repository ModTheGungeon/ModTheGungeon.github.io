var coverDown = document.getElementById("cover-down");
coverDown.outerHTML = "<div id=\"cover-down\"></div>";
coverDown = document.getElementById("cover-down");

(function() {
    var scrollOvershoot = 64;
    var scrollTo;
    var scrollToOvershoot;
    var scrolling = false;

    var updateScrollTo = function() {
        scrollTo = document.getElementById("main").offsetTop;
        scrollToOvershoot = scrollTo + scrollOvershoot;
    };
    updateScrollTo();

    var lastFrame = new Date().getTime();
    var scrollFrame = function() {
        var currentScroll = window.scrollY;
        if (0 <= currentScroll - scrollTo) {
            window.scrollTo(0, scrollTo);
            scrolling = false;
            return;
        }
        
        var currentFrame = new Date().getTime();
        var dt = (currentFrame - lastFrame) / 1000;
        lastFrame = currentFrame;

        window.scrollTo(0, currentScroll + (scrollToOvershoot - currentScroll) * 4 * dt);

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

    window.addEventListener("resize", updateScrollTo);
})();
