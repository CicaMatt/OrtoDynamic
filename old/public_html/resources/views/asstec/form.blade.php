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

	{!! Form::open(array('url'=>'asstec?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Dati lavorazione in assistenza</legend>
									
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
									
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
								
										
										 <div class="col-md-2">
										 	
										 </div>
								</div>
						
<label for="assistenza_tecnica" class=" control-label col-md-4 text-left" text-align=left>Assistenza tecnica</label>
<div class="col-md-6">
                            <div class="input-group m-b" style="width:150px !important;">
					<?php $assistenza_tecnica = explode(',',$row['assistenza_tecnica']);
					$assistenza_tecnica_vet = array( 'NO' => 'NO' , 'SI' => 'SI'); ?>
					<select name='assistenza_tecnica' rows='5'   class='select2 '  > 
						<?php 
						foreach($assistenza_tecnica_vet as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['assistenza_tecnica'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
				</div> 
            
										 </div>  
										


<label for="ragione_reclamo" class=" control-label col-md-4 text-left"> Motivo richiesta di assistenza </label>
										<div class="col-md-6">
										  
					<?php $prova = explode(',',$row['ragione_reclamo']);
					$ragione_reclamo_opt = array( 'RINNOVO FORNITURA' => 'RINNOVO FORNITURA' , 'RIPARAZIONE' => 'RIPARAZIONE', 'MANUTENZIONE' => 'MANUTENZIONE' , 'MODIFICA' => 'MODIFICA'); ?>
					<select name='ragione_reclamo' rows='5'   class='select2 '  > 
						<?php 
						foreach($ragione_reclamo_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['ragione_reclamo'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
</div>


<label for="presidio" class=" control-label col-md-4 text-left"> Presidio </label>
										<div class="col-md-6">
										  
					<?php $prova = explode(',',$row['presidio']);
					$presidio_opt = array( 'INTERNO' => 'INTERNO' , 'ESTERNO' => 'ESTERNO'); ?>
					<select name='presidio' rows='5'   class='select2 '  > 
						<?php 
						foreach($presidio_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['presidio'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
</div>

<label for="garanzia" class=" control-label col-md-4 text-left"> Garanzia </label>
										<div class="col-md-6">
										  
					<?php $garanzia = explode(',',$row['garanzia']);
					$garanzia_opt = array( 'IN GARANZIA' => 'IN GARANZIA' , 'FUORI GARANZIA' => 'FUORI GARANZIA'); ?>
					<select name='garanzia' rows='5'   class='select2 '  > 
						<?php 
						foreach($garanzia_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['garanzia'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
</div>

		
<div class="form-group  " >
										<label for="descrizione_intervento" class=" control-label col-md-4 text-left"> Descrizione intervento </label>
										<div class="col-md-6">
										  <input  type='text' name='descrizione_intervento' id='descrizione_intervento' value='{{ $row['descrizione_intervento'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
<div class="col-md-2">
										 	
										 </div>
											<label for="data_consegna_assistenza" class=" control-label col-md-4 text-left"> Data consegna </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_consegna_assistenza', $row['data_consegna_assistenza'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
<div class="col-md-2">
										 	
										 </div>
<label for="annotazioni_tecniche_assistenza" class=" control-label col-md-4 text-left"> Annotazioni tecniche</label>
										<div class="col-md-6">
										  <input  type='text' name='annotazioni_tecniche_assistenza' id='annotazioni_tecniche_assistenza' value='{{ $row['annotazioni_tecniche_assistenza'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
<div class="col-md-2">
										 	
										 </div>
<label for="garanzia" class=" control-label col-md-4 text-left">   Esito collaudo </label>
										<div class="col-md-6">
										  
					<?php $garanzia = explode(',',$row['esito_collaudo_assistenza_tecnica']);
					$esito_collaudo_assistenza_tecnica_opt = array( 'POSITIVO' => 'POSITIVO' , 'NEGATIVO' => 'NEGATIVO'); ?>
					<select name='esito_collaudo_assistenza_tecnica' rows='5'   class='select2 '  > 
						<?php 
						foreach($esito_collaudo_assistenza_tecnica_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['esito_collaudo_assistenza_tecnica'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
</div>
<div class="col-md-2">
										 	
										 </div>
									<label for="data_esito_collaudo_assistenza" class=" control-label col-md-4 text-left"> Data esito collaudo </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_esito_collaudo_assistenza', $row['data_esito_collaudo_assistenza'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 


										 </div> 
<label for="firma_medico_assistenza" class=" control-label col-md-4 text-left">Firma Medico</label>
<div class="col-md-6">
                                    <div class="input-group m-b" style="width:150px !important;">
					<?php $firma_medico_assistenza = explode(',',$row['firma_medico_assistenza']);
					$firma_medico_assistenza_opt = array( 'VINCENZO PEPE' => 'VINCENZO PEPE' , 'MAURO DE ROSA' => 'MAURO DE ROSA' , 'LUCIANO FASOLINO' => 'LUCIANO FASOLINO' , 'GUIDO CALENDA' => 'GUIDO CALENDA' , 'ILARIO PEPE' => 'ILARIO PEPE' , 'NICOLO VIO' => 'NICOLO BOVIO' , 'ANGELA BOTTA' => 'ANGELA BOTTA' , 'ANTONIO VILLANI' => 'ANTONIO VILLANI' , 'VINCENZO ANGELLOTTI' => 'VINCENZO ANGELLOTTI' , 'ALKSANDRA LASKOWSKA' => 'ALKSANDRA LASKOWSKA' , 'IRENE LORETI' => 'IRENE LORETI' , 'FRANCESCO PERNA' => 'FRANCESCO PERNA' , 'ANTONIO MENDITTO' => 'ANTONIO MENDITTO' , 'ANTIMO VERDE' => 'ANTIMO VERDE' , 'PAOLA LANDI' => 'PAOLA LANDI' , 'MICHELE VERDE' => 'MICHELE VERDE' , 'FRANCO GRAZIANO' => 'FRANCO GRAZIANO' , 'MARINA DE LISA ' => 'MARINA DE LISA' , 'FRANCESCO MIRANDA' => 'FRANCESCO MIRANDA' , 'A. PATORE' => 'A. PATORE' , 'MAURIZIO SENATORE' => 'MAURIZIO SENATORE' , 'A. PASTORE' => 'A. PASTORE'); ?>
					<select name='firma_medico_assistenza' rows='5'   class='select2 '  > 
						<?php 
						foreach($firma_medico_assistenza_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['firma_medico_assistenza'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
				</div> 
										 </div> 
										 </div> 
									
						   <div class="col-md-2">
										 	
										 </div>



										 
									  </div>
										 <div class="col-md-2">
										 	
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
			var removeUrl = '{{ url("asstec/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop