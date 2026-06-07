

		 {!! Form::open(array('url'=>'prodottipreventivi/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> prodottipreventivi</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Codice Nomenclatore" class=" control-label col-md-4 text-left"> Codice Nomenclatore <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='codice_nomenclatore' rows='5' id='codice_nomenclatore' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Quantita" class=" control-label col-md-4 text-left"> Quantita <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='quantita' id='quantita' value='{{ $row['quantita'] }}' 
						required     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prezzo" class=" control-label col-md-4 text-left"> Prezzo </label>
										<div class="col-md-6">
										  <input  type='text' name='prezzo' id='prezzo' value='{{ $row['prezzo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Sconto" class=" control-label col-md-4 text-left"> Sconto </label>
										<div class="col-md-6">
										  <input  type='text' name='sconto' id='sconto' value='{{ $row['sconto'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Importo" class=" control-label col-md-4 text-left"> Importo </label>
										<div class="col-md-6">
										  <input  type='text' name='importo' id='importo' value='{{ $row['importo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  
					<?php $stato = explode(',',$row['stato']);
					$stato_opt = array( 'OK' => 'OK' , ); ?>
					<select name='stato' rows='5'   class='select2 '  > 
						<?php 
						foreach($stato_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['stato'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
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
		
		
		$("#codice_nomenclatore").jCombo("{!! url('prodottipreventivi/comboselect?filter=nomenclatore:id:codice|descrizione|prezzo') !!}",
		{  selected_value : '{{ $row["codice_nomenclatore"] }}' });
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
