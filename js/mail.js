$(document).ready(function () {
    $("#contact-form").submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        /* get some values from elements on the page: */
        var $form = $(this),
            name_value = $form.find('input[name="name"]').val(),
            email_value = $form.find('input[name="email"]').val(),
            number_value = $form.find('input[name="phone"]').val(),
            message_value = $form.find('textarea[name="message"]').val(),
            url = $form.attr('action');

        /* Send the data using post */
        var posting = $.post(url, {
            name: name_value,
            email: email_value,
            phone: number_value,
            message: message_value
        });

        posting.done(function (data) {
            alert(data);
            $form.find('input[name="name"]').val('');
            $form.find('input[name="email"]').val('');
            $form.find('input[name="phone"]').val('');
            $form.find('textarea[name="message"]').val('');
        });
    });
});