var EDIT_PLAN_ID = null;
var EDIT_PLAN_DAY = null;

var planFormHeading = $('#plan-form h3')
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
    cancelPlanEditMode();
});

function enterPlanEditMode(el) {
    EDIT_PLAN_ID = el.id;
    EDIT_PLAN_DAY = el.day;

    planDayInput.val(el.day)
    planHoursInput.val(el.hours);
    planActivityInput.val(el.activity);
    planInstructorInput.val(el.instructor);
    planRoomInput.val(el.room);
    planSubmit.text('Zapisz');
    planFormHeading.text(`Edytuj wpis z ${getFullDay(el.day)} ${el.hours}`)
    planCancel.show();
}

function cancelPlanEditMode() {
    EDIT_PLAN_ID = null;
    EDIT_PLAN_DAY = null;

    planCancel.hide();
    planSubmit.text('Dodaj');
    planFormHeading.text('Dodaj nowy wpis')
}

function editPlan(day, hours, activity, instructor, room) {
    firebase.database().ref('plan/' + EDIT_PLAN_DAY + '/' + EDIT_PLAN_ID).remove()
        .then(function() {
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
                cancelPlanEditMode();
            })
        })
}

function addPlan(day, hours, activity, instructor, room) {
    if (EDIT_PLAN_ID) {
        return editPlan(day, hours, activity, instructor, room);
    }

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
    edtBtn.innerText = 'EDYTUJ';
    edtBtn.className = 'btn btn-primary';
    edtCol.className = 'text-center';
    edtCol.appendChild(edtBtn);

    edtBtn.addEventListener('click', function () {
        enterPlanEditMode(el);
    });

    var delCol = document.createElement('td');
    var delBtn = document.createElement('button');
    delBtn.innerText = 'USUN';
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

function getFullDay(day) {
    switch(day) {
        case 'mon':
            return 'Poniedziałek';
        case 'tue':
            return 'Wtorek';
        case 'wed':
            return 'Środa';
        case 'the':
            return 'Czwartek';
        case 'fri':
            return 'Piątek';
        case 'sat':
            return 'Sobota';
        case 'sun':
            return 'Niedziela';
    }
}