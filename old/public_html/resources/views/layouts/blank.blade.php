<?php $sximoconfig  = config('sximo');?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ $sximoconfig['cnf_appname'] }}</title>
<link rel="shortcut icon" href="{{ asset('favicon.ico')}}" type="image/x-icon">

<!-- Bootstrap Core CSS -->
    <link href="{{ asset('')}}assets/template/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- This is a Custom CSS -->
    <link href="{{ asset('')}}assets/template/css/style.css" rel="stylesheet">
    <!-- Legacy  Custom CSS for old sximo layout -->
    <link href="{{ asset('')}}assets/template/css/legacy.css" rel="stylesheet">

    
	<link href="{{ asset('sximo/css/sximo5.css')}}" rel="stylesheet">
	<script src="{{ asset('adminlte')}}/plugins/jQuery/jquery-2.2.3.min.js"></script>
	<script src="{{ asset('adminlte')}}/bootstrap/js/bootstrap.min.js"></script>
	@if(session('themes') !='')
	<link href="{{ asset('')}}assets/template/css/colors/{{ session('themes')}}.css" id="theme" rel="stylesheet">
	@else
	<link href="{{ asset('')}}assets/template/css/colors/gray.css" id="theme" rel="stylesheet">
	@endif
    <!-- jQuery UI 1.11.4 -->
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>    
    <!-- Bootstrap Core JavaScript -->
    <script src="{{ asset('')}}assets/template/bootstrap/dist/js/bootstrap.min.js"></script>
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
			<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->	

	
	
  	</head>

	<body onload="window.print()">
		{!! $html !!}
	
		<script type="text/javascript">
			$(function(){
				$('.box-header').hide();
			})
		</script>
	</body>

</html>