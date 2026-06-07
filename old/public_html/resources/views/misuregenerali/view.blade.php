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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('misuregenerali/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('misuregenerali/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('misuregenerali/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('misuregenerali?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
			<div class="table-responsive">
				<table class="table table-striped " >
					<tbody>	
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Collo', (isset($fields['mis_collo']['language'])? $fields['mis_collo']['language'] : array())) }}</td>
						<td>{{ $row->mis_collo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Omero', (isset($fields['mis_omero']['language'])? $fields['mis_omero']['language'] : array())) }}</td>
						<td>{{ $row->mis_omero}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Braccio', (isset($fields['mis_braccio']['language'])? $fields['mis_braccio']['language'] : array())) }}</td>
						<td>{{ $row->mis_braccio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Polso', (isset($fields['mis_polso']['language'])? $fields['mis_polso']['language'] : array())) }}</td>
						<td>{{ $row->mis_polso}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Bacino', (isset($fields['mis_bacino']['language'])? $fields['mis_bacino']['language'] : array())) }}</td>
						<td>{{ $row->mis_bacino}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Coscia', (isset($fields['mis_coscia']['language'])? $fields['mis_coscia']['language'] : array())) }}</td>
						<td>{{ $row->mis_coscia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Gamba', (isset($fields['mis_gamba']['language'])? $fields['mis_gamba']['language'] : array())) }}</td>
						<td>{{ $row->mis_gamba}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Altro', (isset($fields['altro']['language'])? $fields['altro']['language'] : array())) }}</td>
						<td>{{ $row->altro}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
