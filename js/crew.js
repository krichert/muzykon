$(document).ready(function () {
    var galleryContainer = $('.crew-slick-container');

    firebase.database().ref('crew').once('value')
        .then(function (snapshot) {
            var crew = snapshot.val();

            Object.keys(crew).map(function (key) {
                return {
                    id: key,
                    ...crew[key]
                }
            }).forEach(function (el) {
                var container = document.createElement('div');
                container.className = 'crew-container';

                var imgContainer = document.createElement('div');
                imgContainer.className = 'd-flex justify-content-center';

                var img = document.createElement('img');
                img.className = 'img-fluid';
                img.alt = el.name;
                img.src = el.url;

                var name = document.createElement('h5');
                name.className = 'crew-heading text-center';
                name.innerText = el.name;

                var instruments = document.createElement('h6');
                instruments.className = 'crew-instrument';
                instruments.innerText = el.instruments;

                var description = document.createElement('div');
                description.className = 'crew-description text-center';
                description.innerText = el.description;

                imgContainer.appendChild(img);
                container.appendChild(imgContainer);
                container.appendChild(name);
                container.appendChild(instruments);
                container.appendChild(description);

                galleryContainer.append(container);
            });

            useSlickForCrew();
        });
});
