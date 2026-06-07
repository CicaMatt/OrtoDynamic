

		 {!! Form::open(array('url'=>'preventivi/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<ul class="nav nav-tabs"><li class="active"><a href="#preventivi" data-toggle="tab">preventivi</a></li>
				</ul><div class="tab-content"><div class="tab-pane m-t active" id="preventivi"> 
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Tipologia" class=" control-label col-md-4 text-left"> Tipologia </label>
										<div class="col-md-6">
										  
					<?php $tipologia_preventivo = explode(',',$row['tipologia_preventivo']);
					$tipologia_preventivo_opt = array( 'Asl' => 'Asl' ,  'Privato' => 'Privato' , ); ?>
					<select name='tipologia_preventivo' rows='5'   class='select2 '  > 
						<?php 
						foreach($tipologia_preventivo_opt as $key=>$val)
						{
							echo "<option  value ='$key' ".($row['tipologia_preventivo'] == $key ? " selected='selected' " : '' ).">$val</option>"; 						
						}						
						?></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cliente" class=" control-label col-md-4 text-left"> Cliente <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  <select name='id_cliente' rows='5' id='id_cliente' class='select2 ' required  ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Diagnosi Circostanziata" class=" control-label col-md-4 text-left"> Diagnosi Circostanziata </label>
										<div class="col-md-6">
										  <textarea name='diagnosi_circostanziata' rows='5' id='diagnosi_circostanziata' class='form-control input-sm '  
				           >{{ $row['diagnosi_circostanziata'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Programma Terapeutico" class=" control-label col-md-4 text-left"> Programma Terapeutico </label>
										<div class="col-md-6">
										  <textarea name='programma_terapeutico' rows='5' id='programma_terapeutico' class='form-control input-sm '  
				           >{{ $row['programma_terapeutico'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Prescizione Dettagliata Protesi" class=" control-label col-md-4 text-left"> Prescizione Dettagliata Protesi </label>
										<div class="col-md-6">
										  <textarea name='prescizione_dettagliata_protesi' rows='5' id='prescizione_dettagliata_protesi' class='form-control input-sm '  
				           >{{ $row['prescizione_dettagliata_protesi'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Creazione" class=" control-label col-md-4 text-left"> Data Creazione <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_creazione', $row['data_creazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Emissione" class=" control-label col-md-4 text-left"> Data Emissione <span class="asterix"> * </span></label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_preventivo', $row['data_preventivo'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 
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
		$('.addC').relCopy({limit:5});
		
		$("#id_cliente").jCombo("{!! url('preventivi/comboselect?filter=clienti:id:cognome|nome|data_nascita') !!}",
		{  selected_value : '{{ $row["id_cliente"] }}' });
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
