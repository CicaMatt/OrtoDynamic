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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('clienti/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('clienti/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('clienti/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('clienti?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Cliente', (isset($fields['id']['language'])? $fields['id']['language'] : array())) }}</td>
						<td>{{ $row->id}} </td>
						
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Codice Fiscale', (isset($fields['codice_fiscale']['language'])? $fields['codice_fiscale']['language'] : array())) }}</td>
						<td>{{ $row->codice_fiscale}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Nascita', (isset($fields['data_nascita']['language'])? $fields['data_nascita']['language'] : array())) }}</td>
						<td>{{ date('',strtotime($row->data_nascita)) }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Sesso', (isset($fields['sesso']['language'])? $fields['sesso']['language'] : array())) }}</td>
						<td>{{ $row->sesso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Comune Nascita', (isset($fields['comune_nascita']['language'])? $fields['comune_nascita']['language'] : array())) }}</td>
						<td>{{ $row->comune_nascita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Comune Nascita Estero', (isset($fields['comune_estero']['language'])? $fields['comune_estero']['language'] : array())) }}</td>
						<td>{{ $row->comune_estero}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Indirizzo', (isset($fields['indirizzo']['language'])? $fields['indirizzo']['language'] : array())) }}</td>
						<td>{{ $row->indirizzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Provincia', (isset($fields['provincia']['language'])? $fields['provincia']['language'] : array())) }}</td>
						<td>{{ $row->provincia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Citta', (isset($fields['citta']['language'])? $fields['citta']['language'] : array())) }}</td>
						<td>{{ $row->citta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cap', (isset($fields['cap']['language'])? $fields['cap']['language'] : array())) }}</td>
						<td>{{ $row->cap}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Nazione', (isset($fields['nazione']['language'])? $fields['nazione']['language'] : array())) }}</td>
						<td>{{ $row->nazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Distretto Appartenenza', (isset($fields['distretto_appartenenza']['language'])? $fields['distretto_appartenenza']['language'] : array())) }}</td>
						<td>{{ $row->distretto_appartenenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Medico', (isset($fields['id_medico']['language'])? $fields['id_medico']['language'] : array())) }}</td>
						<td>{{ SiteHelpers::formatLookUp($row->id_medico,'id_medico','1:medici:id:cognome|nome') }} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Telefono', (isset($fields['telefono']['language'])? $fields['telefono']['language'] : array())) }}</td>
						<td>{{ $row->telefono}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Email', (isset($fields['email']['language'])? $fields['email']['language'] : array())) }}</td>
						<td>{{ $row->email}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Cellulare', (isset($fields['cellulare']['language'])? $fields['cellulare']['language'] : array())) }}</td>
						<td>{{ $row->cellulare}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note_cliente']['language'])? $fields['note_cliente']['language'] : array())) }}</td>
						<td>{{ $row->note_cliente}} </td>
						
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
			$('#{{ str_replace(" ","_",$subgrid[$i]['title']) }}').load('{{ url("clienti/lookup?param=".implode("-",$subgrid["$i"])."-".$id)}}')
		<?php endfor;?>
	})

</script>
	  
@stop