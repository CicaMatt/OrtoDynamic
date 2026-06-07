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

	{!! Form::open(array('url'=>'nonconformita?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Non Conformità</legend>
									{!! Form::hidden('id', $row['id']) !!}
									  <div class="form-group  " >
										<label for="Id Preventivo" class=" control-label col-md-4 text-left"> Id Preventivo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='id_preventivo' rows='5' id='id_preventivo' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Difformita Rilevata" class=" control-label col-md-4 text-left"> Difformita Rilevata <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='difformita_rilevata' id='difformita_rilevata' value='{{ $row['difformita_rilevata'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tecnico" class=" control-label col-md-4 text-left"> Tecnico </label>
										<div class="col-md-6">
										  <input  type='text' name='tecnico' id='tecnico' value='{{ $row['tecnico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Note" class=" control-label col-md-4 text-left"> Note </label>
										<div class="col-md-6">
										  <textarea name='note' rows='5' id='note' class='form-control input-sm '  
				           >{{ $row['note'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Apertura Reclamo" class=" control-label col-md-4 text-left"> Data Apertura Reclamo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_apertura_reclamo', $row['data_apertura_reclamo'],array('class'=>'form-control input-sm')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Chiusura Reclamo" class=" control-label col-md-4 text-left"> Data Chiusura Reclamo </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_chiusura_reclamo', $row['data_chiusura_reclamo'],array('class'=>'form-control input-sm')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato Reclamo" class=" control-label col-md-4 text-left"> Stato Reclamo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
					<?php $stato_reclamo = explode(',',$row['stato_reclamo']);
					$stato_reclamo_opt = array( 'APERTO' => 'APERTO' ,  'CHIUSO' => 'CHIUSO' , ); ?>
					<select name='stato_reclamo' rows='5' required  class='select2 '  > 
						<?php 
						foreach($stato_reclamo_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['stato_reclamo'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
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
		
		
		
		$("#id_preventivo").jCombo("{!! url('nonconformita/comboselect?filter=preventivi:id:id_cliente') !!}",
		{  selected_value : '{{ $row["id_preventivo"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("nonconformita/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop