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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('preventivi/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('preventivi/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('preventivi/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('preventivi?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Programma Terapeutico', (isset($fields['programma_terapeutico']['language'])? $fields['programma_terapeutico']['language'] : array())) }}</td>
						<td>{{ $row->programma_terapeutico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prescizione Dettagliata Protesi', (isset($fields['prescizione_dettagliata_protesi']['language'])? $fields['prescizione_dettagliata_protesi']['language'] : array())) }}</td>
						<td>{{ $row->prescizione_dettagliata_protesi}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Creazione', (isset($fields['data_creazione']['language'])? $fields['data_creazione']['language'] : array())) }}</td>
						<td>{{ $row->data_creazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Emissione', (isset($fields['data_preventivo']['language'])? $fields['data_preventivo']['language'] : array())) }}</td>
						<td>{{ $row->data_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato', (isset($fields['stato']['language'])? $fields['stato']['language'] : array())) }}</td>
						<td>{{ $row->stato}} </td>
						
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
			$('#{{ str_replace(" ","_",$subgrid[$i]['title']) }}').load('{{ url("preventivi/lookup?param=".implode("-",$subgrid["$i"])."-".$id)}}')
		<?php endfor;?>
	})

</script>
	  
@stop