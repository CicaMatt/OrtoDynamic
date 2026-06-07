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
<div class="page-content  row">
	<div class="page-content-wrapper no-margin">

	<div class="sbox">
		<div class="sbox-title clearfix">
		<h4> Form Update </h4>
			<div class="sbox-tools" >
				<a href="{{ url('sximo/rac?return='.$return) }}" class="tips btn btn-sm  " title="{{ __('core.btn_back') }}"><i class="fa  fa-times"></i></a>		
			</div>
		</div>
		<div class="sbox-content">
	<div class="box-body"> 	

		<ul class="parsley-error-list">
			@foreach($errors->all() as $error)
				<li>{{ $error }}</li>
			@endforeach
		</ul>	

		 {!! Form::open(array('url'=>'sximo/rac?return='.$return, 'class'=>'form-horizontal validated','files' => true , 'parsley-validate'=>'','novalidate'=>' ')) !!}
<div class="col-md-12">
						<fieldset><legend> RestAPI Client</legend>
				{!! Form::hidden('id', $row['id']) !!}					
									  <div class="form-group  " >
										<label for="Apiuser" class=" control-label col-md-4 text-left"> Apiuser </label>
										<div class="col-md-7">
										  <select name='apiuser' rows='5' id='apiuser' class='select2 ' required="true"   ></select> 
										 </div> 
										 <div class="col-md-1">
										 	
										 </div>
									  </div> 					
										@if($row['id'] !='')
											<div class="form-group  " >
												<label for="Apikey" class=" control-label col-md-4 text-left"> 
												Api Key </label>
												<div class="col-md-6">
												  {!! Form::text('apikey', $row['apikey'],array('class'=>'form-control', 'placeholder'=>'','readonly'=>'1' ,'style'=>'background : #f0f0f0 !important;'   )) !!} 
												 <p><i>  Use this apikey with useremail as basic authorization access to all your registered modules </i> </p>
												 </div> 
												 <div class="col-md-2">
												 	
												 </div>
											</div> 
										@endif
	 {!! Form::hidden('created', $row['created']) !!}					
									  <div class="form-group  " >
										<label for="Modules" class=" control-label col-md-4 text-left"> Modules </label>
										<div class="col-md-7">
										  <select name='modules[]' multiple rows='5' id='modules' required="true" class='select2 '   ></select> 
										 </div> 
										 <div class="col-md-1">
										 	
										 </div>
									  </div> </fieldset>
			</div>
			
			

		
			<div style="clear:both"></div>	
				
					
				  <div class="form-group">
					<label class="col-sm-4 text-right">&nbsp;</label>
					<div class="col-sm-8">	
					<button type="submit" name="apply" class="btn btn-info btn-sm" ><i class="icon-checkmark-circle2"></i> {{ __('core.sb_apply') }}</button>
					<button type="submit" name="submit" class="btn btn-primary btn-sm" ><i class="icon-bubble-check"></i> {{ __('core.sb_save') }}</button>
					<button type="button" onclick="location.href='{{ URL::to('sximo/rac?return='.$return) }}' " class="btn btn-warning btn-sm "><i class="icon-cancel-circle2 "></i>  {{ __('core.sb_cancel') }} </button>
					</div>	  
			
				  </div> 
		 <input type="hidden" name="action_task" value="save" />
		 {!! Form::close() !!}
	</div>
</div>		 
</div>	
		 
   <script type="text/javascript">
	$(document).ready(function() { 
		
		
		$("#apiuser").jCombo("{!! url('sximo/rac/comboselect?filter=tb_users:id:email') !!}",
		{  selected_value : '{{ $row["apiuser"] }}' });
		
		$("#modules").jCombo("{!! url('sximo/rac/comboselect?filter=tb_module:module_name:module_title&limit=WHERE:module_type:!=:core') !!}",
		{  selected_value : '{{ $row["modules"] }}' });	
		
	});
	</script>		 
@stop