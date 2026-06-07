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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Collo', (isset($fields['collo']['language'])? $fields['collo']['language'] : array())) }}</td>
						<td>{{ $row->collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pianta', (isset($fields['pianta']['language'])? $fields['pianta']['language'] : array())) }}</td>
						<td>{{ $row->pianta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Scarpa', (isset($fields['misura_scarpa']['language'])? $fields['misura_scarpa']['language'] : array())) }}</td>
						<td>{{ $row->misura_scarpa}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Speronatura', (isset($fields['speronatura']['language'])? $fields['speronatura']['language'] : array())) }}</td>
						<td>{{ $row->speronatura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Rialzo', (isset($fields['rialzo']['language'])? $fields['rialzo']['language'] : array())) }}</td>
						<td>{{ $row->rialzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Piano Incl Tot', (isset($fields['piano_incl_tot']['language'])? $fields['piano_incl_tot']['language'] : array())) }}</td>
						<td>{{ $row->piano_incl_tot}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tipo Plantare', (isset($fields['tipo_plantare']['language'])? $fields['tipo_plantare']['language'] : array())) }}</td>
						<td>{{ $row->tipo_plantare}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Modello Scarpa', (isset($fields['modello_scarpa']['language'])? $fields['modello_scarpa']['language'] : array())) }}</td>
						<td>{{ $row->modello_scarpa}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Caviglia', (isset($fields['caviglia']['language'])? $fields['caviglia']['language'] : array())) }}</td>
						<td>{{ $row->caviglia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Passaggio Collo', (isset($fields['passaggio_collo']['language'])? $fields['passaggio_collo']['language'] : array())) }}</td>
						<td>{{ $row->passaggio_collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Passaggio Caviglie', (isset($fields['passaggio_caviglie']['language'])? $fields['passaggio_caviglie']['language'] : array())) }}</td>
						<td>{{ $row->passaggio_caviglie}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	