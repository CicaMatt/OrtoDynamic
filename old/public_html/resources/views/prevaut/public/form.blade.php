

		 {!! Form::open(array('url'=>'prevaut/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Preventivi Autorizzati</legend>
									
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
										<label for="Id Cliente" class=" control-label col-md-4 text-left"> Id Cliente </label>
										<div class="col-md-6">
										  <input  type='text' name='id_cliente' id='id_cliente' value='{{ $row['id_cliente'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Creazione" class=" control-label col-md-4 text-left"> Data Creazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_creazione' id='data_creazione' value='{{ $row['data_creazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Diagnosi Circostanziata" class=" control-label col-md-4 text-left"> Diagnosi Circostanziata </label>
										<div class="col-md-6">
										  <input  type='text' name='diagnosi_circostanziata' id='diagnosi_circostanziata' value='{{ $row['diagnosi_circostanziata'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Programma Terapeutico" class=" control-label col-md-4 text-left"> Programma Terapeutico </label>
										<div class="col-md-6">
										  <input  type='text' name='programma_terapeutico' id='programma_terapeutico' value='{{ $row['programma_terapeutico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prescizione Dettagliata Protesi" class=" control-label col-md-4 text-left"> Prescizione Dettagliata Protesi </label>
										<div class="col-md-6">
										  <input  type='text' name='prescizione_dettagliata_protesi' id='prescizione_dettagliata_protesi' value='{{ $row['prescizione_dettagliata_protesi'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Preventivo" class=" control-label col-md-4 text-left"> Data Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='data_preventivo' id='data_preventivo' value='{{ $row['data_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Preventivo" class=" control-label col-md-4 text-left"> Numero Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='numero_preventivo' id='numero_preventivo' value='{{ $row['numero_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tipologia Preventivo" class=" control-label col-md-4 text-left"> Tipologia Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='tipologia_preventivo' id='tipologia_preventivo' value='{{ $row['tipologia_preventivo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  <input  type='text' name='stato' id='stato' value='{{ $row['stato'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Accettazione" class=" control-label col-md-4 text-left"> Data Accettazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_accettazione' id='data_accettazione' value='{{ $row['data_accettazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Numero Autorizzazione" class=" control-label col-md-4 text-left"> Numero Autorizzazione </label>
										<div class="col-md-6">
										  <input  type='text' name='numero_autorizzazione' id='numero_autorizzazione' value='{{ $row['numero_autorizzazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Id Medico" class=" control-label col-md-4 text-left"> Id Medico </label>
										<div class="col-md-6">
										  <input  type='text' name='id_medico' id='id_medico' value='{{ $row['id_medico'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Ricezione Autorizzazione" class=" control-label col-md-4 text-left"> Data Ricezione Autorizzazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_ricezione_autorizzazione' id='data_ricezione_autorizzazione' value='{{ $row['data_ricezione_autorizzazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Note" class=" control-label col-md-4 text-left"> Note </label>
										<div class="col-md-6">
										  <input  type='text' name='note' id='note' value='{{ $row['note'] }}' 
						     class='form-control input-sm ' /> 
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
