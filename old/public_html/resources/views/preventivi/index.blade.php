@extends('layouts.app')

@section('content')
@php $stateLogs = $stateLogs ?? []; @endphp
{{--*/ usort($tableGrid, "SiteHelpers::_sort") /*--}}
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li class="active"> {{ $pageTitle }} </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

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
                            <li><a href="javascript://ajax"  onclick="InBozza('IN BOZZA');" class="tips" title="{{ __('core.btn_remove') }}"> In Bozza </a></li>
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
				            <li><a href="{{ url('preventivi') }}?search=data_preventivo:like:2022|" class="tips" > Preventivi 2022</a></li>
				            <li><a href="{{ url('preventivi') }}?search=data_preventivo:like:2021|" class="tips" > Preventivi 2021</a></li>
							<li><a href="{{ url('preventivi') }}?search=data_preventivo:like:2020|" class="tips" > Preventivi 2020</a></li>
							<li><a href="{{ url('preventivi') }}?search=data_preventivo:like:2019|" class="tips" > Preventivi 2019</a></li>
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
						<th align="left" width="200">Note private</th>
						<th align="left" width="240">Ultimo stato</th>
					  </tr>
		        </thead>

		        <tbody>        						
		            @foreach ($rowData as $row)
		                <tr>
							<td > {{ ++$i }} </td>
							<td ><input type="checkbox" class="ids minimal-green" name="ids[]" value="{{ $row->id }}" data-note="{{ e($row->note_private) }}" />  </td>
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
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id.'&tipologia=ddt')}}" class="tips" title="Genera DDT"> DDT </a></li>
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id.'&tipologia=scheda')}}" class="tips" title="Genera Scheda PDF"> Scheda Progetto </a></li>
									@if(!empty($row->id_cliente))
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id_cliente.'&tipologia=privacy')}}" class="tips" title="Genera Modulo di privacy"> Genera Modulo di privacy PDF</a></li>
									@endif
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
					 <td width="200">
					 	<div class="form-group" style="margin-bottom:0; padding-right: 10px; min-width: 200px;">
							<textarea class="form-control input-sm" rows="3" data-note-id="{{ $row->id }}">{{ $row->note_private }}</textarea>
					 		<button type="button" class="btn btn-primary btn-xs" style="margin-top:5px;" onclick="SximoUpdatePrivateNote({{ $row->id }});">
					 			<i class="fa fa-save"></i> Salva
					 		</button>
					 	</div>
					 </td>
					 <td width="240" class="state-log-cell">
					 	@if(!empty($stateLogs[$row->id]))
					 		<ul style="min-width: 200px;">
					 			@if(!empty($stateLogs[$row->id]))
					 				<small>{{ \Carbon\Carbon::parse($stateLogs[$row->id][0]['logdate'])->format('Y-m-d H:i') }} - {{ $stateLogs[$row->id][0]['note'] }}</small>
					 			@endif
					 		</ul>
					 	@else
					 		<span class="text-muted">Nessuna modifica</span>
					 	@endif
					 </td>
		                </tr>
						
		            @endforeach
		              
		        </tbody>
		      
		    </table>
			<input type="hidden" name="action_task" value="" />
			<input type="hidden" name="cambiadata" value="" />
			<input type="hidden" name="id_preventivo" value="" />
			<input type="hidden" name="state" value="" />
			<input type="hidden" name="state_note" value="" />
            <input type="hidden" name="nOrdine" value="" />
			<input type="hidden" name="giorni" value="" />
            <input type="hidden" name="dataAutorizzazione" value="" />
<input type="hidden" name="dataAutorizzazioneOdierna" value="" />
			<input type="hidden" name="nFattura" value="" />
			<input type="hidden" name="note_record_id" value="" />
			<input type="hidden" name="note_value" value="" />
			{!! Form::close() !!}
			<div class="modal fade" id="stateChangeModal" tabindex="-1" role="dialog" aria-labelledby="stateChangeModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 class="modal-title" id="stateChangeModalLabel">Motivazione cambio stato</h4>
						</div>
						<div class="modal-body">
							<div class="form-group">
								<label for="stateChangeNote">Motivazione (facoltativa)</label>
								<textarea id="stateChangeNote" class="form-control" rows="4" placeholder="Inserisci una motivazione o lascia vuoto"></textarea>
								<small class="text-muted">Il testo verrà salvato come nota privata del preventivo.</small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Chiudi</button>
							<button type="button" class="btn btn-primary" id="stateChangeConfirm">Conferma</button>
						</div>
					</div>
				</div>
			</div>
			@include('footer')
			</div>
			<!-- End Table Grid -->


			</div>
		</div>
	</div>
</div>


<script>
(function($){
	var stateChangeContext = null;
	var $modal, $noteField;

	function getSelectedIds(){
		return $('.ids:checked').map(function(){
			return $(this).val();
		}).get();
	}

	function getNoteValueById(id){
		var $checkbox = $('.ids[value="'+id+'"]');
		return $checkbox.data('note') || '';
	}

	function formatDate(date){
		var yyyy = date.getFullYear();
		var mm = ('0' + (date.getMonth() + 1)).slice(-2);
		var dd = ('0' + date.getDate()).slice(-2);
		return yyyy + '-' + mm + '-' + dd;
	}

	function openStateModal(ctx){
		stateChangeContext = $.extend({
			ids: [],
			prefillNote: '',
			beforeSubmit: null
		}, ctx || {});

		if((stateChangeContext.prefillNote === '' || stateChangeContext.prefillNote === null) && stateChangeContext.ids.length === 1){
			stateChangeContext.prefillNote = getNoteValueById(stateChangeContext.ids[0]) || '';
		}

		$noteField.val(stateChangeContext.prefillNote || '');
		$modal.modal('show');
	}

	function resetStateNoteFields(){
		$('input[name="state_note"]').val('');
	}

	function requireSingleSelection(){
		var ids = getSelectedIds();
		if(ids.length > 1){
			alert('Selezionare un solo preventivo alla volta');
			return null;
		}
		if(!ids.length){
			alert('Selezionare almeno un preventivo');
			return null;
		}
		return ids;
	}

	$(document).ready(function(){
		$modal = $('#stateChangeModal');
		$noteField = $('#stateChangeNote');

		$('.copy').click(function() {
			var total = $('.ids:checked').length;
			if(confirm('are u sure Copy selected rows ?'))
			{
				$('input[name="action_task"]').val('copy');
				$('#SximoTable').submit();
			}
		});

		$modal.on('hidden.bs.modal', function(){
			stateChangeContext = null;
			$noteField.val('');
			resetStateNoteFields();
		});

		$('#stateChangeConfirm').on('click', function(){
			if(!stateChangeContext || typeof stateChangeContext.beforeSubmit !== 'function'){
				$modal.modal('hide');
				return;
			}
			$('input[name="state_note"]').val($noteField.val());
			stateChangeContext.beforeSubmit();
			$modal.modal('hide');
			$('#SximoTable').submit();
			stateChangeContext = null;
		});
	});

	window.SximoUpdatePrivateNote = function(id){
		var $field = $('textarea[data-note-id="'+id+'"]');
		if(!$field.length){
			return;
		}
		$('input[name="action_task"]').val('updatePrivateNote');
		$('input[name="note_record_id"]').val(id);
		$('input[name="note_value"]').val($field.val());
		$('#SximoTable').submit();
	};

	window.SximoChangeState = function(newState){
		var ids = getSelectedIds();
		if(!ids.length){
			alert('Selezionare almeno un preventivo');
			return;
		}
		if(!confirm('Sei sicuro di voler cambiare lo stato?')){
			return;
		}
		openStateModal({
			ids: ids,
			prefillNote: ids.length === 1 ? getNoteValueById(ids[0]) : '',
			beforeSubmit: function(){
				$('input[name="action_task"]').val('changeState');
				$('input[name="state"]').val(newState);
			}
		});
	};

	window.nOrdine = function(p1)
	{
		var ids = requireSingleSelection();
		if(!ids){
			return;
		}
		if(!confirm('sei sicuro di voler cambiare lo stato?')){
			return;
		}
		var numeroAutorizzazione = window.prompt("Inserire il Numero di autorizzazione");
		if(numeroAutorizzazione === null){
			return;
		}

		var today = new Date();
		var todayFormatted = formatDate(today);
		var cambiaData = false;
		var dataAccettazione = '';

		if(confirm('Vuoi inserire  la data di accettazione del protocollo?')){
			var nuovaData = window.prompt("Inserire la data nel formato : gg/mm/aaaa");
			if(nuovaData === null){
				return;
			}
			if(nuovaData.length === 10){
				var giorno = nuovaData.substring(0,2);
				var mese = nuovaData.substring(3,5);
				var anno = nuovaData.substring(6,10);
				dataAccettazione = anno+ '-' + mese+ '-' + giorno;
				cambiaData = true;
			}
		}

		openStateModal({
			ids: ids,
			prefillNote: getNoteValueById(ids[0]) || '',
			beforeSubmit: function(){
				$('input[name="action_task"]').val('AutorizzaOrdine');
				$('input[name="state"]').val(p1);
				$('input[name="nOrdine"]').val(numeroAutorizzazione);
				$('input[name="dataAutorizzazioneOdierna"]').val(todayFormatted);
				if(cambiaData){
					$('input[name="dataAutorizzazione"]').val(dataAccettazione);
					$('input[name="cambiadata"]').val('si');
				}else{
					$('input[name="dataAutorizzazione"]').val('');
					$('input[name="cambiadata"]').val('');
				}
			}
		});
	};

	window.nFattura = function(p1)
	{
		var ids = requireSingleSelection();
		if(!ids){
			return;
		}
		var numeroFattura = window.prompt("Inserire il Numero della fattura");
		if(numeroFattura === null){
			return;
		}

		openStateModal({
			ids: ids,
			prefillNote: getNoteValueById(ids[0]) || '',
			beforeSubmit: function(){
				$('input[name="action_task"]').val('Fattura');
				$('input[name="state"]').val(p1);
				$('input[name="nFattura"]').val(numeroFattura);
			}
		});
	};

	window.Consegna = function(p1)
	{
		var ids = getSelectedIds();
		if(!ids.length){
			alert('Selezionare almeno un preventivo');
		 return;
		}
		openStateModal({
			ids: ids,
			prefillNote: ids.length === 1 ? getNoteValueById(ids[0]) : '',
			beforeSubmit: function(){
				$('input[name="action_task"]').val('Consegna');
				$('input[name="state"]').val(p1);
			}
		});
	};

	window.InBozza = function(p1)
	{
		var ids = requireSingleSelection();
		if(!ids){
			return;
		}
		openStateModal({
			ids: ids,
			prefillNote: getNoteValueById(ids[0]) || '',
			beforeSubmit: function(){
				$('input[name="action_task"]').val('Bozza');
				$('input[name="state"]').val(p1);
			}
		});
	};
})(jQuery);
</script>	


	
@stop
