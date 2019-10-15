$(document).ready(function () {
    var crewNameInput = $('#crewName');
    var crewInstrumentsInput = $('#crewInstruments');
    var crewDescriptionInput = $('#crewDescription');
    var crewPhotoInput = $('#crewPhoto');
    var crewSubmit = $('#crewSubmit');

    crewSubmit.on('click', function (e) {
        e.preventDefault();

        if (crewPhotoInput[0].files[0]) {
            addCrew(crewPhotoInput[0].files[0], crewNameInput.val(), crewInstrumentsInput.val(), crewDescriptionInput.val())
        } else {
            alert('Dodaj zdjęcie!')
        }
    });

    getCrew();
});

function getCrew() {
    var tableBody = document.querySelector('.crew-table tbody');

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    firebase.database().ref('crew').once('value')
        .then(function (snapshot) {
            var crew = snapshot.val();

            Object.keys(crew).map(function (key) {
                return {
                    id: key,
                    ...crew[key]
                }
            }).forEach(function (el) {
                var row = document.createElement('tr');

                var nameCol = document.createElement('td');
                nameCol.innerText = el.name;

                var instrumentsCol = document.createElement('td');
                instrumentsCol.innerText = el.instruments;

                var descriptionCol = document.createElement('td');
                descriptionCol.innerText = el.description;

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
                    removeCrew(el.id);
                });

                row.appendChild(nameCol);
                row.appendChild(instrumentsCol);
                row.appendChild(descriptionCol);
                row.appendChild(imgCol);
                row.appendChild(delCol);

                tableBody.append(row);
            })
        });
}

function removeCrew(id) {
    firebase.storage().ref('crew/' + id).delete()
        .then(function () {
            firebase.database().ref('crew/' + id).remove().then(function () {
                getCrew();
            })
        })
}

function addCrew(file, name, instruments, description) {
    var key = firebase.database().ref('crew').push().key;

    var uploadTask = firebase.storage().ref('crew/' + key).put(file)

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function(error) {
        alert('Błąd podczas dodwania zdjęcia. Spróbuj ponownie!')
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            firebase.database().ref('crew/' + key).set({
                name: name,
                instruments: instruments,
                description: description,
                url: downloadURL
            }).then(function () {
                getCrew();
            })
        });
    });
}
