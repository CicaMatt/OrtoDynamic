@extends('layouts.app')


@section('content')
<div class="page-content row">
	<div class="page-content-wrapper m-t">

		<div class="sbox">
			<div class="sbox-title">
				<h1> {{ $pageTitle }} <small> {{ $pageNote }} </small></h1>
			</div>
			<div class="sbox-content">

	 @include('sximo.config.tab',array('active'=>'translation'))
 	{!! Form::open(array('url'=>'sximo/config/translation/', 'class'=>'form-vertical row')) !!}
		
		<div class="col-sm-9">
		
			<a href="{{ URL::to('sximo/config/addtranslation')}} " onclick="SximoModal(this.href,'Add New Language');return false;" class="btn btn-success"><i class="fa fa-plus"></i> New </a>  
			<hr />
			<table class="table table-striped">
				<thead>
					<tr>
						<th> Name </th>
						<th> Folder </th>
						<th> Author </th>
						<th> Action </th>
					</tr>
				</thead>
				<tbody>		
			
				@foreach(SiteHelpers::langOption() as $lang)
					<tr>
						<td>  {{  $lang['name'] }}   </td>
						<td> {{  $lang['folder'] }} </td>
						<td> {{  $lang['author'] }} </td>
					  	<td>
						@if($lang['folder'] !='en')
						<a href="{{ URL::to('sximo/config/translation?edit='.$lang['folder'])}} " class="btn btn-sm btn-primary"> Manage </a>
						<a href="{{ URL::to('sximo/config/removetranslation/'.$lang['folder'])}} " class="btn btn-sm btn-danger"> Delete </a> 
						 
						@endif 
					
					</td>
					</tr>
				@endforeach
				
				</tbody>
			</table>
		</div> 

		{!! Form::close() !!}


			</div>
		</div>
	</div>
</div>
@endsection