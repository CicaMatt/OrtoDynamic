

		 {!! Form::open(array('url'=>'statocheck/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> StatoCheck</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Stato Partenza" class=" control-label col-md-4 text-left"> Stato Partenza </label>
										<div class="col-md-6">
										  <select name='stato_partenza' rows='5' id='stato_partenza' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Stato Arrivo" class=" control-label col-md-4 text-left"> Stato Arrivo </label>
										<div class="col-md-6">
										  <select name='stato_arrivo' rows='5' id='stato_arrivo' class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tabella Check" class=" control-label col-md-4 text-left"> Tabella Check </label>
										<div class="col-md-6">
										  <input  type='text' name='tabella_check' id='tabella_check' value='{{ $row['tabella_check'] }}' 
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
		
		
		$("#stato_partenza").jCombo("{!! url('statocheck/comboselect?filter=stato:nome:nome') !!}",
		{  selected_value : '{{ $row["stato_partenza"] }}' });
		
		$("#stato_arrivo").jCombo("{!! url('statocheck/comboselect?filter=stato:nome:nome') !!}",
		{  selected_value : '{{ $row["stato_arrivo"] }}' });
		 

		$('.removeCurrentFiles').on('click',function(){
			var removeUrl = $(this).attr('href');
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
