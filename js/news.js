$(document).ready(function () {
    var newsContainer = $('.news-slick-container');

    firebase.database().ref('news').once('value')
        .then(function (snapshot) {
            var news = snapshot.val();

            Object.keys(news).map(function (key) {
                return {
                    id: key,
                    ...news[key]
                }
            }).forEach(function (el) {
                var container = document.createElement('div');
                container.className = 'news-container d-flex flex-column justify-content-center';

                var date = document.createElement('span');
                date.className = 'news-date text-center';
                date.innerText = el.date;

                var title = document.createElement('h6');
                title.className = 'news-heading text-center';
                title.innerText = el.title;

                var description = document.createElement('div');
                description.className = 'news-description text-center';
                description.innerText = el.text;

                container.appendChild(date);
                container.appendChild(title);
                container.appendChild(description);

                newsContainer.append(container);
            })
        });
});
