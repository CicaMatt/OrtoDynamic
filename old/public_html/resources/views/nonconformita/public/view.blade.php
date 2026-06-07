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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Preventivo', (isset($fields['id_preventivo']['language'])? $fields['id_preventivo']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_preventivo,'id_preventivo','1:preventivi:id:id|data_preventivo') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cognome', (isset($fields['cognome']['language'])? $fields['cognome']['language'] : array())) }}</td>
						<td>{{ $row->cognome}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Nome', (isset($fields['nome']['language'])? $fields['nome']['language'] : array())) }}</td>
						<td>{{ $row->nome}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Nascita', (isset($fields['data_nascita']['language'])? $fields['data_nascita']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_nascita)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Difformita Rilevata', (isset($fields['difformita_rilevata']['language'])? $fields['difformita_rilevata']['language'] : array())) }}</td>
						<td>{{ $row->difformita_rilevata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Nome Tecnico', (isset($fields['nome_tecnico']['language'])? $fields['nome_tecnico']['language'] : array())) }}</td>
						<td>{{ $row->nome_tecnico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Apertura Reclamo', (isset($fields['data_apertura_reclamo']['language'])? $fields['data_apertura_reclamo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_apertura_reclamo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Chiusura Reclamo', (isset($fields['data_chiusura_reclamo']['language'])? $fields['data_chiusura_reclamo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_chiusura_reclamo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Reclamo', (isset($fields['stato_reclamo']['language'])? $fields['stato_reclamo']['language'] : array())) }}</td>
						<td>{{ $row->stato_reclamo}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	