$(document).ready(function () {
    var today = new Date();

    var newsDateInput = $('#newsDate');
    var newsTitleInput = $('#newsTitle');
    var newsDescriptionInput = $('#newsDescription');
    var newsSubmit = $('#newsSubmit');

    newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());

    newsSubmit.on('click', function (e) {
        e.preventDefault();

        addNews(newsDateInput.val(), newsTitleInput.val(), newsDescriptionInput.val())
            .then(function () {
                newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
                newsTitleInput.val('');
                newsDescriptionInput.val('');
            })
    });

    getNews();
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
