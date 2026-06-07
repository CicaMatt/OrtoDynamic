@extends('layouts.app')

@section('content')
<section class="page-header row">
  <h3> {{ $title }} </h3>
  <ol class="breadcrumb">
    <li><a href="{{ url('dashboard')}}"> Home </a></li>
    <li><a href="{{ url('root')}}"> Core  </a></li>
    <li  class="active"> {{ $title }} </li>
  </ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">
        <div class="sbox"  >
            <div class="sbox-title" >   
                <h3> {!! $title !!} </h3>
				<div class="sbox-tools">
					<a href="{{ url('sximo/form/update')}}" class="btn btn-sm  linkConfig tips ajaxCallback" title="New Table "><i class="fa fa-plus"></i> Create Form  </a>
				</div>                
            </div>
            <div class="sbox-content">
    		<div class="infobox infobox-info fade in">
			  <button type="button" class="close" data-dismiss="alert"> x </button>  
			   <p><strong> Importanly : </strong> This is Simple FORM BUILDER . Its usefull for create simple form for your frontend website.   </p>
			</div>
            	<div class="row">

	            	<div class="col-md-2">
						<ul class="nav" id="table-list" >
						@foreach($forms as $form)
							<li><a href="{{ url('sximo/form/update?id='.$form->formID) }}" class="ajaxCallback"> {{ $form->name }}</a> </li>
						@endforeach

						</ul>


	            	</div>

	            	<div class="col-md-10">

		            	<div id="main-container">

		            	</div>

	            	</div>


            	</div>              
            </div>  
        </div>
    </div>      
</div>
 


  <script type="text/javascript">
$(document).ready(function(){

	$('.ajaxCallback').click(function(){
		$('.ajaxLoading').show();
		var url =  $(this).attr('href');
		$.get( url , function( data ) {
			$( "#main-container" ).html( data );
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