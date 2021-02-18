var EDIT_TIMETABLE_ID = null;

var today = new Date();

var timetableYearInput = $('#timetableYear');
var timetableMonthInput = $('#timetableMonth');
var timetableDayInput = $('#timetableDay');
var timetableRentierInput = $('#timetableRentier');
var timetableRoomInput = $('#timetableRoom');
var timetableStartTimeInput = $('#timetableStart');
var timetableEndTimeInput = $('#timetableEnd');
var timetableSubmit = $('#timetableSubmit');
var timetableCancel = $('#timetableCancel');

var timetableFetchYearInput = $('#timetableFetchYear');
var timetableFetchMonthInput = $('#timetableFetchMonth');
var timetableFetchSubmit = $('#timetableFetchSubmit');

$(document).ready(function () {
    timetableFetchYearInput.val(today.getFullYear());
    timetableFetchMonthInput.val(today.getMonth() + 1);

    timetableYearInput.val(today.getFullYear());
    timetableMonthInput.val(today.getMonth() + 1);
    timetableDayInput.val(today.getDate());

    timetableFetchSubmit.on('click', function (e) {
        e.preventDefault();

        if (timetableFetchYearInput.val() && timetableFetchMonthInput.val()) {
            getTimetable();
        } else {
            alert('Podaj rok i miesiąc by zobaczyć dane harmongramu.')
        }
    });

    timetableCancel.hide();

    getTimetable();
});

timetableSubmit.on('click', function (e) {
    e.preventDefault();

    if (timetableStartTimeInput.val() < timetableEndTimeInput.val()) {
        addTimetable(
            timetableRoomInput.val(),
            timetableYearInput.val(),
            timetableMonthInput.val(),
            timetableDayInput.val(),
            timetableRentierInput.val(),
            timetableStartTimeInput.val(),
            timetableEndTimeInput.val()
        )
    } else {
        alert('Koniec musi być później niż początek.')
    }
});

timetableCancel.on('click', function (e) {
    e.preventDefault();

    timetableSubmit.text('Dodaj');
    timetableRoomInput.prop( "disabled", false );
    timetableYearInput.prop( "disabled", false );
    timetableMonthInput.prop( "disabled", false );

    timetableRentierInput.val('');
    EDIT_TIMETABLE_ID = null;
    timetableCancel.hide();
});

function getTimetable() {
    var timetableFetchYearInput = $('#timetableFetchYear');
    var timetableFetchMonthInput = $('#timetableFetchMonth');

    var tableConcertBody = document.querySelector('.timetable-concert-table tbody');
    var tableRoomABody = document.querySelector('.timetable-room-a-table tbody');
    var tableRoomBBody = document.querySelector('.timetable-room-b-table tbody');

    while (tableConcertBody.firstChild) {
        tableConcertBody.removeChild(tableConcertBody.firstChild);
    }

    while (tableRoomABody.firstChild) {
        tableRoomABody.removeChild(tableRoomABody.firstChild);
    }

    while (tableRoomBBody.firstChild) {
        tableRoomBBody.removeChild(tableRoomBBody.firstChild);
    }

    getTimetableByRoom('concert', timetableFetchYearInput.val(), timetableFetchMonthInput.val(), tableConcertBody);
    getTimetableByRoom('roomA', timetableFetchYearInput.val(), timetableFetchMonthInput.val(), tableRoomABody);
    getTimetableByRoom('roomB', timetableFetchYearInput.val(), timetableFetchMonthInput.val(), tableRoomBBody);
}

function getTimetableByRoom(room, year, month, tableBody) {
    firebase.database().ref('timetable/' + room + '/' + year + '/' + month).once('value')
        .then(function (snapshot) {
            var timetable = snapshot.val();

            if (timetable) {
                Object.keys(timetable).map(function (key) {
                    return {
                        id: key,
                        year: year,
                        month: month,
                        room: room,
                        ...timetable[key]
                    }
                }).sort(function(a,b) {
                    if (a.day > b.day) {
                        return 1;
                    } else if ((a.day < b.day)) {
                        return -1;
                    } else {
                        return 0;
                    }
                }).forEach(function (el) {
                    tableBody.append(createTimetableRow(el));
                })
            }
        });
}

function removeTimetable(room, year, month, id) {
    firebase.database().ref('timetable/' + room + '/' + year + '/' + month + '/' + id).remove()
        .then(function () {
            getTimetable();
        });
}

function addTimetable(room, year, month, day, rentier, start, end) {
    if (EDIT_TIMETABLE_ID) {
        firebase.database().ref('timetable/' + room + '/' + year + '/' + month + '/' + EDIT_TIMETABLE_ID).set({
            rentier: rentier,
            start: start,
            end: end,
            day: day
        }).then(function () {
            getTimetable();
            timetableRentierInput.val('');
            timetableRoomInput.prop( "disabled", false );
            timetableYearInput.prop( "disabled", false );
            timetableMonthInput.prop( "disabled", false );
            timetableSubmit.text('Dodaj');
            timetableCancel.hide();
        })
    } else {
        return firebase.database().ref('timetable/' + room + '/' + year + '/' + month).push({
            rentier: rentier,
            start: start,
            end: end,
            day: day
        }).then(function () {
            getTimetable();
            timetableRentierInput.val('');
        })
    }

}

function createTimetableRow(el) {
    var row = document.createElement('tr');

    var dateCol = document.createElement('td');
    var timeCol = document.createElement('td');
    var rentierCol = document.createElement('td');

    var edtCol = document.createElement('td');
    var edtBtn = document.createElement('button');
    edtBtn.innerText = '🖊️';
    edtBtn.className = 'btn btn-primary';
    edtCol.className = 'text-center';
    edtCol.appendChild(edtBtn);

    edtBtn.addEventListener('click', function () {
        EDIT_TIMETABLE_ID = el.id;
        timetableRoomInput.prop( "disabled", true );
        timetableYearInput.prop( "disabled", true );
        timetableMonthInput.prop( "disabled", true );


        timetableDayInput.val(el.day)
        timetableRentierInput.val(el.rentier)
        timetableStartTimeInput.val(el.start)
        timetableEndTimeInput.val(el.end)
        timetableCancel.show();
        timetableSubmit.text('Zapisz');
    });

    var delCol = document.createElement('td');
    var delBtn = document.createElement('button');
    delBtn.innerText = 'X';
    delBtn.className = 'btn btn-danger';
    delCol.className = 'text-center';
    delCol.appendChild(delBtn);

    delBtn.addEventListener('click', function () {
        removeTimetable(el.room, el.year, el.month, el.id);
    });


    dateCol.innerText = el.year + '.' + el.month + '.' + el.day;
    timeCol.innerText = el.start + ' - ' + el.end;
    rentierCol.innerText = el.rentier;

    row.appendChild(dateCol);
    row.appendChild(timeCol);
    row.appendChild(rentierCol);
    row.appendChild(edtCol);
    row.appendChild(delCol);

    return row;
}
