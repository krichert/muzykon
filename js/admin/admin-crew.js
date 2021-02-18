var EDIT_CREW_ID = null;
var IMAGE_CREW_URL = null;

var crewHeadingForm = $('#crew-form h3');
var crewNameInput = $('#crewName');
var crewInstrumentsInput = $('#crewInstruments');
var crewDescriptionInput = $('#crewDescription');
var crewPhotoInput = $('#crewPhoto');
var crewSubmit = $('#crewSubmit');
var crewCancel = $('#crewCancel');

$(document).ready(function () {
    getCrew();
    crewCancel.hide();
});

function enterCrewEditMode(el) {
    crewCancel.show();

    EDIT_CREW_ID = el.id;
    IMAGE_CREW_URL = el.url;

    crewSubmit.text('Zapisz');
    crewHeadingForm.text(`Edytuj wpis o ${el.name}`);
    crewNameInput.val(el.name);
    crewInstrumentsInput.val(el.instruments);
    crewDescriptionInput.val(el.description);
}

function cancelCrewEditMode() {
    EDIT_CREW_ID = null;
    IMAGE_CREW_URL = null;
    crewSubmit.text('Dodaj');
    crewHeadingForm.text(`Dodaj nowy wpis`);
    crewCancel.hide();
}

crewSubmit.on('click', function (e) {
    e.preventDefault();

    if (crewPhotoInput[0].files[0]) {
        addCrew(crewPhotoInput[0].files[0], crewNameInput.val(), crewInstrumentsInput.val(), crewDescriptionInput.val())
    } else {
        if (EDIT_CREW_ID) {
            editCrew(crewNameInput.val(), crewInstrumentsInput.val(), crewDescriptionInput.val())
        } else {
            alert('Dodaj zdjęcie!')
        }
    }
});

crewCancel.on('click', function (e) {
    e.preventDefault();

    crewNameInput.val('');
    crewInstrumentsInput.val('');
    crewDescriptionInput.val('');
    crewPhotoInput.val('');
    crewSubmit.text('Dodaj');
    EDIT_CREW_ID = null;
    IMAGE_CREW_URL = null;
    crewCancel.hide();
    crewHeadingForm.text('Dodaj osobę')
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

                var edtCol = document.createElement('td');
                var edtBtn = document.createElement('button');
                edtBtn.innerText = 'EDYTUJ';
                edtBtn.className = 'btn btn-primary';
                edtCol.className = 'text-center';
                edtCol.appendChild(edtBtn);

                edtBtn.addEventListener('click', function () {
                    enterCrewEditMode(el);
                });

                var delCol = document.createElement('td');
                var delBtn = document.createElement('button');
                delBtn.innerText = 'USUN';
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
                row.appendChild(edtCol);
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
    var key;

    if (EDIT_CREW_ID) {
        key = EDIT_CREW_ID;
    } else {
        key =  firebase.database().ref('crew').push().key;
    }

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
                crewNameInput.val('');
                crewInstrumentsInput.val('');
                crewDescriptionInput.val('');
                crewPhotoInput.val('');
                if (EDIT_CREW_ID) {
                    cancelCrewEditMode();
                }
            })
        });
    });
}

function editCrew(name, instruments, description) {
    firebase.database().ref('crew/' + EDIT_CREW_ID).set({
        name: name,
        instruments: instruments,
        description: description,
        url: IMAGE_CREW_URL
    }).then(function () {
        getCrew();
        crewNameInput.val('');
        crewInstrumentsInput.val('');
        crewDescriptionInput.val('');
        crewPhotoInput.val('');
        cancelCrewEditMode();
    })
}
