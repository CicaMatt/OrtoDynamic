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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Collo', (isset($fields['mis_collo']['language'])? $fields['mis_collo']['language'] : array())) }}</td>
						<td>{{ $row->mis_collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Omero', (isset($fields['mis_omero']['language'])? $fields['mis_omero']['language'] : array())) }}</td>
						<td>{{ $row->mis_omero}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Braccio', (isset($fields['mis_braccio']['language'])? $fields['mis_braccio']['language'] : array())) }}</td>
						<td>{{ $row->mis_braccio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Polso', (isset($fields['mis_polso']['language'])? $fields['mis_polso']['language'] : array())) }}</td>
						<td>{{ $row->mis_polso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Bacino', (isset($fields['mis_bacino']['language'])? $fields['mis_bacino']['language'] : array())) }}</td>
						<td>{{ $row->mis_bacino}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Coscia', (isset($fields['mis_coscia']['language'])? $fields['mis_coscia']['language'] : array())) }}</td>
						<td>{{ $row->mis_coscia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Gamba', (isset($fields['mis_gamba']['language'])? $fields['mis_gamba']['language'] : array())) }}</td>
						<td>{{ $row->mis_gamba}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altro', (isset($fields['altro']['language'])? $fields['altro']['language'] : array())) }}</td>
						<td>{{ $row->altro}} </td>
						
					</tr>
						
					<tr>
						<td width='30%' class='label-view text-right'></td>
						<td> <a href="javascript:history.go(-1)" class="btn btn-primary"> Back To Grid <a> </td>
						
					</tr>					
				
			</tbody>	
		</table>   

	 
	
	</div>
</div>	