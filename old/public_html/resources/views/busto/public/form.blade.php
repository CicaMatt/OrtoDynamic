

		 {!! Form::open(array('url'=>'busto/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Busto</legend>
									
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
										<label for="Misura Vita" class=" control-label col-md-4 text-left"> Misura Vita </label>
										<div class="col-md-6">
										  <textarea name='misura_vita' rows='5' id='misura_vita' class='form-control input-sm '  
				           >{{ $row['misura_vita'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura Bacino" class=" control-label col-md-4 text-left"> Misura Bacino </label>
										<div class="col-md-6">
										  <textarea name='misura_bacino' rows='5' id='misura_bacino' class='form-control input-sm '  
				           >{{ $row['misura_bacino'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura 2 4" class=" control-label col-md-4 text-left"> Misura 2 4 </label>
										<div class="col-md-6">
										  <textarea name='misura_2_4' rows='5' id='misura_2_4' class='form-control input-sm '  
				           >{{ $row['misura_2_4'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Fino Ascella" class=" control-label col-md-4 text-left"> Fino Ascella </label>
										<div class="col-md-6">
										  <textarea name='fino_ascella' rows='5' id='fino_ascella' class='form-control input-sm '  
				           >{{ $row['fino_ascella'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Spallacci" class=" control-label col-md-4 text-left"> Spallacci </label>
										<div class="col-md-6">
										  <textarea name='spallacci' rows='5' id='spallacci' class='form-control input-sm '  
				           >{{ $row['spallacci'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Alt Stoffa Ant" class=" control-label col-md-4 text-left"> Alt Stoffa Ant </label>
										<div class="col-md-6">
										  <textarea name='alt_stoffa_ant' rows='5' id='alt_stoffa_ant' class='form-control input-sm '  
				           >{{ $row['alt_stoffa_ant'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Alt Tot Armatura" class=" control-label col-md-4 text-left"> Alt Tot Armatura </label>
										<div class="col-md-6">
										  <textarea name='alt_tot_armatura' rows='5' id='alt_tot_armatura' class='form-control input-sm '  
				           >{{ $row['alt_tot_armatura'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Dist Ascellare" class=" control-label col-md-4 text-left"> Dist Ascellare </label>
										<div class="col-md-6">
										  <textarea name='dist_ascellare' rows='5' id='dist_ascellare' class='form-control input-sm '  
				           >{{ $row['dist_ascellare'] }}</textarea> 
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
