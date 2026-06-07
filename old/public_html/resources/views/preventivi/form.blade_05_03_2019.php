
application/x-httpd-php form.blade.php ( HTML document, ASCII text )
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

	{!! Form::open(array('url'=>'preventivi?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Tipologia" class=" control-label col-md-4 text-left"> Tipologia </label>
										<div class="col-md-6">
										  
					<?php $tipologia_preventivo = explode(',',$row['tipologia_preventivo']);
					$tipologia_preventivo_opt = array( 'Asl' => 'Asl' ,  'Privato' => 'Privato' , ); ?>
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
										  <textarea name='diagnosi_circostanziata' rows='5' id='diagnosi_circostanziata' class='form-control input-sm '  
				           >{{ $row['diagnosi_circostanziata'] }}</textarea> 
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
										<label for="Data Creazione" class=" control-label col-md-4 text-left"> Data Creazione <span class="asterix"> * </span></label>
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
										<label for="Data Ricezione" class=" control-label col-md-4 text-left"> Data Ricezione <span class="asterix"> * </span></label>
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
										<div class="col-md-2">
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
     <table>
         <tbody>
            <tr class="clone clonedInput">
                <td>
                </td>
                <th class="text-left">Totale</th>   
                <td style="padding: 5px 10px 5px 5px;">  </td>
                <td>
                <input type="text" name="totale" class="form-control input-sm" value="">
                </td>
            </tr>
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
		$('input[name="bulk_importo[]').prop("readonly", true);
		$('input[name="totale').prop("readonly", true);
		$('.addC').relCopy({});
		
		$("#id_cliente").jCombo("{!! url('preventivi/comboselect?filter=clienti:id:cognome|nome|data_nascita') !!}",
		{  selected_value : '{{ $row["id_cliente"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("preventivi/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});
	});
	// we used jQuery 'keyup' to trigger the computation as the user type
	$('.table-responsive').on('change', 'input[name="bulk_quantita[]"]', function() {
    var importoTotale = 0;        
    $('.table-responsive tr').each(function(){
        if ($(this).find('select[name="bulk_codice_nomenclatore[]"] option:selected').text()!="") {
        var quantity = parseInt( $(this).find('input[name="bulk_quantita[]"]').val(),10);
        if(Math.floor(quantity) != quantity && !$.isNumeric(quantity)){
            alert("Inserire un valore numerico come quantità");
            $(this).find('input[name="bulk_quantita[]"]').val("");
            return false;
        } 
        var price = $(this).find('select[name="bulk_codice_nomenclatore[]"] option:selected').text();
        var res = price.trim().split(" ");
        var price2 = res[res.length-1];
        if(!$.isNumeric(price2)){
            alert("Il prezzo del prodotto non è corretto");
            return false;
        } 
        var sconto = parseInt( $(this).find('input[name="bulk_sconto[]"]').val(),10);
        if(!isNaN(sconto)){
        if(Math.floor(sconto) != sconto && !$.isNumeric(sconto)){
            alert("Inserire un valore numerico corretto come sconto");
            $(this).find('input[name="bulk_sconto[]"]').val("");
            return false;
        } else {
            if (sconto > 100 || sconto < 0) 
            { 
                alert("inserire un valore compreso tra 0 e 100");
                $(this).find('input[name="bulk_sconto[]"]').val("");
                return false;
            } 
        }}
        if(price2!=null && quantity!=null) {
            if($.isNumeric(sconto)) {
                var total = (price2 * quantity) - ((price2 * quantity)*sconto)/100;
            } else {
                var total = (price2 * quantity);
            }
        } else {
            total = 0;
        }
        $(this).find('input[name="bulk_importo[]"]').val(total);
        if (!isNaN(total)) {
            importoTotale += total;
        }
        $('input[name="totale').val(importoTotale);
	}});
});

	// we used jQuery 'keyup' to trigger the computation as the user type
	$('.table-responsive').on('change', 'input[name="bulk_sconto[]"]', function() {
    var importoTotale = 0;        
    $('.table-responsive tr').each(function(){
        if ($(this).find('select[name="bulk_codice_nomenclatore[]"] option:selected').text()!="") {
        var quantity = parseInt( $(this).find('input[name="bulk_quantita[]"]').val(),10);
        if(Math.floor(quantity) != quantity && !$.isNumeric(quantity)){
            alert("Inserire un valore numerico come quantità");
            $(this).find('input[name="bulk_quantita[]"]').val("");
            return false;
        } 
        var price = $(this).find('select[name="bulk_codice_nomenclatore[]"] option:selected').text();
        var res = price.trim().split(" ");
        var price2 = res[res.length-1];
        if(!$.isNumeric(price2)){
            alert("Il prezzo del prodotto non è corretto");
            return false;
        } 
        var sconto = parseInt( $(this).find('input[name="bulk_sconto[]"]').val(),10);
        if(!isNaN(sconto)){
        if(Math.floor(sconto) != sconto && !$.isNumeric(sconto)){
            alert("Inserire un valore numerico corretto come sconto");
            $(this).find('input[name="bulk_sconto[]"]').val("");
            return false;
        } else {
            if (sconto > 100 || sconto < 0) 
            { 
                alert("inserire un valore compreso tra 0 e 100");
                $(this).find('input[name="bulk_sconto[]"]').val("");
                return false;
            } 
        }}
        if(price2!=null && quantity!=null) {
            if($.isNumeric(sconto)) {
                var total = (price2 * quantity) - ((price2 * quantity)*sconto)/100;
            } else {
                var total = (price2 * quantity);
            }
        } else {
            total = 0;
        }
        $(this).find('input[name="bulk_importo[]"]').val(total);
        if (!isNaN(total)) {
            importoTotale += total;
        }
        $('input[name="totale').val(importoTotale);
	}});
});


	</script>		 
@stop