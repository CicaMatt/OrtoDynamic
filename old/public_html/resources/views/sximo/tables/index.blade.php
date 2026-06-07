@extends('layouts.app')

@section('content')
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li class="active"> {{ $pageTitle }} </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

		<div class="sbox">
			<div class="sbox-title">
				<h1> All Tables  <small> </small></h1>
				<div class="sbox-tools">
					<a href="{{ url('sximo/tables/tableconfig/')}}" class="btn btn-sm  linkConfig tips" title="New Table "><i class="fa fa-plus"></i> Create New Table  </a>
					<a href="{{ url('sximo/tables/mysqleditor/')}}" class="btn btn-sm linkConfig tips" title="MySQL Editor"><i class="fa fa-pencil"></i> MySQL Editor  </a>	
				</div>				
			</div>
			<div class="sbox-content">
		<div class="row">

					
			<div class="col-md-3">
				<div class="table-scroll" style="height: 450px; position: absolute;">
				{!! Form::open(array('url'=>'sximo/tables/tableremove/', 'class'=>'form-horizontal ','id'=>'removeTable' )) !!}
				<div class="m-t" style="height: 450px; " >
					<table class="table">
						<thead>
							<tr>
								
								<th width="30"> <input type="checkbox" class="checkall minimal-green " /></th>
								<th> Table Name </th>
								<th width="50"> Action </th>
							</tr>
						</thead>
						<tbody>
						@foreach($tables as $table)
							<tr>
								<td><input type="checkbox" class="ids  minimal-green" name="id[]" value="{{ $table }}" /> </td>
								<td><a href="{{ URL::TO('sximo/tables/tableconfig/'.$table)}}" class="linkConfig" > {{ $table }}</a></td>
								<td>
								<a href="javascript:void(0)" onclick="droptable()" class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i></a>
								</td>
							</tr>
						@endforeach
						</tbody>
					
					</table>
				
				</div>
				{!! Form::close() !!}
				</div>		
			</div>
			<div class="col-md-9">
				
				<div class="tableconfig" style=" padding:10px; min-height:550px; ">

				</div>

			</div>

		</div>
    </div>


			</div>
		</div>
	</div>
</div>
 <script type="text/javascript" src="{{ asset('sximo5/js/simpleclone.js') }}"></script>

<script type="text/javascript">
$(document).ready(function(){
	jQuery('.table-scroll').scrollbar();
	$('.linkConfig').click(function(){
		$('.ajaxLoading').show();
		var url =  $(this).attr('href');
		$.get( url , function( data ) {
			$( ".tableconfig" ).html( data );
			$('.ajaxLoading').hide();
			
			
		});
		return false;
	});
});

function droptable()
{
	if(confirm('are you sure remove selected table(s) ?'))
	{
		$('#removeTable').submit();
	} else {
		return false;
	}
}

</script>
@endsection