@extends('layouts.app')

@section('content')
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li><a href="{{ url($pageModule) }}"> {{ $pageTitle }} </a></li>
		<li class="active"> Form  </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

	{!! Form::open(array('url'=>'misuregenerali?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
	<div class="sbox">
		<div class="sbox-title clearfix">
			<div class="sbox-tools " >
				<a href="{{ url($pageModule.'?return='.$return) }}" class="tips btn btn-sm "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-times"></i></a> 
			</div>
			<div class="sbox-tools pull-left" >
				<button name="apply" class="tips btn btn-sm btn-apply  "  title="{{ __('core.btn_back') }}" ><i class="fa  fa-check"></i> {{ __('core.sb_apply') }} </button>
				<button name="save" class="tips btn btn-sm btn-save"  title="{{ __('core.btn_back') }}" ><i class="fa  fa-paste"></i> {{ __('core.sb_save') }} </button> 
			</div>
		</div>	
		<div class="sbox-content clearfix">
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
			
			

		</div>
	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		
	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("misuregenerali/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop