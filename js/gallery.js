$(document).ready(function () {
    var galleryContainer = $('.gallery-slick-container');

    firebase.database().ref('gallery').once('value')
        .then(function (snapshot) {
            var gallery = snapshot.val();

            Object.keys(gallery).map(function (key) {
                return {
                    id: key,
                    ...gallery[key]
                }
            }).forEach(function (el) {
                var container = document.createElement('div');

                var imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-img-container';

                var img = document.createElement('img');
                img.className = 'img-fluid';
                img.alt = 'zajęcia';
                img.src = el.url;

                imgContainer.appendChild(img);
                container.appendChild(imgContainer);

                galleryContainer.append(container);
            });

            useSlickForGallery();
        });
});
