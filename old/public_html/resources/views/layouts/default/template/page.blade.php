<section class="page-header">
	<div class="container">		
		<h2> {{ $title }}</h2>
		<span> {{ $subtitle }} </span>
		<ol class="breadcrumb">
			<li><a href="{{ url('') }}"> Home </a> </li>
			<li class="active"> {{ $title }} </li>
		</ol>	
	</div>	
</section>
<!-- Page Header End -->
<section class="section " id="main-page">
	<div class="container">			
  		<?php echo $content ;?>
  	</div>
</section>
