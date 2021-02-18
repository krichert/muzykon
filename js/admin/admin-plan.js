var EDIT_PLAN_ID = null;

var planDayInput = $('#planDay');
var planHoursInput = $('#planHours');
var planActivityInput = $('#planActivities');
var planInstructorInput = $('#planInstructor');
var planRoomInput = $('#planRoom');
var planSubmit = $('#planSubmit');
var planCancel = $('#planCancel');

$(document).ready(function () {
    getPlan();
    planCancel.hide();
});

planSubmit.on('click', function (e) {
    e.preventDefault();

    addPlan(planDayInput.val(), planHoursInput.val(), planActivityInput.val(), planInstructorInput.val(), planRoomInput.val())
});

planCancel.on('click', function (e) {
    e.preventDefault();

    planHoursInput.val('');
    planActivityInput.val('');
    planInstructorInput.val('');
    planRoomInput.val('');
    planSubmit.text('Dodaj');
    planDayInput.prop( "disabled", false );
    EDIT_PLAN_ID = null;
    planCancel.hide();
});

function addPlan(day, hours, activity, instructor, room) {
    if (EDIT_PLAN_ID) {
        firebase.database().ref('plan/' + day + '/' + EDIT_PLAN_ID).set({
            hours: hours,
            activity: activity,
            instructor: instructor,
            room: room
        }).then(function () {
            getPlan();
            planHoursInput.val('');
            planActivityInput.val('');
            planInstructorInput.val('');
            planRoomInput.val('');
            planDayInput.prop( "disabled", false );
            planSubmit.text('Dodaj');
            planCancel.hide();
        })
    } else {
        firebase.database().ref('plan/' + day).push({
            hours: hours,
            activity: activity,
            instructor: instructor,
            room: room
        }).then(function () {
            getPlan();
            planHoursInput.val('');
            planActivityInput.val('');
            planInstructorInput.val('');
            planRoomInput.val('');
        })
    }
}

function getPlan() {
    firebase.database().ref('plan').once('value')
        .then(function (snapshot) {
            var plan = snapshot.val();

            clearPlan();

            if (plan) {
                Object.keys(plan).forEach(function (keyDay) {
                    var day = plan[keyDay];
                    var tableBody = document.querySelector('#' + keyDay + ' table tbody');

                    Object.keys(day).map(key => {
                        return {
                            id: key,
                            day: keyDay,
                            ...day[key]
                        }
                    }).sort(function(a,b) {
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
        });
}

function createPlanRow(el) {
    var row = document.createElement('tr');

    var hoursCol = document.createElement('td');
    var activityCol = document.createElement('td');
    var instructorCol = document.createElement('td');
    var roomCol = document.createElement('td');

    var edtCol = document.createElement('td');
    var edtBtn = document.createElement('button');
    edtBtn.innerText = '🖊️';
    edtBtn.className = 'btn btn-primary';
    edtCol.className = 'text-center';
    edtCol.appendChild(edtBtn);

    edtBtn.addEventListener('click', function () {
        EDIT_PLAN_ID = el.id;
        planHoursInput.val(el.hours);
        planActivityInput.val(el.activity);
        planInstructorInput.val(el.instructor);
        planRoomInput.val(el.room);
        planSubmit.text('Zapisz');
        planCancel.show();
        planDayInput.prop( "disabled", true );
    });

    var delCol = document.createElement('td');
    var delBtn = document.createElement('button');
    delBtn.innerText = 'X';
    delBtn.className = 'btn btn-danger';
    delCol.className = 'text-center';
    delCol.appendChild(delBtn);

    delBtn.addEventListener('click', function () {
        removePlan(el.day, el.id);
    });


    hoursCol.innerText = el.hours;
    activityCol.innerText = el.activity;
    instructorCol.innerText = el.instructor;
    roomCol.innerText = el.room;

    row.appendChild(hoursCol);
    row.appendChild(activityCol);
    row.appendChild(instructorCol);
    row.appendChild(roomCol);
    row.appendChild(edtCol);
    row.appendChild(delCol);

    return row;
}

function removePlan(day, id) {
    firebase.database().ref('plan/' + day + '/' + id).remove()
        .then(function () {
            getPlan();
        });
}

function clearPlan() {
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(function (keyDay) {
        var tableBody = document.querySelector('#' + keyDay + ' table tbody');

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    });
}