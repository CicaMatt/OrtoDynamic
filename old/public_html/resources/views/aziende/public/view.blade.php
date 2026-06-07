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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Anno', (isset($fields['anno']['language'])? $fields['anno']['language'] : array())) }}</td>
						<td>{{ $row->anno}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Regione', (isset($fields['codice_regione']['language'])? $fields['codice_regione']['language'] : array())) }}</td>
						<td>{{ $row->codice_regione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Denominazione Regione', (isset($fields['denominazione_regione']['language'])? $fields['denominazione_regione']['language'] : array())) }}</td>
						<td>{{ $row->denominazione_regione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Azienda', (isset($fields['codice_azienda']['language'])? $fields['codice_azienda']['language'] : array())) }}</td>
						<td>{{ $row->codice_azienda}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Denominazione Azienda', (isset($fields['denominazione_azienda']['language'])? $fields['denominazione_azienda']['language'] : array())) }}</td>
						<td>{{ $row->denominazione_azienda}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Comune', (isset($fields['codice_comune']['language'])? $fields['codice_comune']['language'] : array())) }}</td>
						<td>{{ $row->codice_comune}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Comune', (isset($fields['comune']['language'])? $fields['comune']['language'] : array())) }}</td>
						<td>{{ $row->comune}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Distretto', (isset($fields['distretto']['language'])? $fields['distretto']['language'] : array())) }}</td>
						<td>{{ $row->distretto}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	