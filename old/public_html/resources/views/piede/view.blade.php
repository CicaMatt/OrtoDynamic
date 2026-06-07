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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('piede/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('piede/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('piede/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('piede?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
			<div class="table-responsive">
				<table class="table table-striped " >
					<tbody>	
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Collo', (isset($fields['collo']['language'])? $fields['collo']['language'] : array())) }}</td>
						<td>{{ $row->collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pianta', (isset($fields['pianta']['language'])? $fields['pianta']['language'] : array())) }}</td>
						<td>{{ $row->pianta}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Scarpa', (isset($fields['misura_scarpa']['language'])? $fields['misura_scarpa']['language'] : array())) }}</td>
						<td>{{ $row->misura_scarpa}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Speronatura', (isset($fields['speronatura']['language'])? $fields['speronatura']['language'] : array())) }}</td>
						<td>{{ $row->speronatura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Rialzo', (isset($fields['rialzo']['language'])? $fields['rialzo']['language'] : array())) }}</td>
						<td>{{ $row->rialzo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Piano Incl Tot', (isset($fields['piano_incl_tot']['language'])? $fields['piano_incl_tot']['language'] : array())) }}</td>
						<td>{{ $row->piano_incl_tot}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Tipo Plantare', (isset($fields['tipo_plantare']['language'])? $fields['tipo_plantare']['language'] : array())) }}</td>
						<td>{{ $row->tipo_plantare}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Modello Scarpa', (isset($fields['modello_scarpa']['language'])? $fields['modello_scarpa']['language'] : array())) }}</td>
						<td>{{ $row->modello_scarpa}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Caviglia', (isset($fields['caviglia']['language'])? $fields['caviglia']['language'] : array())) }}</td>
						<td>{{ $row->caviglia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Passaggio Collo', (isset($fields['passaggio_collo']['language'])? $fields['passaggio_collo']['language'] : array())) }}</td>
						<td>{{ $row->passaggio_collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Passaggio Caviglie', (isset($fields['passaggio_caviglie']['language'])? $fields['passaggio_caviglie']['language'] : array())) }}</td>
						<td>{{ $row->passaggio_caviglie}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Note', (isset($fields['note']['language'])? $fields['note']['language'] : array())) }}</td>
						<td>{{ $row->note}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
