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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Preventivo', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_cliente,'id_cliente','1:clienti:id:cognome|nome|data_nascita') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tipologia', (isset($fields['tipologia_preventivo']['language'])? $fields['tipologia_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->tipologia_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Diagnosi Circostanziata', (isset($fields['diagnosi_circostanziata']['language'])? $fields['diagnosi_circostanziata']['language'] : array())) }}</td>
						<td>{{ $row->diagnosi_circostanziata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prescizione Dettagliata Protesi', (isset($fields['prescizione_dettagliata_protesi']['language'])? $fields['prescizione_dettagliata_protesi']['language'] : array())) }}</td>
						<td>{{ $row->prescizione_dettagliata_protesi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Prescrizione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Preventivo', (isset($fields['data_preventivo']['language'])? $fields['data_preventivo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_preventivo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Ricezione Autorizzazione', (isset($fields['data_ricezione_autorizzazione']['language'])? $fields['data_ricezione_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->data_ricezione_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Autorizzazione Protocollo ASL', (isset($fields['numero_autorizzazione']['language'])? $fields['numero_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->numero_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Accettazione Protocollo ASL', (isset($fields['data_accettazione']['language'])? $fields['data_accettazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_accettazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Totale', (isset($fields['totale']['language'])? $fields['totale']['language'] : array())) }}</td>
						<td>{{ $row->totale}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Ordine', (isset($fields['numero_ordine']['language'])? $fields['numero_ordine']['language'] : array())) }}</td>
						<td>{{ $row->numero_ordine}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Medico', (isset($fields['id_medico']['language'])? $fields['id_medico']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_medico,'id_medico','1:medici:id:cognome|nome') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Modello', (isset($fields['modello']['language'])? $fields['modello']['language'] : array())) }}</td>
						<td>{{ $row->modello}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misure', (isset($fields['misure']['language'])? $fields['misure']['language'] : array())) }}</td>
						<td>{{ $row->misure}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misure Ok', (isset($fields['misure_ok']['language'])? $fields['misure_ok']['language'] : array())) }}</td>
						<td>{{ $row->misure_ok}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Residenza', (isset($fields['citta']['language'])? $fields['citta']['language'] : array())) }}</td>
						<td>{{ $row->citta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Provvigioni Pagate', (isset($fields['provvigioni_pagate']['language'])? $fields['provvigioni_pagate']['language'] : array())) }}</td>
						<td>{{ $row->provvigioni_pagate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Lavorazione', (isset($fields['stato_1']['language'])? $fields['stato_1']['language'] : array())) }}</td>
						<td>{{ $row->stato_1}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massima Scadenza', (isset($fields['massima_scadenza']['language'])? $fields['massima_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->massima_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Fattura', (isset($fields['numero_fattura']['language'])? $fields['numero_fattura']['language'] : array())) }}</td>
						<td>{{ $row->numero_fattura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Preventivo', (isset($fields['Preventivo']['language'])? $fields['Preventivo']['language'] : array())) }}</td>
						<td>{!! SiteHelpers::formatRows($row->Preventivo,$fields['Preventivo'],$row ) !!} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massina Scadenza Per Lavorazione', (isset($fields['giorni_scadenza']['language'])? $fields['giorni_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->giorni_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note ', (isset($fields['note_finali']['language'])? $fields['note_finali']['language'] : array())) }}</td>
						<td>{{ $row->note_finali}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	