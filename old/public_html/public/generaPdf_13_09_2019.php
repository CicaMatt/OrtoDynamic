<?php

require_once('fpdf.php');
require_once('fpdi.php');

header('Content-type: application/pdf');

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
    $pdf->SetXY(100, $pdf->Gety());
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);

    $pdf->SetXY(40, 249);
    $pdf->Write(0, date('d-m-y'));

		
		

    $date= date("ymd", date('m/d/Y', time()));

    if (!file_exists('./uploads/userfiles/pdf/privacy/')) {
	    mkdir('./uploads/userfiles/pdf/privacy/', 0777, true);
    }
	$savepath = './uploads/userfiles/pdf/privacy/'.$nome .$cognome. $date .'.pdf';

    $pdf->Output($savepath,'I');
    
    
    
    
} elseif ($tipologia==scheda) {
    
    
    $sql = 'select * FROM preventivi , clienti  where preventivi.id = ' .$checkedValue. '  and clienti.id = preventivi.id_cliente';


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $idProgetto = $row['0'];
            $datapreventivo=$row['6'];
            $cognome= $row['14'];
            $nome=$row['15'];
            $comuneResidenza=$row['20'];
            $provinciaResidenza=$row['21'];
            $telefono=$row['25'];
            $comuneNascita=$row['18'];
            $dataNascita= $row['17'];
            $diagnosi=$row['3'];
            $protesi=$row['5'];
            $indirizzoResidenza=$row['19'];
            
        } 
    }
    
    // initiate FPDI
    $pdf = new FPDI();
    // add a page
    $pdf->AddPage();
    // set the source file
			
    $pdf->setSourceFile('./doc/scheda.pdf');
    
    
    // import page 1
    $tplIdx = $pdf->importPage(1);
    // use the imported page and place it at position 10,10 with a width of 100 mm
    $pdf->useTemplate($tplIdx, 5, 5, 200);
    
    
    // Intestazione
    $pdf->SetFont('Arial','',9);
    //$pdf->SetFont('Arial','I',9);
    $pdf->SetTextColor(0, 0, 0);
    
    $pdf->SetXY(23.5, 57);
    $pdf->Write(0,  'ITCA01039968');
    
    $pdf->SetXY(32, 74.5);
    $pdf->Write(0,  $idProgetto); 
    $pdf->SetXY(30, 81.6);
    $pdf->Write(0, date("d/m/y", strtotime($datapreventivo))); 
    
    
    $pdf->SetXY(40, 97);
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $nome = strtoupper($nome);
    $pdf->Write(0, $nome);
    
    $pdf->SetXY(42, 104.6);
    $pdf->Write(0, $indirizzoResidenza);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $comuneResidenza = strtoupper($comuneResidenza);
    $pdf->Write(0, $comuneResidenza);
    $pdf->SetXY($pdf->Getx()+1, $pdf->Gety());
    $pdf->Write(0, '(' . $provinciaResidenza . ')');
    
    $pdf->SetXY(38, 112.2);
    $pdf->Write(0, $telefono); 
    
    $pdf->SetXY(36, 119.8);
    $comuneNascita = strtoupper($comuneNascita);
    $pdf->Write(0, $comuneNascita); 
    
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $pdf->Write(0, 'Data ' . date("d/m/y", strtotime($dataNascita))); 
    
    
    if(strlen($diagnosi)>=65) {
        $pdf->SetXY(44, 128.5+ $incremento);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )),0,65)); 
        $pdf->SetXY(44, 128.5+ $incremento);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )),65,130)); 
        
    } else {
        $pdf->SetXY(44, 128.5);
        $pdf->Write(0, strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )));
    }
    
    
    
    if(strlen($protesi)>=65) {
        $pdf->SetXY(50, 151.4+ $incremento);
        $pdf->Write(0, strtoupper(substr($protesi,0,65))); 
        $pdf->SetXY(50, 157+ $incremento);
        $pdf->Write(0, strtoupper(substr($protesi,65,130))); 
        
    } else {
        $pdf->SetXY(50, 151.4);
        $pdf->Write(0, strtoupper($protesi));
    }
    
    
    //item preventivi 
    
    $sql = 'select * FROM item_preventivi , nomenclatore  where id_preventivo = ' .$checkedValue. ' and item_preventivi.codice_nomenclatore = nomenclatore.id';
    

    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );

    $incremento = 0;
    $subTotale = 0;
    $totale = 0;
    
 
    while ($row = $result->fetch_row()) {  
        if($row){
            $codiceNomenclatore = $row['10'];
            $descrizione = $row['11'];
            $prezzo = $row['3'];
            $quantita = $row['2'];
            $importo = $row['4'];
            $sconto= $row['6'];
            $subTotale = $subTotale + $importo;
        }
        
        $pdf->SetFont('Arial','',8);
        $pdf->SetXY(28, 185.4 + $incremento);
        $pdf->Write(0, $codiceNomenclatore);
    
        $pdf->SetFont('Arial','',6);
        if(strlen($descrizione)>=30) {
            $pdf->SetXY(49.2, 184.4+ $incremento);
            $pdf->Write(0, substr($descrizione,0,28)); 
            $pdf->SetXY(49.2, 186.6+ $incremento);
            $pdf->Write(0, substr($descrizione,29,60)); 
        
        } else {
            $pdf->SetXY(49.2, 185.4+ $incremento);
            $pdf->Write(0, $descrizione);
        }
    
        $pdf->SetFont('Arial','',8);
        $pdf->SetXY(94.5, 185.4 + $incremento);
        $pdf->Write(0, $quantita);
    
        $pdf->SetXY(110.8, 185.4 + $incremento);
        $pdf->Write(0, $prezzo . ' ' .chr(128));
        
        if ($sconto) {
        $pdf->SetXY(135.8, 185.4 + $incremento);
        $pdf->Write(0, $sconto.'%');
            
        }
    
        $pdf->SetXY(153.8, 185.4 + $incremento);
        $pdf->Write(0, round($importo,2) . ' ' .chr(128));
    
        $pdf->SetXY(173, 185.4 + $incremento);
        $pdf->Write(0, '4%');
        
        $incremento = $incremento + 5.1;
        
        
        
    }
    
    $totale = $subTotale + ($subTotale*(4/100));
    
    $pdf->SetXY(153.8, 235);
    $pdf->Write(0, round($subTotale,2) . ' ' .chr(128));
    
    $pdf->SetXY(153.8, 240);
    $pdf->Write(0, round($totale,2) . ' ' .chr(128));
    
    if (!file_exists('./uploads/userfiles/pdf/privacy/')) {
	    mkdir('./uploads/userfiles/pdf/privacy/', 0777, true);
    }
	$savepath = './uploads/userfiles/pdf/privacy/'.$nome .$cognome. $date .'.pdf';

    $pdf->Output($savepath,'I');

} else { 
    
    $sql = 'select * FROM preventivi , clienti  where preventivi.id = ' .$checkedValue. '  and clienti.id = preventivi.id_cliente';


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $nome=$row['15'];
            $cognome= $row['14'];
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
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $nome = strtoupper($nome);
    $pdf->Write(0, $nome);
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

    $pdf->Output($savepath,'I');
}


?>