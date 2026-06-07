<div class="m-t" style="padding-top:25px;">	
    <div class="row m-b-lg animated fadeInDown delayp1 text-center">
        <h3> {{ $pageTitle }} <small> {{ $pageNote }} </small></h3>
        <hr />       
    </div>
</div>
<div class="m-t">
	<div class="table-responsive" > 	

		<table class="table table-striped table-bordered" >
			<tbody>	
		
			
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Lavorazione', (isset($fields['id_lavorazione']['language'])? $fields['id_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->id_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Preventivo', (isset($fields['id_preventivo']['language'])? $fields['id_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->id_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ $row->id_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Uso Previsto', (isset($fields['uso_previsto']['language'])? $fields['uso_previsto']['language'] : array())) }}</td>
						<td>{{ $row->uso_previsto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Modalita Di Utilizzo', (isset($fields['modalita_di_utilizzo']['language'])? $fields['modalita_di_utilizzo']['language'] : array())) }}</td>
						<td>{{ $row->modalita_di_utilizzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Contatto Previto', (isset($fields['contatto_previto']['language'])? $fields['contatto_previto']['language'] : array())) }}</td>
						<td>{{ $row->contatto_previto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Durata Contatto', (isset($fields['durata_contatto']['language'])? $fields['durata_contatto']['language'] : array())) }}</td>
						<td>{{ $row->durata_contatto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Frequenza Contatto', (isset($fields['frequenza_contatto']['language'])? $fields['frequenza_contatto']['language'] : array())) }}</td>
						<td>{{ $row->frequenza_contatto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Gesso', (isset($fields['gesso']['language'])? $fields['gesso']['language'] : array())) }}</td>
						<td>{{ $row->gesso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cuoio', (isset($fields['cuoio']['language'])? $fields['cuoio']['language'] : array())) }}</td>
						<td>{{ $row->cuoio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Fodera', (isset($fields['fodera']['language'])? $fields['fodera']['language'] : array())) }}</td>
						<td>{{ $row->fodera}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Materiali Sintetici', (isset($fields['materiali_sintetici']['language'])? $fields['materiali_sintetici']['language'] : array())) }}</td>
						<td>{{ $row->materiali_sintetici}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Sughero', (isset($fields['sughero']['language'])? $fields['sughero']['language'] : array())) }}</td>
						<td>{{ $row->sughero}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altro', (isset($fields['altro']['language'])? $fields['altro']['language'] : array())) }}</td>
						<td>{{ $row->altro}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Influssi Previsti', (isset($fields['influssi_previsti']['language'])? $fields['influssi_previsti']['language'] : array())) }}</td>
						<td>{{ $row->influssi_previsti}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Conseguenze Previste', (isset($fields['conseguenze_previste']['language'])? $fields['conseguenze_previste']['language'] : array())) }}</td>
						<td>{{ $row->conseguenze_previste}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Si No Manutenzione', (isset($fields['si_no_manutenzione']['language'])? $fields['si_no_manutenzione']['language'] : array())) }}</td>
						<td>{{ $row->si_no_manutenzione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Si No Taratura', (isset($fields['si_no_taratura']['language'])? $fields['si_no_taratura']['language'] : array())) }}</td>
						<td>{{ $row->si_no_taratura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Si No Durata Limitata', (isset($fields['si_no_durata_limitata']['language'])? $fields['si_no_durata_limitata']['language'] : array())) }}</td>
						<td>{{ $row->si_no_durata_limitata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Durata Prevista', (isset($fields['durata_prevista']['language'])? $fields['durata_prevista']['language'] : array())) }}</td>
						<td>{{ $row->durata_prevista}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Effetti Lungo Utilizzo', (isset($fields['effetti_lungo_utilizzo']['language'])? $fields['effetti_lungo_utilizzo']['language'] : array())) }}</td>
						<td>{{ $row->effetti_lungo_utilizzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prodotti Associati', (isset($fields['prodotti_associati']['language'])? $fields['prodotti_associati']['language'] : array())) }}</td>
						<td>{{ $row->prodotti_associati}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Forze Meccaniche Del Dispositivo', (isset($fields['forze_meccaniche_del_dispositivo']['language'])? $fields['forze_meccaniche_del_dispositivo']['language'] : array())) }}</td>
						<td>{{ $row->forze_meccaniche_del_dispositivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Determinante Durata', (isset($fields['determinante_durata']['language'])? $fields['determinante_durata']['language'] : array())) }}</td>
						<td>{{ $row->determinante_durata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Caratteristiche Compromettenti', (isset($fields['caratteristiche_compromettenti']['language'])? $fields['caratteristiche_compromettenti']['language'] : array())) }}</td>
						<td>{{ $row->caratteristiche_compromettenti}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Elenco Limiti Applicazione', (isset($fields['elenco_limiti_applicazione']['language'])? $fields['elenco_limiti_applicazione']['language'] : array())) }}</td>
						<td>{{ $row->elenco_limiti_applicazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Elettricità', (isset($fields['elettricità']['language'])? $fields['elettricità']['language'] : array())) }}</td>
						<td>{{ $row->elettricità}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Calore', (isset($fields['calore']['language'])? $fields['calore']['language'] : array())) }}</td>
						<td>{{ $row->calore}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Forza Meccanica', (isset($fields['forza_meccanica']['language'])? $fields['forza_meccanica']['language'] : array())) }}</td>
						<td>{{ $row->forza_meccanica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Radiazioni Ionizzanti', (isset($fields['radiazioni_ionizzanti']['language'])? $fields['radiazioni_ionizzanti']['language'] : array())) }}</td>
						<td>{{ $row->radiazioni_ionizzanti}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Campi Elettromagnetici', (isset($fields['campi_elettromagnetici']['language'])? $fields['campi_elettromagnetici']['language'] : array())) }}</td>
						<td>{{ $row->campi_elettromagnetici}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Parti Mobili', (isset($fields['parti_mobili']['language'])? $fields['parti_mobili']['language'] : array())) }}</td>
						<td>{{ $row->parti_mobili}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Masse Sospese', (isset($fields['masse_sospese']['language'])? $fields['masse_sospese']['language'] : array())) }}</td>
						<td>{{ $row->masse_sospese}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Guasto', (isset($fields['guasto']['language'])? $fields['guasto']['language'] : array())) }}</td>
						<td>{{ $row->guasto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pressione Rottura', (isset($fields['pressione_rottura']['language'])? $fields['pressione_rottura']['language'] : array())) }}</td>
						<td>{{ $row->pressione_rottura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pressione Acustica', (isset($fields['pressione_acustica']['language'])? $fields['pressione_acustica']['language'] : array())) }}</td>
						<td>{{ $row->pressione_acustica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Vibrazione', (isset($fields['vibrazione']['language'])? $fields['vibrazione']['language'] : array())) }}</td>
						<td>{{ $row->vibrazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Campi Magnetici', (isset($fields['campi_magnetici']['language'])? $fields['campi_magnetici']['language'] : array())) }}</td>
						<td>{{ $row->campi_magnetici}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Carico Biologico', (isset($fields['carico_biologico']['language'])? $fields['carico_biologico']['language'] : array())) }}</td>
						<td>{{ $row->carico_biologico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Contaminazione Biologica', (isset($fields['contaminazione_biologica']['language'])? $fields['contaminazione_biologica']['language'] : array())) }}</td>
						<td>{{ $row->contaminazione_biologica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Incompatibilita Biologica', (isset($fields['incompatibilita_biologica']['language'])? $fields['incompatibilita_biologica']['language'] : array())) }}</td>
						<td>{{ $row->incompatibilita_biologica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Emissione Incorretta', (isset($fields['emissione_incorretta']['language'])? $fields['emissione_incorretta']['language'] : array())) }}</td>
						<td>{{ $row->emissione_incorretta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Formulazione Incorretta Sostanza Chimica', (isset($fields['formulazione_incorretta_sostanza_chimica']['language'])? $fields['formulazione_incorretta_sostanza_chimica']['language'] : array())) }}</td>
						<td>{{ $row->formulazione_incorretta_sostanza_chimica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tossicita', (isset($fields['tossicita']['language'])? $fields['tossicita']['language'] : array())) }}</td>
						<td>{{ $row->tossicita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Infezioni', (isset($fields['infezioni']['language'])? $fields['infezioni']['language'] : array())) }}</td>
						<td>{{ $row->infezioni}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pirogenicita', (isset($fields['pirogenicita']['language'])? $fields['pirogenicita']['language'] : array())) }}</td>
						<td>{{ $row->pirogenicita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Incapacita Di Mantenere Sicurezza Igienica', (isset($fields['incapacita_di_mantenere_sicurezza_igienica']['language'])? $fields['incapacita_di_mantenere_sicurezza_igienica']['language'] : array())) }}</td>
						<td>{{ $row->incapacita_di_mantenere_sicurezza_igienica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Degradazioni', (isset($fields['degradazioni']['language'])? $fields['degradazioni']['language'] : array())) }}</td>
						<td>{{ $row->degradazioni}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Interferenze Elettromagnetiche', (isset($fields['interferenze_elettromagnetiche']['language'])? $fields['interferenze_elettromagnetiche']['language'] : array())) }}</td>
						<td>{{ $row->interferenze_elettromagnetiche}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Alimentazione Inadeguata Di Energia O Di Refrigerante', (isset($fields['alimentazione_inadeguata_di_energia_o_di_refrigerante']['language'])? $fields['alimentazione_inadeguata_di_energia_o_di_refrigerante']['language'] : array())) }}</td>
						<td>{{ $row->alimentazione_inadeguata_di_energia_o_di_refrigerante}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Limitazione Refrigerante', (isset($fields['limitazione_refrigerante']['language'])? $fields['limitazione_refrigerante']['language'] : array())) }}</td>
						<td>{{ $row->limitazione_refrigerante}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Probabilita Di Funzionamento Oltre Alle Condizioni Prescritte', (isset($fields['probabilita_di_funzionamento_oltre_alle_condizioni_prescritte']['language'])? $fields['probabilita_di_funzionamento_oltre_alle_condizioni_prescritte']['language'] : array())) }}</td>
						<td>{{ $row->probabilita_di_funzionamento_oltre_alle_condizioni_prescritte}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Incompatibilita Con Altri Dispositivi', (isset($fields['incompatibilita_con_altri_dispositivi']['language'])? $fields['incompatibilita_con_altri_dispositivi']['language'] : array())) }}</td>
						<td>{{ $row->incompatibilita_con_altri_dispositivi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Danneggiamento Meccanico Accidentale', (isset($fields['danneggiamento_meccanico_accidentale']['language'])? $fields['danneggiamento_meccanico_accidentale']['language'] : array())) }}</td>
						<td>{{ $row->danneggiamento_meccanico_accidentale}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Contaminazione Da Prodotti Di Scarto', (isset($fields['contaminazione_da_prodotti_di_scarto']['language'])? $fields['contaminazione_da_prodotti_di_scarto']['language'] : array())) }}</td>
						<td>{{ $row->contaminazione_da_prodotti_di_scarto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Etichettatura Inadeguata', (isset($fields['etichettatura_inadeguata']['language'])? $fields['etichettatura_inadeguata']['language'] : array())) }}</td>
						<td>{{ $row->etichettatura_inadeguata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Istruzioni Operative Inadeguate', (isset($fields['istruzioni_operative_inadeguate']['language'])? $fields['istruzioni_operative_inadeguate']['language'] : array())) }}</td>
						<td>{{ $row->istruzioni_operative_inadeguate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Specifiche Inadeguate Degli Accessori', (isset($fields['specifiche_inadeguate_degli_accessori']['language'])? $fields['specifiche_inadeguate_degli_accessori']['language'] : array())) }}</td>
						<td>{{ $row->specifiche_inadeguate_degli_accessori}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Istruzioni Operative Troppo Complicate', (isset($fields['istruzioni_operative_troppo_complicate']['language'])? $fields['istruzioni_operative_troppo_complicate']['language'] : array())) }}</td>
						<td>{{ $row->istruzioni_operative_troppo_complicate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Istruzioni Operative Non Disponibili', (isset($fields['istruzioni_operative_non_disponibili']['language'])? $fields['istruzioni_operative_non_disponibili']['language'] : array())) }}</td>
						<td>{{ $row->istruzioni_operative_non_disponibili}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Uso Da Parte Di Personale Inesperto', (isset($fields['uso_da_parte_di_personale_inesperto']['language'])? $fields['uso_da_parte_di_personale_inesperto']['language'] : array())) }}</td>
						<td>{{ $row->uso_da_parte_di_personale_inesperto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Uso Scorretto Prevedibile', (isset($fields['uso_scorretto_prevedibile']['language'])? $fields['uso_scorretto_prevedibile']['language'] : array())) }}</td>
						<td>{{ $row->uso_scorretto_prevedibile}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Avvertenze Inefficienti', (isset($fields['avvertenze_inefficienti']['language'])? $fields['avvertenze_inefficienti']['language'] : array())) }}</td>
						<td>{{ $row->avvertenze_inefficienti}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Avvertenze Inadeguate Per Dispositivi Monouso', (isset($fields['avvertenze_inadeguate_per_dispositivi_monouso']['language'])? $fields['avvertenze_inadeguate_per_dispositivi_monouso']['language'] : array())) }}</td>
						<td>{{ $row->avvertenze_inadeguate_per_dispositivi_monouso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misurazioni Inesatte', (isset($fields['misurazioni_inesatte']['language'])? $fields['misurazioni_inesatte']['language'] : array())) }}</td>
						<td>{{ $row->misurazioni_inesatte}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Diagnosi Inesatte', (isset($fields['diagnosi_inesatte']['language'])? $fields['diagnosi_inesatte']['language'] : array())) }}</td>
						<td>{{ $row->diagnosi_inesatte}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Trasferimento Erroneo Dati', (isset($fields['trasferimento_erroneo_dati']['language'])? $fields['trasferimento_erroneo_dati']['language'] : array())) }}</td>
						<td>{{ $row->trasferimento_erroneo_dati}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Presentazione Scorretta Dati', (isset($fields['presentazione_scorretta_dati']['language'])? $fields['presentazione_scorretta_dati']['language'] : array())) }}</td>
						<td>{{ $row->presentazione_scorretta_dati}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Incompatibilita Con Prodotti Di Altri Dispositivi', (isset($fields['incompatibilita_con_prodotti_di_altri_dispositivi']['language'])? $fields['incompatibilita_con_prodotti_di_altri_dispositivi']['language'] : array())) }}</td>
						<td>{{ $row->incompatibilita_con_prodotti_di_altri_dispositivi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Caratteristiche Di Prestazione Inadeguate', (isset($fields['caratteristiche_di_prestazione_inadeguate']['language'])? $fields['caratteristiche_di_prestazione_inadeguate']['language'] : array())) }}</td>
						<td>{{ $row->caratteristiche_di_prestazione_inadeguate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Mancanza Di Specifiche Di Manutenzione', (isset($fields['mancanza_di_specifiche_di_manutenzione']['language'])? $fields['mancanza_di_specifiche_di_manutenzione']['language'] : array())) }}</td>
						<td>{{ $row->mancanza_di_specifiche_di_manutenzione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Manutenzione Inadeguata', (isset($fields['manutenzione_inadeguata']['language'])? $fields['manutenzione_inadeguata']['language'] : array())) }}</td>
						<td>{{ $row->manutenzione_inadeguata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Mancanza Di Documentazione Della Scadenza O Durata', (isset($fields['mancanza_di_documentazione_della_scadenza_o_durata']['language'])? $fields['mancanza_di_documentazione_della_scadenza_o_durata']['language'] : array())) }}</td>
						<td>{{ $row->mancanza_di_documentazione_della_scadenza_o_durata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Meccanica', (isset($fields['perdita_integrita_meccanica']['language'])? $fields['perdita_integrita_meccanica']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_meccanica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Confezionamento Inadeguato', (isset($fields['confezionamento_inadeguato']['language'])? $fields['confezionamento_inadeguato']['language'] : array())) }}</td>
						<td>{{ $row->confezionamento_inadeguato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Riutilizzo Improprio', (isset($fields['riutilizzo_improprio']['language'])? $fields['riutilizzo_improprio']['language'] : array())) }}</td>
						<td>{{ $row->riutilizzo_improprio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pericoli Uso', (isset($fields['pericoli_uso']['language'])? $fields['pericoli_uso']['language'] : array())) }}</td>
						<td>{{ $row->pericoli_uso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Probabilita Verifica Uso', (isset($fields['probabilita_verifica_uso']['language'])? $fields['probabilita_verifica_uso']['language'] : array())) }}</td>
						<td>{{ $row->probabilita_verifica_uso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Danno Associato Al Pericolo Uso', (isset($fields['danno_associato_al_pericolo_uso']['language'])? $fields['danno_associato_al_pericolo_uso']['language'] : array())) }}</td>
						<td>{{ $row->danno_associato_al_pericolo_uso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pericoli Guasti Manutenzioni Invecchiamento', (isset($fields['pericoli_guasti_manutenzioni_invecchiamento']['language'])? $fields['pericoli_guasti_manutenzioni_invecchiamento']['language'] : array())) }}</td>
						<td>{{ $row->pericoli_guasti_manutenzioni_invecchiamento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Probabilita Di Verifica Invecchiamento', (isset($fields['probabilita_di_verifica_invecchiamento']['language'])? $fields['probabilita_di_verifica_invecchiamento']['language'] : array())) }}</td>
						<td>{{ $row->probabilita_di_verifica_invecchiamento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Danno Associato Invecchiamento', (isset($fields['danno_associato_invecchiamento']['language'])? $fields['danno_associato_invecchiamento']['language'] : array())) }}</td>
						<td>{{ $row->danno_associato_invecchiamento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stima Rischi Probabilita Verifica', (isset($fields['stima_rischi_probabilita_verifica']['language'])? $fields['stima_rischi_probabilita_verifica']['language'] : array())) }}</td>
						<td>{{ $row->stima_rischi_probabilita_verifica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stima Rischi Danno Associato', (isset($fields['stima_rischi_danno_associato']['language'])? $fields['stima_rischi_danno_associato']['language'] : array())) }}</td>
						<td>{{ $row->stima_rischi_danno_associato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stima Rischi Necessita', (isset($fields['stima_rischi_necessita']['language'])? $fields['stima_rischi_necessita']['language'] : array())) }}</td>
						<td>{{ $row->stima_rischi_necessita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Accettazione Rischio', (isset($fields['accettazione_rischio']['language'])? $fields['accettazione_rischio']['language'] : array())) }}</td>
						<td>{{ $row->accettazione_rischio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Utente Puo Rilevare Rischio', (isset($fields['utente_puo_rilevare_rischio']['language'])? $fields['utente_puo_rilevare_rischio']['language'] : array())) }}</td>
						<td>{{ $row->utente_puo_rilevare_rischio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Eliminazione Pericolo Tramite Controlli', (isset($fields['eliminazione_pericolo_tramite_controlli']['language'])? $fields['eliminazione_pericolo_tramite_controlli']['language'] : array())) }}</td>
						<td>{{ $row->eliminazione_pericolo_tramite_controlli}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pericolo Utilizzo Non Corretto', (isset($fields['pericolo_utilizzo_non_corretto']['language'])? $fields['pericolo_utilizzo_non_corretto']['language'] : array())) }}</td>
						<td>{{ $row->pericolo_utilizzo_non_corretto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prevedere Allarmi Segnalazioni', (isset($fields['prevedere_allarmi_segnalazioni']['language'])? $fields['prevedere_allarmi_segnalazioni']['language'] : array())) }}</td>
						<td>{{ $row->prevedere_allarmi_segnalazioni}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Meccanica Probabilita Verifica', (isset($fields['perdita_integrita_meccanica_probabilita_verifica']['language'])? $fields['perdita_integrita_meccanica_probabilita_verifica']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_meccanica_probabilita_verifica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Meccanica Danno Associato', (isset($fields['perdita_integrita_meccanica_danno_associato']['language'])? $fields['perdita_integrita_meccanica_danno_associato']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_meccanica_danno_associato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Meccanica Necessita', (isset($fields['perdita_integrita_meccanica_necessita']['language'])? $fields['perdita_integrita_meccanica_necessita']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_meccanica_necessita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Accettazione Rischio', (isset($fields['perdita_integrita_accettazione_rischio']['language'])? $fields['perdita_integrita_accettazione_rischio']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_accettazione_rischio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Utente Puo Rilevare Rischio', (isset($fields['perdita_integrita_utente_puo_rilevare_rischio']['language'])? $fields['perdita_integrita_utente_puo_rilevare_rischio']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_utente_puo_rilevare_rischio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Eliminazione Pericolo Tramite Controlli', (isset($fields['perdita_integrita_eliminazione_pericolo_tramite_controlli']['language'])? $fields['perdita_integrita_eliminazione_pericolo_tramite_controlli']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_eliminazione_pericolo_tramite_controlli}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Pericolo Utilizzo Non Corretto', (isset($fields['perdita_integrita_pericolo_utilizzo_non_corretto']['language'])? $fields['perdita_integrita_pericolo_utilizzo_non_corretto']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_pericolo_utilizzo_non_corretto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Perdita Integrita Prevedere Allarmi Segnalazioni', (isset($fields['perdita_integrita_prevedere_allarmi_segnalazioni']['language'])? $fields['perdita_integrita_prevedere_allarmi_segnalazioni']['language'] : array())) }}</td>
						<td>{{ $row->perdita_integrita_prevedere_allarmi_segnalazioni}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Valutazione Biologica Lavorazione Materiali', (isset($fields['valutazione_biologica_lavorazione_materiali']['language'])? $fields['valutazione_biologica_lavorazione_materiali']['language'] : array())) }}</td>
						<td>{{ $row->valutazione_biologica_lavorazione_materiali}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Dati Provenienti Da Test Di Sicurezza Biologica', (isset($fields['dati_provenienti_da_test_di_sicurezza_biologica']['language'])? $fields['dati_provenienti_da_test_di_sicurezza_biologica']['language'] : array())) }}</td>
						<td>{{ $row->dati_provenienti_da_test_di_sicurezza_biologica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data', (isset($fields['data']['language'])? $fields['data']['language'] : array())) }}</td>
						<td>{{ $row->data}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Firma Direzione', (isset($fields['firma_direzione']['language'])? $fields['firma_direzione']['language'] : array())) }}</td>
						<td>{{ $row->firma_direzione}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	