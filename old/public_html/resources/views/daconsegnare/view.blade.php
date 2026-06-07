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
		   		<a href="{{ ($prevnext['prev'] != '' ? url('daconsegnare/'.$prevnext['prev'].'?return='.$return ) : '#') }}" class="tips btn btn-sm"><i class="fa fa-arrow-left"></i>  </a>	
				<a href="{{ ($prevnext['next'] != '' ? url('daconsegnare/'.$prevnext['next'].'?return='.$return ) : '#') }}" class="tips btn btn-sm "> <i class="fa fa-arrow-right"></i>  </a>					
			</div>	

			<div class="sbox-tools" >
				@if($access['is_add'] ==1)
		   		<a href="{{ url('daconsegnare/'.$id.'/edit?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_edit') }}"><i class="fa  fa-pencil"></i></a>
				@endif
				<a href="{{ url('daconsegnare?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
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
						<td>{{ $row->id_preventivo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Id Cliente', (isset($fields['id_cliente']['language'])? $fields['id_cliente']['language'] : array())) }}</td>
						<td>{{ $row->id_cliente}} </td>
						
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
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Fine Lavorazione', (isset($fields['data_fine_lavorazione']['language'])? $fields['data_fine_lavorazione']['language'] : array())) }}</td>
						<td>{{ $row->data_fine_lavorazione}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Consegna', (isset($fields['data_consegna']['language'])? $fields['data_consegna']['language'] : array())) }}</td>
						<td>{{ $row->data_consegna}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Prova Cliente', (isset($fields['prova_cliente']['language'])? $fields['prova_cliente']['language'] : array())) }}</td>
						<td>{{ $row->prova_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Pos Ril', (isset($fields['pos_ril']['language'])? $fields['pos_ril']['language'] : array())) }}</td>
						<td>{{ $row->pos_ril}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Firma Medico', (isset($fields['firma_medico']['language'])? $fields['firma_medico']['language'] : array())) }}</td>
						<td>{{ $row->firma_medico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Verifica Cliente', (isset($fields['Verifica_cliente']['language'])? $fields['Verifica_cliente']['language'] : array())) }}</td>
						<td>{{ $row->Verifica_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Verifica Pos Ril', (isset($fields['verifica_pos_ril']['language'])? $fields['verifica_pos_ril']['language'] : array())) }}</td>
						<td>{{ $row->verifica_pos_ril}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Prova Cliente', (isset($fields['data_prova_cliente']['language'])? $fields['data_prova_cliente']['language'] : array())) }}</td>
						<td>{{ $row->data_prova_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Verifica Cliente', (isset($fields['data_verifica_cliente']['language'])? $fields['data_verifica_cliente']['language'] : array())) }}</td>
						<td>{{ $row->data_verifica_cliente}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Stato Lavorazione Assistenza', (isset($fields['stato_lavorazione_assistenza']['language'])? $fields['stato_lavorazione_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->stato_lavorazione_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Assistenza Tecnica', (isset($fields['assistenza_tecnica']['language'])? $fields['assistenza_tecnica']['language'] : array())) }}</td>
						<td>{{ $row->assistenza_tecnica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Ragione Reclamo', (isset($fields['ragione_reclamo']['language'])? $fields['ragione_reclamo']['language'] : array())) }}</td>
						<td>{{ $row->ragione_reclamo}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Presidio', (isset($fields['presidio']['language'])? $fields['presidio']['language'] : array())) }}</td>
						<td>{{ $row->presidio}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Garanzia', (isset($fields['garanzia']['language'])? $fields['garanzia']['language'] : array())) }}</td>
						<td>{{ $row->garanzia}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Descrizione Intervento', (isset($fields['descrizione_intervento']['language'])? $fields['descrizione_intervento']['language'] : array())) }}</td>
						<td>{{ $row->descrizione_intervento}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Consegna Assistenza', (isset($fields['data_consegna_assistenza']['language'])? $fields['data_consegna_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->data_consegna_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Annotazioni Tecniche Assistenza', (isset($fields['annotazioni_tecniche_assistenza']['language'])? $fields['annotazioni_tecniche_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->annotazioni_tecniche_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Esito Collaudo Assistenza Tecnica', (isset($fields['esito_collaudo_assistenza_tecnica']['language'])? $fields['esito_collaudo_assistenza_tecnica']['language'] : array())) }}</td>
						<td>{{ $row->esito_collaudo_assistenza_tecnica}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Data Esito Collaudo Assistenza', (isset($fields['data_esito_collaudo_assistenza']['language'])? $fields['data_esito_collaudo_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->data_esito_collaudo_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Firma Medico Assistenza', (isset($fields['firma_medico_assistenza']['language'])? $fields['firma_medico_assistenza']['language'] : array())) }}</td>
						<td>{{ $row->firma_medico_assistenza}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Firma Tecnico', (isset($fields['firma_tecnico']['language'])? $fields['firma_tecnico']['language'] : array())) }}</td>
						<td>{{ $row->firma_tecnico}} </td>
						
					</tr>
				
					<tr>
						<td width='30%' class='label-view text-right'>{{ SiteHelpers::activeLang('Massima Scadenza', (isset($fields['massima_scadenza']['language'])? $fields['massima_scadenza']['language'] : array())) }}</td>
						<td>{{ $row->massima_scadenza}} </td>
						
					</tr>
				
					</tbody>	
				</table>   

			 	

			</div>
		</div>
	</div>
	</div>
</div>
@stop
