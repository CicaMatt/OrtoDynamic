@extends('layouts.app')

@section('content')
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li><a href="{{ url($pageModule) }}"> {{ $pageTitle }} </a></li>
		<li class="active"> Form  </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

	{!! Form::open(array('url'=>'clienti?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
	<div class="sbox">
		<div class="sbox-title clearfix">
			<div class="sbox-tools " >
				<a href="{{ url($pageModule.'?return='.$return) }}" class="tips btn btn-sm "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-times"></i></a> 
			</div>
			<div class="sbox-tools pull-left" >
				<button name="apply" class="tips btn btn-sm btn-apply  "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-check"></i> Applica Modifiche </button>
				<button name="save" class="tips btn btn-sm btn-save"  title="{{ __('core.btn_back') }}" ><i class="fa  fa-paste"></i> Salva </button> 
				<button name="both" class="tips btn btn-sm btn-save"  title="{{ __('core.btn_back') }}" ><i class="fa  fa-paste"></i> Salva e Inserisci Preventivo </button>
				<a target="_blank" href="{{ url('generaPdf.php?checkedvalue='.$row['id'].'&tipologia=privacy')}}" class="tips" ><input type="button" class="tips btn btn-sm btn-danger"  title="{{ __('core.btn_back') }}" value="Genera Modulo di privacy"></a> 
			</div>
		</div>	
		<div class="sbox-content clearfix">
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		
<ul class="nav nav-tabs"><li class="active"><a href="#AnagraficaCliente" data-toggle="tab">Anagrafica Cliente</a></li>
				<li class=""><a href="#MisurePiede" data-toggle="tab">Misure Piede</a></li>
				<li class=""><a href="#MisureBusto" data-toggle="tab">Misure Busto</a></li>
				<li class=""><a href="#MisureGenerali" data-toggle="tab">Misure Generali</a></li>
				</ul><div class="tab-content"><div class="tab-pane m-t active" id="AnagraficaCliente"> 
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Cognome" class=" control-label col-md-4 text-left"> Cognome <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='cognome' id='cognome' value='{{ $row['cognome'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Nome" class=" control-label col-md-4 text-left"> Nome <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='nome' id='nome' value='{{ $row['nome'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Fiscale" class=" control-label col-md-4 text-left"> Codice Fiscale </label>
										<div class="col-md-6">
											<div class="input-group input-group-sm">
												<input  type='text' name='codice_fiscale' id='codice_fiscale' value='{{ $row['codice_fiscale'] }}' 
						     class='form-control' />
												<span class="input-group-btn">
													<button class="btn btn-default" type="button" id="generateCodiceFiscale">Genera CF</button>
												</span>
											</div>
											<small class="text-muted help-block m-t-xs">La generazione automatica può risultare errata in caso di omocodie: controlla sempre il codice fiscale suggerito.</small>
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Nascita" class=" control-label col-md-4 text-left"> Data Nascita <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
					<div class="input-group m-b" style="width:150px !important;">
						{!! Form::date('data_nascita', $row['data_nascita'],array('class'=>'form-control input-sm','id'=>'data_nascita')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div>
									  <div class="form-group  " >
										<label for="Sesso" class=" control-label col-md-4 text-left"> Sesso <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
					<?php $sesso = explode(',',$row['sesso']);
					$sesso_opt = array( 'M' => 'M' ,  'F' => 'F' , ); ?>
					<select name='sesso' rows='5' required  class='select2 '  > 
						<?php 
						foreach($sesso_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['sesso'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
									  <div class="form-group  " >
										<label for="Comune Nascita" class=" control-label col-md-4 text-left"> Comune Nascita </label>
										<div class="col-md-6">
										  <select name='comune_nascita' rows='5' id='comune_nascita' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div>
									  
									  <div class="form-group  " >
										<label for="Comune Nascita Estero" class=" control-label col-md-4 text-left"> Comune Nascita Estero </label>
										<div class="col-md-6">
										  <input  type='text' name='comune_estero' id='comune_estero' value='{{ $row['comune_estero'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
									  
									  <div class="form-group  " >
										<label for="Indirizzo" class=" control-label col-md-4 text-left"> Indirizzo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='indirizzo' id='indirizzo' value='{{ $row['indirizzo'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Provincia" class=" control-label col-md-4 text-left"> Provincia <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='provincia' rows='5' id='provincia' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Citta" class=" control-label col-md-4 text-left"> Citta <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='citta' rows='5' id='citta' class='select2 '  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cap" class=" control-label col-md-4 text-left"> Cap </label>
										<div class="col-md-6">
										  <input  type='text' name='cap' id='cap' value='{{ $row['cap'] }}' class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Nazione" class=" control-label col-md-4 text-left"> Nazione </label>
										<div class="col-md-6">
										  <select name='nazione' rows='5' id='nazione' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <!-- <div class="form-group  " >
										<label for="Medico" class=" control-label col-md-4 text-left"> Medico </label>
										<div class="col-md-6">
										  <select name='id_medico' rows='5' id='id_medico' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> -->					
									  <div class="form-group  " >
										<label for="Telefono" class=" control-label col-md-4 text-left"> Telefono <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='telefono' id='telefono' value='{{ $row['telefono'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div>  					
									  <div class="form-group  " >
										<label for="Email" class=" control-label col-md-4 text-left"> Email </label>
										<div class="col-md-6">
										  <input  type='text' name='email' id='email' value='{{ $row['email'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cellulare" class=" control-label col-md-4 text-left"> Cellulare </label>
										<div class="col-md-6">
										  <input  type='text' name='cellulare' id='cellulare' value='{{ $row['cellulare'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Note" class=" control-label col-md-4 text-left"> Note </label>
										<div class="col-md-6">
										  <textarea name='note_cliente' rows='5' id='note_cliente' class='form-control input-sm '>{{ $row['note_cliente'] }}</textarea> 
<br>
	                                   <a class="button" onclick=setta() style="border:1px; border-style:solid; border-color:#1ab394; padding: 3px;">Cancella note</a>
										 </div> 
                                         
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
			</div>
   
			
			<div class="tab-pane m-t " id="MisurePiede"> 
									
									  <div class="form-group  " >
										<label for="Collo" class=" control-label col-md-4 text-left"> Collo </label>
										<div class="col-md-6">
										  <input  type='text' name='collo' id='collo' value='{{ $row['collo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pianta" class=" control-label col-md-4 text-left"> Pianta </label>
										<div class="col-md-6">
										  <input  type='text' name='pianta' id='pianta' value='{{ $row['pianta'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura Scarpa" class=" control-label col-md-4 text-left"> Misura Scarpa </label>
										<div class="col-md-6">
										  <input  type='text' name='misura_scarpa' id='misura_scarpa' value='{{ $row['misura_scarpa'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Speronatura" class=" control-label col-md-4 text-left"> Speronatura </label>
										<div class="col-md-6">
										  <input  type='text' name='speronatura' id='speronatura' value='{{ $row['speronatura'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Rialzo" class=" control-label col-md-4 text-left"> Rialzo </label>
										<div class="col-md-6">
										  <input  type='text' name='rialzo' id='rialzo' value='{{ $row['rialzo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Piano Incl Tot" class=" control-label col-md-4 text-left"> Piano Incl Tot </label>
										<div class="col-md-6">
										  <input  type='text' name='piano_incl_tot' id='piano_incl_tot' value='{{ $row['piano_incl_tot'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tipo Plantare" class=" control-label col-md-4 text-left"> Tipo Plantare </label>
										<div class="col-md-6">
										  <input  type='text' name='tipo_plantare' id='tipo_plantare' value='{{ $row['tipo_plantare'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Note" class=" control-label col-md-4 text-left"> Note </label>
										<div class="col-md-6">
										  <textarea name='note' rows='5' id='note' class='form-control input-sm '  
				           >{{ $row['note'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
			</div>
			
			<div class="tab-pane m-t " id="MisureBusto"> 
									
									  <div class="form-group  " >
										<label for="Misura Vita" class=" control-label col-md-4 text-left"> Misura Vita </label>
										<div class="col-md-6">
										  <input  type='text' name='misura_vita' id='misura_vita' value='{{ $row['misura_vita'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura Bacino" class=" control-label col-md-4 text-left"> Misura Bacino </label>
										<div class="col-md-6">
										  <input  type='text' name='misura_bacino' id='misura_bacino' value='{{ $row['misura_bacino'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura 2 4" class=" control-label col-md-4 text-left"> Misura 2 4 </label>
										<div class="col-md-6">
										  <input  type='text' name='misura_2_4' id='misura_2_4' value='{{ $row['misura_2_4'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Fino Ascella" class=" control-label col-md-4 text-left"> Fino Ascella </label>
										<div class="col-md-6">
										  <input  type='text' name='fino_ascella' id='fino_ascella' value='{{ $row['fino_ascella'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Spallacci" class=" control-label col-md-4 text-left"> Spallacci </label>
										<div class="col-md-6">
										  
					
					<input type='radio' name='spallacci' value ='No'  @if($row['spallacci'] == 'No') checked="checked" @endif class='minimal-red' > No 
					
					<input type='radio' name='spallacci' value ='Si'  @if($row['spallacci'] == 'Si') checked="checked" @endif class='minimal-red' > Si  
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Altezza Stoffa Anteriore" class=" control-label col-md-4 text-left"> Altezza Stoffa Anteriore </label>
										<div class="col-md-6">
										  <input  type='text' name='alt_stoffa_ant' id='alt_stoffa_ant' value='{{ $row['alt_stoffa_ant'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Altezza Totale Armatura" class=" control-label col-md-4 text-left"> Altezza Totale Armatura </label>
										<div class="col-md-6">
										  <input  type='text' name='alt_tot_armatura' id='alt_tot_armatura' value='{{ $row['alt_tot_armatura'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Distanza Ascellare" class=" control-label col-md-4 text-left"> Distanza Ascellare </label>
										<div class="col-md-6">
										  <input  type='text' name='dist_ascellare' id='dist_ascellare' value='{{ $row['dist_ascellare'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
			</div>
			
			<div class="tab-pane m-t " id="MisureGenerali"> 
									  <div class="form-group  " >
										<label for="Tipo Tutore" class=" control-label col-md-4 text-left"> Tipo Tutore </label>
										<div class="col-md-6">
										  <input  type='text' name='tipo_tutore' id='tipo_tutore' value='{{ $row['tipo_tutore'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div>   
									    
									  <div class="form-group  " >
										<label for="Collo" class=" control-label col-md-4 text-left"> Collo </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_collo' id='mis_collo' value='{{ $row['mis_collo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Omero" class=" control-label col-md-4 text-left"> Omero </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_omero' id='mis_omero' value='{{ $row['mis_omero'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Braccio" class=" control-label col-md-4 text-left"> Braccio </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_braccio' id='mis_braccio' value='{{ $row['mis_braccio'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Polso" class=" control-label col-md-4 text-left"> Polso </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_polso' id='mis_polso' value='{{ $row['mis_polso'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Bacino" class=" control-label col-md-4 text-left"> Bacino </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_bacino' id='mis_bacino' value='{{ $row['mis_bacino'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Coscia" class=" control-label col-md-4 text-left"> Coscia </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_coscia' id='mis_coscia' value='{{ $row['mis_coscia'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Gamba" class=" control-label col-md-4 text-left"> Gamba </label>
										<div class="col-md-6">
										  <input  type='text' name='mis_gamba' id='mis_gamba' value='{{ $row['mis_gamba'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Altro" class=" control-label col-md-4 text-left"> Altro </label>
										<div class="col-md-6">
										  <textarea name='altro' rows='5' id='altro' class='form-control input-sm '  
				           >{{ $row['altro'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
			</div>
			
			

		</div>
	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		

		 
   <script type="text/javascript">
(function($){
	var comuneCodesCache = null;
	var comuneCodesRequest = null;
	var comuneCodesUrl = "{{ asset('js/comuni-codici-catastali.json') }}";
	var monthCodes = ['A','B','C','D','E','H','L','M','P','R','S','T'];
	var oddValues = {
		'0':1,'1':0,'2':5,'3':7,'4':9,'5':13,'6':15,'7':17,'8':19,'9':21,
		'A':1,'B':0,'C':5,'D':7,'E':9,'F':13,'G':15,'H':17,'I':19,'J':21,
		'K':2,'L':4,'M':18,'N':20,'O':11,'P':3,'Q':6,'R':8,'S':12,'T':14,
		'U':16,'V':10,'W':22,'X':25,'Y':24,'Z':23
	};
	var evenValues = {
		'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
		'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,
		'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,'T':19,
		'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25
	};
	var checkLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	function stripDiacritics(value){
		if(!value){
			return '';
		}
		if(typeof value.normalize === 'function'){
			return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
		}
		return value;
	}

	function onlyLetters(value){
		return (value || '').toUpperCase().replace(/[^A-Z]/g,'');
	}

	function normalizeComuneName(label){
		return onlyLetters(stripDiacritics(label || ''));
	}

	function loadComuneCodes(){
		if(comuneCodesCache){
			return $.Deferred().resolve(comuneCodesCache).promise();
		}
		if(comuneCodesRequest){
			return comuneCodesRequest;
		}
		comuneCodesRequest = $.getJSON(comuneCodesUrl).done(function(data){
			comuneCodesCache = data || {};
		}).fail(function(){
			comuneCodesRequest = null;
		});
		return comuneCodesRequest;
	}

	function resolveComuneCode(label){
		if(!comuneCodesCache){
			return null;
		}
		var normalized = normalizeComuneName(label);
		return normalized ? (comuneCodesCache[normalized] || null) : null;
	}

	function buildNameCode(value, isName){
		var cleaned = onlyLetters(stripDiacritics(value || ''));
		var consonants = cleaned.replace(/[AEIOU]/g,'');
		var vowels = cleaned.replace(/[^AEIOU]/g,'');
		var code = '';
		if(isName && consonants.length >= 4){
			code = consonants.charAt(0) + consonants.charAt(2) + consonants.charAt(3);
		} else {
			code = consonants.substr(0,3);
		}
		if(code.length < 3){
			code += vowels.substr(0, 3 - code.length);
		}
		while(code.length < 3){
			code += 'X';
		}
		return code;
	}

	function buildDateCode(dateStr, gender){
		if(!dateStr){
			return null;
		}
		var parts = dateStr.split('-');
		if(parts.length !== 3){
			return null;
		}
		var monthIndex = parseInt(parts[1],10) - 1;
		var day = parseInt(parts[2],10);
		if(isNaN(monthIndex) || isNaN(day) || monthIndex < 0 || monthIndex > 11){
			return null;
		}
		var monthCode = monthCodes[monthIndex];
		var year = parts[0].slice(-2);
		if((gender || '').toUpperCase() === 'F'){
			day += 40;
		}
		var dayString = day < 10 ? '0' + day : String(day);
		return year + monthCode + dayString;
	}

	function buildControlChar(partial){
		var sum = 0;
		for(var i = 0; i < partial.length; i++){
			var current = partial.charAt(i);
			if((i + 1) % 2 === 0){
				sum += (evenValues[current] !== undefined ? evenValues[current] : 0);
			} else {
				sum += (oddValues[current] !== undefined ? oddValues[current] : 0);
			}
		}
		return checkLetters.charAt(sum % 26);
	}

	function buildCodiceFiscale(payload){
		var surnameCode = buildNameCode(payload.cognome, false);
		var nameCode = buildNameCode(payload.nome, true);
		var dateCode = buildDateCode(payload.birthDate, payload.gender);
		if(!payload.comuneCode || !dateCode){
			return null;
		}
		var partial = surnameCode + nameCode + dateCode + payload.comuneCode;
		return partial + buildControlChar(partial);
	}

	function cleanComuneLabel(label){
		var text = $.trim(label || '');
		if(!text){
			return '';
		}
		var parts = text.split(' ');
		if(parts.length > 1){
			var lastPart = parts[parts.length - 1];
			if(/^[A-Z]{2}$/.test(lastPart)){
				parts.pop();
			}
		}
		return parts.join(' ');
	}

	function handleGenerateCf(){
		var missing = [];
		var cognome = $.trim($('#cognome').val());
		var nome = $.trim($('#nome').val());
		var dataNascita = $('#data_nascita').val() || $('input[name="data_nascita"]').val();
		var sesso = $('select[name="sesso"]').val();
		var comuneVal = $('#comune_nascita').val();
		var comuneLabel = comuneVal ? cleanComuneLabel($('#comune_nascita option:selected').text()) : '';

		if(!cognome){
			missing.push('Cognome');
		}
		if(!nome){
			missing.push('Nome');
		}
		if(!dataNascita){
			missing.push('Data di nascita');
		}
		if(!sesso){
			missing.push('Sesso');
		}
		if(!comuneLabel){
			missing.push('Comune di nascita');
		}

		if(missing.length){
			alert('Per generare il codice fiscale è necessario compilare: ' + missing.join(', '));
			return;
		}

		loadComuneCodes().done(function(){
			var comuneCode = resolveComuneCode(comuneLabel);
			if(!comuneCode){
				alert('Comune di nascita non riconosciuto. Inserisci il codice fiscale manualmente.');
				return;
			}
			var codice = buildCodiceFiscale({
				nome: nome,
				cognome: cognome,
				birthDate: dataNascita,
				gender: sesso,
				comuneCode: comuneCode
			});
			if(!codice){
				alert('Impossibile generare il codice fiscale con i dati inseriti.');
				return;
			}
			$('#codice_fiscale').val(codice);
		}).fail(function(){
			alert('Impossibile caricare i dati necessari per la generazione del codice fiscale.');
		});
	}

	$(document).ready(function() { 
		
		
		
		$("#comune_nascita").jCombo("{!! url('clienti/comboselect?filter=comuni:Comune:Comune|Provincia') !!}",
		{  selected_value : '{{ $row["comune_nascita"] }}' });
		
		$("#provincia").jCombo("{!! url('clienti/comboselect?filter=provincia:Provincia:Provincia') !!}",
		{  selected_value : '{{ $row["provincia"] }}' });
		
		$("#citta").jCombo("{!! url('clienti/comboselect?filter=comuni:Comune:Comune') !!}&parent=provincia:",
		{  parent: '#provincia', selected_value : '{{ $row["citta"] }}' });
		
		$("#nazione").jCombo("{!! url('clienti/comboselect?filter=stati:nome_stati:nome_stati|sigla_iso_3166_1_alpha_3_stati') !!}",
		{  selected_value : '{{ $row["nazione"] }}' });
		
		$("#id_medico").jCombo("{!! url('clienti/comboselect?filter=medici:id:cognome|nome') !!}",
		{  selected_value : '{{ $row["id_medico"] }}' });
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("clienti/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		

		$('#generateCodiceFiscale').on('click', handleGenerateCf);
		
	});
})(jQuery);
	</script>		 

   <script type="text/javascript">

function setta(){
document.getElementById("note_cliente").value = "Nessuna";
}
</script>
@stop
