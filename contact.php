<?php
$data           = array();      // array to pass back data
// Ma clé privée
$secret = "6LdiX4QUAAAAAM3oNp16iec5g1VhlFl6JEqosV1l";
// Paramètre renvoyé par le recaptcha
$response = $_POST['g-recaptcha-response'];
// On récupère l'IP de l'utilisateur
$remoteip = $_SERVER['REMOTE_ADDR'];

$api_url = "https://www.google.com/recaptcha/api/siteverify?secret="
	    . $secret
	    . "&response=" . $response
	    . "&remoteip=" . $remoteip ;

$decode = json_decode(file_get_contents($api_url), true);
	if(($_POST['txtNom']!="") && ($_POST['txtMail']!="") && ($_POST['txtMessage']!="")){
  if ($decode['success'] == false) {
    		// C'est un humain
				$currTime = time();
        $to = 'alexandre.bonvalle@gmail.com';
        $subject = $_POST['txtNom'].' - alexandrebonvalle.fr ('.date("d/m/Y - H\hi",$currTime).')';
        $message = $_POST['txtMessage']."\n\r\n\r".'Mail envoyé le '.date("d/m/Y",$currTime).' à '.date("H\hi",$currTime).' depuis le contact form - alexandrebonvalle.fr';
        $headers = array(
            'From' => $_POST['txtMail'],
            'Reply-To' => $_POST['txtMail'],
            'X-Mailer' => 'PHP/' . phpversion()
        );

        if (mail($to,$subject,$message, $headers)) {
          $data['success'] = true;
          $data['message'] = 'Success';
        } else {
          $data['success'] = false;
          $data['message'] = 'Error';
        }
      }else {
    		// C'est un robot ou le code de vérification est incorrecte
				$data['success'] = false;
        $data['message'] = 'Recaptcha error';
    	}

		}else{
			$data['success'] = false;
			$data['message'] = 'error empty';
		}
      // return all our data to an AJAX call
  echo json_encode($data);
?>
