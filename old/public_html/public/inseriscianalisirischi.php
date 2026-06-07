<?php


// on declare $mysqli apres !
$mysqli = new mysqli('localhost', 'wqortody_user', 'TauvByodceow9Graym' );
// cnx a la base
mysqli_select_db($mysqli, 'wqortody_sximo') or die('Errore connessione al DB: ' .mysqli_connect_error());

//$out = str_replace('+','%27',$_GET['checkedValue']);

$checkedValue = $_GET['checkedvalue'];
$idlav=$checkedValue;
$sql="select * from lavorazioni where id= $idlav";
$idlavorazione;
$idcliente;
$idpreventivo;
$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );
while($row=$result->fetch_array()){
    $idlavorazione=$row[id];
    $idpreventivo=$row[id_preventivo];
    $idcliente=$row[id_cliente];
}

$sql="insert into analisi_rischi(id_lavorazione, id_preventivo, id_cliente) values ($idlavorazione, $idcliente, $idpreventivo)";
$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );

require __DIR__.'/../vendor/autoload.php';
if (class_exists(\Dotenv\Dotenv::class) && file_exists(__DIR__.'/../.env')) {
    \Dotenv\Dotenv::createImmutable(__DIR__.'/..')->safeLoad();
}
$appUrl = rtrim($_ENV['APP_URL'] ?? getenv('APP_URL') ?? 'http://localhost', '/');
header('Location:'.$appUrl.'/analrischi');
die();


?>
