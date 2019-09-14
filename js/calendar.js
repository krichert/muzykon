$(document).ready(function() {
    var calendarEl = document.getElementById('calendar');
    var today = new Date();

    var visitedYears = [today.getFullYear()];
    var visitedMonths = [today.getMonth() + 1];

    $('#room-form').on('change', 'input', function () {
        calendar.removeAllEventSources();
        var date = calendar.getDate();

        var calendarDatePlusSixDays = new Date();
        calendarDatePlusSixDays.setDate(date.getDate() + 6);

        visitedYears = [calendarDatePlusSixDays.getFullYear()];
        visitedMonths = [calendarDatePlusSixDays.getMonth() + 1];

        getData(calendarDatePlusSixDays.getFullYear(), calendarDatePlusSixDays.getMonth() + 1, calendar);
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['timeGrid' ],
        defaultView: 'timeGridWeek',
        locale: 'pl',
        allDaySlot: false,
        minTime: "06:00",
        maxTime: "24:00",
    });

    getData(today.getFullYear(), today.getMonth() + 1, calendar);

    calendar.render();

    $(".fc-button").on('click', function () {
        var calendarDate = calendar.getDate();
        
        var calendarDatePlusSixDays = new Date();
        calendarDatePlusSixDays.setDate(calendarDate.getDate() + 6);

        if (!visitedYears.includes(calendarDatePlusSixDays.getFullYear()) || !visitedMonths.includes(calendarDatePlusSixDays.getMonth() + 1)) {
            getData(calendarDatePlusSixDays.getFullYear(), calendarDatePlusSixDays.getMonth() + 1, calendar);
            visitedYears.push(calendarDatePlusSixDays.getFullYear());
            visitedMonths.push(calendarDatePlusSixDays.getMonth() + 1);
        }
    })
});

function getData(year, month, calendar) {
    var room = $("input[name='room']:checked").val();

    firebase.database().ref('timetable/' + room + '/' + year + '/' + month).once('value')
        .then(function (snapshot) {
            var data = snapshot.val();

            if (data) {
                var formattedData = Object.keys(data).map(function (key) {
                    return {
                        title: data[key].rentier,
                        start: `${year}-${formatNumber(month)}-${formatNumber(data[key].day)}T${data[key].start}`,
                        end: `${year}-${formatNumber(month)}-${formatNumber(data[key].day)}T${data[key].end}`
                    }
                });

                calendar.addEventSource({
                    events: formattedData,
                    color: '#2363AE',
                    textColor: '#FFFFFF',
                })
            }
        })
}

function formatNumber(month) {
    if (month < 10) {
        return '0' + month;
    } else {
        return month;
    }
}