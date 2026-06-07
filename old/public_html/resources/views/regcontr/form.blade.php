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

	{!! Form::open(array('url'=>'regcontr?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Registro Controlli</legend>
									
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
										<label for="Id Lavorazione" class=" control-label col-md-4 text-left"> Id Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='id_lavorazione' id='id_lavorazione' value='{{ $row['id_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Intervento" class=" control-label col-md-4 text-left"> Data Intervento </label>
										<div class="col-md-6">
										  
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_intervento', $row['data_intervento'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 

										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Intervento" class=" control-label col-md-4 text-left"> Intervento </label>
										<div class="col-md-6">
										  <textarea name='intervento' rows='5' id='intervento' class='form-control input-sm '  
				           >{{ $row['intervento'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										
		<label for="firma_tecnico" class=" control-label col-md-4 text-left">FIRMA TECNICO</label>
<div class="col-md-6">
                                    <div class="input-group m-b" style="width:150px !important;">
					<?php $firma_tecnico = explode(',',$row['firma_tecnico']);
					$firma_tecnico_vet = array( 'GAETANO D AURIA' => 'GAETANO D AURIA' , 'FRANCESCO PEPE' => 'FRANCESCO PEPE' , 'GRAZIA GRECO' => 'GRAZIA GRECO' , 'VERONICA D AURIA ' => 'VERONICA D AURIA '); ?>
					<select name='firma_tecnico' rows='5'   class='select2 '  > 
						<?php 
						foreach($firma_tecnico_vet as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['firma_tecnico'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
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
		
		
		
		$("#firma_medico").jCombo("{!! url('regcontr/comboselect?filter=medici:id:nome|cognome') !!}",
		{  selected_value : '{{ $row["firma_medico"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("regcontr/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop