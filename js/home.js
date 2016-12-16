document.getElementById("cover-outer").style.left = "0px";
document.getElementById("pageversion").style.right = "16px";

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

var _updateHeaderPos = 0;
var updateHeaderPos = function(scrollY) {
    if (0 <= scrollY - mainY) {
        if (_updateHeaderPos != 1) {
            _updateHeaderPos = 1;
            header.style.position = "fixed";
        }
    } else if (_updateHeaderPos != 2) {
        _updateHeaderPos = 2;
        header.style.position = "absolute";
    }
};
updateHeaderPos(0);
window.addEventListener("scroll", function() {updateHeaderPos(window.scrollY);});

var downloads = document.getElementById("downloads");
var downloadNewest;
jsonp("//api.github.com/repos/ModTheGungeon/ETGMod.Installer/releases?callback=", {
    onSuccess: function(json) {
        for (var i = 0; i < json.data.length; i++) {
            var data = json.data[i];
            var tag = data.tag_name;
            var asset = data.assets[0];
            if (asset == null) continue;
            var url = asset.browser_download_url;
            var count = asset.download_count;
            
            var elemDownload = document.createElement("a");
            elemDownload.href = url;
            elemDownload.textContent = tag;
            var elemCount = document.createElement("span");
            elemCount.className = "minor";
            elemCount.textContent = "(" + count + ")";
            elemDownload.appendChild(elemCount);
            if (!data.prerelease) {
                if (downloadNewest == null) {
                    downloadNewest = elemDownload;
                    elemDownload.setAttribute("newest", true);
                    var elemIcon = document.createElement("i");
                    elemIcon.className = "material-icons";
                    elemIcon.textContent = "file_download";
                    elemDownload.insertBefore(elemIcon, elemDownload.firstChild);
                }
            } else {
                elemDownload.setAttribute("prerelease", true);
            }
            downloads.appendChild(elemDownload);
        }
    }
});

var showprereleases = document.getElementById("showprereleases");
showprereleases.parentElement.style.display = "inline-block";
showprereleases.addEventListener("change", function() {
    downloads.setAttribute("showprereleases", showprereleases.checked);
});
