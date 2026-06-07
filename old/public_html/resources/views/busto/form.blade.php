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

	{!! Form::open(array('url'=>'busto?return='.$return, 'class'=>'form-horizontal validated','files' => true )) !!}
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
			
			

		</div>
	</div>
	<input type="hidden" name="action_task" value="save" />
	{!! Form::close() !!}
	</div>
</div>		
	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		
		 		 

		$('.removeMultiFiles').on('click',function(){
			var removeUrl = '{{ url("busto/removefiles?file=")}}'+$(this).attr('url');
			$(this).parent().remove();
			$.get(removeUrl,function(response){});
			$(this).parent('div').empty();	
			return false;
		});		
		
	});
	</script>		 
@stop