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

	{!! Form::open(array('url'=>'prevlav?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Preventivi in lavorazione</legend>
									
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
										<label for="Id Cliente" class=" control-label col-md-4 text-left"> Id Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='id_cliente' id='id_cliente' value='{{ $row['id_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Creazione" class=" control-label col-md-4 text-left"> Data Creazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_creazione' id='data_creazione' value='{{ $row['data_creazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Diagnosi Circostanziata" class=" control-label col-md-4 text-left"> Diagnosi Circostanziata </label>
										<div class="col-md-6">
										  <input  type='text' name='diagnosi_circostanziata' id='diagnosi_circostanziata' value='{{ $row['diagnosi_circostanziata'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Programma Terapeutico" class=" control-label col-md-4 text-left"> Programma Terapeutico </label>
										<div class="col-md-6">
										  <input  type='text' name='programma_terapeutico' id='programma_terapeutico' value='{{ $row['programma_terapeutico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prescizione Dettagliata Protesi" class=" control-label col-md-4 text-left"> Prescizione Dettagliata Protesi </label>
										<div class="col-md-6">
										  <input  type='text' name='prescizione_dettagliata_protesi' id='prescizione_dettagliata_protesi' value='{{ $row['prescizione_dettagliata_protesi'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Preventivo" class=" control-label col-md-4 text-left"> Data Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='data_preventivo' id='data_preventivo' value='{{ $row['data_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Preventivo" class=" control-label col-md-4 text-left"> Numero Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='numero_preventivo' id='numero_preventivo' value='{{ $row['numero_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tipologia Preventivo" class=" control-label col-md-4 text-left"> Tipologia Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='tipologia_preventivo' id='tipologia_preventivo' value='{{ $row['tipologia_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  <input  type='text' name='stato' id='stato' value='{{ $row['stato'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Accettazione" class=" control-label col-md-4 text-left"> Data Accettazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_accettazione' id='data_accettazione' value='{{ $row['data_accettazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Autorizzazione" class=" control-label col-md-4 text-left"> Numero Autorizzazione </label>
										<div class="col-md-6">
										  <input  type='text' name='numero_autorizzazione' id='numero_autorizzazione' value='{{ $row['numero_autorizzazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Id Medico" class=" control-label col-md-4 text-left"> Id Medico </label>
										<div class="col-md-6">
										  <input  type='text' name='id_medico' id='id_medico' value='{{ $row['id_medico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Ricezione Autorizzazione" class=" control-label col-md-4 text-left"> Data Ricezione Autorizzazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_ricezione_autorizzazione' id='data_ricezione_autorizzazione' value='{{ $row['data_ricezione_autorizzazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Note" class=" control-label col-md-4 text-left"> Note </label>
										<div class="col-md-6">
										  <input  type='text' name='note' id='note' value='{{ $row['note'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misure Ok" class=" control-label col-md-4 text-left"> Misure Ok </label>
										<div class="col-md-6">
										  <input  type='text' name='misure_ok' id='misure_ok' value='{{ $row['misure_ok'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Provvigioni Pagate" class=" control-label col-md-4 text-left"> Provvigioni Pagate </label>
										<div class="col-md-6">
										  <input  type='text' name='provvigioni_pagate' id='provvigioni_pagate' value='{{ $row['provvigioni_pagate'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Totale" class=" control-label col-md-4 text-left"> Totale </label>
										<div class="col-md-6">
										  <input  type='text' name='totale' id='totale' value='{{ $row['totale'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Preventivo" class=" control-label col-md-4 text-left"> Preventivo </label>
										<div class="col-md-6">
										  <input  type='file' name='Preventivo' id='Preventivo' value='{{ $row['Preventivo'] }}' 
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
			var removeUrl = '{{ url("prevlav/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop