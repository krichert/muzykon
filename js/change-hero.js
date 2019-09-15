$(document).ready(function () {
    setHeroImgSrc();
});

$(window).resize(function () {
    setHeroImgSrc();
});

function setHeroImgSrc() {
    var heroImg = $('header #hero-img');

    var mq = window.matchMedia("(max-width: 767px)");

    if (mq.matches) {
        heroImg.attr("src", "./img/hero-mobile.png");
    } else {
        heroImg.attr("src", "./img/hero.png");
    }
}