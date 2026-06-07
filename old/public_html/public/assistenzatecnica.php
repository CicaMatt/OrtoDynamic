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
$idnc=$checkedValue;


$sql="Select *, clienti.id as id_cliente, lavorazioni.stato as st, clienti.note as nt, clienti.indirizzo as ind, clienti.citta as ct, item_lavorazioni.id as prodotto_id, lavorazioni.prova_cliente as pc from clienti, preventivi, lavorazioni, item_lavorazioni where lavorazioni.id=$idnc and clienti.id=lavorazioni.id_cliente and lavorazioni.id=item_lavorazioni.id_lavorazione and lavorazioni.id_cliente=clienti.id and item_lavorazioni.id_lavorazione=lavorazioni.id and lavorazioni.id_preventivo=preventivi.id and clienti.id=preventivi.id_cliente";


$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );

 // initiate FPDI
    $pdf = new FPDI();
    // add a page
    
    // set the source file
    $i=0;
$pdf->setSourceFile('./doc/Assistenzatecnica.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(1);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
	$pdf->SetFont('Arial','',9);
    $pdf->SetXY(40, 40);
    while($row=$result->fetch_array()){
    $pdf->SetXY(165, 16.9);
    $pdf->Write(0,"$row[id_lavorazione]");
    $pdf->SetXY(155, 33.9);
    $pdf->Write(0,date('d     m       Y'));
    $pdf->SetXY(135, 94);
    $pdf->Write(0,"$row[nome]");
    $pdf->SetXY(43, 94);
    $pdf->Write(0,"$row[cognome]");
    $pdf->SetXY(43, 104);
    $pdf->Write(0,"$row[comune_nascita]");
    $pdf->SetXY(90, 104);
    $pdf->Write(0,date(" d    m    Y", strtotime($row[data_nascita])));
    $pdf->SetFont('Arial','',6);
    $pdf->SetXY(139, 104);
    $pdf->Write(0, $row[ct]);
    $pdf->SetFont('Arial','',9);
    $pdf->SetXY(180, 103.8);
    $pdf->Write(0, $row[provincia]);
    $pdf->SetXY(43, 114);
    $pdf->Write(0,"$row[ind]");
    $pdf->SetXY(160, 113.8);
    $firstStringCharacter = substr($row[telefono], 0, 10);
    $pdf->Write(0,"$firstStringCharacter");
    $pdf->SetXY(40, 123);
    $pdf->Write(0,"$row[codice_fiscale]");
    $pdf->SetXY(40, 123);
    $pdf->Write(0,"$row[codice_fiscale]");
    $pdf->SetFont('Arial','',6);
    $pdf->SetXY(130, 123.6);
    $pdf->Write(0, $row[nt]);
    $pdf->SetFont('Arial','',9);
    if(strlen($row[descrizione_intervento])>=65) {
        $pdf->SetFont('Arial','',5);
        $pdf->SetXY(25, 146);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $row[descrizione_intervento] )),0,160)); 
        $pdf->SetXY(25, 153.3);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $row[descrizione_intervento] )),160,320)); 
  
    }else{
        
       $pdf->SetXY(25, 146);
       $pdf->SetFont('Arial','',5);
        $pdf->Write(0, strtoupper($row[descrizione_intervento]));  
    }
    
    
    
    if(strlen($row[annotazioni_tecniche_assistenza])>=65) {
        $pdf->SetFont('Arial','',5);
        $pdf->SetXY(25, 193);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $row[annotazioni_tecniche_assistenza] )),0,150)); 
        $pdf->SetXY(25, 199.8);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $row[annotazioni_tecniche_assistenza] )),150,300)); 
  
    }else{
        
       $pdf->SetXY(25, 193);
       $pdf->SetFont('Arial','',5);
        $pdf->Write(0, strtoupper($row[annotazioni_tecniche_assistenza]));  
    }
    
    $pdf->SetFont('Arial','',9);
    $pdf->SetXY(65, 175);
    $pdf->Write(0,date(" d    m    Y", strtotime($row[data_consegna_assistenza])));
    $pdf->SetXY(167, 260);
    $pdf->Write(0,date(" d/m/Y", strtotime($row[data_consegna_assistenza])));
     if($row[esito_collaudo_assistenza_tecnica]=='POSITIVO'){
    $pdf->SetXY(138.7, 219);
    $pdf->Write(0, "X");
    }else if($row[esito_collaudo_assistenza_tecnica]=='NEGATIVO'){
    $pdf->SetXY(162, 219);
    $pdf->Write(0, "X");
    }
    $pdf->SetXY(34, 243.3);
    $pdf->Write(0,date(" d    m    Y", strtotime($row[data_esito_collaudo_assistenza])));
    $pdf->SetFont('Arial','',7);
    $pdf->SetXY(150, 243.3);
    $pdf->Write(0,$row[firma_medico_assistenza]);
    $pdf->SetXY(150, 174.9);
    $pdf->Write(0,$row[firma_medico_assistenza]);
    $pdf->SetFont('Arial','',9);
    if($row[presidio]=='INTERNO'){
        $pdf->SetXY(21.4, 50.3);
    $pdf->Write(0,"X");
        
    }else{
         $pdf->SetXY(21.4, 58.7);
    $pdf->Write(0,"X");
        
    }
    if($row[garanzia]=="IN GARANZIA"){
        $pdf->SetXY(135, 50.3);
    $pdf->Write(0,"X");
        
    }else{
        $pdf->SetXY(135, 58.7);
    $pdf->Write(0,"X");
        
    }
    $pdf->SetXY(34, 263.3);
    $pdf->Write(0, $row[st]);
        }
    
   
    
    $pdf->Output();
    
    
    
    
    
    
/*if ($tipologia==privacy){ 
    
    $sql = 'select cognome,nome from clienti  where clienti.id = ' . $checkedValue;


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $nome=$row['1'];
            $cognome= $row['0'];
       
            
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
    
    
    $sql = 'select preventivi.id,preventivi.data_preventivo,
            clienti.cognome,clienti.nome,clienti.citta,clienti.provincia,
            clienti.telefono,clienti.comune_nascita,clienti.data_nascita,
            preventivi.diagnosi_circostanziata,preventivi.prescizione_dettagliata_protesi,
            clienti.indirizzo, tipologia_preventivo FROM preventivi , clienti  where preventivi.id = ' .$checkedValue. '  and clienti.id = preventivi.id_cliente';


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $idProgetto = $row['0'];
            $datapreventivo=$row['1'];
            $cognome= $row['2'];
            $nome=$row['3'];
            $comuneResidenza=$row['4'];
            $provinciaResidenza=$row['5'];
            $telefono=$row['6'];
            $comuneNascita=$row['7'];
            $dataNascita= $row['8'];
            $diagnosi=$row['9'];
            $protesi=$row['10'];
            $indirizzoResidenza=$row['11'];
            $tipologiapreventivo=$row['12'];
            
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
    
    
    $pdf->SetXY(40, 89.5);
    $cognome = strtoupper($cognome);
    $pdf->Write(0, $cognome);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $nome = strtoupper($nome);
    $pdf->Write(0, $nome);
    
    $pdf->SetXY(43, 97);
    $pdf->Write(0, $indirizzoResidenza);
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $comuneResidenza = strtoupper($comuneResidenza);
    $pdf->Write(0, $comuneResidenza);
    $pdf->SetXY($pdf->Getx()+1, $pdf->Gety());
    $pdf->Write(0, '(' . $provinciaResidenza . ')');
    
    $pdf->SetXY(38, 104.7);
    $pdf->Write(0, $telefono); 
    
    $pdf->SetXY(36, 112.1);
    $comuneNascita = strtoupper($comuneNascita);
    $pdf->Write(0, $comuneNascita); 
    
    
    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
    $pdf->Write(0, 'Data ' . date("d/m/y", strtotime($dataNascita))); 
    
        $pdf->SetXY(168, 59);
    $tipologiaP = strtoupper($tipologiapreventivo);
    $pdf->Write(0, $tipologiaP); 
    
    
    if(strlen($diagnosi)>=65) {
        $pdf->SetXY(44, 119+ $incremento);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )),0,65)); 
        $pdf->SetXY(44, 122+ $incremento);
        $pdf->Write(0, substr(strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )),65,125)); 
        
    } else {
        $pdf->SetXY(44, 120.7);
        $pdf->Write(0, strtoupper(preg_replace( "/\r|\n/", "", $diagnosi )));
    }
    
    
    
    if(strlen($protesi)>=65) {
        $pdf->SetXY(50, 125.4+ $incremento);
        $pdf->Write(0, strtoupper(substr($protesi,0,65))); 
        $pdf->SetXY(50, 128.4+ $incremento);
        $pdf->Write(0, strtoupper(substr($protesi,65,125))); 
        
    } else {
        $pdf->SetXY(50, 127.3);
        $pdf->Write(0, strtoupper($protesi));
    }
    
    
    //item preventivi 
    
    $sql = 'select nomenclatore.codice,nomenclatore.descrizione,item_preventivi.prezzo,
            item_preventivi.quantita,item_preventivi.importo,item_preventivi.sconto 
            FROM item_preventivi , nomenclatore  where id_preventivo = ' .$checkedValue. ' and item_preventivi.codice_nomenclatore = nomenclatore.id';
    

    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );

    $incremento = 0;
    $subTotale = 0;
    $totale = 0;
    
 
    while ($row = $result->fetch_row()) {  
        if($row){
            $codiceNomenclatore = $row['0'];
            $descrizione = $row['1'];
            $prezzo = $row['2'];
            $quantita = $row['3'];
            $importo = $row['4'];
            $sconto= $row['5'];
            $subTotale = $subTotale + $importo;
        }
        
        $pdf->SetFont('Arial','',8);
        $pdf->SetXY(28, 145.7 + $incremento);
        $pdf->Write(0, $codiceNomenclatore);
    
        $pdf->SetFont('Arial','',6);
        if(strlen($descrizione)>=30) {
            $pdf->SetXY(49.2, 145.1+ $incremento);
            $pdf->Write(0, substr($descrizione,0,28)); 
            $pdf->SetXY(49.2, 146.9+ $incremento);
            $pdf->Write(0, substr($descrizione,29,60)); 
        
        } else {
            $pdf->SetXY(49.2, 145.7+ $incremento);
            $pdf->Write(0, $descrizione);
        }
    
        $pdf->SetFont('Arial','',8);
        $pdf->SetXY(94.5, 145.7 + $incremento);
        $pdf->Write(0, $quantita);
    
        $pdf->SetXY(110.8, 145.7 + $incremento);
        $pdf->Write(0, $prezzo . ' ' .chr(128));
        
        if ($sconto) {
        $pdf->SetXY(135.8, 145.7 + $incremento);
        $pdf->Write(0, $sconto.'%');
            
        }
    
        $pdf->SetXY(153.8, 145.9 + $incremento);
        $pdf->Write(0, round($importo,2) . ' ' .chr(128));
    
        $pdf->SetXY(173, 145.8 + $incremento);
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
    
    $sql = 'select clienti.nome,clienti.cognome,
            preventivi.data_preventivo,preventivi.data_accettazione,
            preventivi.numero_autorizzazione FROM preventivi , clienti  where preventivi.id = ' .$checkedValue. '  and clienti.id = preventivi.id_cliente';


    $result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


 
    while ($row = $result->fetch_row()) {  
        if($row){
            $nome=$row['0'];
            $cognome= $row['1'];
            $datapreventivo=$row['2'];
            $dataaccettazione= $row['3'];
            $numeroaccettazione= $row['4'];
            
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
}*/


?>