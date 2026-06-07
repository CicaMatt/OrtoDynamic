

		 {!! Form::open(array('url'=>'lavorazioni/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Lavorazioni</legend>
									
									  <div class="form-group  " >
										<label for="Preventivo" class=" control-label col-md-4 text-left"> Preventivo </label>
										<div class="col-md-6">
										  <select name='id_preventivo' rows='5' id='id_preventivo' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Cliente" class=" control-label col-md-4 text-left"> Cliente </label>
										<div class="col-md-6">
										  <select name='id_cliente' rows='5' id='id_cliente' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  
					<?php $stato = explode(',',$row['stato']);
					$stato_opt = array( 'IN LAVORAZIONE' => 'IN LAVORAZIONE' ,  'LAVORATO' => 'LAVORATO' ,  'LAVORATO PARZIALE' => 'LAVORATO PARZIALE' ,  'ANNULLATO' => 'ANNULLATO' ,  'DA CONSEGNARE' => 'DA CONSEGNARE' , ); ?>
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
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Inizio Lavorazione" class=" control-label col-md-4 text-left"> Data Inizio Lavorazione </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_creazione_lavorazione', $row['data_creazione_lavorazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Annullamento" class=" control-label col-md-4 text-left"> Data Annullamento </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_annullamento', $row['data_annullamento'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Fine Lavorazione" class=" control-label col-md-4 text-left"> Data Fine Lavorazione </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_fine_lavorazione', $row['data_fine_lavorazione'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Consegna" class=" control-label col-md-4 text-left"> Data Consegna </label>
										<div class="col-md-6">
										  
				<div class="input-group m-b" style="width:150px !important;">
					{!! Form::text('data_consegna', $row['data_consegna'],array('class'=>'form-control input-sm date')) !!}
					<span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div> 
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
		$('.addC').relCopy({});
		
		$("#id_preventivo").jCombo("{!! url('lavorazioni/comboselect?filter=preventivi:id:id|diagnosi_circostanziata|programma_terapeutico') !!}",
		{  selected_value : '{{ $row["id_preventivo"] }}' });
		
		$("#id_cliente").jCombo("{!! url('lavorazioni/comboselect?filter=clienti:id:cognome|nome|data_nascita') !!}",
		{  selected_value : '{{ $row["id_cliente"] }}' });
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
