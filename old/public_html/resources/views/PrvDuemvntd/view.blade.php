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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('PrvDuemvntd/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('PrvDuemvntd/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('PrvDuemvntd/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('PrvDuemvntd?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
			<!-- Nav tabs -->
				<ul class="nav nav-tabs" role="tablist">
					<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab"><b>{{ $pageTitle }} : </b>  View Detail </a></li>
				@foreach($subgrid as $sub)
					<li role="presentation"><a href="#{{ str_replace(" ","_",$sub['title']) }}" aria-controls="profile" role="tab" data-toggle="tab"><b>{{ $pageTitle }}</b>  : {{ $sub['title'] }}</a></li>
				@endforeach
				</ul>

				<!-- Tab panes -->
				<div class="tab-content m-t">
					<div role="tabpanel" class="tab-pane active" id="home">

					<table class="table table-striped table-bordered" >
						<tbody>	
					
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Preventivo', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_cliente,'id_cliente','1:clienti:id:cognome|nome|data_nascita') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tipologia', (isset($fields['tipologia_preventivo']['language'])? $fields['tipologia_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->tipologia_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Diagnosi Circostanziata', (isset($fields['diagnosi_circostanziata']['language'])? $fields['diagnosi_circostanziata']['language'] : array())) }}</td>
						<td>{{ $row->diagnosi_circostanziata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prescizione Dettagliata Protesi', (isset($fields['prescizione_dettagliata_protesi']['language'])? $fields['prescizione_dettagliata_protesi']['language'] : array())) }}</td>
						<td>{{ $row->prescizione_dettagliata_protesi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Prescrizione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Preventivo', (isset($fields['data_preventivo']['language'])? $fields['data_preventivo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_preventivo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Ricezione Autorizzazione', (isset($fields['data_ricezione_autorizzazione']['language'])? $fields['data_ricezione_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->data_ricezione_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Autorizzazione Protocollo ASL', (isset($fields['numero_autorizzazione']['language'])? $fields['numero_autorizzazione']['language'] : array())) }}</td>
						<td>{{ $row->numero_autorizzazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Accettazione Protocollo ASL', (isset($fields['data_accettazione']['language'])? $fields['data_accettazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_accettazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Totale', (isset($fields['totale']['language'])? $fields['totale']['language'] : array())) }}</td>
						<td>{{ $row->totale}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Ordine', (isset($fields['numero_ordine']['language'])? $fields['numero_ordine']['language'] : array())) }}</td>
						<td>{{ $row->numero_ordine}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Medico', (isset($fields['id_medico']['language'])? $fields['id_medico']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_medico,'id_medico','1:medici:id:cognome|nome') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misure Ok', (isset($fields['misure_ok']['language'])? $fields['misure_ok']['language'] : array())) }}</td>
						<td>{{ $row->misure_ok}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Residenza', (isset($fields['citta']['language'])? $fields['citta']['language'] : array())) }}</td>
						<td>{{ $row->citta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Provvigioni Pagate', (isset($fields['provvigioni_pagate']['language'])? $fields['provvigioni_pagate']['language'] : array())) }}</td>
						<td>{{ $row->provvigioni_pagate}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Lavorazione', (isset($fields['stato_1']['language'])? $fields['stato_1']['language'] : array())) }}</td>
						<td>{{ $row->stato_1}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massima Scadenza', (isset($fields['massima_scadenza']['language'])? $fields['massima_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->massima_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Numero Fattura', (isset($fields['numero_fattura']['language'])? $fields['numero_fattura']['language'] : array())) }}</td>
						<td>{{ $row->numero_fattura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Preventivo', (isset($fields['Preventivo']['language'])? $fields['Preventivo']['language'] : array())) }}</td>
						<td>{!! SiteHelpers::formatRows($row->Preventivo,$fields['Preventivo'],$row ) !!} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massina Scadenza Per Lavorazione', (isset($fields['giorni_scadenza']['language'])? $fields['giorni_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->giorni_scadenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note ', (isset($fields['note_finali']['language'])? $fields['note_finali']['language'] : array())) }}</td>
						<td>{{ $row->note_finali}} </td>
						
					</tr>
				
							
						</tbody>	
					</table>  
				</div>

				@foreach($subgrid as $sub)
					<div role="tabpanel" class="tab-pane" id="{{ str_replace(" ","_",$sub['title']) }}"></div>
				@endforeach	
			 	
		</div>
	</div>
	</div>
</div>
<script type="text/javascript">
	$(function(){
		<?php for($i=0 ; $i<count($subgrid); $i++)  :?>
			$('#{{ str_replace(" ","_",$subgrid[$i]['title']) }}').load('{{ url("PrvDuemvntd/lookup?param=".implode("-",$subgrid["$i"])."-".$id)}}')
		<?php endfor;?>
	})

</script>
	  
@stop