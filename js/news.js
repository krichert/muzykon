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
            }).reverse().forEach(function (el) {
                var container = document.createElement('div');
                container.className = 'news-container d-flex flex-column justify-content-center';

                var imgContainer = document.createElement('div');
                imgContainer.className = 'd-flex justify-content-center';

                var img = document.createElement('img');
                img.className = 'img-fluid contain';
                img.alt = el.title;
                img.src = el.url;

                var date = document.createElement('span');
                date.className = 'news-date text-center';
                date.innerText = el.date;

                var title = document.createElement('h6');
                title.className = 'news-heading text-center';
                title.innerText = el.title;

                var description = document.createElement('div');
                description.className = 'news-description text-center';
                description.innerText = el.text;

                imgContainer.appendChild(img);
                container.appendChild(date);
                if (el.url) {
                    container.appendChild(imgContainer);
                }
                container.appendChild(title);
                container.appendChild(description);

                newsContainer.append(container);
            });

            useSlickForNews();
        });
});
