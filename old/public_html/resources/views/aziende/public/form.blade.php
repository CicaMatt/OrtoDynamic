

		 {!! Form::open(array('url'=>'aziende/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-6">
						<fieldset><legend> aziende</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Anno" class=" control-label col-md-4 text-left"> Anno </label>
										<div class="col-md-6">
										  <input  type='text' name='anno' id='anno' value='{{ $row['anno'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Regione" class=" control-label col-md-4 text-left"> Codice Regione </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_regione' id='codice_regione' value='{{ $row['codice_regione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Denominazione Regione" class=" control-label col-md-4 text-left"> Denominazione Regione </label>
										<div class="col-md-6">
										  <input  type='text' name='denominazione_regione' id='denominazione_regione' value='{{ $row['denominazione_regione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Codice Azienda" class=" control-label col-md-4 text-left"> Codice Azienda </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_azienda' id='codice_azienda' value='{{ $row['codice_azienda'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Denominazione Azienda" class=" control-label col-md-4 text-left"> Denominazione Azienda </label>
										<div class="col-md-6">
										  <input  type='text' name='denominazione_azienda' id='denominazione_azienda' value='{{ $row['denominazione_azienda'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			<div class="col-md-6">
						<fieldset><legend> </legend>
									
									  <div class="form-group  " >
										<label for="Codice Comune" class=" control-label col-md-4 text-left"> Codice Comune </label>
										<div class="col-md-6">
										  <input  type='text' name='codice_comune' id='codice_comune' value='{{ $row['codice_comune'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Comune" class=" control-label col-md-4 text-left"> Comune </label>
										<div class="col-md-6">
										  <input  type='text' name='comune' id='comune' value='{{ $row['comune'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Distretto" class=" control-label col-md-4 text-left"> Distretto </label>
										<div class="col-md-6">
										  <input  type='text' name='distretto' id='distretto' value='{{ $row['distretto'] }}' 
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
