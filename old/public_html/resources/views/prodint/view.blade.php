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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('prodint/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('prodint/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('prodint/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('prodint?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Nomenclatore', (isset($fields['codice_nomenclatore']['language'])? $fields['codice_nomenclatore']['language'] : array())) }}</td>
						<td>{{ $row->codice_nomenclatore}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Item Preventivi', (isset($fields['id_item_preventivi']['language'])? $fields['id_item_preventivi']['language'] : array())) }}</td>
						<td>{{ $row->id_item_preventivi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Quantita', (isset($fields['quantita']['language'])? $fields['quantita']['language'] : array())) }}</td>
						<td>{{ $row->quantita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione Lavorazione', (isset($fields['data_creazione_lavorazione']['language'])? $fields['data_creazione_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->data_creazione_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Annullamento', (isset($fields['data_annullamento']['language'])? $fields['data_annullamento']['language'] : array())) }}</td>
						<td>{{ $row->data_annullamento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Ordine', (isset($fields['data_ordine']['language'])? $fields['data_ordine']['language'] : array())) }}</td>
						<td>{{ $row->data_ordine}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Consegna Parziale', (isset($fields['data_consegna_parziale']['language'])? $fields['data_consegna_parziale']['language'] : array())) }}</td>
						<td>{{ $row->data_consegna_parziale}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Consegna', (isset($fields['data_consegna']['language'])? $fields['data_consegna']['language'] : array())) }}</td>
						<td>{{ $row->data_consegna}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Lavorazione', (isset($fields['id_lavorazione']['language'])? $fields['id_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->id_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Descrizione Nomenclatore', (isset($fields['descrizione_nomenclatore']['language'])? $fields['descrizione_nomenclatore']['language'] : array())) }}</td>
						<td>{{ $row->descrizione_nomenclatore}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Importo', (isset($fields['importo']['language'])? $fields['importo']['language'] : array())) }}</td>
						<td>{{ $row->importo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Produzione', (isset($fields['produzione']['language'])? $fields['produzione']['language'] : array())) }}</td>
						<td>{{ $row->produzione}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
