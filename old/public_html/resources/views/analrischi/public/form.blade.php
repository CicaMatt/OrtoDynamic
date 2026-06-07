

		 {!! Form::open(array('url'=>'analrischi/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Analisi Rischi</legend>
									
									  <div class="form-group  " >
										<label for="Id" class=" control-label col-md-4 text-left"> Id </label>
										<div class="col-md-6">
										  <input  type='text' name='id' id='id' value='{{ $row['id'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Id Lavorazione" class=" control-label col-md-4 text-left"> Id Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='id_lavorazione' id='id_lavorazione' value='{{ $row['id_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Id Preventivo" class=" control-label col-md-4 text-left"> Id Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='id_preventivo' id='id_preventivo' value='{{ $row['id_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Id Cliente" class=" control-label col-md-4 text-left"> Id Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='id_cliente' id='id_cliente' value='{{ $row['id_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Uso Previsto" class=" control-label col-md-4 text-left"> Uso Previsto </label>
										<div class="col-md-6">
										  <textarea name='uso_previsto' rows='5' id='uso_previsto' class='form-control input-sm '  
				           >{{ $row['uso_previsto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Modalita Di Utilizzo" class=" control-label col-md-4 text-left"> Modalita Di Utilizzo </label>
										<div class="col-md-6">
										  <textarea name='modalita_di_utilizzo' rows='5' id='modalita_di_utilizzo' class='form-control input-sm '  
				           >{{ $row['modalita_di_utilizzo'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Contatto Previto" class=" control-label col-md-4 text-left"> Contatto Previto </label>
										<div class="col-md-6">
										  <textarea name='contatto_previto' rows='5' id='contatto_previto' class='form-control input-sm '  
				           >{{ $row['contatto_previto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Durata Contatto" class=" control-label col-md-4 text-left"> Durata Contatto </label>
										<div class="col-md-6">
										  <textarea name='durata_contatto' rows='5' id='durata_contatto' class='form-control input-sm '  
				           >{{ $row['durata_contatto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Frequenza Contatto" class=" control-label col-md-4 text-left"> Frequenza Contatto </label>
										<div class="col-md-6">
										  <textarea name='frequenza_contatto' rows='5' id='frequenza_contatto' class='form-control input-sm '  
				           >{{ $row['frequenza_contatto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Gesso" class=" control-label col-md-4 text-left"> Gesso </label>
										<div class="col-md-6">
										  <textarea name='gesso' rows='5' id='gesso' class='form-control input-sm '  
				           >{{ $row['gesso'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cuoio" class=" control-label col-md-4 text-left"> Cuoio </label>
										<div class="col-md-6">
										  <textarea name='cuoio' rows='5' id='cuoio' class='form-control input-sm '  
				           >{{ $row['cuoio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Fodera" class=" control-label col-md-4 text-left"> Fodera </label>
										<div class="col-md-6">
										  <textarea name='fodera' rows='5' id='fodera' class='form-control input-sm '  
				           >{{ $row['fodera'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Materiali Sintetici" class=" control-label col-md-4 text-left"> Materiali Sintetici </label>
										<div class="col-md-6">
										  <textarea name='materiali_sintetici' rows='5' id='materiali_sintetici' class='form-control input-sm '  
				           >{{ $row['materiali_sintetici'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Sughero" class=" control-label col-md-4 text-left"> Sughero </label>
										<div class="col-md-6">
										  <textarea name='sughero' rows='5' id='sughero' class='form-control input-sm '  
				           >{{ $row['sughero'] }}</textarea> 
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
									  <div class="form-group  " >
										<label for="Influssi Previsti" class=" control-label col-md-4 text-left"> Influssi Previsti </label>
										<div class="col-md-6">
										  <textarea name='influssi_previsti' rows='5' id='influssi_previsti' class='form-control input-sm '  
				           >{{ $row['influssi_previsti'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Conseguenze Previste" class=" control-label col-md-4 text-left"> Conseguenze Previste </label>
										<div class="col-md-6">
										  <textarea name='conseguenze_previste' rows='5' id='conseguenze_previste' class='form-control input-sm '  
				           >{{ $row['conseguenze_previste'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Si No Manutenzione" class=" control-label col-md-4 text-left"> Si No Manutenzione </label>
										<div class="col-md-6">
										  <textarea name='si_no_manutenzione' rows='5' id='si_no_manutenzione' class='form-control input-sm '  
				           >{{ $row['si_no_manutenzione'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Si No Taratura" class=" control-label col-md-4 text-left"> Si No Taratura </label>
										<div class="col-md-6">
										  <textarea name='si_no_taratura' rows='5' id='si_no_taratura' class='form-control input-sm '  
				           >{{ $row['si_no_taratura'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Si No Durata Limitata" class=" control-label col-md-4 text-left"> Si No Durata Limitata </label>
										<div class="col-md-6">
										  <textarea name='si_no_durata_limitata' rows='5' id='si_no_durata_limitata' class='form-control input-sm '  
				           >{{ $row['si_no_durata_limitata'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Durata Prevista" class=" control-label col-md-4 text-left"> Durata Prevista </label>
										<div class="col-md-6">
										  <textarea name='durata_prevista' rows='5' id='durata_prevista' class='form-control input-sm '  
				           >{{ $row['durata_prevista'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Effetti Lungo Utilizzo" class=" control-label col-md-4 text-left"> Effetti Lungo Utilizzo </label>
										<div class="col-md-6">
										  <textarea name='effetti_lungo_utilizzo' rows='5' id='effetti_lungo_utilizzo' class='form-control input-sm '  
				           >{{ $row['effetti_lungo_utilizzo'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prodotti Associati" class=" control-label col-md-4 text-left"> Prodotti Associati </label>
										<div class="col-md-6">
										  <textarea name='prodotti_associati' rows='5' id='prodotti_associati' class='form-control input-sm '  
				           >{{ $row['prodotti_associati'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Forze Meccaniche Del Dispositivo" class=" control-label col-md-4 text-left"> Forze Meccaniche Del Dispositivo </label>
										<div class="col-md-6">
										  <textarea name='forze_meccaniche_del_dispositivo' rows='5' id='forze_meccaniche_del_dispositivo' class='form-control input-sm '  
				           >{{ $row['forze_meccaniche_del_dispositivo'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Determinante Durata" class=" control-label col-md-4 text-left"> Determinante Durata </label>
										<div class="col-md-6">
										  <textarea name='determinante_durata' rows='5' id='determinante_durata' class='form-control input-sm '  
				           >{{ $row['determinante_durata'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Caratteristiche Compromettenti" class=" control-label col-md-4 text-left"> Caratteristiche Compromettenti </label>
										<div class="col-md-6">
										  <textarea name='caratteristiche_compromettenti' rows='5' id='caratteristiche_compromettenti' class='form-control input-sm '  
				           >{{ $row['caratteristiche_compromettenti'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Elenco Limiti Applicazione" class=" control-label col-md-4 text-left"> Elenco Limiti Applicazione </label>
										<div class="col-md-6">
										  <textarea name='elenco_limiti_applicazione' rows='5' id='elenco_limiti_applicazione' class='form-control input-sm '  
				           >{{ $row['elenco_limiti_applicazione'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Elettricità" class=" control-label col-md-4 text-left"> Elettricità </label>
										<div class="col-md-6">
										  <input  type='text' name='elettricità' id='elettricità' value='{{ $row['elettricità'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Calore" class=" control-label col-md-4 text-left"> Calore </label>
										<div class="col-md-6">
										  <input  type='text' name='calore' id='calore' value='{{ $row['calore'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Forza Meccanica" class=" control-label col-md-4 text-left"> Forza Meccanica </label>
										<div class="col-md-6">
										  <input  type='text' name='forza_meccanica' id='forza_meccanica' value='{{ $row['forza_meccanica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Radiazioni Ionizzanti" class=" control-label col-md-4 text-left"> Radiazioni Ionizzanti </label>
										<div class="col-md-6">
										  <input  type='text' name='radiazioni_ionizzanti' id='radiazioni_ionizzanti' value='{{ $row['radiazioni_ionizzanti'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Campi Elettromagnetici" class=" control-label col-md-4 text-left"> Campi Elettromagnetici </label>
										<div class="col-md-6">
										  <input  type='text' name='campi_elettromagnetici' id='campi_elettromagnetici' value='{{ $row['campi_elettromagnetici'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Parti Mobili" class=" control-label col-md-4 text-left"> Parti Mobili </label>
										<div class="col-md-6">
										  <input  type='text' name='parti_mobili' id='parti_mobili' value='{{ $row['parti_mobili'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Masse Sospese" class=" control-label col-md-4 text-left"> Masse Sospese </label>
										<div class="col-md-6">
										  <input  type='text' name='masse_sospese' id='masse_sospese' value='{{ $row['masse_sospese'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Guasto" class=" control-label col-md-4 text-left"> Guasto </label>
										<div class="col-md-6">
										  <input  type='text' name='guasto' id='guasto' value='{{ $row['guasto'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pressione Rottura" class=" control-label col-md-4 text-left"> Pressione Rottura </label>
										<div class="col-md-6">
										  <input  type='text' name='pressione_rottura' id='pressione_rottura' value='{{ $row['pressione_rottura'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pressione Acustica" class=" control-label col-md-4 text-left"> Pressione Acustica </label>
										<div class="col-md-6">
										  <input  type='text' name='pressione_acustica' id='pressione_acustica' value='{{ $row['pressione_acustica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Vibrazione" class=" control-label col-md-4 text-left"> Vibrazione </label>
										<div class="col-md-6">
										  <input  type='text' name='vibrazione' id='vibrazione' value='{{ $row['vibrazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Campi Magnetici" class=" control-label col-md-4 text-left"> Campi Magnetici </label>
										<div class="col-md-6">
										  <input  type='text' name='campi_magnetici' id='campi_magnetici' value='{{ $row['campi_magnetici'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Carico Biologico" class=" control-label col-md-4 text-left"> Carico Biologico </label>
										<div class="col-md-6">
										  <input  type='text' name='carico_biologico' id='carico_biologico' value='{{ $row['carico_biologico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Contaminazione Biologica" class=" control-label col-md-4 text-left"> Contaminazione Biologica </label>
										<div class="col-md-6">
										  <input  type='text' name='contaminazione_biologica' id='contaminazione_biologica' value='{{ $row['contaminazione_biologica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Incompatibilita Biologica" class=" control-label col-md-4 text-left"> Incompatibilita Biologica </label>
										<div class="col-md-6">
										  <input  type='text' name='incompatibilita_biologica' id='incompatibilita_biologica' value='{{ $row['incompatibilita_biologica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Emissione Incorretta" class=" control-label col-md-4 text-left"> Emissione Incorretta </label>
										<div class="col-md-6">
										  <input  type='text' name='emissione_incorretta' id='emissione_incorretta' value='{{ $row['emissione_incorretta'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Formulazione Incorretta Sostanza Chimica" class=" control-label col-md-4 text-left"> Formulazione Incorretta Sostanza Chimica </label>
										<div class="col-md-6">
										  <input  type='text' name='formulazione_incorretta_sostanza_chimica' id='formulazione_incorretta_sostanza_chimica' value='{{ $row['formulazione_incorretta_sostanza_chimica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tossicita" class=" control-label col-md-4 text-left"> Tossicita </label>
										<div class="col-md-6">
										  <input  type='text' name='tossicita' id='tossicita' value='{{ $row['tossicita'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Infezioni" class=" control-label col-md-4 text-left"> Infezioni </label>
										<div class="col-md-6">
										  <input  type='text' name='infezioni' id='infezioni' value='{{ $row['infezioni'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pirogenicita" class=" control-label col-md-4 text-left"> Pirogenicita </label>
										<div class="col-md-6">
										  <input  type='text' name='pirogenicita' id='pirogenicita' value='{{ $row['pirogenicita'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Incapacita Di Mantenere Sicurezza Igienica" class=" control-label col-md-4 text-left"> Incapacita Di Mantenere Sicurezza Igienica </label>
										<div class="col-md-6">
										  <input  type='text' name='incapacita_di_mantenere_sicurezza_igienica' id='incapacita_di_mantenere_sicurezza_igienica' value='{{ $row['incapacita_di_mantenere_sicurezza_igienica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Degradazioni" class=" control-label col-md-4 text-left"> Degradazioni </label>
										<div class="col-md-6">
										  <input  type='text' name='degradazioni' id='degradazioni' value='{{ $row['degradazioni'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Interferenze Elettromagnetiche" class=" control-label col-md-4 text-left"> Interferenze Elettromagnetiche </label>
										<div class="col-md-6">
										  <input  type='text' name='interferenze_elettromagnetiche' id='interferenze_elettromagnetiche' value='{{ $row['interferenze_elettromagnetiche'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Alimentazione Inadeguata Di Energia O Di Refrigerante" class=" control-label col-md-4 text-left"> Alimentazione Inadeguata Di Energia O Di Refrigerante </label>
										<div class="col-md-6">
										  <input  type='text' name='alimentazione_inadeguata_di_energia_o_di_refrigerante' id='alimentazione_inadeguata_di_energia_o_di_refrigerante' value='{{ $row['alimentazione_inadeguata_di_energia_o_di_refrigerante'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Limitazione Refrigerante" class=" control-label col-md-4 text-left"> Limitazione Refrigerante </label>
										<div class="col-md-6">
										  <input  type='text' name='limitazione_refrigerante' id='limitazione_refrigerante' value='{{ $row['limitazione_refrigerante'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Probabilita Di Funzionamento Oltre Alle Condizioni Prescritte" class=" control-label col-md-4 text-left"> Probabilita Di Funzionamento Oltre Alle Condizioni Prescritte </label>
										<div class="col-md-6">
										  <input  type='text' name='probabilita_di_funzionamento_oltre_alle_condizioni_prescritte' id='probabilita_di_funzionamento_oltre_alle_condizioni_prescritte' value='{{ $row['probabilita_di_funzionamento_oltre_alle_condizioni_prescritte'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Incompatibilita Con Altri Dispositivi" class=" control-label col-md-4 text-left"> Incompatibilita Con Altri Dispositivi </label>
										<div class="col-md-6">
										  <input  type='text' name='incompatibilita_con_altri_dispositivi' id='incompatibilita_con_altri_dispositivi' value='{{ $row['incompatibilita_con_altri_dispositivi'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Danneggiamento Meccanico Accidentale" class=" control-label col-md-4 text-left"> Danneggiamento Meccanico Accidentale </label>
										<div class="col-md-6">
										  <input  type='text' name='danneggiamento_meccanico_accidentale' id='danneggiamento_meccanico_accidentale' value='{{ $row['danneggiamento_meccanico_accidentale'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Contaminazione Da Prodotti Di Scarto" class=" control-label col-md-4 text-left"> Contaminazione Da Prodotti Di Scarto </label>
										<div class="col-md-6">
										  <input  type='text' name='contaminazione_da_prodotti_di_scarto' id='contaminazione_da_prodotti_di_scarto' value='{{ $row['contaminazione_da_prodotti_di_scarto'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Etichettatura Inadeguata" class=" control-label col-md-4 text-left"> Etichettatura Inadeguata </label>
										<div class="col-md-6">
										  <input  type='text' name='etichettatura_inadeguata' id='etichettatura_inadeguata' value='{{ $row['etichettatura_inadeguata'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Istruzioni Operative Inadeguate" class=" control-label col-md-4 text-left"> Istruzioni Operative Inadeguate </label>
										<div class="col-md-6">
										  <input  type='text' name='istruzioni_operative_inadeguate' id='istruzioni_operative_inadeguate' value='{{ $row['istruzioni_operative_inadeguate'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Specifiche Inadeguate Degli Accessori" class=" control-label col-md-4 text-left"> Specifiche Inadeguate Degli Accessori </label>
										<div class="col-md-6">
										  <input  type='text' name='specifiche_inadeguate_degli_accessori' id='specifiche_inadeguate_degli_accessori' value='{{ $row['specifiche_inadeguate_degli_accessori'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Istruzioni Operative Troppo Complicate" class=" control-label col-md-4 text-left"> Istruzioni Operative Troppo Complicate </label>
										<div class="col-md-6">
										  <input  type='text' name='istruzioni_operative_troppo_complicate' id='istruzioni_operative_troppo_complicate' value='{{ $row['istruzioni_operative_troppo_complicate'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Istruzioni Operative Non Disponibili" class=" control-label col-md-4 text-left"> Istruzioni Operative Non Disponibili </label>
										<div class="col-md-6">
										  <input  type='text' name='istruzioni_operative_non_disponibili' id='istruzioni_operative_non_disponibili' value='{{ $row['istruzioni_operative_non_disponibili'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Uso Da Parte Di Personale Inesperto" class=" control-label col-md-4 text-left"> Uso Da Parte Di Personale Inesperto </label>
										<div class="col-md-6">
										  <input  type='text' name='uso_da_parte_di_personale_inesperto' id='uso_da_parte_di_personale_inesperto' value='{{ $row['uso_da_parte_di_personale_inesperto'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Uso Scorretto Prevedibile" class=" control-label col-md-4 text-left"> Uso Scorretto Prevedibile </label>
										<div class="col-md-6">
										  <input  type='text' name='uso_scorretto_prevedibile' id='uso_scorretto_prevedibile' value='{{ $row['uso_scorretto_prevedibile'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Avvertenze Inefficienti" class=" control-label col-md-4 text-left"> Avvertenze Inefficienti </label>
										<div class="col-md-6">
										  <input  type='text' name='avvertenze_inefficienti' id='avvertenze_inefficienti' value='{{ $row['avvertenze_inefficienti'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Avvertenze Inadeguate Per Dispositivi Monouso" class=" control-label col-md-4 text-left"> Avvertenze Inadeguate Per Dispositivi Monouso </label>
										<div class="col-md-6">
										  <input  type='text' name='avvertenze_inadeguate_per_dispositivi_monouso' id='avvertenze_inadeguate_per_dispositivi_monouso' value='{{ $row['avvertenze_inadeguate_per_dispositivi_monouso'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misurazioni Inesatte" class=" control-label col-md-4 text-left"> Misurazioni Inesatte </label>
										<div class="col-md-6">
										  <input  type='text' name='misurazioni_inesatte' id='misurazioni_inesatte' value='{{ $row['misurazioni_inesatte'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Diagnosi Inesatte" class=" control-label col-md-4 text-left"> Diagnosi Inesatte </label>
										<div class="col-md-6">
										  <input  type='text' name='diagnosi_inesatte' id='diagnosi_inesatte' value='{{ $row['diagnosi_inesatte'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Trasferimento Erroneo Dati" class=" control-label col-md-4 text-left"> Trasferimento Erroneo Dati </label>
										<div class="col-md-6">
										  <input  type='text' name='trasferimento_erroneo_dati' id='trasferimento_erroneo_dati' value='{{ $row['trasferimento_erroneo_dati'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Presentazione Scorretta Dati" class=" control-label col-md-4 text-left"> Presentazione Scorretta Dati </label>
										<div class="col-md-6">
										  <input  type='text' name='presentazione_scorretta_dati' id='presentazione_scorretta_dati' value='{{ $row['presentazione_scorretta_dati'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Incompatibilita Con Prodotti Di Altri Dispositivi" class=" control-label col-md-4 text-left"> Incompatibilita Con Prodotti Di Altri Dispositivi </label>
										<div class="col-md-6">
										  <input  type='text' name='incompatibilita_con_prodotti_di_altri_dispositivi' id='incompatibilita_con_prodotti_di_altri_dispositivi' value='{{ $row['incompatibilita_con_prodotti_di_altri_dispositivi'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Caratteristiche Di Prestazione Inadeguate" class=" control-label col-md-4 text-left"> Caratteristiche Di Prestazione Inadeguate </label>
										<div class="col-md-6">
										  <input  type='text' name='caratteristiche_di_prestazione_inadeguate' id='caratteristiche_di_prestazione_inadeguate' value='{{ $row['caratteristiche_di_prestazione_inadeguate'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mancanza Di Specifiche Di Manutenzione" class=" control-label col-md-4 text-left"> Mancanza Di Specifiche Di Manutenzione </label>
										<div class="col-md-6">
										  <input  type='text' name='mancanza_di_specifiche_di_manutenzione' id='mancanza_di_specifiche_di_manutenzione' value='{{ $row['mancanza_di_specifiche_di_manutenzione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Manutenzione Inadeguata" class=" control-label col-md-4 text-left"> Manutenzione Inadeguata </label>
										<div class="col-md-6">
										  <input  type='text' name='manutenzione_inadeguata' id='manutenzione_inadeguata' value='{{ $row['manutenzione_inadeguata'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mancanza Di Documentazione Della Scadenza O Durata" class=" control-label col-md-4 text-left"> Mancanza Di Documentazione Della Scadenza O Durata </label>
										<div class="col-md-6">
										  <input  type='text' name='mancanza_di_documentazione_della_scadenza_o_durata' id='mancanza_di_documentazione_della_scadenza_o_durata' value='{{ $row['mancanza_di_documentazione_della_scadenza_o_durata'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Meccanica" class=" control-label col-md-4 text-left"> Perdita Integrita Meccanica </label>
										<div class="col-md-6">
										  <input  type='text' name='perdita_integrita_meccanica' id='perdita_integrita_meccanica' value='{{ $row['perdita_integrita_meccanica'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Confezionamento Inadeguato" class=" control-label col-md-4 text-left"> Confezionamento Inadeguato </label>
										<div class="col-md-6">
										  <input  type='text' name='confezionamento_inadeguato' id='confezionamento_inadeguato' value='{{ $row['confezionamento_inadeguato'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Riutilizzo Improprio" class=" control-label col-md-4 text-left"> Riutilizzo Improprio </label>
										<div class="col-md-6">
										  <input  type='text' name='riutilizzo_improprio' id='riutilizzo_improprio' value='{{ $row['riutilizzo_improprio'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pericoli Uso" class=" control-label col-md-4 text-left"> Pericoli Uso </label>
										<div class="col-md-6">
										  <textarea name='pericoli_uso' rows='5' id='pericoli_uso' class='form-control input-sm '  
				           >{{ $row['pericoli_uso'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Probabilita Verifica Uso" class=" control-label col-md-4 text-left"> Probabilita Verifica Uso </label>
										<div class="col-md-6">
										  <textarea name='probabilita_verifica_uso' rows='5' id='probabilita_verifica_uso' class='form-control input-sm '  
				           >{{ $row['probabilita_verifica_uso'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Danno Associato Al Pericolo Uso" class=" control-label col-md-4 text-left"> Danno Associato Al Pericolo Uso </label>
										<div class="col-md-6">
										  <textarea name='danno_associato_al_pericolo_uso' rows='5' id='danno_associato_al_pericolo_uso' class='form-control input-sm '  
				           >{{ $row['danno_associato_al_pericolo_uso'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pericoli Guasti Manutenzioni Invecchiamento" class=" control-label col-md-4 text-left"> Pericoli Guasti Manutenzioni Invecchiamento </label>
										<div class="col-md-6">
										  <textarea name='pericoli_guasti_manutenzioni_invecchiamento' rows='5' id='pericoli_guasti_manutenzioni_invecchiamento' class='form-control input-sm '  
				           >{{ $row['pericoli_guasti_manutenzioni_invecchiamento'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Probabilita Di Verifica Invecchiamento" class=" control-label col-md-4 text-left"> Probabilita Di Verifica Invecchiamento </label>
										<div class="col-md-6">
										  <textarea name='probabilita_di_verifica_invecchiamento' rows='5' id='probabilita_di_verifica_invecchiamento' class='form-control input-sm '  
				           >{{ $row['probabilita_di_verifica_invecchiamento'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Danno Associato Invecchiamento" class=" control-label col-md-4 text-left"> Danno Associato Invecchiamento </label>
										<div class="col-md-6">
										  <textarea name='danno_associato_invecchiamento' rows='5' id='danno_associato_invecchiamento' class='form-control input-sm '  
				           >{{ $row['danno_associato_invecchiamento'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stima Rischi Probabilita Verifica" class=" control-label col-md-4 text-left"> Stima Rischi Probabilita Verifica </label>
										<div class="col-md-6">
										  <textarea name='stima_rischi_probabilita_verifica' rows='5' id='stima_rischi_probabilita_verifica' class='form-control input-sm '  
				           >{{ $row['stima_rischi_probabilita_verifica'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stima Rischi Danno Associato" class=" control-label col-md-4 text-left"> Stima Rischi Danno Associato </label>
										<div class="col-md-6">
										  <textarea name='stima_rischi_danno_associato' rows='5' id='stima_rischi_danno_associato' class='form-control input-sm '  
				           >{{ $row['stima_rischi_danno_associato'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stima Rischi Necessita" class=" control-label col-md-4 text-left"> Stima Rischi Necessita </label>
										<div class="col-md-6">
										  <textarea name='stima_rischi_necessita' rows='5' id='stima_rischi_necessita' class='form-control input-sm '  
				           >{{ $row['stima_rischi_necessita'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Accettazione Rischio" class=" control-label col-md-4 text-left"> Accettazione Rischio </label>
										<div class="col-md-6">
										  <textarea name='accettazione_rischio' rows='5' id='accettazione_rischio' class='form-control input-sm '  
				           >{{ $row['accettazione_rischio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Utente Puo Rilevare Rischio" class=" control-label col-md-4 text-left"> Utente Puo Rilevare Rischio </label>
										<div class="col-md-6">
										  <textarea name='utente_puo_rilevare_rischio' rows='5' id='utente_puo_rilevare_rischio' class='form-control input-sm '  
				           >{{ $row['utente_puo_rilevare_rischio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Eliminazione Pericolo Tramite Controlli" class=" control-label col-md-4 text-left"> Eliminazione Pericolo Tramite Controlli </label>
										<div class="col-md-6">
										  <textarea name='eliminazione_pericolo_tramite_controlli' rows='5' id='eliminazione_pericolo_tramite_controlli' class='form-control input-sm '  
				           >{{ $row['eliminazione_pericolo_tramite_controlli'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pericolo Utilizzo Non Corretto" class=" control-label col-md-4 text-left"> Pericolo Utilizzo Non Corretto </label>
										<div class="col-md-6">
										  <textarea name='pericolo_utilizzo_non_corretto' rows='5' id='pericolo_utilizzo_non_corretto' class='form-control input-sm '  
				           >{{ $row['pericolo_utilizzo_non_corretto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prevedere Allarmi Segnalazioni" class=" control-label col-md-4 text-left"> Prevedere Allarmi Segnalazioni </label>
										<div class="col-md-6">
										  <textarea name='prevedere_allarmi_segnalazioni' rows='5' id='prevedere_allarmi_segnalazioni' class='form-control input-sm '  
				           >{{ $row['prevedere_allarmi_segnalazioni'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Meccanica Probabilita Verifica" class=" control-label col-md-4 text-left"> Perdita Integrita Meccanica Probabilita Verifica </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_meccanica_probabilita_verifica' rows='5' id='perdita_integrita_meccanica_probabilita_verifica' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_meccanica_probabilita_verifica'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Meccanica Danno Associato" class=" control-label col-md-4 text-left"> Perdita Integrita Meccanica Danno Associato </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_meccanica_danno_associato' rows='5' id='perdita_integrita_meccanica_danno_associato' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_meccanica_danno_associato'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Meccanica Necessita" class=" control-label col-md-4 text-left"> Perdita Integrita Meccanica Necessita </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_meccanica_necessita' rows='5' id='perdita_integrita_meccanica_necessita' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_meccanica_necessita'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Accettazione Rischio" class=" control-label col-md-4 text-left"> Perdita Integrita Accettazione Rischio </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_accettazione_rischio' rows='5' id='perdita_integrita_accettazione_rischio' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_accettazione_rischio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Utente Puo Rilevare Rischio" class=" control-label col-md-4 text-left"> Perdita Integrita Utente Puo Rilevare Rischio </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_utente_puo_rilevare_rischio' rows='5' id='perdita_integrita_utente_puo_rilevare_rischio' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_utente_puo_rilevare_rischio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Eliminazione Pericolo Tramite Controlli" class=" control-label col-md-4 text-left"> Perdita Integrita Eliminazione Pericolo Tramite Controlli </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_eliminazione_pericolo_tramite_controlli' rows='5' id='perdita_integrita_eliminazione_pericolo_tramite_controlli' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_eliminazione_pericolo_tramite_controlli'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Pericolo Utilizzo Non Corretto" class=" control-label col-md-4 text-left"> Perdita Integrita Pericolo Utilizzo Non Corretto </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_pericolo_utilizzo_non_corretto' rows='5' id='perdita_integrita_pericolo_utilizzo_non_corretto' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_pericolo_utilizzo_non_corretto'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Perdita Integrita Prevedere Allarmi Segnalazioni" class=" control-label col-md-4 text-left"> Perdita Integrita Prevedere Allarmi Segnalazioni </label>
										<div class="col-md-6">
										  <textarea name='perdita_integrita_prevedere_allarmi_segnalazioni' rows='5' id='perdita_integrita_prevedere_allarmi_segnalazioni' class='form-control input-sm '  
				           >{{ $row['perdita_integrita_prevedere_allarmi_segnalazioni'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Valutazione Biologica Lavorazione Materiali" class=" control-label col-md-4 text-left"> Valutazione Biologica Lavorazione Materiali </label>
										<div class="col-md-6">
										  <textarea name='valutazione_biologica_lavorazione_materiali' rows='5' id='valutazione_biologica_lavorazione_materiali' class='form-control input-sm '  
				           >{{ $row['valutazione_biologica_lavorazione_materiali'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Dati Provenienti Da Test Di Sicurezza Biologica" class=" control-label col-md-4 text-left"> Dati Provenienti Da Test Di Sicurezza Biologica </label>
										<div class="col-md-6">
										  <textarea name='dati_provenienti_da_test_di_sicurezza_biologica' rows='5' id='dati_provenienti_da_test_di_sicurezza_biologica' class='form-control input-sm '  
				           >{{ $row['dati_provenienti_da_test_di_sicurezza_biologica'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data" class=" control-label col-md-4 text-left"> Data </label>
										<div class="col-md-6">
										  <input  type='text' name='data' id='data' value='{{ $row['data'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Firma Direzione" class=" control-label col-md-4 text-left"> Firma Direzione </label>
										<div class="col-md-6">
										  <textarea name='firma_direzione' rows='5' id='firma_direzione' class='form-control input-sm '  
				           >{{ $row['firma_direzione'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			

			<div style="clear:both"></div>	
				
					
				  <div class="form-group">
					<label class="col-sm-4 text-right">&nbsp;</label>
					<div class="col-sm-8">	
					<button type="submit" name="apply" class="btn btn-info btn-sm" ><i class="fa  fa-check-circle"></i> {{ Lang::get('core.sb_apply') }}</button>
					<button type="submit" name="submit" class="btn btn-primary btn-sm" ><i class="fa  fa-save "></i> {{ Lang::get('core.sb_save') }}</button>
				  </div>	  
			
		</div> 
		 <input type="hidden" name="action_task" value="public" />
		 {!! Form::close() !!}
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
