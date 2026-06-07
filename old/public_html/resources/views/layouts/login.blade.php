<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{config('sximo.cnf_appname') }}</title>
<link rel="shortcut icon" href="{{ asset('favicon.ico')}}" type="image/x-icon">

    <link href="{{ asset('sximo5/js/plugins/bootstrap/css/bootstrap.css')}}" rel="stylesheet"> 
    <link href="{{ asset('sximo5/js/plugins/toast/css/jquery.toast.css')}}" rel="stylesheet">
    <link href="{{ asset('sximo5/css/sximo.css')}}" rel="stylesheet">
    <link href="{{ asset('sximo5/css/animate.css')}}" rel="stylesheet">
    <link href="{{ asset('sximo5/fonts/icomoon.css')}}" rel="stylesheet">
    <link href="{{ asset('sximo5/fonts/awesome/css/font-awesome.min.css')}}" rel="stylesheet">


    <script type="text/javascript" src="{{ asset('sximo5/js/plugins/jquery.3.2.1.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('sximo5/js/plugins/parsley.min.js') }}"></script>      
    <script type="text/javascript" src="{{ asset('sximo5/js/plugins/bootstrap/js/bootstrap.js') }}"></script>
    <script type="text/javascript" src="{{ asset('sximo5/js/plugins/jquery.form.js') }}"></script>  
    <script type="text/javascript" src="{{ asset('sximo5/js/plugins/toast/js/jquery.toast.js') }}"></script>
    <script src='https://www.google.com/recaptcha/api.js'></script>

    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->  

    
  
    </head>
<body  class="bglogin">
    <div class="middle-box  ">
        <div class="inner">
            @yield('content') 
        </div>
    </div>


</body> 
</html>