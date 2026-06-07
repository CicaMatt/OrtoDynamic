

		 {!! Form::open(array('url'=>'misuregenerali/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Misure Generali</legend>
									
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
										<label for="Mis Collo" class=" control-label col-md-4 text-left"> Mis Collo </label>
										<div class="col-md-6">
										  <textarea name='mis_collo' rows='5' id='mis_collo' class='form-control input-sm '  
				           >{{ $row['mis_collo'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Omero" class=" control-label col-md-4 text-left"> Mis Omero </label>
										<div class="col-md-6">
										  <textarea name='mis_omero' rows='5' id='mis_omero' class='form-control input-sm '  
				           >{{ $row['mis_omero'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Braccio" class=" control-label col-md-4 text-left"> Mis Braccio </label>
										<div class="col-md-6">
										  <textarea name='mis_braccio' rows='5' id='mis_braccio' class='form-control input-sm '  
				           >{{ $row['mis_braccio'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Polso" class=" control-label col-md-4 text-left"> Mis Polso </label>
										<div class="col-md-6">
										  <textarea name='mis_polso' rows='5' id='mis_polso' class='form-control input-sm '  
				           >{{ $row['mis_polso'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Bacino" class=" control-label col-md-4 text-left"> Mis Bacino </label>
										<div class="col-md-6">
										  <textarea name='mis_bacino' rows='5' id='mis_bacino' class='form-control input-sm '  
				           >{{ $row['mis_bacino'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Coscia" class=" control-label col-md-4 text-left"> Mis Coscia </label>
										<div class="col-md-6">
										  <textarea name='mis_coscia' rows='5' id='mis_coscia' class='form-control input-sm '  
				           >{{ $row['mis_coscia'] }}</textarea> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Mis Gamba" class=" control-label col-md-4 text-left"> Mis Gamba </label>
										<div class="col-md-6">
										  <textarea name='mis_gamba' rows='5' id='mis_gamba' class='form-control input-sm '  
				           >{{ $row['mis_gamba'] }}</textarea> 
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
