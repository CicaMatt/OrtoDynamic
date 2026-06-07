<?php
require_once('fpdf.php');
require_once('fpdi.php');


header('Content-type: application/pdf');
$pdf = new FPDI();
    // add a page
    
    // set the source file
    $i=0;
$pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(1);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
	$pdf->SetFont('Arial','',9);

// on declare $mysqli apres !
$mysqli = new mysqli('localhost', 'wqortody_user', 'TauvByodceow9Graym' );
// cnx a la base
mysqli_select_db($mysqli, 'wqortody_sximo') or die('Errore connessione al DB: ' .mysqli_connect_error());

//$out = str_replace('+','%27',$_GET['checkedValue']);

$checkedValue = $_GET['checkedvalue'];
$idlav=$checkedValue;
$sql="select *, lavorazioni.id as idlav , analisi_rischi.altro as alt, analisi_rischi.elettricità as el, analisi_rischi.valutazione_biologica_lavorazione_materiali as vbm, analisi_rischi.effetti_lungo_utilizzo as elu from lavorazioni, analisi_rischi, clienti where lavorazioni.id=analisi_rischi.id_lavorazione and clienti.id=analisi_rischi.id_cliente and analisi_rischi.id=$idlav";

$result = mysqli_query($mysqli, $sql)  or die ('Errore SQL : ' .$sql .mysqli_connect_error() );
while($row=$result->fetch_array()){
    $pdf->SetFont('Arial','',11);
    $pdf->SetXY(110,26);
    $pdf->Write(0,"Lavorazione: $row[idlav]");
    $pdf->SetXY(45,49);
    $pdf->SetFont('Arial','',9);
    $pdf->Write(0,"$row[cognome] $row[nome]");
    $pdf->SetXY(45,54);
    $pdf->Write(0,$row[uso_previsto]);
    $pdf->SetXY(48,59);
    $pdf->Write(0,"    $row[modalita_di_utilizzo]");
    $pdf->SetXY(48,69.7);
    $pdf->Write(0,"    $row[contatto_previto]");
    $pdf->SetXY(49.5,75.2);
    $pdf->Write(0,"$row[durata_contatto]");
    $pdf->SetXY(49.5,80.4);
    $pdf->Write(0,"$row[frequenza_contatto]");
    $pdf->SetXY(49.5,90.4);
    $pdf->Write(0,"$row[gesso]");
    $pdf->SetXY(49.5,95);
    $pdf->Write(0,"$row[cuoio]");
    $pdf->SetXY(49.5,99.8);
    $pdf->Write(0,"$row[fodera]");
    $pdf->SetXY(49.5,105.2);
    $pdf->Write(0,"$row[materiali_sintetici]");
    $pdf->SetXY(49.5,110.1);
    $pdf->Write(0,"$row[sughero]");
    $pdf->SetXY(49.5,115.3);
    $pdf->Write(0,$row[alt]);
    $pdf->SetXY(49.5,125.8);
    $pdf->Write(0,$row[influssi_previsti]);
    $pdf->SetXY(54.5,131.7);
    $pdf->Write(0,$row[conseguenze_previste]);
    if($row[si_no_manutenzione]=="SI"){
        $pdf->SetFont('Arial','',14);
    $pdf->SetXY(141.5,136.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}else{
    $pdf->SetFont('Arial','',14);
    $pdf->SetXY(148.5,136.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}

if($row[si_no_taratura]=="SI"){
        $pdf->SetFont('Arial','',14);
    $pdf->SetXY(141.5,141.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}else{
    $pdf->SetFont('Arial','',14);
    $pdf->SetXY(148.5,141.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}



if($row[si_no_durata_limitata]=="SI"){
        $pdf->SetFont('Arial','',14);
    $pdf->SetXY(141.5,146.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}else{
    $pdf->SetFont('Arial','',14);
    $pdf->SetXY(148.5,146.5);
    $pdf->Write(0,'X');
    $pdf->SetFont('Arial','',9);
}
$pdf->SetXY(142.5,152.5);
    $pdf->Write(0, $row[durata_prevista]);
    $pdf->SetFont('Arial','',7);
    $pdf->SetXY(20.5,163);
$pdf->Write(0, $row[elu]);
    $pdf->SetFont('Arial','',9);
    $pdf->SetFont('Arial','',7);
    $pdf->SetXY(20.5,173.5);
$pdf->Write(0, $row[prodotti_associati]);
    $pdf->SetXY(18.5,183.8);
$pdf->Write(0, $row[forze_meccaniche_del_dispositivo]);
    $pdf->SetXY(18.5,194.8);
$pdf->Write(0, $row[determinante_durata]);   
    $pdf->SetXY(18.5,209.8);
$pdf->Write(0, $row[riutilizzo_dispositivo]);
$pdf->SetFont('Arial','',5);
$pdf->SetXY(16.5,225.8);
$pdf->Write(0, $row[caratteristiche_compromettenti]);
$pdf->SetXY(16.5,250.8);
$pdf->Write(0, $row[elenco_limiti_applicazione]);
$pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
$pdf->AddPage();
$tplIdx = $pdf->importPage(2);
$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
$pdf->SetFont('Arial','',9);
if($row[el]=='INTRINSECO'){
	$pdf->SetXY(116,51.8);
    $pdf->Write(0, "X");
	}else if($row[el]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,51.8);
    $pdf->Write(0, "X");
	}else if($row[el]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,51.8);
    $pdf->Write(0, "X"); 
	}
	if($row[calore]=='INTRINSECO'){
	$pdf->SetXY(116,57);
    $pdf->Write(0, "X");
	}else if($row[calore]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,57);
    $pdf->Write(0, "X");
	}else if($row[calore]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,57);
    $pdf->Write(0, "X"); 
	}
	
	if($row[forza_meccanica]=='INTRINSECO'){
	$pdf->SetXY(116,64);
    $pdf->Write(0, "X");
	}else if($row[forza_meccanica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,64);
    $pdf->Write(0, "X");
	}else if($row[forza_meccanica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,64);
    $pdf->Write(0, "X"); 
	}
	
		if($row[radiazioni_ionizzanti]=='INTRINSECO'){
	$pdf->SetXY(116,69);
    $pdf->Write(0, "X");
	}else if($row[radiazioni_ionizzanti]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,69);
    $pdf->Write(0, "X");
	}else if($row[radiazioni_ionizzanti]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,69);
    $pdf->Write(0, "X"); 
	}
	
		if($row[campi_elettromagnetici]=='INTRINSECO'){
	$pdf->SetXY(116,75);
    $pdf->Write(0, "X");
	}else if($row[campi_elettromagnetici]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,75);
    $pdf->Write(0, "X");
	}else if($row[campi_elettromagnetici]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,75);
    $pdf->Write(0, "X"); 
	}
	
		if($row[parti_mobili]=='INTRINSECO'){
	$pdf->SetXY(116,80);
    $pdf->Write(0, "X");
	}else if($row[parti_mobili]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,80);
    $pdf->Write(0, "X");
	}else if($row[parti_mobili]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,80);
    $pdf->Write(0, "X"); 
	}
		if($row[masse_sospese]=='INTRINSECO'){
	$pdf->SetXY(116,86);
    $pdf->Write(0, "X");
	}else if($row[masse_sospese]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,86);
    $pdf->Write(0, "X");
	}else if($row[masse_sospese]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,86);
    $pdf->Write(0, "X"); 
	}
	
	if($row[guasto]=='INTRINSECO'){
	$pdf->SetXY(116,94);
    $pdf->Write(0, "X");
	}else if($row[guasto]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,94);
    $pdf->Write(0, "X");
	}else if($row[guasto]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,94);
    $pdf->Write(0, "X"); 
	}
	
		if($row[pressione_rottura]=='INTRINSECO'){
	$pdf->SetXY(116,103);
    $pdf->Write(0, "X");
	}else if($row[pressione_rottura]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,103);
    $pdf->Write(0, "X");
	}else if($row[pressione_rottura]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,103);
    $pdf->Write(0, "X"); 
	}
	
		if($row[pressione_acustica]=='INTRINSECO'){
	$pdf->SetXY(116,108);
    $pdf->Write(0, "X");
	}else if($row[pressione_acustica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,108);
    $pdf->Write(0, "X");
	}else if($row[pressione_acustica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,108);
    $pdf->Write(0, "X"); 
	}
	
		if($row[pressione_acustica]=='INTRINSECO'){
	$pdf->SetXY(116,108);
    $pdf->Write(0, "X");
	}else if($row[pressione_acustica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,108);
    $pdf->Write(0, "X");
	}else if($row[pressione_acustica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,108);
    $pdf->Write(0, "X"); 
	}
	
		if($row[vibrazione]=='INTRINSECO'){
	$pdf->SetXY(116,114);
    $pdf->Write(0, "X");
	}else if($row[vibrazione]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,114);
    $pdf->Write(0, "X");
	}else if($row[vibrazione]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,114);
    $pdf->Write(0, "X"); 
	}
	if($row[campi_magnetici]=='INTRINSECO'){
	$pdf->SetXY(116,120);
    $pdf->Write(0, "X");
	}else if($row[campi_magnetici]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,120);
    $pdf->Write(0, "X");
	}else if($row[campi_magnetici]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,120);
    $pdf->Write(0, "X"); 
	}
	
		if($row[carico_biologico]=='INTRINSECO'){
	$pdf->SetXY(116,146);
    $pdf->Write(0, "X");
	}else if($row[carico_biologico]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,146);
    $pdf->Write(0, "X");
	}else if($row[carico_biologico]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,146);
    $pdf->Write(0, "X"); 
	}
	
	if($row[contaminazione_biologica]=='INTRINSECO'){
	$pdf->SetXY(116,152);
    $pdf->Write(0, "X");
	}else if($row[contaminazione_biologica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,152);
    $pdf->Write(0, "X");
	}else if($row[contaminazione_biologica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,152);
    $pdf->Write(0, "X"); 
	}
	
	if($row[incompatibilita_biologica]=='INTRINSECO'){
	$pdf->SetXY(116,159);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_biologica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,159);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_biologica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,159);
    $pdf->Write(0, "X"); 
	}
	
		if($row[emissione_incorretta]=='INTRINSECO'){
	$pdf->SetXY(116,164);
    $pdf->Write(0, "X");
	}else if($row[emissione_incorretta]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,164);
    $pdf->Write(0, "X");
	}else if($row[emissione_incorretta]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,164);
    $pdf->Write(0, "X"); 
	}
	
	
		if($row[formulazione_incorretta_sostanza_chimica]=='INTRINSECO'){
	$pdf->SetXY(116,171);
    $pdf->Write(0, "X");
	}else if($row[formulazione_incorretta_sostanza_chimica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,171);
    $pdf->Write(0, "X");
	}else if($row[formulazione_incorretta_sostanza_chimica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,171);
    $pdf->Write(0, "X"); 
	}
	
	if($row[tossicita]=='INTRINSECO'){
	$pdf->SetXY(116,180);
    $pdf->Write(0, "X");
	}else if($row[tossicita]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,180);
    $pdf->Write(0, "X");
	}else if($row[tossicita]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,180);
    $pdf->Write(0, "X"); 
	
	
	
}

	if($row[infezioni]=='INTRINSECO'){
	$pdf->SetXY(116,185);
    $pdf->Write(0, "X");
	}else if($row[infezioni]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,185);
    $pdf->Write(0, "X");
	}else if($row[infezioni]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,185);
    $pdf->Write(0, "X"); 
	
	
	
}


	if($row[pirogenicita]=='INTRINSECO'){
	$pdf->SetXY(116,191);
    $pdf->Write(0, "X");
	}else if($row[pirogenicita]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,191);
    $pdf->Write(0, "X");
	}else if($row[pirogenicita]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,191);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[incapacita_di_mantenere_sicurezza_igienica]=='INTRINSECO'){
	$pdf->SetXY(116,200);
    $pdf->Write(0, "X");
	}else if($row[incapacita_di_mantenere_sicurezza_igienica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,200);
    $pdf->Write(0, "X");
	}else if($row[incapacita_di_mantenere_sicurezza_igienica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,200);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[degradazioni]=='INTRINSECO'){
	$pdf->SetXY(116,207);
    $pdf->Write(0, "X");
	}else if($row[degradazioni]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,207);
    $pdf->Write(0, "X");
	}else if($row[degradazioni]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,207);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[interferenze_elettromagnetiche]=='INTRINSECO'){
	$pdf->SetXY(116,235);
    $pdf->Write(0, "X");
	}else if($row[interferenze_elettromagnetiche]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,235);
    $pdf->Write(0, "X");
	}else if($row[interferenze_elettromagnetiche]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,235);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[alimentazione_inadeguata_di_energia_o_di_refrigerante]=='INTRINSECO'){
	$pdf->SetXY(116,241);
    $pdf->Write(0, "X");
	}else if($row[alimentazione_inadeguata_di_energia_o_di_refrigerante]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,241);
    $pdf->Write(0, "X");
	}else if($row[alimentazione_inadeguata_di_energia_o_di_refrigerante]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,241);
    $pdf->Write(0, "X"); 
	
	
	
}




if($row[limitazione_refrigerante]=='INTRINSECO'){
	$pdf->SetXY(116,249);
    $pdf->Write(0, "X");
	}else if($row[limitazione_refrigerante]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,249);
    $pdf->Write(0, "X");
	}else if($row[limitazione_refrigerante]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,249);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[probabilita_di_funzionamento_oltre_alle_condizioni_prescritte]=='INTRINSECO'){
	$pdf->SetXY(116,257);
    $pdf->Write(0, "X");
	}else if($row[probabilita_di_funzionamento_oltre_alle_condizioni_prescritte]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,257);
    $pdf->Write(0, "X");
	}else if($row[probabilita_di_funzionamento_oltre_alle_condizioni_prescritte]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,257);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[incompatibilita_con_altri_dispositivi]=='INTRINSECO'){
	$pdf->SetXY(116,266);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_con_altri_dispositivi]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,266);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_con_altri_dispositivi]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,266);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[danneggiamento_meccanico_accidentale]=='INTRINSECO'){
	$pdf->SetXY(116,272);
    $pdf->Write(0, "X");
	}else if($row[danneggiamento_meccanico_accidentale]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,272);
    $pdf->Write(0, "X");
	}else if($row[danneggiamento_meccanico_accidentale]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,272);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[contaminazione_da_prodotti_di_scarto]=='INTRINSECO'){
	$pdf->SetXY(116,277);
    $pdf->Write(0, "X");
	}else if($row[contaminazione_da_prodotti_di_scarto]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,279);
    $pdf->Write(0, "X");
	}else if($row[contaminazione_da_prodotti_di_scarto]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,277);
    $pdf->Write(0, "X"); 
	
	
	
}

$pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(3);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
if($row[etichettatura_inadeguata]=='INTRINSECO'){
	$pdf->SetXY(116,45.5);
    $pdf->Write(0, "X");
	}else if($row[etichettatura_inadeguata]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,45.5);
    $pdf->Write(0, "X");
	}else if($row[etichettatura_inadeguata]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,45.5);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[istruzioni_operative_inadeguate]=='INTRINSECO'){
	$pdf->SetXY(116,50.5);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_inadeguate]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,50.5);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_inadeguate]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,50.5);
    $pdf->Write(0, "X"); 
	
	
	
}






if($row[specifiche_inadeguate_degli_accessori]=='INTRINSECO'){
	$pdf->SetXY(116,55.4);
    $pdf->Write(0, "X");
	}else if($row[specifiche_inadeguate_degli_accessori]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,55.4);
    $pdf->Write(0, "X");
	}else if($row[specifiche_inadeguate_degli_accessori]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,55.4);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[istruzioni_operative_troppo_complicate]=='INTRINSECO'){
	$pdf->SetXY(116,61.8);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_troppo_complicate]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,61.8);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_troppo_complicate]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,61.8);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[istruzioni_operative_non_disponibili]=='INTRINSECO'){
	$pdf->SetXY(116,68.4);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_non_disponibili]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,68.4);
    $pdf->Write(0, "X");
	}else if($row[istruzioni_operative_non_disponibili]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,68.4);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[uso_da_parte_di_personale_inesperto]=='INTRINSECO'){
	$pdf->SetXY(116,80.4);
    $pdf->Write(0, "X");
	}else if($row[uso_da_parte_di_personale_inesperto]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,80.4);
    $pdf->Write(0, "X");
	}else if($row[uso_da_parte_di_personale_inesperto]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,80.4);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[uso_scorretto_prevedibile]=='INTRINSECO'){
	$pdf->SetXY(116,87.4);
    $pdf->Write(0, "X");
	}else if($row[uso_scorretto_prevedibile]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,87.4);
    $pdf->Write(0, "X");
	}else if($row[uso_scorretto_prevedibile]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,87.4);
    $pdf->Write(0, "X"); 
	
	
	
}



if($row[avvertenze_inefficienti]=='INTRINSECO'){
	$pdf->SetXY(116,96.4);
    $pdf->Write(0, "X");
	}else if($row[avvertenze_inefficienti]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,96.4);
    $pdf->Write(0, "X");
	}else if($row[avvertenze_inefficienti]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,96.4);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[avvertenze_inadeguate_per_dispositivi_monouso]=='INTRINSECO'){
	$pdf->SetXY(116,107);
    $pdf->Write(0, "X");
	}else if($row[avvertenze_inadeguate_per_dispositivi_monouso]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,107);
    $pdf->Write(0, "X");
	}else if($row[avvertenze_inadeguate_per_dispositivi_monouso]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,107);
    $pdf->Write(0, "X"); 
	
	
	
}


if($row[misurazioni_inesatte]=='INTRINSECO'){
	$pdf->SetXY(116,117);
    $pdf->Write(0, "X");
	}else if($row[misurazioni_inesatte]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,117);
    $pdf->Write(0, "X");
	}else if($row[misurazioni_inesatte]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,117);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[diagnosi_inesatte]=='INTRINSECO'){
	$pdf->SetXY(116,125);
    $pdf->Write(0, "X");
	}else if($row[diagnosi_inesatte]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,125);
    $pdf->Write(0, "X");
	}else if($row[diagnosi_inesatte]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,125);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[trasferimento_erroneo_dati]=='INTRINSECO'){
	$pdf->SetXY(116,131);
    $pdf->Write(0, "X");
	}else if($row[trasferimento_erroneo_dati]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,131);
    $pdf->Write(0, "X");
	}else if($row[trasferimento_erroneo_dati]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,131);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[presentazione_scorretta_dati]=='INTRINSECO'){
	$pdf->SetXY(116,137);
    $pdf->Write(0, "X");
	}else if($row[presentazione_scorretta_dati]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,137);
    $pdf->Write(0, "X");
	}else if($row[presentazione_scorretta_dati]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,137);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[incompatibilita_con_prodotti_di_altri_dispositivi]=='INTRINSECO'){
	$pdf->SetXY(116,144);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_con_prodotti_di_altri_dispositivi]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,144);
    $pdf->Write(0, "X");
	}else if($row[incompatibilita_con_prodotti_di_altri_dispositivi]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,144);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[caratteristiche_di_prestazione_inadeguate]=='INTRINSECO'){
	$pdf->SetXY(116,181);
    $pdf->Write(0, "X");
	}else if($row[caratteristiche_di_prestazione_inadeguate]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,181);
    $pdf->Write(0, "X");
	}else if($row[caratteristiche_di_prestazione_inadeguate]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,181);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[mancanza_di_specifiche_di_manutenzione]=='INTRINSECO'){
	$pdf->SetXY(116,194);
    $pdf->Write(0, "X");
	}else if($row[mancanza_di_specifiche_di_manutenzione]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,194);
    $pdf->Write(0, "X");
	}else if($row[mancanza_di_specifiche_di_manutenzione]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,194);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[manutenzione_inadeguata]=='INTRINSECO'){
	$pdf->SetXY(116,208);
    $pdf->Write(0, "X");
	}else if($row[manutenzione_inadeguata]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,208);
    $pdf->Write(0, "X");
	}else if($row[manutenzione_inadeguata]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,208);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[mancanza_di_documentazione_della_scadenza_o_durata]=='INTRINSECO'){
	$pdf->SetXY(116,216);
    $pdf->Write(0, "X");
	}else if($row[manutenzione_inadeguata]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,216);
    $pdf->Write(0, "X");
	}else if($row[manutenzione_inadeguata]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,216);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[perdita_integrita_meccanica]=='INTRINSECO'){
	$pdf->SetXY(116,225);
    $pdf->Write(0, "X");
	}else if($row[perdita_integrita_meccanica]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,225);
    $pdf->Write(0, "X");
	}else if($row[perdita_integrita_meccanica]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,225);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[confezionamento_inadeguato]=='INTRINSECO'){
	$pdf->SetXY(116,235);
    $pdf->Write(0, "X");
	}else if($row[confezionamento_inadeguato]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,235);
    $pdf->Write(0, "X");
	}else if($row[confezionamento_inadeguato]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,235);
    $pdf->Write(0, "X"); 
	
	
	
}

if($row[riutilizzo_improprio]=='INTRINSECO'){
	$pdf->SetXY(116,245.6);
    $pdf->Write(0, "X");
	}else if($row[riutilizzo_improprio]=='CONNESSO ALL USO IN COND. NORMALI'){
		$pdf->SetXY(146,245.6);
    $pdf->Write(0, "X");
	}else if($row[riutilizzo_improprio]=='CONNESSO ALL USO IN COND. GUASTI'){
	$pdf->SetXY(175,245.6);
    $pdf->Write(0, "X"); 
}


$pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(4);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
	$pdf->SetXY(20,46);
	$pdf->SetFont('Arial','',7);
    $pdf->Write(0, $row[pericoli_uso]);
    $pdf->SetXY(110,46);
	$pdf->SetFont('Arial','',7);
    $pdf->Write(0, $row[probabilita_verifica_uso]);
     $pdf->SetXY(140,46);
	$pdf->Write(0, $row[danno_associato_al_pericolo_uso]);
     $pdf->SetXY(150,46);
	
	
	$pdf->SetXY(19,68);
	$pdf->SetFont('Arial','',5);
    $pdf->Write(0, $row[pericoli_guasti_manutenzioni_invecchiamento]);
    $pdf->SetXY(109,68);
    $pdf->Write(0, $row[probabilita_di_verifica_invecchiamento]);
    $pdf->SetXY(139,68);
    $pdf->Write(0, $row[danno_associato_invecchiamento]);
    $pdf->SetFont('Arial','',9);
    
    if($row[stima_rischi_probabilita_verifica]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(100,114);
    $pdf->Write(0, "X");
    }else if($row[stima_rischi_probabilita_verifica]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,114);
    $pdf->Write(0, "X");
    }
    
       if($row[stima_rischi_danno_associato]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(100,120);
    $pdf->Write(0, "X");
    }else if($row[stima_rischi_danno_associato]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,120);
    $pdf->Write(0, "X");
    }
    
        if($row[stima_rischi_necessita]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(100,128);
    $pdf->Write(0, "X");
    }else if($row[stima_rischi_necessita]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,128);
    $pdf->Write(0, "X");
    }
    
    $pdf->SetFont('Arial','',20);
       if($row[accettazione_rischio]=='SI'){
    $pdf->SetXY(102,145.7);
    $pdf->Write(0, "X");
    }else if($row[accettazione_rischio]=='NO'){ 
    $pdf->SetXY(161.4,145.7);
    $pdf->Write(0, "X");
    }
    
     $pdf->SetFont('Arial','',9);
       if($row[utente_puo_rilevare_rischio]=='SI'){
    $pdf->SetXY(167,167);
    $pdf->Write(0, $row[utente_puo_rilevare_rischio]);
    }else if($row[utente_puo_rilevare_rischio]=='NO'){ 
    $pdf->SetXY(167,167);
    $pdf->Write(0, $row[utente_puo_rilevare_rischio]);
    }
    
     $pdf->SetFont('Arial','',9);
       if($row[eliminazione_pericolo_tramite_controlli]=='SI'){
    $pdf->SetXY(167,175);
    $pdf->Write(0, $row[eliminazione_pericolo_tramite_controlli]);
    }else if($row[eliminazione_pericolo_tramite_controlli]=='NO'){ 
    $pdf->SetXY(167,175);
    $pdf->Write(0, $row[eliminazione_pericolo_tramite_controlli]);
    }
    
       $pdf->SetFont('Arial','',9);
    $pdf->SetXY(167,190);
    $pdf->Write(0, $row[pericolo_utilizzo_non_corretto]);
    
    
      $pdf->SetFont('Arial','',9);
    $pdf->SetXY(167,196);
    $pdf->Write(0, $row[prevedere_allarmi_segnalazioni]);
    
    
    
    
    
    
    
    
    //----------------------------------------------------------------QUINTO PDF
    
    $pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(5);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
    	$pdf->SetXY(139,150);
  
  
      
        if($row[perdita_integrita_meccanica_probabilita_verifica]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(98,40);
    $pdf->Write(0, "X");
    }else if($row[perdita_integrita_meccanica_probabilita_verifica]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,40);
    $pdf->Write(0, "X");
    }
    
      if($row[perdita_integrita_meccanica_danno_associato]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(98,46);
    $pdf->Write(0, "X");
    }else if($row[perdita_integrita_meccanica_danno_associato]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,46);
    $pdf->Write(0, "X");
    }
    	
    	
    	if($row[perdita_integrita_meccanica_necessita]=='IN CONDIZIONI NORMALI'){
    $pdf->SetXY(98,55);
    $pdf->Write(0, "X");
    }else if($row[perdita_integrita_meccanica_necessita]=='IN CONDIZIONI DI MALFUNZIONAMENTO'){ 
    $pdf->SetXY(160,55);
    $pdf->Write(0, "X");
    }
	$pdf->SetFont('Arial','',7);
   
   
 
   $pdf->SetFont('Arial','',20);
       if($row[perdita_integrita_accettazione_rischio]=='SI'){
    $pdf->SetXY(102,72);
    $pdf->Write(0, "X");
    }else if($row[perdita_integrita_accettazione_rischio]=='NO'){ 
    $pdf->SetXY(161.4,72);
    $pdf->Write(0, "X");
    }
    
    
     $pdf->SetFont('Arial','',9);
       if($row[perdita_integrita_utente_puo_rilevare_rischio]=='SI'){
    $pdf->SetXY(167,93);
    $pdf->Write(0, $row[perdita_integrita_utente_puo_rilevare_rischio]);
    }else if($row[perdita_integrita_utente_puo_rilevare_rischio]=='NO'){ 
    $pdf->SetXY(167,93);
    $pdf->Write(0, $row[perdita_integrita_utente_puo_rilevare_rischio]);
    }
    
    $pdf->SetXY(167,102);
    $pdf->Write(0, $row[perdita_integrita_eliminazione_pericolo_tramite_controlli]);
    
    $pdf->SetXY(167,116);
    $pdf->Write(0, $row[perdita_integrita_pericolo_utilizzo_non_corretto]);
    
        $pdf->SetXY(167,123);
    $pdf->Write(0, $row[perdita_integrita_prevedere_allarmi_segnalazioni]);
    $pdf->SetFont('Arial','',4);
       $pdf->SetXY(127,193);
    $pdf->Write(0, $row[composizione_chimica_materiali]);
    $pdf->SetXY(122,201);
    $pdf->Write(0, $row[vbm]);
    $pdf->SetXY(121,206);
    $pdf->Write(0, $row[dati_provenienti_da_test_di_sicurezza_biologica]);
    
    $pdf->setSourceFile('./doc/moduloanalisidelrischio.pdf');
    $pdf->AddPage();
    $tplIdx = $pdf->importPage(6);
	$pdf->useTemplate($tplIdx, null, null, 0, 0, true);
	$pdf->SetFont('Arial','',9);
    $pdf->SetXY(43,134);
    $originalDate = $row[data];
$newDate = date("d-m-Y", strtotime($originalDate));
    $pdf->Write(0, $newDate);
}

$pdf->SetFont('Arial','',9);
$pdf->Output();
?>