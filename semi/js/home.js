function homejs() {

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

function reloadDownloads(os_name) {
    let childNodes = downloads.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        let el = childNodes[i];
        if (el.tagName != "A") continue;;
        console.log("delete child: ");
        console.log(el);
        downloads.removeChild(el);
    }

    downloadNewest = null;

    console.log("reload dls: " + os_name);

    jsonp("//api.github.com/repos/ModTheGungeon/SemiInstaller/releases?callback=", {
    onSuccess: function(json) {
        for (var i = 0; i < json.data.length; i++) {
            var data = json.data[i];
            var tag = data.tag_name;

            for (var j = 0; j < data.assets.length; j++) {
                var asset = data.assets[j];

                if (asset == null) continue;
                var url = asset.browser_download_url;

                console.log(url);

                if (!url.includes(os_name)) continue;

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
    }
});

}


function updateOS(os) {
    Array.prototype.forEach.call(document.getElementsByClassName("os_none"), function(el) { el.style.display = "none"; })
    Array.prototype.forEach.call(document.getElementsByClassName("os_windows"), function(el) { el.style.display = "none"; })
    Array.prototype.forEach.call(document.getElementsByClassName("os_linux"), function(el) { el.style.display = "none"; })
    Array.prototype.forEach.call(document.getElementsByClassName("os_macosx"), function(el) { el.style.display = "none"; })

    Array.prototype.forEach.call(document.getElementsByClassName("os_" + os), function(el) { el.style.display = "inherit"; })

    if (os == "none") document.getElementById("downloads").style.display = "none";
    else document.getElementById("downloads").style.display = "inherit";

    reloadDownloads(os);

    console.log("new os: " + os);
}

function getOS() {
    if (window.navigator.userAgent.includes("Windows")) return "windows";
    if (window.navigator.userAgent.includes("Mac")) return "macosx";
    if (window.navigator.userAgent.includes("Linux")) return "linux";
    return "none";
}

let os_select = document.getElementById("os_select");
os_select.addEventListener("change", function() {
    let value = os_select.value;

    updateOS(value);
});

let os = getOS();
updateOS(os);
for (let i = 0; i < os_select.options.length; i++) {
    if (os_select.options[i].value == os) {
        os_select.selectedIndex = i;
    }
}

var showprereleases = document.getElementById("showprereleases");
showprereleases.parentElement.style.display = "inline-block";
showprereleases.addEventListener("change", function() {
    downloads.setAttribute("showprereleases", showprereleases.checked);
});

}
homejs();