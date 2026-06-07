@extends('layouts.app')

@section('content')
{{--*/ usort($tableGrid, "SiteHelpers::_sort") /*--}}
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li class="active"> {{ $pageTitle }} </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">ff

		<div class="sbox">
			<div class="sbox-title">
				<h1> Preventivi <small> </small></h1>
				<div class="sbox-tools">
					@if(Session::get('gid') ==1)
						<a href="{{ url($pageModule) }}" class="tips btn btn-sm  " title=" {{ __('core.btn_reload') }}" ><i class="fa  fa-refresh"></i></a>
						<a href="{{ url('sximo/module/config/'.$pageModule) }}" class="tips btn btn-sm  " title=" {{ __('core.btn_config') }}" ><i class="fa  fa-ellipsis-v"></i></a>
					@endif 	
				</div>				
			</div>
			<div class="sbox-content">
			<!-- Toolbar Top -->
			<div class="row">
				<div class="col-md-8"> 	
					@if($access['is_add'] ==1)
					<a href="{{ url('preventivi/create?return='.$return) }}" class="btn btn-default btn-sm"  
						title="{{ __('core.btn_create') }}"><i class=" fa fa-plus "></i> Crea Nuovo </a>
					@endif

					<div class="btn-group">
						<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-menu5"></i> Azioni </button>
				        <ul class="dropdown-menu">
				         @if($access['is_excel'] ==1)
							<li><a href="{{ url( $pageModule .'/export?do=excel&return='.$return) }}"><i class="fa fa-download"></i> Exporta CSV </a></li>	
						@endif
						@if($access['is_add'] ==1)
							<li><a href="{{ url($pageModule .'/import?return='.$return) }}" onclick="SximoModal(this.href, 'Import CSV'); return false;"><i class="fa fa-cloud-upload"></i> Importa CSV</a></li>
							<li><a href="javascript://ajax" class=" copy " title="Copy" ><i class="fa fa-copy"></i> Copia selezionati</a></li>
						@endif	
							<li><a href="{{ url($pageModule) }}"  ><i class="fa fa-times"></i> Cancella Ricerca </a></li>
				          	<li role="separator" class="divider"></li>
				         @if($access['is_remove'] ==1)
							 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}"><i class="fa fa-trash-o"></i>
							Rimuovi Selezionati </a></li>
						@endif 
				          
				        </ul>
				    </div>
				    <div class="btn-group">
						<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-menu5"></i> Stato Preventivo </button>
				        <ul class="dropdown-menu">
						    <li><a href="javascript://ajax"  onclick="SximoChangeState('INVIATO');" class="tips" title="{{ __('core.btn_remove') }}"> Invia Preventivo ASL </a></li>	
							<li><a href="javascript://ajax"  onclick="nOrdine('AUTORIZZATO');" class="tips" title="{{ __('core.btn_remove') }}"> Preventivo Autorizzato ASL </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('IN LAVORAZIONE'); " class="tips" title="{{ __('core.btn_remove') }}"> Manda in Lavorazione </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('IN LAVORAZIONE SENZA AUTORIZZAZIONE');" class="tips" title="{{ __('core.btn_remove') }}"> Manda in Lavorazione senza Aut. </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('SOSPESO');" class="tips" title="{{ __('core.btn_remove') }}"> Sospeso </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('CONSEGNATO');" class="tips" title="{{ __('core.btn_remove') }}"> Ordine Consegnato </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('CONSEGNATO PARZIALE');" class="tips" title="{{ __('core.btn_remove') }}"> Ordine Consegnato Parzialmente </a></li>
							<li><a href="javascript://ajax"  onclick="nFattura('FATTURATO');" class="tips" title="{{ __('core.btn_remove') }}"> Ordine Fatturato </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('RISCOSSO');" class="tips" title="{{ __('core.btn_remove') }}"> Ordine Riscosso </a></li>
							<li role="separator" class="divider"></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('ANNULLATO');" class="tips" title="{{ __('core.btn_remove') }}"> Annulla Preventivo </a></li>
							<li><a href="javascript://ajax"  onclick="SximoChangeState('RIFIUTATO');" class="tips" title="{{ __('core.btn_remove') }}"> Preventivo Rifiutato </a></li>
				        </ul>
				    </div>
				    
				  
				    
				    <div class="btn-group" >
						<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-menu5"></i> Filtra per anno </button>
				        <ul class="dropdown-menu">
				            <li><a href="{{ url('prevdvd') }}" class="tips" > Preventivi 2022</a></li>
				            <li><a href="{{ url('pdvu') }}" class="tips" > Preventivi 2021</a></li>
							<li><a href="{{ url('prvduemilaventi') }}" class="tips" > Preventivi 2020</a></li>
							<li><a href="{{ url('prvdcnv') }}" class="tips" > Preventivi 2019</a></li>
				        </ul>
				    </div>
				    
				    
				    
				    
				    
				    
				    
				    
				    
				    
				    
				</div>
				<div class="col-md-4 pull-right">
					<div class="input-group">
					      <div class="input-group-btn">
					        <button type="button" class="btn btn-default btn-sm " 
					        onclick="SximoModal('{{ url($pageModule."/search") }}','Ricerca Avanzata'); " ><i class="fa fa-filter"></i> Filtra </button>
					      </div><!-- /btn-group -->
					      <input type="text" class="form-control input-sm onsearch" data-target="{{ url($pageModule) }}" aria-label="..." placeholder=" Type And Hit Enter ">
					    </div>
				</div>    
			</div>					
			<!-- End Toolbar Top -->

			<!-- Table Grid -->
			<div class="table-responsive" style="padding-bottom: 70px;">
 			{!! Form::open(array('url'=>'preventivi?'.$return, 'class'=>'form-horizontal m-t' ,'id' =>'SximoTable' )) !!}
			
		    <table class="table table-striped table-hover " id="{{ $pageModule }}Table">
		        <thead>
					<tr>
						<th style="width: 3% !important;" class="number"> No </th>
						<th  style="width: 3% !important;"> <input type="checkbox" class="checkall minimal-green" /></th>
						<th  style="width: 10% !important;">{{ __('core.btn_action') }}</th>
						
						@foreach ($tableGrid as $t)
							@if($t['view'] =='1')				
								<?php $limited = isset($t['limited']) ? $t['limited'] :''; 
								if(SiteHelpers::filterColumn($limited ))
								{
									$addClass='class="tbl-sorting" ';
									if($insort ==$t['field'])
									{
										$dir_order = ($inorder =='desc' ? 'sort-desc' : 'sort-asc'); 
										$addClass='class="tbl-sorting '.$dir_order.'" ';
									}
									echo '<th align="'.$t['align'].'" '.$addClass.' width="'.$t['width'].'">'.\SiteHelpers::activeLang($t['label'],array()).'</th>';				
								} 
								?>
							@endif
						@endforeach
						
					  </tr>
		        </thead>

		        <tbody>        						
		            @foreach ($rowData as $row)
		                <tr>
							<td > {{ ++$i }} </td>
							<td ><input type="checkbox" class="ids minimal-green" name="ids[]" value="{{ $row->id }}" />  </td>
							<td>

							 	<div class="dropdown">
								  <button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown"> Action </button>
								  <ul class="dropdown-menu">
								 	@if($access['is_detail'] ==1)
									<li><a href="{{ url('preventivi/'.$row->id.'?return='.$return)}}" class="tips" title="{{ __('core.btn_view') }}"> Visualizza </a></li>
									@endif
									@if($access['is_edit'] ==1)
									<li><a  href="{{ url('preventivi/'.$row->id.'/edit?return='.$return) }}" class="tips" title="{{ __('core.btn_edit') }}"> {{ __('core.btn_edit') }} </a></li>
									@endif
									<li><a  href="javascript://ajax" onclick="SximoInserisciNonConformita({{ $row->id }});" class="tips" title="{{ __('core.btn_edit') }}"> Inserisci Non Conformità </a></li>
						<!-- Modificato -->
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id)}}" class="tips" title="Genera Modulo di consegna"> Modulo di consegna </a></li>
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id.'&tipologia=scheda')}}" class="tips" title="Genera Scheda PDF"> Scheda Progetto </a></li>
								
						<!fine modifica-->
									<li class="divider" role="separator"></li>
									@if($access['is_remove'] ==1)
										 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}">
										Elimina </a></li>
									@endif 
								  </ul>
								</div>

							</td>														
						 @foreach ($tableGrid as $field)
							 @if($field['view'] =='1')
							 	<?php $limited = isset($field['limited']) ? $field['limited'] :''; ?>
							 	@if(SiteHelpers::filterColumn($limited ))
							 	 <?php $addClass= ($insort ==$field['field'] ? 'class="tbl-sorting-active" ' : ''); ?>
								 <td align="{{ $field['align'] }}" width=" {{ $field['width'] }}"  {!! $addClass !!} >					 
								 	{!! SiteHelpers::formatRows($row->{$field['field']},$field ,$row ) !!}						 
								 </td>
								@endif	
							 @endif					 
						 @endforeach			 
		                </tr>
						
		            @endforeach
		              
		        </tbody>
		      
		    </table>
			<input type="hidden" name="action_task" value="" />
			<input type="hidden" name="cambiadata" value="" />
			<input type="hidden" name="id_preventivo" value="" />
			<input type="hidden" name="state" value="" />
            <input type="hidden" name="nOrdine" value="" />
			<input type="hidden" name="giorni" value="" />
            <input type="hidden" name="dataAutorizzazione" value="" />
			<input type="hidden" name="nFattura" value="" />
			{!! Form::close() !!}
			@include('footer')
			</div>
			<!-- End Table Grid -->


			</div>
		</div>
	</div>
</div>


<script>
$(document).ready(function(){
	$('.copy').click(function() {
		var total = $('input[class="ids"]:checkbox:checked').length;
		if(confirm('are u sure Copy selected rows ?'))
		{
			$('input[name="action_task"]').val('copy');
			$('#SximoTable').submit();// do the rest here	
		}
	})	
	
});	


function nOrdine(p1)
{	
	//var total = $('input[class="ids"]:checkbox:checked').length;
    total = document.querySelectorAll('input[type="checkbox"]:checked').length;
	if (total > 1) {
	    alert ("Selezionare un solo preventivo alla volta");
	}
	else if (total === 0) {
	    alert ("Selezionare almeno un preventivo");
	}
	else{
	    if(confirm('sei sicuro di voler cambiare lo stato?'))
	        {   
	            var a = window.prompt("Inserire il Numero di autorizzazione"); 
                    var data;
                    today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

                  today = yyyy + '-' + mm + '-' + dd;
                    $('input[name="dataAutorizzazione"]').val(today);
                    $('input[name="cambiadata"]').val("si");
               
                     
	        	$('input[name="action_task"]').val('AutorizzaOrdine');
	        	$('input[name="state"]').val(p1);
	        	$('input[name="nOrdine"]').val(a);
	        	$('#SximoTable').submit();// do the rest here	
	        }
	    }
}

function nFattura(p1)
{	
	//var total = $('input[class="ids"]:checkbox:checked').length;
    total = document.querySelectorAll('input[type="checkbox"]:checked').length;
	if (total > 1) {
	    alert ("Selezionare un solo preventivo alla volta");
	}
	else if (total === 0) {
	    alert ("Selezionare almeno un preventivo");
	}
	else{
	    
	            var a = window.prompt("Inserire il Numero della fattura"); 
	        	$('input[name="action_task"]').val('Fattura');
	        	$('input[name="state"]').val(p1);
	        	$('input[name="nFattura"]').val(a);
	        	$('#SximoTable').submit();// do the rest here	
	    }
}

</script>	


	
@stop
