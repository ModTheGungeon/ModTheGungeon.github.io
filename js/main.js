var main = document.getElementById("main");
var mainY;
var updateMainY = function() {
    mainY = main.offsetTop;
};
updateMainY();
window.addEventListener("resize", updateMainY);
