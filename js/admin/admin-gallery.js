$(document).ready(function () {
    var today = new Date();

    var photoInput = $('#photo');
    var photoSubmit = $('#photoSubmit');

    photoSubmit.on('click', function (e) {
        e.preventDefault();

        if (photoInput[0].files[0]) {
            addGallery(photoInput[0].files[0])
        } else {
            alert('Dodaj zdjęcie!')
        }
    });

    getGallery();
});

function getGallery() {
    var tableBody = document.querySelector('.gallery-table tbody');

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    firebase.database().ref('gallery').once('value')
        .then(function (snapshot) {
            var gallery = snapshot.val();

            Object.keys(gallery).map(function (key) {
                return {
                    id: key,
                    ...gallery[key]
                }
            }).forEach(function (el) {
                var row = document.createElement('tr');

                var nameCol = document.createElement('td');
                nameCol.innerText = el.name;

                var imgCol = document.createElement('td');
                var img = document.createElement('img');
                img.setAttribute('src', el.url);
                img.setAttribute('width', '100');

                imgCol.appendChild(img);

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.className = 'btn btn-danger';
                delCol.className = 'text-center';

                delCol.appendChild(delBtn);


                delBtn.addEventListener('click', function () {
                    removeGallery(el.id);
                });

                row.appendChild(nameCol);
                row.appendChild(imgCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeGallery(id) {
    firebase.storage().ref('gallery/' + id).delete()
        .then(function () {
            firebase.database().ref('gallery/' + id).remove().then(function () {
                getGallery();
            })
        })
}

function addGallery(file) {
    var key = firebase.database().ref('gallery').push().key;

    var uploadTask = firebase.storage().ref('gallery/' + key).put(file)

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function(error) {
        alert('Błąd podczas dodwania zdjęcia. Spróbuj ponownie!')
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            firebase.database().ref('gallery/' + key).set({
                name: file.name,
                url: downloadURL
            }).then(function () {
                getGallery();
            })
        });
    });
}
