$(document).ready(function () {
    setPlanHeaders();
});

$(window).resize(function () {
    setPlanHeaders();
});

function setPlanHeaders() {
    var mon = $('a[href="#mon"]');
    var tue = $('a[href="#tue"]');
    var wed = $('a[href="#wed"]');
    var thu = $('a[href="#thu"]');
    var fri = $('a[href="#fri"]');
    var sat = $('a[href="#sat"]');
    var sun = $('a[href="#sun"]');

    var mq = window.matchMedia("(max-width: 992px)");

    if (mq.matches) {
        mon.text("PON");
        tue.text("WT");
        wed.text("ŚR");
        thu.text("CZW");
        fri.text("PT");
        sat.text("SOB");
        sun.text("ND");
    } else {
        mon.text("PONIEDZIAŁEK");
        tue.text("WTOREK");
        wed.text("ŚRODA");
        thu.text("CZWARTEK");
        fri.text("PIĄTEK");
        sat.text("SOBOTA");
        sun.text("NIEDZIELA");
    }
}
