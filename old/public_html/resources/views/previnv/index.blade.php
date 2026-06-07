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
				<h1> All Records <small> </small></h1>
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
				<div class="col-md-4"> 	
					@if($access['is_add'] ==1)
					<a href="{{ url('previnv/create?return='.$return) }}" class="btn btn-default btn-sm"  
						title="{{ __('core.btn_create') }}"><i class=" fa fa-plus "></i> Create New </a>
					@endif

					<div class="btn-group">
						<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-menu5"></i> Bulk Action </button>
				        <ul class="dropdown-menu">
				         @if($access['is_excel'] ==1)
							<li><a href="{{ url( $pageModule .'/export?do=excel&return='.$return) }}"><i class="fa fa-download"></i> Export CSV </a></li>	
						@endif
						@if($access['is_add'] ==1)
							<li><a href="{{ url($pageModule .'/import?return='.$return) }}" onclick="SximoModal(this.href, 'Import CSV'); return false;"><i class="fa fa-cloud-upload"></i> Import CSV</a></li>
							<li><a href="javascript://ajax" class=" copy " title="Copy" ><i class="fa fa-copy"></i> Copy selected</a></li>
						@endif	
							<li><a href="{{ url($pageModule) }}"  ><i class="fa fa-times"></i> Clear Search </a></li>
							<li><a href="javascript://ajax" onclick="SximoChangeStateBulk();" class="text-warning"><i class="fa fa-ban"></i> Annulla selezionati</a></li>
				          	<li role="separator" class="divider"></li>
				         @if($access['is_remove'] ==1)
							 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}"><i class="fa fa-trash-o"></i>
							Remove Selected </a></li>
						@endif 
				          
				        </ul>
				    </div>    
				</div>
				<div class="col-md-4 pull-right">
					<div class="input-group">
					      <div class="input-group-btn">
					        <button type="button" class="btn btn-default btn-sm " 
					        onclick="SximoModal('{{ url($pageModule."/search") }}','Advance Search'); " ><i class="fa fa-filter"></i> Filtra </button>
					      </div><!-- /btn-group -->
					      <input type="text" class="form-control input-sm onsearch" data-target="{{ url($pageModule) }}" aria-label="..." placeholder=" Type And Hit Enter ">
					    </div>
				</div>    
			</div>					
			<!-- End Toolbar Top -->

			<!-- Table Grid -->
			<div class="table-responsive" style="padding-bottom: 70px;">
 			{!! Form::open(array('url'=>'previnv?'.$return, 'class'=>'form-horizontal m-t' ,'id' =>'SximoTable' )) !!}
			
		    <table class="table table-striped table-hover " id="{{ $pageModule }}Table">
		        <thead>
					<tr>
						<th style="width: 3% !important;" class="number"> No </th>
						<th  style="width: 3% !important;"> <input type="checkbox" class="checkall minimal-green" /></th>
						<th  style="width: 10% !important;">{{ __('core.btn_action') }}</th>
						
						@foreach ($tableGrid as $t)
							@if($t['view'] =='1')				
								<?php
								if (isset($t['field']) && $t['field'] == 'data_creazione') {
									continue;
								}
								$limited = isset($t['limited']) ? $t['limited'] :''; 
								{
									$addClass='class="tbl-sorting" ';
									if($insort ==$t['field'])
									{
										$dir_order = ($inorder =='desc' ? 'sort-desc' : 'sort-asc'); 
										$addClass='class="tbl-sorting '.$dir_order.'" ';
									}
									echo '<th align="'.$t['align'].'" '.$addClass.' width="'.$t['width'].'">'.\SiteHelpers::activeLang($t['label'],(isset($t['language'])? $t['language'] : array())).'</th>';				
								}
								?>
							@endif
						@endforeach
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
									<li><a href="{{ url('previnv/'.$row->id.'?return='.$return)}}" class="tips" title="{{ __('core.btn_view') }}"> {{ __('core.btn_view') }} </a></li>
									@endif
									@if($access['is_edit'] ==1)
									<li><a  href="{{ url('previnv/'.$row->id.'/edit?return='.$return) }}" class="tips" title="{{ __('core.btn_edit') }}"> {{ __('core.btn_edit') }} </a></li>
									@endif
									@if(!empty($row->id_cliente))
									<li><a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row->id_cliente.'&tipologia=privacy')}}" class="tips" title="Genera Modulo di privacy"> Genera Modulo di privacy PDF</a></li>
									@endif
									<li><a href="javascript://ajax" class="text-warning js-change-state-row" data-id="{{ $row->id }}"><i class="fa fa-ban"></i> Annulla</a></li>
									<li class="divider" role="separator"></li>
									@if($access['is_remove'] ==1)
										 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}">
										Remove Selected </a></li>
									@endif 
								  </ul>
								</div>

							</td>														
							 @foreach ($tableGrid as $field)
								 @if($field['view'] =='1')
								 	<?php 
										if (isset($field['field']) && (
											$field['field'] == 'data_creazione'
											 || $field['field'] == 'numero_ordine')
										) {
											continue;
										}
										$limited = isset($field['limited']) ? $field['limited'] :''; 
									?>
								 	@if(SiteHelpers::filterColumn($limited ))
								 	 <?php $addClass= ($insort ==$field['field'] ? 'class="tbl-sorting-active" ' : ''); ?>
									 <td align="{{ $field['align'] }}" width=" {{ $field['width'] }}"  {!! $addClass !!} >					 
									 	{!! SiteHelpers::formatRows($row->{$field['field']},$field ,$row ) !!}						 
									 </td>
									@endif
								 @endif
							 @endforeach
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
			<input type="hidden" name="state" value="" />
			<input type="hidden" name="state_note" value="" />
			<div id="singleChangeContainer"></div>

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

	function openStateModal(config){
		stateChangeContext = $.extend({
			ids: [],
			replaceSelection: false,
			actionTask: 'changeState',
			state: 'ANNULLATO',
			prefillNote: ''
		}, config || {});

		if(typeof stateChangeContext.prefillNote === 'undefined' || stateChangeContext.prefillNote === null){
			if(stateChangeContext.ids.length === 1){
				stateChangeContext.prefillNote = getNoteValueById(stateChangeContext.ids[0]);
			} else {
				stateChangeContext.prefillNote = '';
			}
		}

		$noteField.val(stateChangeContext.prefillNote || '');
		$modal.modal('show');
	}

	function bindModalEvents(){
		$modal = $('#stateChangeModal');
		$noteField = $('#stateChangeNote');

		$(document).on('click', '.js-change-state-row', function(e){
			e.preventDefault();
			var id = $(this).data('id');
			SximoChangeStateRow(id);
		});

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
		});

		$('#stateChangeConfirm').on('click', function(){
			if(!stateChangeContext){
				return;
			}
			$('input[name="action_task"]').val(stateChangeContext.actionTask);
			$('input[name="state"]').val(stateChangeContext.state);
			$('input[name="state_note"]').val($noteField.val());

			if(stateChangeContext.replaceSelection){
				$('.ids').prop('checked', false);
				var inputs = '';
				stateChangeContext.ids.forEach(function(id){
					inputs += '<input type="hidden" name="ids[]" value="'+id+'">';
				});
				$('#singleChangeContainer').html(inputs);
			} else {
				$('#singleChangeContainer').empty();
			}

			$modal.modal('hide');
			$('#SximoTable').submit();
			stateChangeContext = null;
		});
	}

	$(document).ready(function(){
		bindModalEvents();
	});

	window.SximoChangeStateRow = function(id){
		if(!confirm('Sei sicuro di voler annullare questo preventivo?')){
			return;
		}
		openStateModal({
			ids: [id],
			replaceSelection: true,
			actionTask: 'changeState',
			state: 'ANNULLATO',
			prefillNote: getNoteValueById(id)
		});
	};

	window.SximoChangeStateBulk = function(){
		var ids = getSelectedIds();
		if(!ids.length){
			alert('Seleziona almeno un preventivo da annullare');
			return;
		}
		if(!confirm('Sei sicuro di voler annullare i preventivi selezionati?')){
			return;
		}
		openStateModal({
			ids: ids,
			replaceSelection: false,
			actionTask: 'changeState',
			state: 'ANNULLATO',
			prefillNote: ids.length === 1 ? getNoteValueById(ids[0]) : ''
		});
	};
})(jQuery);
</script>	
	
@stop
