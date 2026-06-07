@extends('layouts.app')

@section('content')
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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('prevdvd/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('prevdvd/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('prevdvd/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('prevdvd?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ $row->id_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ $row->data_creazione}} </td>
						
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
						<td>{{ $row->data_preventivo}} </td>
						
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
						<td>{{ $row->data_accettazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Autorizzazione', (isset($fields['numero_autorizzazione']['language'])? $fields['numero_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->numero_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Medico', (isset($fields['id_medico']['language'])? $fields['id_medico']['language'] : array())) }}</td>
						<td>{{ $row->id_medico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Entry By', (isset($fields['entry_by']['language'])? $fields['entry_by']['language'] : array())) }}</td>
						<td>{{ $row->entry_by}} </td>
						
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
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Preventivo', (isset($fields['Preventivo']['language'])? $fields['Preventivo']['language'] : array())) }}</td>
						<td>{{ $row->Preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Ordine', (isset($fields['numero_ordine']['language'])? $fields['numero_ordine']['language'] : array())) }}</td>
						<td>{{ $row->numero_ordine}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Modello', (isset($fields['modello']['language'])? $fields['modello']['language'] : array())) }}</td>
						<td>{{ $row->modello}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misure', (isset($fields['misure']['language'])? $fields['misure']['language'] : array())) }}</td>
						<td>{{ $row->misure}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note Finali', (isset($fields['note_finali']['language'])? $fields['note_finali']['language'] : array())) }}</td>
						<td>{{ $row->note_finali}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Giorni Scadenza', (isset($fields['giorni_scadenza']['language'])? $fields['giorni_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->giorni_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massima Scadenza', (isset($fields['massima_scadenza']['language'])? $fields['massima_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->massima_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Fattura', (isset($fields['numero_fattura']['language'])? $fields['numero_fattura']['language'] : array())) }}</td>
						<td>{{ $row->numero_fattura}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
