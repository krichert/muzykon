$(document).ready(function () {
    var signOutButton = $('#signOut');

    signOutButton.on('click', function () {
        firebase.auth().signOut();
    });

    var today = new Date();

    var newsDateInput = $('#newsDate');
    var newsTitleInput = $('#newsTitle');
    var newsDescriptionInput = $('#newsDescription');
    var newsSubmit = $('#newsSubmit');

    newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + today.getMonth() + '.' + today.getFullYear());

    newsSubmit.on('click', function (e) {
        e.preventDefault();

        addNews(newsDateInput.val(), newsTitleInput.val(), newsDescriptionInput.val())
            .then(function () {
                newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + today.getMonth() + '.' + today.getFullYear());
                newsTitleInput.val('');
                newsDescriptionInput.val('');
            })
    });

    var timetableYearInput = $('#timetableYear');
    var timetableMonthInput = $('#timetableMonth');
    var timetableDayInput = $('#timetableDay');
    var timetableRentierInput = $('#timetableRentier');
    var timetableRoomInput = $('#timetableRoom');
    var timetableStartTimeInput = $('#timetableStart');
    var timetableEndTimeInput = $('#timetableEnd');
    var timetableSubmit = $('#timetableSubmit');

    var timetableFetchYearInput = $('#timetableFetchYear');
    var timetableFetchMonthInput = $('#timetableFetchMonth');
    var timetableFetchSubmit = $('#timetableFetchSubmit');

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

    getNews();
    getTimetable();
});

function getNews() {
    var tableBody = document.querySelector('.news-table tbody');

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    firebase.database().ref('news').once('value')
        .then(function (snapshot) {
            var news = snapshot.val();

            Object.keys(news).map(function (key) {
                return {
                    id: key,
                    ...news[key]
                }
            }).forEach(function (el) {
                var row = document.createElement('tr');

                var dateCol = document.createElement('td');
                var titleCol = document.createElement('td');
                var textCol = document.createElement('td');

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.className = 'btn btn-danger';
                delCol.className = 'text-center';

                delCol.appendChild(delBtn);


                delBtn.addEventListener('click', function () {
                    removeNews(el.id);
                });


                dateCol.innerText = el.date;
                textCol.innerText = el.text;
                titleCol.innerText = el.title;

                row.appendChild(dateCol);
                row.appendChild(titleCol);
                row.appendChild(textCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeNews(id) {
    firebase.database().ref('news/' + id).remove()
        .then(function () {
            getNews();
        })
}

function addNews(date, title, text) {
    return firebase.database().ref('news').push({
        date: date,
        title: title,
        text: text
    }).then(function () {
        getNews();
    })
}

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
    return firebase.database().ref('timetable/' + room + '/' + year + '/' + month).push({
        rentier: rentier,
        start: start,
        end: end,
        day: day
    }).then(function () {
        getTimetable();
    })
}

function createTimetableRow(el) {
    var row = document.createElement('tr');

    var dateCol = document.createElement('td');
    var timeCol = document.createElement('td');
    var rentierCol = document.createElement('td');

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
    row.appendChild(delCol);

    return row;
}


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
