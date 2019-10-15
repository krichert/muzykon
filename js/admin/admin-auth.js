$(document).ready(function () {
    var loginSection = $('#login');
    var panelSection = $('#panel');

    var inputEmail = $('#inputEmail');
    var inputPassword = $('#inputPassword');
    var submitLogin = $('#submitLogin');

    submitLogin.on('click', function (e) {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword(inputEmail.val(), inputPassword.val())
            .catch(function () {
                alert('Nie poprawny login lub hasło. Spróbuj ponownie.')
            });

    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loginSection.hide();
            panelSection.show();
        } else {
            loginSection.show();
            panelSection.hide();
        }
    });
});

