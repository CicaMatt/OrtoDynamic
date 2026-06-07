

		 {!! Form::open(array('url'=>'piede/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Piede</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Collo" class=" control-label col-md-4 text-left"> Collo </label>
										<div class="col-md-6">
										  <input  type='text' name='collo' id='collo' value='{{ $row['collo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Pianta" class=" control-label col-md-4 text-left"> Pianta </label>
										<div class="col-md-6">
										  <input  type='text' name='pianta' id='pianta' value='{{ $row['pianta'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Misura Scarpa" class=" control-label col-md-4 text-left"> Misura Scarpa </label>
										<div class="col-md-6">
										  <input  type='text' name='misura_scarpa' id='misura_scarpa' value='{{ $row['misura_scarpa'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Speronatura" class=" control-label col-md-4 text-left"> Speronatura </label>
										<div class="col-md-6">
										  <input  type='text' name='speronatura' id='speronatura' value='{{ $row['speronatura'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Rialzo" class=" control-label col-md-4 text-left"> Rialzo </label>
										<div class="col-md-6">
										  <input  type='text' name='rialzo' id='rialzo' value='{{ $row['rialzo'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Piano Incl Tot" class=" control-label col-md-4 text-left"> Piano Incl Tot </label>
										<div class="col-md-6">
										  <input  type='text' name='piano_incl_tot' id='piano_incl_tot' value='{{ $row['piano_incl_tot'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Tipo Plantare" class=" control-label col-md-4 text-left"> Tipo Plantare </label>
										<div class="col-md-6">
										  <input  type='text' name='tipo_plantare' id='tipo_plantare' value='{{ $row['tipo_plantare'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Modello Scarpa" class=" control-label col-md-4 text-left"> Modello Scarpa </label>
										<div class="col-md-6">
										  <input  type='text' name='modello_scarpa' id='modello_scarpa' value='{{ $row['modello_scarpa'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Caviglia" class=" control-label col-md-4 text-left"> Caviglia </label>
										<div class="col-md-6">
										  <input  type='text' name='caviglia' id='caviglia' value='{{ $row['caviglia'] }}' 
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
									  </div> 					
									  <div class="form-group  " >
										<label for="Passaggio Caviglie" class=" control-label col-md-4 text-left"> Passaggio Caviglie </label>
										<div class="col-md-6">
										  <input  type='text' name='passaggio_caviglie' id='passaggio_caviglie' value='{{ $row['passaggio_caviglie'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Passaggio Collo" class=" control-label col-md-4 text-left"> Passaggio Collo </label>
										<div class="col-md-6">
										  <input  type='text' name='passaggio_collo' id='passaggio_collo' value='{{ $row['passaggio_collo'] }}' 
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
