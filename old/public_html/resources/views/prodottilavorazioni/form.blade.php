@extends('layouts.app')

@section('content')
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li><a href="{{ url($pageModule) }}"> {{ $pageTitle }} </a></li>
		<li class="active"> Form  </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

	{!! Form::open(array('url'=>'prodottilavorazioni?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
	<div class="sbox">
		<div class="sbox-title clearfix">
			<div class="sbox-tools " >
				<a href="{{ url($pageModule.'?return='.$return) }}" class="tips btn btn-sm "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-times"></i></a> 
			</div>
			<div class="sbox-tools pull-left" >
				<button name="apply" class="tips btn btn-sm btn-apply  "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-check"></i> {{ __('core.sb_apply') }} </button>
				<button name="save" class="tips btn btn-sm btn-save"  title="{{ __('core.btn_back') }}" ><i class="fa  fa-paste"></i> {{ __('core.sb_save') }} </button> 
			</div>
		</div>	
		<div class="sbox-content clearfix">
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		
<div class="col-md-12">
						<fieldset><legend> Prodotti Lavorazioni</legend>
									
									  <div class="form-group  " >
										<label for="Id" class=" control-label col-md-4 text-left"> Id </label>
										<div class="col-md-6">
										  <input  type='text' name='id' id='id' value='{{ $row['id'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Nomenclatore" class=" control-label col-md-4 text-left"> Codice Nomenclatore </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_nomenclatore' id='codice_nomenclatore' value='{{ $row['codice_nomenclatore'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Descrizione Nomenclatore" class=" control-label col-md-4 text-left"> Descrizione Nomenclatore </label>
										<div class="col-md-6">
										  <input  type='text' name='descrizione_nomenclatore' id='descrizione_nomenclatore' value='{{ $row['descrizione_nomenclatore'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Quantita" class=" control-label col-md-4 text-left"> Quantita </label>
										<div class="col-md-6">
										  <input  type='text' name='quantita' id='quantita' value='{{ $row['quantita'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Importo" class=" control-label col-md-4 text-left"> Importo </label>
										<div class="col-md-6">
										  <input  type='text' name='importo' id='importo' value='{{ $row['importo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  <select name='stato' rows='5' id='stato' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
									  
									   <div class="form-group  " >
										<label for="Produzione" class=" control-label col-md-4 text-left"> Produzione </label>
										<div class="col-md-6">
										  					<?php $prod = explode(',',$row['produzione']);
					$produzione_opt = array('INTERNA'=>'INTERNA','ESTERNA'=>'ESTERNA'); ?>
					<select name='produzione' rows='5'   class='select2 '  > 
						<?php 
						foreach($produzione_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['produzione'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
									  
									  <div class="form-group  " >
										<label for="Data Creazione Lavorazione" class=" control-label col-md-4 text-left"> Data Creazione Lavorazione </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_creazione_lavorazione', $row['data_creazione_lavorazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Annullamento" class=" control-label col-md-4 text-left"> Data Annullamento </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
                              
    <input type="date" name="data_annullamento" 
        placeholder="dd-mm-yyyy" value=""
        min="1997-01-01" max="2130-12-31">
			            
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Ordine" class=" control-label col-md-4 text-left"> Data Ordine </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_ordine', $row['data_ordine'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Consegna Parziale" class=" control-label col-md-4 text-left"> Data Consegna Parziale </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_consegna_parziale', $row['data_consegna_parziale'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 		


  <div class="form-group  " >
										<label for="fornitore" class=" control-label col-md-4 text-left"> Fornitore </label>
										<div class="col-md-6">
										  <input  type='text' name='fornitore' id='codice_nomenclatore' value='{{ $row['fornitore'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 	


 <div class="form-group  " >
										<label for="materiale" class=" control-label col-md-4 text-left"> Materiale </label>
										<div class="col-md-6">
										  <input  type='text' name='materiale' id='codice_nomenclatore' value='{{ $row['materiale'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 	




 <div class="form-group  " >
										<label for="DDT" class=" control-label col-md-4 text-left"> DDT </label>
										<div class="col-md-6">
										  <input  type='text' name='DDT' id='DDT' value='{{ $row['DDT'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 	
			

 <div class="form-group  " >
										<label for="lotto" class=" control-label col-md-4 text-left"> Lotto </label>
										<div class="col-md-6">
										  <input  type='text' name='lotto' id='codice_nomenclatore' value='{{ $row['lotto'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 	



									  <div class="form-group  " >
										<label for="Data Consegna" class=" control-label col-md-4 text-left"> Data Consegna </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_consegna', $row['data_consegna'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			

		</div>
	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		
	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		
		
		$("#stato").jCombo("{!! url('prodottilavorazioni/comboselect?filter=stato_lavorazioni:id:') !!}",
		{  selected_value : '{{ $row["stato"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("prodottilavorazioni/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop