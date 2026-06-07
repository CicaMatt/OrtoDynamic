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

	{!! Form::open(array('url'=>'lavorazioni?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
						<fieldset><legend> Lavorazioni</legend>
									   {!! Form::hidden('id', $row['id']) !!}
									  <div class="form-group  " >
										<label for="Preventivo" class=" control-label col-md-4 text-left"> Preventivo </label>
										<div class="col-md-6">
										  <select name='id_preventivo' rows='5' id='id_preventivo' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cliente" class=" control-label col-md-4 text-left"> Cliente </label>
										<div class="col-md-6" readonly>
										  <select name='id_cliente' rows='5' id='id_cliente'  class='select2 '  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  
					<?php $stato = explode(',',$row['stato']);
					$stato_opt = array( 'IN LAVORAZIONE' => 'IN LAVORAZIONE' , 'IN FINITURA' => 'IN FINITURA' , 'LAVORATO' => 'LAVORATO' ,  'LAVORATO PARZIALE' => 'LAVORATO PARZIALE' ,  'ANNULLATO' => 'ANNULLATO' ,  'DA CONSEGNARE' => 'DA CONSEGNARE' , 'PRONTO PRIMA PROVA' => 'PRONTO PRIMA PROVA' , 'PRONTO SECONDA PROVA' => 'PRONTO SECONDA PROVA' , 'PRONTO TERZA PROVA' => 'PRONTO TERZA PROVA' , 'IN REVISIONE DOPO CONSEGNA' => 'IN REVISIONE DOPO CONSEGNA' , 'INVIATE A LACO PER MODIFICA' => 'INVIATE A LACO PER MODIFICA'); ?>
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
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Inizio Lavorazione" class=" control-label col-md-4 text-left"> Data Inizio Lavorazione </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_creazione_lavorazione', $row['data_creazione_lavorazione'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data fine Lavorazione" class=" control-label col-md-4 text-left"> Data fine Lavorazione </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_fine_lavorazione', $row['data_fine_lavorazione'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
<label for="prova_cliente" class=" control-label col-md-4 text-left"> Prova sul cliente </label>
										<div class="col-md-6">
										  
					<?php $prova = explode(',',$row['prova_cliente']);
					$prova_opt = array( 'TECNICO' => 'TECNICO' , 'FUNZIONALE' => 'FUNZIONALE', 'ESTETICO' => 'ESTETICO'); ?>
					<select name='prova_cliente' rows='5'   class='select2 '  > 
						<?php 
						foreach($prova_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['prova_cliente'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
									

<label for="pos_ril" class=" control-label col-md-4 text-left">Positivo - Rilavorazione</label>
<div class="col-md-6">
                                    <div class="input-group m-b" style="width:150px !important;">
					<?php $posril = explode(',',$row['pos_ril']);
					$posril_opt = array( 'POSITIVO' => 'POSITIVO' , 'RILAVORAZIONE' => 'RILAVORAZIONE'); ?>
					<select name='pos_ril' rows='5'   class='select2 '  > 
						<?php 
						foreach($posril_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['pos_ril'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
				</div> 
            
										 </div> 



<label for="data_prova_cliente" class=" control-label col-md-4 text-left"> Data della prova su cliente </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_prova_cliente', $row['data_prova_cliente'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 

<label for="verifica_cliente" class=" control-label col-md-4 text-left">Verifica sul cliente per consegna </label>
										<div class="col-md-6">
										  
					<?php $prova = explode(',',$row['Verifica_cliente']);
					$prova_opt = array( 'TECNICO' => 'TECNICO' , 'FUNZIONALE' => 'FUNZIONALE', 'ESTETICO' => 'ESTETICO'); ?>
					<select name='Verifica_cliente' rows='5'   class='select2 '  > 
						<?php 
						foreach($prova_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['Verifica_cliente'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
									

<label for="verifica_pos_ril" class=" control-label col-md-4 text-left">Positivo - Rilavorazione</label>
<div class="col-md-6">
                                    <div class="input-group m-b" style="width:150px !important;">
					<?php $posril = explode(',',$row['verifica_pos_ril']);
					$posril_opt = array( 'POSITIVO' => 'POSITIVO' , 'RILAVORAZIONE' => 'RILAVORAZIONE'); ?>
					<select name='verifica_pos_ril' rows='5'   class='select2 '  > 
						<?php 
						foreach($posril_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['verifica_pos_ril'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
				</div> 
            
										 </div> 


<label for="data_verifica_cliente" class=" control-label col-md-4 text-left"> Data della verifica su cliente </label>
										<div class="col-md-6">
<div class="input-group m-b" style="width:150px !important;">
					{!! Form::date('data_verifica_cliente', $row['data_verifica_cliente'],array('class'=>'form-control input')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
















										 
										 
										 <label for="firma_medico" class=" control-label col-md-4 text-left">Firma Medico</label>
<div class="col-md-6">
                                    <div class="input-group m-b" style="width:150px !important;">
					<?php $firmamedico = explode(',',$row['firma_medico']);
					$firmamedico_opt = array( 'VINCENZO PEPE' => 'VINCENZO PEPE' , 'MAURO DE ROSA' => 'MAURO DE ROSA' , 'LUCIANO FASOLINO' => 'LUCIANO FASOLINO' , 'GUIDO CALENDA' => 'GUIDO CALENDA' , 'ILARIO PEPE' => 'ILARIO PEPE' , 'NICOLO VIO' => 'NICOLO BOVIO' , 'ANGELA BOTTA' => 'ANGELA BOTTA' , 'ANTONIO VILLANI' => 'ANTONIO VILLANI' , 'VINCENZO ANGELLOTTI' => 'VINCENZO ANGELLOTTI' , 'ALKSANDRA LASKOWSKA' => 'ALKSANDRA LASKOWSKA' , 'IRENE LORETI' => 'IRENE LORETI' , 'FRANCESCO PERNA' => 'FRANCESCO PERNA' , 'ANTONIO MENDITTO' => 'ANTONIO MENDITTO' , 'ANTIMO VERDE' => 'ANTIMO VERDE' , 'PAOLA LANDI' => 'PAOLA LANDI' , 'MICHELE VERDE' => 'MICHELE VERDE' , 'FRANCO GRAZIANO' => 'FRANCO GRAZIANO' , 'MARINA DE LISA ' => 'MARINA DE LISA' , 'FRANCESCO MIRANDA' => 'FRANCESCO MIRANDA' , 'A. PATORE' => 'A. PATORE' , 'MAURIZIO SENATORE' => 'MAURIZIO SENATORE' , 'A. PASTORE' => 'A. PASTORE'); ?>
					<select name='firma_medico' rows='5'   class='select2 '  > 
						<?php 
						foreach($firmamedico_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['firma_medico'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
				</div> 
            
										 </div> 


<label for="assistenza_tecnica" class=" control-label col-md-4 text-left">Assistenza tecnica</label>
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






										 <div class="col-md-2">
										 	
										 </div>
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



									  </div> 					
									  </fieldset>
			</div>
									  </div> 				






 </div>

										  
				

			
			
	@if($accesschild['is_add'] == '1' && $accesschild['is_edit'] == '1' )
	<hr />
	<div class="clr clear"></div>
	
	<h5> Prodotti Lavorazioni </h5>
	
	<div class="table-responsive">
    <table class="table table-striped ">
        <thead>
			<tr>
				@foreach ($subform['tableGrid'] as $t)
					@if($t['view'] =='1' && $t['field'] !='id' && $t['field'] != $relation_key)
						<th>{{ $t['label'] }}</th>
					@endif
				@endforeach
				<th></th>	
			  </tr>

        </thead>

        <tbody>
        @if(count($subform['rowData'])>=1)
            @foreach ($subform['rowData'] as $rows)
            <tr class="clone clonedInput">
									
			 @foreach ($subform['tableGrid'] as $field)
				 @if($field['view'] =='1' && $field['field'] !='id' && $field['field'] != $relation_key)
				 <td>					 
				 	{!! SiteHelpers::bulkForm($field['field'] , $subform['tableForm'] , $rows->{$field['field']}) !!}							 
				 </td>
				 @endif					 
			 
			 @endforeach
			 <td>
			 	
			 	<input type="hidden" name="counter[]">
			 	<input type="hidden" name="bulk_{{ $relation_key}}[]" value="{{  $rows->{$relation_key} }}" >
			 </td>
			@endforeach
			</tr> 

		@else
            <tr class="clone clonedInput">
									
			 @foreach ($subform['tableGrid'] as $field)

				 @if($field['view'] =='1' && $field['field'] !='id' && $field['field'] != $relation_key)
				 <td>					 
				 	{!! SiteHelpers::bulkForm($field['field'] , $subform['tableForm'] ) !!}							 
				 </td>
				 @endif					 
			 
			 @endforeach
			 <td>
			 	<a onclick=" $(this).parents('.clonedInput').remove(); return false" href="#" class="remove btn btn-xs btn-danger">-</a>
			 	<input type="hidden" name="counter[]">
			 	<input type="hidden" name="bulk_{{ $relation_key}}[]" value="" >
			 </td>
			
			</tr> 

		
		@endif	


        </tbody>	

     </table>  
     <input type="hidden" name="enable-masterdetail" value="true">
     </div>
	<br /><br />
     
    
     <hr />
	@endif
    
		</div>
	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		
	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		$('.addC').relCopy({});
		
		$("#id_preventivo").jCombo("{!! url('lavorazioni/comboselect?filter=preventivi:id:id|diagnosi_circostanziata|programma_terapeutico') !!}",
		{  selected_value : '{{ $row["id_preventivo"] }}' });
		
		$("#id_cliente").jCombo("{!! url('lavorazioni/comboselect?filter=clienti:id:cognome|nome|data_nascita') !!}",
		{  selected_value : '{{ $row["id_cliente"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("lavorazioni/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});
		//$(':input').attr('readonly','readonly');
		$('input[name="bulk_quantita[]"]').attr('readonly', true);
		$('input[name="bulk_descrizione_nomenclatore[]"]').attr('readonly', true);
		$('input[name="bulk_codice_nomenclatore[]"]').attr('readonly', true);
		$('input[name="bulk_importo[]"]').attr('readonly', true);
		$('#id_cliente').prop('disabled',true);
		$('#id_preventivo').prop('disabled',true);
    	$('form:eq(0)').submit(function( event ) {
            $("#id_preventivo").prop( "disabled", false );
            $('#id_cliente').prop('disabled',false);
        });     
		
	});
	</script>		 
@stop