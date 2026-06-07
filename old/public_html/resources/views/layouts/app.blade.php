<?php

  $set_theme = session('set_theme');
  if($set_theme =='') {
    $set_theme = 'light-theme.css';
  }

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title> {{ config('sximo.cnf_appname')}} </title>

<link rel="shortcut icon" href="{{ asset('favicon.ico')}}" type="image/x-icon">

<link href="{{ asset('sximo5/sximo.min.css')}}" rel="stylesheet">
<link href="{{ asset('sximo5/js/plugins/iCheck/skins/square/green.css')}}" rel="stylesheet">
<link href="{{ asset('sximo5/js/plugins/fancybox/jquery.fancybox.css') }}" rel="stylesheet">
<link href="{{ asset('sximo5/js/plugins/toast/css/jquery.toast.css')}}" rel="stylesheet">
<!-- Icon CSS -->   
<link href="{{ asset('sximo5/fonts/icomoon.css')}}" rel="stylesheet">
<link href="{{ asset('sximo5/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css')}}" rel="stylesheet">
<link href="{{ asset('sximo5/fonts/awesome/css/font-awesome.min.css')}}" rel="stylesheet">
<!--<link href="{{ asset('sximo5/css/colors.css')}}" rel="stylesheet"> -->

<!-- Sximo 5 Main CSS -->
<link href="{{ asset('sximo5/css/sximo.css')}}" rel="stylesheet">
<link href="{{ asset('sximo5/'.$set_theme)}}" rel="stylesheet" id="switch-theme">

<script type="text/javascript" src="{{ asset('sximo5/sximo.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('sximo5/js/sximo.js') }}"></script>


<!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->         


</head>

<body class="sxim-init" >
<div id="wrapper">


        @include('layouts.sidebar')
        <div class="gray-bg " id="page-wrapper">
          <div class="minimal-header ">
            @if(file_exists(public_path().'/uploads/images/'.config('sximo.cnf_logo') ) && config('sximo.cnf_logo') !='')
                <img src="{{ asset('uploads/images/'.config('sximo.cnf_logo')) }}" alt="{{ config('sximo.cnf_appname') }}"  />
            @else
            {{ config('sximo.cnf_appname')}} 
            @endif               
          </div>
            @include('layouts.header')

            @yield('content') 
            
        </div>
    </div>


    <div class="footer fixed">
        <div class="pull-right">
           
        </div>
        <div>
            <strong>Copyright</strong> &copy; 2014-<?php echo date('Y');?> .<b> {{ config('sximo.cnf_comname')}}</b> </div>
    </div>      

<div class="modal fade" id="sximo-modal" tabindex="-1" role="dialog">
<div class="modal-dialog  ">
  <div class="modal-content">
    <div class="modal-header bg-default">
        
        <button type="button " class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Modal title</h4>
    </div>
    <div class="modal-body" id="sximo-modal-content">

    </div>

  </div>
</div>
</div>

{{ SiteHelpers::showNotification() }} 
<script type="text/javascript">
jQuery(document).ready(function ($) {
  $('#sidemenu').sximMenu();  
 
  loadNotification();
  setInterval(function(){ 
   // loadNotification()
  }, 10000);  

  $('.switch-theme').on('click', function(event) {
      theme = $(this).attr('code') ;
      url_theme = '{!! asset("sximo5") !!}/'+ theme ;
      $.get('{{ url("set_theme") }}/'+ theme ,function(){

         $('#switch-theme').attr('href',url_theme);
      })       
  }); 

}); 
;  
  
function loadNotification(){
    $.get('{{ url("home/load") }}',function(data){
    $('.notif-alert').html(data.total);
        var html = '';
        $.each( data.note, function( key, val ) {     
        html += '<li><a href="'+val.url+'"><div class="message-center"><div class="user-img">'+val.image+'</div><div class="note-content"><h5>'+val.title+'</h5><span class="mail-desc">'+val.text+'</span> <span class="time">'+val.date+'</span> </div></div><div class="clr"></div></a></li>' ;
        });
        $('#notification-menu').html(html);
    });   
}  
</script>

</body>
</html>
