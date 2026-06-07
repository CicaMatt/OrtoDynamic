@extends('layouts.app')
@section('content')
<div class="page-content row">
	<div class="page-content-wrapper m-t">

		<div class="sbox">
			<div class="sbox-title">
				 <h1> {{ $pageTitle }}</h1>
			</div>
			<div class="sbox-content">


@include('sximo.config.tab')
	 {!! Form::open(array('url'=>'sximo/config/save/', 'class'=>'form-horizontal row validated', 'files' => true)) !!}

	<div class="col-sm-6 animated fadeInRight ">
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_appname') }} </label>
		<div class="col-md-8">
		<input name="cnf_appname" type="text" id="cnf_appname" class="form-control input-sm " required  value="{{ $sximoconfig['cnf_appname'] }}" />  
		 </div> 
	  </div>  
	  
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_appdesc') }} </label>
		<div class="col-md-8">
		<input name="cnf_appdesc" type="text" id="cnf_appdesc" class="form-control input-sm" value="{{ $sximoconfig['cnf_appdesc'] }}" /> 
		 </div> 
	  </div>  
	  
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_comname') }} </label>
		<div class="col-md-8">
		<input name="cnf_comname" type="text" id="cnf_comname" class="form-control input-sm" value="{{ $sximoconfig['cnf_comname'] }}" />  
		 </div> 
	  </div>      

	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_emailsys') }} </label>
		<div class="col-md-8">
		<input name="cnf_email" type="text" id="cnf_email" class="form-control input-sm" value="{{ $sximoconfig['cnf_email'] }}" /> 
		 </div> 
	  </div>   
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4"> {{ Lang::get('core.fr_multilanguage') }} <br />  </label>
		<div class="col-md-8">
			<div class="">
				<input name="cnf_multilang" type="checkbox" id="cnf_multilang" value="1" class="minimal-red" 
				@if($sximoconfig['cnf_multilang'] ==1) checked @endif
				  /> <label> {{ Lang::get('core.fr_enable') }} </label>
			</div>	
		 </div> 
	  </div> 
	     
	   <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_mainlanguage') }} </label>
		<div class="col-md-8">

				<select class="form-control input-sm" name="cnf_lang">

				@foreach(SiteHelpers::langOption() as $lang)
					<option value="{{  $lang['folder'] }}"
					@if(config('sximo.cnf_lang') ==$lang['folder']) selected @endif
					>{{  $lang['name'] }}</option>
				@endforeach
			</select>
		 </div> 
	  </div>   
	      

	   <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">{{ Lang::get('core.fr_fronttemplate') }}</label>
		<div class="col-md-8">
				
				<select class="form-control input-sm" name="cnf_theme" required="true">
				<option value=""> Select Frontend Template</option>

				@foreach(SiteHelpers::themeOption() as $t)
					<option value="{{  $t['folder'] }}"
					@if($sximoconfig['cnf_theme'] ==$t['folder']) selected @endif
					>{{  $t['name'] }}</option>
				@endforeach
			</select>
		 </div> 
	  </div> 


	   <div class="form-group" style="display: none;">
	    <label for="ipt" class=" control-label col-md-4"> Backend Template </label>
		<div class="col-md-8">
				
				<select class="form-control input-sm" name="cnf_backend" required="true">
				<option value="minimal"> Select Backend Template</option>
				@foreach(SiteHelpers::backendOption() as $t)
					<option value="{{  $t['folder'] }}"
					@if($sximoconfig['cnf_backend'] ==$t['folder']) selected @endif
					>{{  $t['name'] }}</option>
				@endforeach
			</select>
		 </div> 
	  </div> 


	  <div class="form-group hide">
	    <label for="ipt" class=" control-label col-md-4"> Development Mode ?   </label>
		<div class="col-md-8">
			<div class="checkbox">
				<input name="cnf_mode" type="checkbox" id="cnf_mode" value="1"
				@if ($sximoconfig['cnf_mode'] =='production') checked @endif
				  />  Production
			</div>
			<small> If you need to debug mode , please unchecked this option </small>	
		 </div> 
	  </div> 		  
	  
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">&nbsp;</label>
		<div class="col-md-8">
			<button class="btn btn-primary" type="submit">{{ Lang::get('core.sb_savechanges') }} </button>
		 </div> 
	  </div> 
	</div>

	<div class="col-sm-6 animated fadeInRight ">

	  
	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4"> {{ Lang::get('core.fr_dateformat') }} </label>
		<div class="col-md-8">
			<select class="form-control input-sm" name="cnf_date">
			<?php $dates = array(
					'Y-m-d'=>' ( Y-m-d ) . Example : '.date('Y-m-d'),
					'Y/m/d'=>' ( Y/m/d ) . Example : '.date('Y/m/d'),
					'd-m-y'=>' ( D-M-Y ) . Example : '.date('d-m-y'),
					'd/m/y'=>' ( D/M/Y ) . Example : '.date('d/m/y'),
					'm-d-y'=>' ( m-d-Y ) . Example : '.date('m-d-Y'),
					'm/d/y'=>' ( m/d/Y ) . Example : '.date('m/d/Y'),
				  );
			foreach($dates as $key=>$val) {?>
				<option value="{{  $key }}"
				@if(config('sximo.cnf_date') ==$key) selected @endif
				>{{  $val }}</option>

			<?php } ?>
			</select>
		 </div> 
	  </div>  			

	  <div class="form-group">
	    <label for="ipt" class=" control-label col-md-4">Metakey </label>
		<div class="col-md-8">
			<textarea class="form-control input-sm" name="cnf_metakey">{{ $sximoconfig['cnf_metakey'] }}</textarea>
		 </div> 
	  </div> 

	   <div class="form-group">
	    <label  class=" control-label col-md-4">Meta Description</label>
		<div class="col-md-8">
			<textarea class="form-control input-sm"  name="cnf_metadesc">{{ $sximoconfig['cnf_metadesc'] }}</textarea>
		 </div> 
	  </div>  

	   <div class="form-group">
	    <label  class=" control-label col-md-4">{{ Lang::get('core.fr_backendlogo') }}</label>
		<div class="col-md-8">
			<input type="file" name="logo">
			<p> <i>Please use image dimension 155px * 30px </i> </p>
			<div style="padding:5px; border:solid 1px #243646 ; background:#243646 ; width:auto;">
			 	@if(file_exists(public_path().'/uploads/images/'.$sximoconfig['cnf_logo']) && $sximoconfig['cnf_logo'] !='')
			 	<img src="{{ asset('uploads/images/'.$sximoconfig['cnf_logo'])}}" alt="{{ $sximoconfig['cnf_appname'] }}" />
			 	@else
				<img src="{{ asset('uploads/logo.png')}}" alt="{{ $sximoconfig['cnf_appname'] }}" />
				@endif	
			</div>				
		 </div> 
	  </div>  		  

	</div>  
	 {!! Form::close() !!}   

			</div>
		</div>
	</div>
</div>


@stop