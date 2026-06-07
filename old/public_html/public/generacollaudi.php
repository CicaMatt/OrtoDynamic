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
$idlav=$checkedValue;


$sql="Select *, clienti.id as id_cliente, item_lavorazioni.id as prodotto_id, lavorazioni.prova_cliente as pc from clienti, preventivi, lavorazioni, item_lavorazioni where lavorazioni.id=$idlav and clienti.id=lavorazioni.id_cliente and lavorazioni.id=item_lavorazioni.id_lavorazione and lavorazioni.id_cliente=clienti.id and item_lavorazioni.id_lavorazione=lavorazioni.id and lavorazioni.id_preventivo=preventivi.id and clienti.id=preventivi.id_cliente";


$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );

 // initiate FPDI
    $pdf = new FPDI();
    // add a page
    
    // set the source file
	$pdf->setSourceFile('./doc/schedacollaudi.pdf');
	

	 $pdf->AddPage();
           $tplIdx = $pdf->importPage(1);
        $pdf->useTemplate($tplIdx, null, null, 0, 0, true);
    
   $prodotto=" ";
   while ($row = $result->fetch_array()) {
       
 
           
          
            $nome=$row[nome];
            $cognome= $row[cognome];
            $pdf->SetFont('Arial','',9);
            $pdf->SetTextColor(0, 0, 0);
            $pdf->SetXY(30, 44);
            $nome = strtoupper($nome);
            $pdf->Write(0, $nome);
            $pdf->SetXY(60, $pdf->Gety());
            $cognome = strtoupper($cognome);
            $pdf->Write(0, $cognome);
            $i=30;
            $sql2="Select item_lavorazioni.id as prodotto_id from clienti, lavorazioni, item_lavorazioni where lavorazioni.id=$idlav and clienti.id=lavorazioni.id_cliente and lavorazioni.id=item_lavorazioni.id_lavorazione and lavorazioni.id_cliente=clienti.id and item_lavorazioni.id_lavorazione=lavorazioni.id";
            $result2 = mysqli_query($mysqli, $sql2)  or die ('Errore SQL : ' .$sql2 .mysqli_connect_error() );
            while($row2=$result2->fetch_array()){
            
            $pdf->SetXY($i, 65);
            $pdf->SetFont('Arial','',6);
            $pdf->Write(0, "$row2[prodotto_id]");
            $i=$i+9;
            }
            $pdf->SetFont('Arial','',9);
            $pdf->SetXY(120, 65);
            $pdf->Write(0, $row[id_lavorazione]);
           $pdf->SetFont('Arial','',5);
           
           
           if(strlen($row[prescizione_dettagliata_protesi])>=45) {
        $pdf->SetXY(92.3, 50);
        $pdf->Write(0, strtoupper(substr($row[prescizione_dettagliata_protesi],0,45))); 
        $pdf->SetXY(92.3, 52);
        $pdf->Write(0, strtoupper(substr($row[prescizione_dettagliata_protesi],45,60))); 
        $pdf->SetXY(92.3, 54);
        $pdf->Write(0, strtoupper(substr($row[prescizione_dettagliata_protesi],60,180))); 
        
    } else {
        $pdf->SetXY(90, 53);
        $pdf->Write(0, strtoupper($row[prescizione_dettagliata_protesi]));
    }
           
           
           
           
           // $pdf->SetXY(95, 53);
           // $pdf->Write(0, $row[prescizione_dettagliata_protesi]);
            $pdf->SetFont('Arial','',9);
             /* if($row[pc]=="FUNZIONALE"){
                 $pdf->SetXY(123, 124.9);
                  $pdf->Write(0, "X");  
                  //PRIMA PARTE
                 if($row[pos_ril]=="POSITIVO"){
                  $pdf->SetXY(111.6, 133.4);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(138.8, 133.4);
                  $pdf->Write(0, "X"); 
                 }
                 
             }else
                   if($row[pc]=="TECNICO"){
                 $pdf->SetXY(70, 125);
                  $pdf->Write(0, "X");  
                  
                 if($row[pos_ril]=="POSITIVO"){
                  $pdf->SetXY(55, 133.4);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(80, 133.4);
                  $pdf->Write(0, "X"); 
                 }
                 
             }else
                   if($row[pc]=="ESTETICO"){
                 $pdf->SetXY(17, 125);
                  $pdf->Write(0, "X");  
                  
                 if($row[pos_ril]=="POSITIVO"){
                  $pdf->SetXY(8.3, 133.4);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(27.5, 133.4);
                  $pdf->Write(0, "X"); 
                  
                 }
                 
             } */
             
             
              $pdf->SetXY(123, 124.9);
                  $pdf->Write(0, "X"); 
                  $pdf->SetXY(111.6, 133.4);
                  $pdf->Write(0, "X");  
                   $pdf->SetXY(55, 133.4);
                  $pdf->Write(0, "X"); 
                    $pdf->SetXY(70, 125);
                  $pdf->Write(0, "X");  
                  $pdf->SetXY(17, 125);
                  $pdf->Write(0, "X");  
                   $pdf->SetXY(8.3, 133.4);
                  $pdf->Write(0, "X");   
             //-------------------
             //SECONDA PARTE
             
             
             /*if($row[Verifica_cliente]=="FUNZIONALE"){
                 $pdf->SetXY(123.7, 185.5);
                  $pdf->Write(0, "X");  
                  
                 if($row[verifica_pos_ril]=="POSITIVO"){
                  $pdf->SetXY(111.6, 194);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[verifica_pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(139.7, 194);
                  $pdf->Write(0, "X"); 
                 }
                 
             }else
                   if($row[Verifica_cliente]=="TECNICO"){
                 $pdf->SetXY(68, 185.5);
                  $pdf->Write(0, "X");  
                  
                 if($row[verifica_pos_ril]=="POSITIVO"){
                  $pdf->SetXY(56, 194);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[verifica_pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(80.9, 194);
                  $pdf->Write(0, "X"); 
                 }
                 
             }else
                   if($row[Verifica_cliente]=="ESTETICO"){
                 $pdf->SetXY(13.5, 185.5);
                  $pdf->Write(0, "X");  
                  
                 if($row[verifica_pos_ril]=="POSITIVO"){
                  $pdf->SetXY(8.3, 194);
                  $pdf->Write(0, "X");   
                 }
                 else
                 if($row[verifica_pos_ril]=="RILAVORAZIONE"){
                     
                  $pdf->SetXY(27.5, 194);
                  $pdf->Write(0, "X"); 
                 }
                 
             }*/
             
             
             $pdf->SetXY(123.7, 185.5);
                  $pdf->Write(0, "X");
              $pdf->SetXY(111.6, 194);
                  $pdf->Write(0, "X");
                   $pdf->SetXY(68, 185.5);
                  $pdf->Write(0, "X");
                $pdf->SetXY(56, 194);
                  $pdf->Write(0, "X");
                   $pdf->SetXY(13.5, 185.5);
                  $pdf->Write(0, "X"); 
                  $pdf->SetXY(8.3, 194);
                  $pdf->Write(0, "X"); 
             //-----------------------
             
             
             
             $pdf->SetXY(17.5, 168.1);
             $originalDate = $row[data_prova_cliente];
             $newDate = date("d-m-Y", strtotime($originalDate));
             $pdf->Write(0, $newDate); 
             
             $pdf->SetXY(17.5, 228.1);
             $originalDate = $row[data_verifica_cliente];
             $newDate = date("d-m-Y", strtotime($originalDate));
             $pdf->Write(0, $newDate);
             
             $oggi=date("Y/m/d");
             $pdf->SetXY(17.5, 262.1);
             $originalDate = $oggi;
             $newDate = date("d-m-Y", strtotime($originalDate));
             $pdf->Write(0, $newDate);
             
             
             
            
              $pdf->SetXY(100, 228.1);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetXY(100, 168.1);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetFont('Arial','',5);
            $pdf->SetXY(180, 262.5);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetXY(180, 214.5);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetXY(180, 159.55);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetXY(180, 94.55);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetXY(180, 76.55);
            $pdf->Write(0, $row[firma_tecnico]);
            $pdf->SetFont('Arial','',9);

            $pdf->SetXY(83.8, 83);
            $pdf->Write(0, "X");
            $i=0;
            $j=0;
            
            $sql2="Select item_lavorazioni.id as prodotto_id, produzione from clienti, lavorazioni, item_lavorazioni where lavorazioni.id=$idlav and clienti.id=lavorazioni.id_cliente and lavorazioni.id=item_lavorazioni.id_lavorazione and lavorazioni.id_cliente=clienti.id and item_lavorazioni.id_lavorazione=lavorazioni.id";
            $result2 = mysqli_query($mysqli, $sql2)  or die ('Errore SQL : ' .$sql2 .mysqli_connect_error() );
            while($row2=$result2->fetch_array()){
            
            
            
            if($row2[produzione]=='INTERNA'){
                $pdf->SetXY(23, 90);
                $pdf->Write(0,"CODICE PRODUZIONI INTERNE: ");
                $pdf->SetXY(79+$i, 90);
                $pdf->Write(0,"$row2[prodotto_id]   ");
                $i=$i+8;
            }else if($row2[produzione]=='ESTERNA'){
                 $pdf->SetXY(23, 98);
                $pdf->Write(0,"CODICE PRODUZIONI ESTERNE: ");
                $pdf->SetXY(79+$j, 98);
                $pdf->Write(0,"$row2[prodotto_id]   ");
                $j=$j+8;
            }
            
            }
            
            
            
        
   }
    
    
   
   
                 $z=0;
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(2);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
        $sql2="Select * from controlli_periodici where id_lavorazione=$idlav";
            $result2 = mysqli_query($mysqli, $sql2)  or die ('Errore SQL : ' .$sql2 .mysqli_connect_error() );
            while($row2=$result2->fetch_array()){
                $pdf->SetXY(25,48+$z);
                $pdf->Write(0,$row2[data_intervento]);
                $pdf->SetXY(155,48+$z);
                $pdf->Write(0,$row2[firma_tecnico]);
                $pdf->SetXY(50,48+$z);
                $pdf->Write(0,$row2[intervento]);
                $z=$z+8.6;
            }
            
            $g=0;
             $sql2="Select * from item_lavorazioni where id_lavorazione=$idlav";
            $result2 = mysqli_query($mysqli, $sql2)  or die ('Errore SQL : ' .$sql2 .mysqli_connect_error() );
            while($row2=$result2->fetch_array()){
                $pdf->SetXY(25,161.5+$g);
                $pdf->Write(0,$row2[materiale]);
                $pdf->SetXY(62,161.5+$g);
                $pdf->Write(0,$row2[fornitore]);
                $pdf->SetXY(107,161.5+$g);
                $pdf->Write(0,$row2[DDT]);
                $pdf->SetXY(150,161.5+$g);
                $pdf->Write(0,$row2[lotto]);
                $g=$g+8;
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