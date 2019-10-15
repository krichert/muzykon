$(document).ready(function () {
    var signOutButton = $('#signOut');

    signOutButton.on('click', function () {
        firebase.auth().signOut();
    });
});

function getWeekDay(number) {
    switch (number) {
        case 0:
            return "PONIEDZIAŁEK";
        case 1:
            return "WTOREK";
        case 2:
            return "ŚRODA";
        case 3:
            return "CZWARTEK";
        case 4:
            return "PIĄTEK";
        case 5:
            return "SOBOTA";
        case 6:
            return "NIEDZIELA";
    }
}

function formatNumber(month) {
    if (month < 10) {
        return '0' + month;
    } else {
        return month;
    }
}
