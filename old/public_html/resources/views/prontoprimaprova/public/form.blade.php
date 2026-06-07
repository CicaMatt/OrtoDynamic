

		 {!! Form::open(array('url'=>'prontoprimaprova/savepublic', 'class'=>'form-horizontal','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}

	@if(Session::has('messagetext'))
	  
		   {!! Session::get('messagetext') !!}
	   
	@endif
	<ul class="parsley-error-list">
		@foreach($errors->all() as $error)
			<li>{{ $error }}</li>
		@endforeach
	</ul>		


<div class="col-md-12">
						<fieldset><legend> Pronto prima prova</legend>
									
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
										<label for="Id Preventivo" class=" control-label col-md-4 text-left"> Id Preventivo </label>
										<div class="col-md-6">
										  <input  type='text' name='id_preventivo' id='id_preventivo' value='{{ $row['id_preventivo'] }}' 
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
										<label for="Stato" class=" control-label col-md-4 text-left"> Stato </label>
										<div class="col-md-6">
										  <input  type='text' name='stato' id='stato' value='{{ $row['stato'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Creazione Lavorazione" class=" control-label col-md-4 text-left"> Data Creazione Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_creazione_lavorazione' id='data_creazione_lavorazione' value='{{ $row['data_creazione_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Annullamento" class=" control-label col-md-4 text-left"> Data Annullamento </label>
										<div class="col-md-6">
										  <input  type='text' name='data_annullamento' id='data_annullamento' value='{{ $row['data_annullamento'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Fine Lavorazione" class=" control-label col-md-4 text-left"> Data Fine Lavorazione </label>
										<div class="col-md-6">
										  <input  type='text' name='data_fine_lavorazione' id='data_fine_lavorazione' value='{{ $row['data_fine_lavorazione'] }}' 
						     class='form-control input-sm ' /> 
										 </div> 
										 <div class="col-md-2">
										 	
										 </div>
									  </div> 					
									  <div class="form-group  " >
										<label for="Data Consegna" class=" control-label col-md-4 text-left"> Data Consegna </label>
										<div class="col-md-6">
										  <input  type='text' name='data_consegna' id='data_consegna' value='{{ $row['data_consegna'] }}' 
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
