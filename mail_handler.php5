<?php

    $name    = $_POST['name'];
    $email   = $_POST['email'];
    $message = $_POST['message'];
    $phone = $_POST['phone'];

    $to      = "kontakt@muzykon.pl";
    $subject = "Nowa wiadomość z kontakt@muzykon.pl";
    $mailmessage = "Nowa wiadomość ze stony kontakt@muzykon.pl. \n\n"
                . "Od: " . $name . "\n"
                . "Numer telefonu: " . $phone . "\n"
                . "Email: " . $email . "\n"
                . "Treść: " . $message;
    $headers = "From: $email";

    if( mail($to,$subject,$mailmessage,$headers) )
    {
        echo "Dziękujemy za przesłanie wiadomości. Skontaktujemy się z Państwem jak najszybciej.";
    }
    else
    {
        echo "Niestety podczas wysyłąnia maila wystąpił błąd. Spróbuj ponownie.";
    }
?>
