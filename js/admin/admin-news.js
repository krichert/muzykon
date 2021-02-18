var EDIT_NEWS_ID = null;
var IMAGE_NEWS_URL = null;

var newsDateInput = $('#newsDate');
var newsTitleInput = $('#newsTitle');
var newsDescriptionInput = $('#newsDescription');
var newsSubmit = $('#newsSubmit');
var newsCancel = $('#newsCancel');
var newsPhotoInput = $('#newsPhoto');

var today = new Date();

$(document).ready(function () {
    newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
    getNews();
    newsCancel.hide();
});

newsSubmit.on('click', function (e) {
    e.preventDefault();

    if (newsPhotoInput[0].files[0]) {
        addNews(newsPhotoInput[0].files[0], newsDateInput.val(), newsTitleInput.val(), newsDescriptionInput.val())
    } else {
        if (EDIT_NEWS_ID) {
            editNews(newsDateInput.val(), newsTitleInput.val(), newsDescriptionInput.val())
        } else {
            alert('Dodaj zdjęcie!')
        }
    }

});

newsCancel.on('click', function (e) {
    e.preventDefault();

    newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
    newsTitleInput.val('');
    newsDescriptionInput.val('');
    newsPhotoInput.val('');
    newsSubmit.text('Dodaj');
    EDIT_NEWS_ID = null;
    IMAGE_NEWS_URL = null;
    newsCancel.hide();
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

                var imgCol = document.createElement('td');
                var img = document.createElement('img');
                img.setAttribute('src', el.url);
                img.setAttribute('width', '100');
                imgCol.appendChild(img);

                var edtCol = document.createElement('td');
                var edtBtn = document.createElement('button');
                edtBtn.innerText = '🖊';
                edtBtn.className = 'btn btn-primary';
                edtCol.className = 'text-center';
                edtCol.appendChild(edtBtn);

                edtBtn.addEventListener('click', function () {
                    newsCancel.show();

                    EDIT_NEWS_ID = el.id;
                    IMAGE_NEWS_URL = el.url;

                    newsSubmit.text('Zapisz');
                    newsDateInput.val(el.date);
                    newsTitleInput.val(el.title);
                    newsDescriptionInput.val(el.text);
                });

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.className = 'btn btn-danger';
                delCol.className = 'text-center';
                delCol.appendChild(delBtn);

                delBtn.addEventListener('click', function () {
                    removeNews(el);
                });

                dateCol.innerText = el.date;
                textCol.innerText = el.text;
                titleCol.innerText = el.title;

                row.appendChild(dateCol);
                row.appendChild(titleCol);
                row.appendChild(textCol);
                row.appendChild(imgCol);
                row.appendChild(edtCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeNews(el) {
    if (el.url) {
        firebase.storage().ref('news/' + el.id).delete()
            .then(function () {
                firebase.database().ref('news/' + el.id).remove().then(function () {
                    getNews();
                })
            })
    } else {
        firebase.database().ref('news/' + el.id).remove().then(function () {
            getNews();
        })
    }
}

function addNews(file, date, title, text) {
    var key;

    if (EDIT_NEWS_ID) {
        key = EDIT_NEWS_ID;
    } else {
        key = firebase.database().ref('news').push().key;
    }

    var uploadTask = firebase.storage().ref('news/' + key).put(file)

    return uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function(error) {
        alert('Błąd podczas zdjęcia. Spróbuj ponownie!')
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            firebase.database().ref('news/' + key).set({
                date: date,
                title: title,
                text: text,
                url: downloadURL
            }).then(function () {
                getNews();

                newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
                newsTitleInput.val('');
                newsDescriptionInput.val('');
                newsPhotoInput.val('');
                newsSubmit.text('Dodaj');
            })
        });
    });
}

function editNews(date, title, text) {
    firebase.database().ref('news/' + EDIT_NEWS_ID).set({
        date: date,
        title: title,
        text: text,
        url: IMAGE_NEWS_URL
    }).then(function () {
        getNews();

        newsDateInput.val(getWeekDay(today.getDay()) + ', ' + today.getDate() + '.' + formatNumber(today.getMonth()) + '.' + today.getFullYear());
        newsTitleInput.val('');
        newsDescriptionInput.val('');
        newsPhotoInput.val('');
        newsSubmit.text('Dodaj');
    })
}
