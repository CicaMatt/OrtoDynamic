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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Vita', (isset($fields['misura_vita']['language'])? $fields['misura_vita']['language'] : array())) }}</td>
						<td>{{ $row->misura_vita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Bacino', (isset($fields['misura_bacino']['language'])? $fields['misura_bacino']['language'] : array())) }}</td>
						<td>{{ $row->misura_bacino}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura 2-4', (isset($fields['misura_2_4']['language'])? $fields['misura_2_4']['language'] : array())) }}</td>
						<td>{{ $row->misura_2_4}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Fino Ascella', (isset($fields['fino_ascella']['language'])? $fields['fino_ascella']['language'] : array())) }}</td>
						<td>{{ $row->fino_ascella}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Spallacci', (isset($fields['spallacci']['language'])? $fields['spallacci']['language'] : array())) }}</td>
						<td>{{ $row->spallacci}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altezza Stoffa Anteriore', (isset($fields['alt_stoffa_ant']['language'])? $fields['alt_stoffa_ant']['language'] : array())) }}</td>
						<td>{{ $row->alt_stoffa_ant}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altezza Totale Armatura', (isset($fields['alt_tot_armatura']['language'])? $fields['alt_tot_armatura']['language'] : array())) }}</td>
						<td>{{ $row->alt_tot_armatura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Distanza Ascellare', (isset($fields['dist_ascellare']['language'])? $fields['dist_ascellare']['language'] : array())) }}</td>
						<td>{{ $row->dist_ascellare}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	