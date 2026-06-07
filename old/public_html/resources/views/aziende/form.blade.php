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

	{!! Form::open(array('url'=>'aziende?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
<div class="col-md-6">
						<fieldset><legend> aziende</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Anno" class=" control-label col-md-4 text-left"> Anno </label>
										<div class="col-md-6">
										  <input  type='text' name='anno' id='anno' value='{{ $row['anno'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Regione" class=" control-label col-md-4 text-left"> Codice Regione </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_regione' id='codice_regione' value='{{ $row['codice_regione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Denominazione Regione" class=" control-label col-md-4 text-left"> Denominazione Regione </label>
										<div class="col-md-6">
										  <input  type='text' name='denominazione_regione' id='denominazione_regione' value='{{ $row['denominazione_regione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Azienda" class=" control-label col-md-4 text-left"> Codice Azienda </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_azienda' id='codice_azienda' value='{{ $row['codice_azienda'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Denominazione Azienda" class=" control-label col-md-4 text-left"> Denominazione Azienda </label>
										<div class="col-md-6">
										  <input  type='text' name='denominazione_azienda' id='denominazione_azienda' value='{{ $row['denominazione_azienda'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			<div class="col-md-6">
						<fieldset><legend> </legend>
									
									  <div class="form-group  " >
										<label for="Codice Comune" class=" control-label col-md-4 text-left"> Codice Comune </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_comune' id='codice_comune' value='{{ $row['codice_comune'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Comune" class=" control-label col-md-4 text-left"> Comune </label>
										<div class="col-md-6">
										  <input  type='text' name='comune' id='comune' value='{{ $row['comune'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Distretto" class=" control-label col-md-4 text-left"> Distretto </label>
										<div class="col-md-6">
										  <input  type='text' name='distretto' id='distretto' value='{{ $row['distretto'] }}' 
						     class='form-control input-sm ' /> 
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
		
		
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("aziende/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop