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

	{!! Form::open(array('url'=>'prodottipreventivi?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> prodottipreventivi</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Codice Nomenclatore" class=" control-label col-md-4 text-left"> Codice Nomenclatore <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='codice_nomenclatore' rows='5' id='codice_nomenclatore' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Quantita" class=" control-label col-md-4 text-left"> Quantita <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='quantita' id='quantita' value='{{ $row['quantita'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prezzo" class=" control-label col-md-4 text-left" > Prezzo </label>
										<div class="col-md-6">
										  <input  type='text' name='bulk_prezzo[]' id='bulk_prezzo[]' value='{{ $row['prezzo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Sconto" class=" control-label col-md-4 text-left"> ScontoSOS </label>
										<div class="col-md-6">
										  <input  type='text' name='sconto' id='sconto' value='{{ $row['sconto'] }}' 
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
										  
					<?php $stato = explode(',',$row['stato']);
					$stato_opt = array( 'OK' => 'OK' , ); ?>
					<select name='stato' rows='5'   class='select2 '  > 
						<?php 
						foreach($stato_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['stato'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			

		</div>

<div name = 'prezzo' id='{{ $row['prezzo'] }}'>
</div>

	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		
	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		
		
		$("#codice_nomenclatore").jCombo("{!! url('prodottipreventivi/comboselect?filter=nomenclatore:id:codice|descrizione|prezzo') !!}",
		{  selected_value : '{{ $row["codice_nomenclatore"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("prodottipreventivi/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop