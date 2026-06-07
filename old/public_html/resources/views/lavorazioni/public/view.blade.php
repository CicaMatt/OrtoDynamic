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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Lavorazione', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_cliente,'id_cliente','1:clienti:id:cognome|nome|data_nascita') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Preventivo', (isset($fields['id_preventivo']['language'])? $fields['id_preventivo']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_preventivo,'id_preventivo','1:preventivi:id:id|diagnosi_circostanziata|programma_terapeutico') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Lavorazione', (isset($fields['data_creazione_lavorazione']['language'])? $fields['data_creazione_lavorazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione_lavorazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Fine', (isset($fields['data_fine_lavorazione']['language'])? $fields['data_fine_lavorazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_fine_lavorazione)) }} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	