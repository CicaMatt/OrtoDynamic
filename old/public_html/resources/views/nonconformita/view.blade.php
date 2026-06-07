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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('nonconformita/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('nonconformita/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('nonconformita/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('nonconformita?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Preventivo', (isset($fields['id_preventivo']['language'])? $fields['id_preventivo']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_preventivo,'id_preventivo','1:preventivi:id:id|data_preventivo') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cognome', (isset($fields['cognome']['language'])? $fields['cognome']['language'] : array())) }}</td>
						<td>{{ $row->cognome}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Nome', (isset($fields['nome']['language'])? $fields['nome']['language'] : array())) }}</td>
						<td>{{ $row->nome}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Nascita', (isset($fields['data_nascita']['language'])? $fields['data_nascita']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_nascita)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_creazione)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Difformita Rilevata', (isset($fields['difformita_rilevata']['language'])? $fields['difformita_rilevata']['language'] : array())) }}</td>
						<td>{{ $row->difformita_rilevata}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Nome Tecnico', (isset($fields['nome_tecnico']['language'])? $fields['nome_tecnico']['language'] : array())) }}</td>
						<td>{{ $row->nome_tecnico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Apertura Reclamo', (isset($fields['data_apertura_reclamo']['language'])? $fields['data_apertura_reclamo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_apertura_reclamo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Chiusura Reclamo', (isset($fields['data_chiusura_reclamo']['language'])? $fields['data_chiusura_reclamo']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_chiusura_reclamo)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Reclamo', (isset($fields['stato_reclamo']['language'])? $fields['stato_reclamo']['language'] : array())) }}</td>
						<td>{{ $row->stato_reclamo}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
