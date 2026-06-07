

		 {!! Form::open(array('url'=>'nonconformita/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Non Conformità</legend>
									
									  <div class="form-group  " >
										<label for="Id Preventivo" class=" control-label col-md-4 text-left"> Id Preventivo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='id_preventivo' rows='5' id='id_preventivo' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Difformita Rilevata" class=" control-label col-md-4 text-left"> Difformita Rilevata <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <input  type='text' name='difformita_rilevata' id='difformita_rilevata' value='{{ $row['difformita_rilevata'] }}' 
						required     class='form-control input-sm ' /> 
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
									  <div class="form-group  " >
										<label for="Data Apertura Reclamo" class=" control-label col-md-4 text-left"> Data Apertura Reclamo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_apertura_reclamo', $row['data_apertura_reclamo'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Chiusura Reclamo" class=" control-label col-md-4 text-left"> Data Chiusura Reclamo </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_chiusura_reclamo', $row['data_chiusura_reclamo'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato Reclamo" class=" control-label col-md-4 text-left"> Stato Reclamo <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
					<?php $stato_reclamo = explode(',',$row['stato_reclamo']);
					$stato_reclamo_opt = array( 'APERTO' => 'APERTO' ,  'CHIUSO' => 'CHIUSO' , ); ?>
					<select name='stato_reclamo' rows='5' required  class='select2 '  > 
						<?php 
						foreach($stato_reclamo_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['stato_reclamo'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Nome Tecnico" class=" control-label col-md-4 text-left"> Nome Tecnico </label>
										<div class="col-md-6">
										  <input  type='text' name='nome_tecnico' id='nome_tecnico' value='{{ $row['nome_tecnico'] }}' 
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
		
		
		$("#id_preventivo").jCombo("{!! url('nonconformita/comboselect?filter=preventivi:id:id_cliente') !!}",
		{  selected_value : '{{ $row["id_preventivo"] }}' });
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
