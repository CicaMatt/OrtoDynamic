<?php

require_once('fpdf.php');
require_once('fpdi.php');


// on declare $mysqli apres !
$mysqli = new mysqli('localhost', 'dbsafero_sximo', 'Fragosa2017!' );
// cnx a la base
mysqli_select_db($mysqli, 'dbsafero_sximo516') or die('Errore connessione al DB: ' .mysqli_connect_error());

//$out = str_replace('+','%27',$_GET['checkedValue']);



$sql = 'select * FROM itempdf WHERE Id IN (' . $_GET['checkedValue'] . ')';

$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );


/* fetch object array */
while ($row = $result->fetch_row()) {
	if($row)
		{

			//Recupera info medico per intestazione
			$userId=$row[1];
			$visitaId=$row[0];
			$sql2 = 'select * FROM tb_users where id='.$row[1];
			$result2 = mysqli_query($mysqli, $sql2)  or die ('Errore SQL : ' .$sql2 .mysqli_connect_error() );
			$row2 = $result2->fetch_row();
			$NomeMedico = $row2['6'];
			$CognomeMedico = $row2['7'];
			$TitoloMedico = $row2['18'];
			$IndirizzoMedico = $row2['19'];
			$ComuneMedico = $row2['20'];
			$ProvinciaMedico = $row2['21'];
			$MailMedico = $row2['4'];
			$PecMedico = $row2['23'];
			$CFMedico = $row2['24'];
			$PIMedico = $row2['25'];
			
			
			$sql3 = 'select v.id,v.datoreLavoro,l.cognomeLavoratore,l.nomeLavoratore,l.mansioneLavoratore,DATE_FORMAT(v.dataVisita,"%d/%m/%y"),
					 v.rivedibilita,v.idoneita,v.idoneitaParzialePrescrizioni,v.idoneitaParzialePrescrizioniTp,v.idoneitaParzialePrescrizioniNote, 
					 v.idoneitaParzialeLimitazioni,v.idoneitaParzialeLimitazioniTp,v.idoneitaParzialeLimitazioniNote, 
					 v.inidoneitaTemporanea,v.inidoneitaTemporaneaValidita,v.inidoneitaTemporaneaNote,
					 v.inidoneitaPermantente,v.inidoneitaPermantenteNote,
					 DATE_FORMAT(v.dataGiudizio,"%d/%m/%y"),
					 v.testTossicodipendenze,v.vaccinazioneAntitetanica,
					 l.dataNascita,
					 v.dataGiudizio,
					 l.sedeLavoro
					 from visita v, lavoratore l
					 where v.IdLavoratore = l.Id
					 and v.id ='.$row[0];
			$result3 = mysqli_query($mysqli, $sql3)  or die ('Errore SQL : ' .$sql3 .mysqli_connect_error() );
			$row3 = $result3->fetch_row();
			$DatoreLavoro = $row3['1'];
			$CognomeLavoratore = $row3['2'];
			$NomeLavoratore = $row3['3'];
			$MansioneLavoratore = $row3['4'];
			$DataVisita = $row3['5'];
			$RivedibilitaVisita = $row3['6'];	
			$idoneita = $row3['7'];
			$idoneitaParzialePrescrizioni = $row3['8'];
			$idoneitaParzialePrescrizioniTp = $row3['9'];
			$idoneitaParzialePrescrizioniNote = $row3['10'];
			$idoneitaParzialeLimitazioni = $row3['11'];
			$idoneitaParzialeLimitazioniTp = $row3['12'];
			$idoneitaParzialeLimitazioniNote = $row3['13'];
			$inidoneitaTemporanea = $row3['14'];
			$inidoneitaTemporaneaValidita = $row3['15'];
			$inidoneitaTemporaneaNote = $row3['16'];
			$inidoneitaPermantente = $row3['17'];
			$inidoneitaPermantenteNote = $row3['18'];
			$DataGiudizio = $row3['19'];
			$testTossicodipendenze = $row3['20'];
			$vaccinazioneAntitetanica = $row3['21'];
			$dataNascita = $row3['22'];
			$DataGiudizio2 = $row3['23'];
			$sedeLavoro = $row3['24'];
			
			
			// initiate FPDI
			$pdf = new FPDI();
			// add a page
			$pdf->AddPage();
			// set the source file
			if ($userId == 22 || $userId == 25 || $userId == 27) {
			    $pdf->setSourceFile('giudizio2.pdf');
		    } else {
                $pdf->setSourceFile('giudizio.pdf');
            }
			// import page 1
			$tplIdx = $pdf->importPage(1);
			// use the imported page and place it at position 10,10 with a width of 100 mm
			$pdf->useTemplate($tplIdx, 5, 5, 200);
		
			// Intestazione
			$pdf->SetFont('Courier','I');
			//$pdf->SetFont('Arial','I',9);
			$pdf->SetTextColor(0, 0, 0);
			$pdf->SetXY(9, 8);
			$pdf->Write(0, $TitoloMedico);
			$pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
			$pdf->Write(0, $NomeMedico);
			$pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
			$pdf->Write(0, $CognomeMedico);
			$pdf->SetXY(9, $pdf->Gety()+5);
			$pdf->Write(0, "Medico Chirurgo");
			$pdf->SetXY(9, $pdf->Gety()+5);
			$pdf->Write(0, "Specialista in Medicina del Lavoro");
			// Intestazione Lavoratore
			//$pdf->SetFont('Courier');
			$pdf->SetFont('Arial','',6);
			$pdf->SetTextColor(0, 0, 0);
			$pdf->SetXY(120, 28);
			$pdf->Write(0, $DatoreLavoro);
			If ($DatoreLavoro == "ARPAC") {
			    $pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
			    $pdf->Write(0, $sedeLavoro);
			}
			$pdf->SetXY(120, $pdf->Gety()+9);
			$pdf->Write(0, $CognomeLavoratore);
			$pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
			$pdf->Write(0, $NomeLavoratore);
			// Dati Lavoratore
			$pdf->SetFont('Arial','',7);
			//$pdf->SetFont('Courier');
			$pdf->SetTextColor(0, 0, 0);
			$pdf->SetXY(32, 81);
			$pdf->Write(0, $CognomeLavoratore);
			$pdf->SetXY($pdf->Getx()+2, $pdf->Gety());
			$pdf->Write(0, $NomeLavoratore);
            if (strlen( $MansioneLavoratore ) > 30) {
                If (strlen( $MansioneLavoratore ) > 60) 
                    {
                        $pdf->SetXY(132, $pdf->Gety()-10);
                        
                        $pdf->Write(0, substr($MansioneLavoratore, 0, strlen( $MansioneLavoratore )/3-1));
                        
                        $pdf->SetXY(132, $pdf->Gety()+5);
                        
                        $pdf->Write(0, substr($MansioneLavoratore,strlen( $MansioneLavoratore )/3-1,(strlen( $MansioneLavoratore )/3))); 
                        
                        $pdf->SetXY(132, $pdf->Gety()+5);
                        
                        $pdf->Write(0, substr($MansioneLavoratore,(strlen( $MansioneLavoratore )/3)+(strlen( $MansioneLavoratore )/3)-2));
                    } else {
                       $pdf->SetXY(132, $pdf->Gety()-5);
			           $pdf->Write(0, substr($MansioneLavoratore, 0, strlen( $MansioneLavoratore )/2-1));
			           $pdf->SetXY(132, $pdf->Gety()+5);
			           $pdf->Write(0, substr($MansioneLavoratore,strlen( $MansioneLavoratore )/2)); 
                    }
            } else {
                $pdf->SetXY(132, $pdf->Gety());
			    $pdf->Write(0, $MansioneLavoratore);
            }
			$pdf->SetXY(44, $pdf->Gety()+8);
			$pdf->Write(0, $DatoreLavoro);
			$pdf->SetXY(147, $pdf->Gety());
			$pdf->Write(0, $DataVisita);
			// Dati Visita
			//$pdf->SetFont('Courier');
			$pdf->SetFont('Arial','',9);
			$pdf->SetTextColor(0, 0, 0);
			$pdf->SetXY(112, 191);
			$pdf->Write(0, $RivedibilitaVisita);
			// Data Documento
			//$pdf->SetFont('Courier');
			$pdf->SetFont('Arial','',9);
			$pdf->SetTextColor(0, 0, 0);
			$pdf->SetXY(29, 202);
			//$pdf->Write(0, date("d/m/y"));
			$pdf->Write(0,$DataGiudizio);
			// Pie Pagina Documento
			$pdf->SetFont('Courier');
			//$pdf->SetFont('Arial','I',8);
			$pdf->SetFontSize(8);
			$pdf->SetTextColor(0, 0, 0);
			$PrimaRiga= $TitoloMedico . " " . $NomeMedico . " " . $CognomeMedico . " - " . $IndirizzoMedico . " - " . $ComuneMedico . " (" . $ProvinciaMedico . ")";
			$x=floor((220-(strlen($PrimaRiga)*2))/2)+3;
			$pdf->SetXY($x, 268);
			$pdf->Write(0, $PrimaRiga);
			$SecondaRiga= "E-Mail : " . $PecMedico;
			$x=floor((220-(strlen($SecondaRiga)*2))/2)+3;
			$pdf->SetXY($x, 271);
			$pdf->Write(0, $SecondaRiga);
			$TerzaRiga= "Cod.Fisc. : " . $CFMedico . ",P.IVA : " . $PIMedico;
			$x=floor((220-(strlen($TerzaRiga)*2))/2)+3;
			$pdf->SetXY($x, 274);
			$pdf->Write(0, $TerzaRiga);
			// Dati Visita Check
			$pdf->SetFont('Courier');
			$pdf->SetFontSize(11);
			$pdf->SetTextColor(0, 0, 0);
			
			If ($idoneita==1) {
					$pdf->SetFontSize(11);
					$pdf->SetXY(10,116);
					$pdf->Write(0,"X");
			}
			
			If ($idoneitaParzialePrescrizioni==1) {
					//$pdf->SetXY(10,$pdf->Gety()+7);
					$pdf->SetXY(10,123);
					$pdf->Write(0,"X");
					$pdf->SetFontSize(8);
					$pdf->SetXY($pdf->Getx()+53,$pdf->Gety());
					$pdf->Write(0,$idoneitaParzialePrescrizioniTp);
					$pdf->SetXY($pdf->Getx()+25,$pdf->Gety());
					$pdf->Write(0,substr($idoneitaParzialePrescrizioniNote,0,60));
			}
			
			If ($idoneitaParzialeLimitazioni==1) {
					$pdf->SetFontSize(11);
					//$pdf->SetXY(10,$pdf->Gety()+7);
					$pdf->SetXY(10,130);
					$pdf->Write(0,"X");
					$pdf->SetFontSize(8);
					$pdf->SetXY($pdf->Getx()+53,$pdf->Gety());
					$pdf->Write(0,$idoneitaParzialeLimitazioniTp);
					
					if (strlen( $idoneitaParzialeLimitazioniNote ) > 80) {
				        $pdf->SetXY(90, $pdf->Gety()-3);
			            $pdf->Write(0, substr($idoneitaParzialeLimitazioniNote, 0, strlen( $idoneitaParzialeLimitazioniNote )/2-1));
			            $pdf->SetXY(90, $pdf->Gety()+3);
			            $pdf->Write(0, substr($idoneitaParzialeLimitazioniNote,strlen( $idoneitaParzialeLimitazioniNote )/2));
                } else {
                        $pdf->SetXY($pdf->Getx()+25, $pdf->Gety());
			            $pdf->Write(0,substr($idoneitaParzialeLimitazioniNote,0,80));
            }
			}
			
			If ($inidoneitaTemporanea==1) {
					$pdf->SetFontSize(11);
					//$pdf->SetXY(10,$pdf->Gety()+7);
					$pdf->SetXY(10,137);
					$pdf->Write(0,"X");
					$pdf->SetFontSize(8);
					$pdf->SetXY(69,$pdf->Gety());
					$pdf->Write(0,substr($inidoneitaTemporaneaNote,0,33));
					$pdf->SetXY(155,$pdf->Gety());
					$pdf->Write(0,substr($inidoneitaTemporaneaValidita,0,60));
			}
			
			If ($inidoneitaPermantente==1) {
					$pdf->SetFontSize(11);
					$pdf->SetXY(10,144);
					$pdf->Write(0,"X");
					$pdf->SetFontSize(8);
					$pdf->SetXY($pdf->Getx()+45,$pdf->Gety());
					$pdf->Write(0,substr($inidoneitaPermantenteNote,0,75));
					
			}
			
			If ($testTossicodipendenze == 1){
			   $pdf->SetFontSize(11);
			   $pdf->SetXY(10,155);
			   $pdf->Write(0,"X");
			}
			If ($vaccinazioneAntitetanica == 1){
			   $pdf->SetFontSize(11);
			   $pdf->SetXY(10,171);
			   $pdf->Write(0,"X");
			}
			
			$date= date("ymd", strtotime($DataGiudizio2));

			
			if (!file_exists('./uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/')) {
				mkdir('./uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/', 0777, true);
			}
			
			/*$savepath = './uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/' . $visitaId . '_' . trim($DatoreLavoro) . '_' . trim($CognomeLavoratore) . '_' . trim($NomeLavoratore) . '_' . date("d_m_y") . '.pdf';*/
			
			/*$savepath = './uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/' . date("ymd") . '_' . trim($DatoreLavoro) . '_' . trim($CognomeLavoratore) . '_' . trim($NomeLavoratore) .  '_' .  $dataNascita . '.pdf';*/
		
            

			/*$savepath = './uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/' . $date . '_' . trim($DatoreLavoro) . '_' . trim($CognomeLavoratore) . '_' . trim($NomeLavoratore) .  '_' .  $dataNascita . '.pdf';*/

	        $savepath = './uploads/userfiles/'. $userId . '/pdf/' . date("ymd") . '/' . $date . '_' . trim($DatoreLavoro) . '_' . trim($CognomeLavoratore) . '_' . trim($NomeLavoratore) .  '_' .  $dataNascita . '.pdf';


			$pdf->Output($savepath,'F');

    }
}

/* free result set */
$result->close();

echo "<script>window.close();</script>";

?>
   