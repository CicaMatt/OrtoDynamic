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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prodotto', (isset($fields['codice_nomenclatore']['language'])? $fields['codice_nomenclatore']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->codice_nomenclatore,'codice_nomenclatore','1:nomenclatore:id:codice|descrizione|prezzo') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Quantita', (isset($fields['quantita']['language'])? $fields['quantita']['language'] : array())) }}</td>
						<td>{{ $row->quantita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prezzo', (isset($fields['prezzo']['language'])? $fields['prezzo']['language'] : array())) }}</td>
						<td>{{ $row->prezzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Sconto', (isset($fields['sconto']['language'])? $fields['sconto']['language'] : array())) }}</td>
						<td>{{ $row->sconto}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Importo', (isset($fields['importo']['language'])? $fields['importo']['language'] : array())) }}</td>
						<td>{{ $row->importo}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	