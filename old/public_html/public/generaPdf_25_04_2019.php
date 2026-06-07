<?php

require_once('fpdf.php');
require_once('fpdi.php');


// on declare $mysqli apres !
$mysqli = new mysqli('localhost', 'wqortody_user', 'TauvByodceow9Graym' );
// cnx a la base
mysqli_select_db($mysqli, 'wqortody_sximo') or die('Errore connessione al DB: ' .mysqli_connect_error());

//$out = str_replace('+','%27',$_GET['checkedValue']);





$checkedValue = $_GET['checkedvalue'];
$tipologia = $_GET['tipologia'] ;




if ($tipologia==privacy){ 
    
    $sql = 'select * from clienti  where clienti.id = ' . $checkedValue;


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $nome=$row['2'];
            $cognome= $row['1'];
       
            
        } 
    }
    
    
    // initiate FPDI
    $pdf = new FPDI();
    // add a page
    $pdf->AddPage();
    // set the source file
			
    $pdf->setSourceFile('./doc/privacy.pdf');
    
    
        // import page 1
    $tplIdx = $pdf->importPage(1);
    // use the imported page and place it at position 10,10 with a width of 100 mm
    $pdf->useTemplate($tplIdx, 5, 5, 200);
		

    // Intestazione
    $pdf->SetFont('Arial','',9);
    //$pdf->SetFont('Arial','I',9);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->SetXY(40, 233);
    $nome = strtoupper($nome);
    $pdf->Write(0, $nome);
    $pdf->SetXY($pdf->Getx()+35, $pdf->Gety());
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);

    $pdf->SetXY(40, 249);

    $pdf->Write(0, date('m/d/Y', time()) );

		
		

    $date= date("ymd", date('m/d/Y', time()));

    if (!file_exists('./uploads/userfiles/pdf/privacy/')) {
	    mkdir('./uploads/userfiles/pdf/privacy/', 0777, true);
    }
	$savepath = './uploads/userfiles/pdf/privacy/'.$nome .$cognome. $date .'.pdf';

    $pdf->Output($savepath,'F');
    
    
    
    
}
else { 
    
    $sql = 'select * FROM preventivi , clienti  where preventivi.id = ' .$checkedValue. '  and clienti.id = preventivi.id_cliente';


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $nome=$row['14'];
            $cognome= $row['13'];
            $datapreventivo=$row['6'];
            $dataaccettazione= $row['10'];
            $numeroaccettazione= $row['11'];
            
        } 
    }

    // initiate FPDI
    $pdf = new FPDI();
    // add a page
    $pdf->AddPage();
    // set the source file
			
    $pdf->setSourceFile('./doc/moduloconsega.pdf');
        
    // import page 1
    $tplIdx = $pdf->importPage(1);
    // use the imported page and place it at position 10,10 with a width of 100 mm
    $pdf->useTemplate($tplIdx, 5, 5, 200);
		

    // Intestazione
    $pdf->SetFont('Arial','',9);
    //$pdf->SetFont('Arial','I',9);
    $pdf->SetTextColor(0, 0, 0);
    $pdf->SetXY(92, 110);
    $nome = strtoupper($nome);
    $pdf->Write(0, $nome);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);
    $pdf->SetXY(55, 115);
    $pdf->Write(0, $numeroaccettazione);
    $pdf->SetXY(120, 115);
    $dataaccettazione= date("d/m/y", strtotime($dataaccettazione));
    $pdf->Write(0, $dataaccettazione);	

    $pdf->SetXY(40, 255);

    $pdf->Write(0, date('m/d/Y', time()) );

		
		

    $date= date("ymd", strtotime($datapreventivo));

    if (!file_exists('./uploads/userfiles/pdf/' . date("ymd") . '/')) {
	    mkdir('./uploads/userfiles/pdf/' . date("ymd") . '/', 0777, true);
    }
	$savepath = './uploads/userfiles/pdf/' . date("ymd") . '/' . $date .'.pdf';

    $pdf->Output($savepath,'F');
}


echo "<script>window.close();</script>";

?>
   