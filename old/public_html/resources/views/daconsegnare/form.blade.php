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

	{!! Form::open(array('url'=>'daconsegnare?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Lavorazioni da consegnare</legend>
									
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
										<label for="Id Preventivo" class=" control-label col-md-4 text-left"> Id Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='id_preventivo' id='id_preventivo' value='{{ $row['id_preventivo'] }}' 
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
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  <input  type='text' name='stato' id='stato' value='{{ $row['stato'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Creazione Lavorazione" class=" control-label col-md-4 text-left"> Data Creazione Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_creazione_lavorazione' id='data_creazione_lavorazione' value='{{ $row['data_creazione_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Annullamento" class=" control-label col-md-4 text-left"> Data Annullamento </label>
										<div class="col-md-6">
										  <input  type='text' name='data_annullamento' id='data_annullamento' value='{{ $row['data_annullamento'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Fine Lavorazione" class=" control-label col-md-4 text-left"> Data Fine Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_fine_lavorazione' id='data_fine_lavorazione' value='{{ $row['data_fine_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Consegna" class=" control-label col-md-4 text-left"> Data Consegna </label>
										<div class="col-md-6">
										  <input  type='text' name='data_consegna' id='data_consegna' value='{{ $row['data_consegna'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prova Cliente" class=" control-label col-md-4 text-left"> Prova Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='prova_cliente' id='prova_cliente' value='{{ $row['prova_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pos Ril" class=" control-label col-md-4 text-left"> Pos Ril </label>
										<div class="col-md-6">
										  <input  type='text' name='pos_ril' id='pos_ril' value='{{ $row['pos_ril'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Firma Medico" class=" control-label col-md-4 text-left"> Firma Medico </label>
										<div class="col-md-6">
										  <input  type='text' name='firma_medico' id='firma_medico' value='{{ $row['firma_medico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Verifica Cliente" class=" control-label col-md-4 text-left"> Verifica Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='Verifica_cliente' id='Verifica_cliente' value='{{ $row['Verifica_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Verifica Pos Ril" class=" control-label col-md-4 text-left"> Verifica Pos Ril </label>
										<div class="col-md-6">
										  <input  type='text' name='verifica_pos_ril' id='verifica_pos_ril' value='{{ $row['verifica_pos_ril'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Prova Cliente" class=" control-label col-md-4 text-left"> Data Prova Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='data_prova_cliente' id='data_prova_cliente' value='{{ $row['data_prova_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Verifica Cliente" class=" control-label col-md-4 text-left"> Data Verifica Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='data_verifica_cliente' id='data_verifica_cliente' value='{{ $row['data_verifica_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato Lavorazione Assistenza" class=" control-label col-md-4 text-left"> Stato Lavorazione Assistenza </label>
										<div class="col-md-6">
										  <input  type='text' name='stato_lavorazione_assistenza' id='stato_lavorazione_assistenza' value='{{ $row['stato_lavorazione_assistenza'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Assistenza Tecnica" class=" control-label col-md-4 text-left"> Assistenza Tecnica </label>
										<div class="col-md-6">
										  <input  type='text' name='assistenza_tecnica' id='assistenza_tecnica' value='{{ $row['assistenza_tecnica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Ragione Reclamo" class=" control-label col-md-4 text-left"> Ragione Reclamo </label>
										<div class="col-md-6">
										  <input  type='text' name='ragione_reclamo' id='ragione_reclamo' value='{{ $row['ragione_reclamo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Presidio" class=" control-label col-md-4 text-left"> Presidio </label>
										<div class="col-md-6">
										  <input  type='text' name='presidio' id='presidio' value='{{ $row['presidio'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Garanzia" class=" control-label col-md-4 text-left"> Garanzia </label>
										<div class="col-md-6">
										  <input  type='text' name='garanzia' id='garanzia' value='{{ $row['garanzia'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Descrizione Intervento" class=" control-label col-md-4 text-left"> Descrizione Intervento </label>
										<div class="col-md-6">
										  <textarea name='descrizione_intervento' rows='5' id='descrizione_intervento' class='form-control input-sm '  
				           >{{ $row['descrizione_intervento'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Consegna Assistenza" class=" control-label col-md-4 text-left"> Data Consegna Assistenza </label>
										<div class="col-md-6">
										  <input  type='text' name='data_consegna_assistenza' id='data_consegna_assistenza' value='{{ $row['data_consegna_assistenza'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Annotazioni Tecniche Assistenza" class=" control-label col-md-4 text-left"> Annotazioni Tecniche Assistenza </label>
										<div class="col-md-6">
										  <textarea name='annotazioni_tecniche_assistenza' rows='5' id='annotazioni_tecniche_assistenza' class='form-control input-sm '  
				           >{{ $row['annotazioni_tecniche_assistenza'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Esito Collaudo Assistenza Tecnica" class=" control-label col-md-4 text-left"> Esito Collaudo Assistenza Tecnica </label>
										<div class="col-md-6">
										  <input  type='text' name='esito_collaudo_assistenza_tecnica' id='esito_collaudo_assistenza_tecnica' value='{{ $row['esito_collaudo_assistenza_tecnica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Esito Collaudo Assistenza" class=" control-label col-md-4 text-left"> Data Esito Collaudo Assistenza </label>
										<div class="col-md-6">
										  <input  type='text' name='data_esito_collaudo_assistenza' id='data_esito_collaudo_assistenza' value='{{ $row['data_esito_collaudo_assistenza'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Firma Medico Assistenza" class=" control-label col-md-4 text-left"> Firma Medico Assistenza </label>
										<div class="col-md-6">
										  <input  type='text' name='firma_medico_assistenza' id='firma_medico_assistenza' value='{{ $row['firma_medico_assistenza'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Firma Tecnico" class=" control-label col-md-4 text-left"> Firma Tecnico </label>
										<div class="col-md-6">
										  <input  type='text' name='firma_tecnico' id='firma_tecnico' value='{{ $row['firma_tecnico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Massima Scadenza" class=" control-label col-md-4 text-left"> Massima Scadenza </label>
										<div class="col-md-6">
										  <input  type='text' name='massima_scadenza' id='massima_scadenza' value='{{ $row['massima_scadenza'] }}' 
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
			var removeUrl = '{{ url("daconsegnare/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop