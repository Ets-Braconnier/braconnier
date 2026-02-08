<?php
// send-devis.php
header('Content-Type: text/html; charset=utf-8');

function clean($s) {
  $s = trim($s);
  $s = str_replace(["\r", "\n"], " ", $s);
  return $s;
}

$nom = isset($_POST['nom']) ? clean($_POST['nom']) : '';
$tel = isset($_POST['tel']) ? clean($_POST['tel']) : '';
$email = isset($_POST['email']) ? clean($_POST['email']) : '';
$objet = isset($_POST['objet']) ? clean($_POST['objet']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($nom === '' || $tel === '' || $email === '' || $objet === '' || $message === '') {
  http_response_code(400);
  echo "Champs manquants.";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "E-mail invalide.";
  exit;
}

$to = "info@braconnier.be";
$subject = "Demande de devis – " . $objet;

$body =
  "Nom / Société : $nom\n" .
  "Téléphone : $tel\n" .
  "E-mail : $email\n\n" .
  "Objet : $objet\n\n" .
  "Message :\n$message\n";

$headers = [];
$headers[] = "From: site@braconnier.be";
$headers[] = "Reply-To: $email";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$ok = mail($to, $subject, $body, implode("\r\n", $headers));

if ($ok) {
  echo "Merci ! Votre demande de devis a bien été envoyée.";
} else {
  http_response_code(500);
  echo "Erreur : envoi impossible. Merci de réessayer plus tard.";
}
