$(document).ready(function() {
    firebase.database().ref('plan').once('value')
        .then(function (snapshot) {
            var data = snapshot.val();

            if (data) {
                Object.keys(data).forEach(function (keyDay) {
                    var day = data[keyDay];
                    var tableBody = document.querySelector('#' + keyDay + ' table tbody');

                    while (tableBody.firstChild) {
                        tableBody.removeChild(tableBody.firstChild);
                    }

                    Object.keys(day).map(key => {
                        return {
                            id: key,
                            ...day[key]
                        }
                    }).sort(function (a, b) {
                        if (a.hours > b.hours) {
                            return 1;
                        } else if ((a.hours < b.hours)) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }).forEach(function (el) {
                        tableBody.append(createPlanRow(el));
                    })
                })
            }

            checkPlan();
        })
});

function createPlanRow(el) {
    var row = document.createElement('tr');

    var hoursCol = document.createElement('td');
    var activityCol = document.createElement('td');
    var instructorCol = document.createElement('td');
    var roomCol = document.createElement('td');

    var instructorLink = document.createElement('a');
    instructorLink.innerText = el.instructor;
    instructorLink.setAttribute('href', 'index.html#crew');
    instructorCol.appendChild(instructorLink);

    hoursCol.innerText = el.hours;
    activityCol.innerText = el.activity;
    roomCol.innerText = el.room;

    row.appendChild(hoursCol);
    row.appendChild(activityCol);
    row.appendChild(instructorCol);
    row.appendChild(roomCol);

    return row;
}

function checkPlan() {
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(function (keyDay) {
        var tableBody = document.querySelector('#' + keyDay + ' table tbody');

        var emptyRow = document.createElement('tr');
        var emptyRowColumn = document.createElement('td');
        emptyRowColumn.setAttribute('colspan', '4');
        emptyRowColumn.innerText = ' - ';
        emptyRow.appendChild(emptyRowColumn);

        if(!tableBody.firstChild) {
            tableBody.appendChild(emptyRow)
        }
    });
}