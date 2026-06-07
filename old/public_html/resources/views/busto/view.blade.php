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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('busto/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('busto/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('busto/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('busto?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
			<div class="table-responsive">
				<table class="table table-striped " >
					<tbody>	
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Vita', (isset($fields['misura_vita']['language'])? $fields['misura_vita']['language'] : array())) }}</td>
						<td>{{ $row->misura_vita}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura Bacino', (isset($fields['misura_bacino']['language'])? $fields['misura_bacino']['language'] : array())) }}</td>
						<td>{{ $row->misura_bacino}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Misura 2-4', (isset($fields['misura_2_4']['language'])? $fields['misura_2_4']['language'] : array())) }}</td>
						<td>{{ $row->misura_2_4}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Fino Ascella', (isset($fields['fino_ascella']['language'])? $fields['fino_ascella']['language'] : array())) }}</td>
						<td>{{ $row->fino_ascella}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Spallacci', (isset($fields['spallacci']['language'])? $fields['spallacci']['language'] : array())) }}</td>
						<td>{{ $row->spallacci}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altezza Stoffa Anteriore', (isset($fields['alt_stoffa_ant']['language'])? $fields['alt_stoffa_ant']['language'] : array())) }}</td>
						<td>{{ $row->alt_stoffa_ant}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altezza Totale Armatura', (isset($fields['alt_tot_armatura']['language'])? $fields['alt_tot_armatura']['language'] : array())) }}</td>
						<td>{{ $row->alt_tot_armatura}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Distanza Ascellare', (isset($fields['dist_ascellare']['language'])? $fields['dist_ascellare']['language'] : array())) }}</td>
						<td>{{ $row->dist_ascellare}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
