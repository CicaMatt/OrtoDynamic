@extends('layouts.app')

@section('content')
@php $stateLogs = $stateLogs ?? []; @endphp
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li><a href="{{ url($pageModule) }}"> {{ $pageTitle }} </a></li>
		<li class="active"> View  </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">
	
	<div class="sbox">
		<div class="sbox-title clearfix">
			<div class="sbox-tools pull-left" >
		   		<a href="{{ ($prevnext['prev'] != '' ? url('previnv/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('previnv/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('previnv/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('previnv?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
			<div class="table-responsive">
				<table class="table table-striped " >
					<tbody>	
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_cliente,'id_cliente','1:clienti:id:cognome|nome|data_nascita') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Prescrizione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Diagnosi Circostanziata', (isset($fields['diagnosi_circostanziata']['language'])? $fields['diagnosi_circostanziata']['language'] : array())) }}</td>
						<td>{{ $row->diagnosi_circostanziata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Programma Terapeutico', (isset($fields['programma_terapeutico']['language'])? $fields['programma_terapeutico']['language'] : array())) }}</td>
						<td>{{ $row->programma_terapeutico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prescizione Dettagliata Protesi', (isset($fields['prescizione_dettagliata_protesi']['language'])? $fields['prescizione_dettagliata_protesi']['language'] : array())) }}</td>
						<td>{{ $row->prescizione_dettagliata_protesi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Preventivo', (isset($fields['data_preventivo']['language'])? $fields['data_preventivo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_preventivo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Preventivo', (isset($fields['numero_preventivo']['language'])? $fields['numero_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->numero_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tipologia Preventivo', (isset($fields['tipologia_preventivo']['language'])? $fields['tipologia_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->tipologia_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Accettazione', (isset($fields['data_accettazione']['language'])? $fields['data_accettazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_accettazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Autorizzazione', (isset($fields['numero_autorizzazione']['language'])? $fields['numero_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->numero_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Medico', (isset($fields['id_medico']['language'])? $fields['id_medico']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_medico,'id_medico','1:medici:id:cognome|nome') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Ricezione Autorizzazione', (isset($fields['data_ricezione_autorizzazione']['language'])? $fields['data_ricezione_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->data_ricezione_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misure Ok', (isset($fields['misure_ok']['language'])? $fields['misure_ok']['language'] : array())) }}</td>
						<td>{{ $row->misure_ok}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Provvigioni Pagate', (isset($fields['provvigioni_pagate']['language'])? $fields['provvigioni_pagate']['language'] : array())) }}</td>
						<td>{{ $row->provvigioni_pagate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Totale', (isset($fields['totale']['language'])? $fields['totale']['language'] : array())) }}</td>
						<td>{{ $row->totale}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>

@if(!empty($stateLogs))
<div class="page-content row">
	<div class="page-content-wrapper no-margin">
		<div class="sbox">
			<div class="sbox-title"><h4>Storico Stato</h4></div>
			<div class="sbox-content">
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Data</th>
								<th>Descrizione</th>
							</tr>
						</thead>
						<tbody>
						@foreach($stateLogs as $log)
							<tr>
								<td>{{ \Carbon\Carbon::parse($log['logdate'])->format('Y-m-d H:i') }}</td>
								<td>{{ $log['note'] }}</td>
							</tr>
						@endforeach
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
@endif
@stop
