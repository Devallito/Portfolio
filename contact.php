<?php
$to = 'alexandre.bonvalle@gmail.com';
$subject = $_POST['txtNom'].' - mail envoyé depuis le contact form - alexandrebonvalle.fr';
$message = $_POST['txtMessage'];
$headers = array(
    'From' => $_POST['txtMail'],
    'Reply-To' => $_POST['txtMail'],
    'X-Mailer' => 'PHP/' . phpversion()
);
if (mail($to,$subject,$message, $headers)) {
  header('Location: ./index.html#contact');
} else {
  header('Location: ./index.html#contact');
}

?>
