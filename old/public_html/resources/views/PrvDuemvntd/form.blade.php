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

	{!! Form::open(array('url'=>'PrvDuemvntd?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
<ul class="nav nav-tabs"><li class="active"><a href="#preventivi" data-toggle="tab">preventivi</a></li>
				</ul><div class="tab-content"><div class="tab-pane m-t active" id="preventivi"> 
									
									  <div class="form-group  " >
										<label for="Numero Preventivo" class=" control-label col-md-4 text-left"> Numero Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='id' id='id' value='{{ $row['id'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tipologia" class=" control-label col-md-4 text-left"> Tipologia </label>
										<div class="col-md-6">
										  
					<?php $tipologia_preventivo = explode(',',$row['tipologia_preventivo']);
					$tipologia_preventivo_opt = array( 'Asl' => 'Asl' ,  'Privato' => 'Privato' ,  'Inail' => 'Inail' , ); ?>
					<select name='tipologia_preventivo' rows='5'   class='select2 '  > 
						<?php 
						foreach($tipologia_preventivo_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['tipologia_preventivo'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cliente" class=" control-label col-md-4 text-left"> Cliente <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='id_cliente' rows='5' id='id_cliente' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Diagnosi Circostanziata" class=" control-label col-md-4 text-left"> Diagnosi Circostanziata </label>
										<div class="col-md-6">
										  <input  type='text' name='diagnosi_circostanziata' id='diagnosi_circostanziata' value='{{ $row['diagnosi_circostanziata'] }}' 
						  input type=text   class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Programma Terapeutico" class=" control-label col-md-4 text-left"> Programma Terapeutico </label>
										<div class="col-md-6">
										  <textarea name='programma_terapeutico' rows='5' id='programma_terapeutico' class='form-control input-sm '  
				           >{{ $row['programma_terapeutico'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prescizione Dettagliata Protesi" class=" control-label col-md-4 text-left"> Prescizione Dettagliata Protesi </label>
										<div class="col-md-6">
										  <textarea name='prescizione_dettagliata_protesi' rows='5' id='prescizione_dettagliata_protesi' class='form-control input-sm '  
				           >{{ $row['prescizione_dettagliata_protesi'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Prescrizione" class=" control-label col-md-4 text-left"> Data Prescrizione <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_creazione', $row['data_creazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Preventivo" class=" control-label col-md-4 text-left"> Data Preventivo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_preventivo', $row['data_preventivo'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Autorizzazione Protocollo ASL" class=" control-label col-md-4 text-left"> Numero Autorizzazione Protocollo ASL </label>
										<div class="col-md-6">
										  <input  type='text' name='numero_autorizzazione' id='numero_autorizzazione' value='{{ $row['numero_autorizzazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Accettazione Protocollo ASL" class=" control-label col-md-4 text-left"> Data Accettazione Protocollo ASL </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_accettazione', $row['data_accettazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
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
										<label for="Id Medico" class=" control-label col-md-4 text-left"> Id Medico </label>
										<div class="col-md-6">
										  <select name='id_medico' rows='5' id='id_medico' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Ricezione Autorizzazione" class=" control-label col-md-4 text-left"> Data Ricezione Autorizzazione </label>
										<div class="col-md-6">
										  <textarea name='data_ricezione_autorizzazione' rows='5' id='data_ricezione_autorizzazione' class='form-control input-sm '  
				           >{{ $row['data_ricezione_autorizzazione'] }}</textarea> 
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
										  
					
					<input type='radio' name='misure_ok' value ='Si'  @if($row['misure_ok'] == 'Si') checked="checked" @endif class='minimal-red' > Si 
					
					<input type='radio' name='misure_ok' value ='No'  @if($row['misure_ok'] == 'No') checked="checked" @endif class='minimal-red' > No  
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Provvigioni Pagate" class=" control-label col-md-4 text-left"> Provvigioni Pagate </label>
										<div class="col-md-6">
										  
					
					<input type='radio' name='provvigioni_pagate' value ='Si'  @if($row['provvigioni_pagate'] == 'Si') checked="checked" @endif class='minimal-red' > Si 
					
					<input type='radio' name='provvigioni_pagate' value ='No'  @if($row['provvigioni_pagate'] == 'No') checked="checked" @endif class='minimal-red' > No  
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Totale" class=" control-label col-md-4 text-left"> Totale </label>
										<div class="col-md-6">
										  <textarea name='totale' rows='5' id='totale' class='form-control input-sm '  
				           >{{ $row['totale'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Preventivo" class=" control-label col-md-4 text-left"> Preventivo </label>
										<div class="col-md-6">
										  <input  type='file' name='Preventivo' id='Preventivo' class='inputfile  @if($row['Preventivo'] =='') class='required' @endif '  />

							<label for='Preventivo'><i class='fa fa-upload'></i> Choose a file</label>
							<div class='Preventivo_preview'></div>
					 	<div >
						{!! SiteHelpers::showUploadedFile($row['Preventivo'],'/uploads/scansioni/') !!}
						
						</div>					
					 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Ordine" class=" control-label col-md-4 text-left"> Numero Ordine </label>
										<div class="col-md-6">
										  <textarea name='numero_ordine' rows='5' id='numero_ordine' class='form-control input-sm '  
				           >{{ $row['numero_ordine'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Modello" class=" control-label col-md-4 text-left"> Modello </label>
										<div class="col-md-6">
										  <textarea name='modello' rows='5' id='modello' class='form-control input-sm '  
				           >{{ $row['modello'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misure" class=" control-label col-md-4 text-left"> Misure </label>
										<div class="col-md-6">
										  <textarea name='misure' rows='5' id='misure' class='form-control input-sm '  
				           >{{ $row['misure'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Giorni Scadenza" class=" control-label col-md-4 text-left"> Giorni Scadenza </label>
										<div class="col-md-6">
										  <textarea name='giorni_scadenza' rows='5' id='giorni_scadenza' class='form-control input-sm '  
				           >{{ $row['giorni_scadenza'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Massima Scadenza" class=" control-label col-md-4 text-left"> Massima Scadenza </label>
										<div class="col-md-6">
										  <textarea name='massima_scadenza' rows='5' id='massima_scadenza' class='form-control input-sm '  
				           >{{ $row['massima_scadenza'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Fattura" class=" control-label col-md-4 text-left"> Numero Fattura </label>
										<div class="col-md-6">
										  <textarea name='numero_fattura' rows='5' id='numero_fattura' class='form-control input-sm '  
				           >{{ $row['numero_fattura'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
			</div>
			
			
			
	@if($accesschild['is_add'] == '1' && $accesschild['is_edit'] == '1' )
	<hr />
	<div class="clr clear"></div>
	
	<h5> Prodotti Preventivo </h5>
	
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
			 	<a onclick=" $(this).parents('.clonedInput').remove(); return false" href="#" class="remove btn btn-xs btn-danger">-</a>
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
     
     <a href="javascript:void(0);" class="addC btn btn-xs btn-info" rel=".clone"><i class="fa fa-plus"></i> New Item</a>
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
		
		$("#id_cliente").jCombo("{!! url('PrvDuemvntd/comboselect?filter=clienti:id:cognome|nome|data_nascita') !!}",
		{  selected_value : '{{ $row["id_cliente"] }}' });
		
		$("#stato").jCombo("{!! url('PrvDuemvntd/comboselect?filter=stato:id:nome') !!}",
		{  selected_value : '{{ $row["stato"] }}' });
		
		$("#id_medico").jCombo("{!! url('PrvDuemvntd/comboselect?filter=medici:id:cognome|nome') !!}",
		{  selected_value : '{{ $row["id_medico"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("PrvDuemvntd/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop