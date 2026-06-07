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
						<td>{{ $row->id_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ $row->id_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione Lavorazione', (isset($fields['data_creazione_lavorazione']['language'])? $fields['data_creazione_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->data_creazione_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Annullamento', (isset($fields['data_annullamento']['language'])? $fields['data_annullamento']['language'] : array())) }}</td>
						<td>{{ $row->data_annullamento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Fine Lavorazione', (isset($fields['data_fine_lavorazione']['language'])? $fields['data_fine_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->data_fine_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Consegna', (isset($fields['data_consegna']['language'])? $fields['data_consegna']['language'] : array())) }}</td>
						<td>{{ $row->data_consegna}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prova Cliente', (isset($fields['prova_cliente']['language'])? $fields['prova_cliente']['language'] : array())) }}</td>
						<td>{{ $row->prova_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pos Ril', (isset($fields['pos_ril']['language'])? $fields['pos_ril']['language'] : array())) }}</td>
						<td>{{ $row->pos_ril}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Firma Medico', (isset($fields['firma_medico']['language'])? $fields['firma_medico']['language'] : array())) }}</td>
						<td>{{ $row->firma_medico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Verifica Cliente', (isset($fields['Verifica_cliente']['language'])? $fields['Verifica_cliente']['language'] : array())) }}</td>
						<td>{{ $row->Verifica_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Verifica Pos Ril', (isset($fields['verifica_pos_ril']['language'])? $fields['verifica_pos_ril']['language'] : array())) }}</td>
						<td>{{ $row->verifica_pos_ril}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Prova Cliente', (isset($fields['data_prova_cliente']['language'])? $fields['data_prova_cliente']['language'] : array())) }}</td>
						<td>{{ $row->data_prova_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Verifica Cliente', (isset($fields['data_verifica_cliente']['language'])? $fields['data_verifica_cliente']['language'] : array())) }}</td>
						<td>{{ $row->data_verifica_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Lavorazione Assistenza', (isset($fields['stato_lavorazione_assistenza']['language'])? $fields['stato_lavorazione_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->stato_lavorazione_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Assistenza Tecnica', (isset($fields['assistenza_tecnica']['language'])? $fields['assistenza_tecnica']['language'] : array())) }}</td>
						<td>{{ $row->assistenza_tecnica}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	