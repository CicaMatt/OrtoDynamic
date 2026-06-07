<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }} | {{ config('sximo.cnf_appname') }}</title>
    <link rel="shortcut icon" href="{{ asset('favicon.ico')}}" type="image/x-icon">
    <!-- CSS Files -->
    <link href="{{ asset('frontend/default/app.css') }}" rel="stylesheet" />
    <link href="{{ asset('frontend/default/style.css') }}" rel="stylesheet" media="screen" />
    <link href="{{ asset('sximo5/fonts/icomoon.css') }}" rel="stylesheet" />
    <link href="{{ asset('sximo5/fonts/awesome/css/font-awesome.css') }}" rel="stylesheet" />
    <!-- CSS Just for demo purpose, don't include it in your project --> 
     <script src="{{ asset('frontend/default/js/app.js') }}"></script>
      



    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js">
    </script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js">
    </script>
    <![endif]-->
  </head>
  <body class="index-page sidebar-collapse">

  <div id="header">
    <div id="social-header" class="clearfix">
      <div class="container">
        
          <div class="row">
            <div class="col-md-6 ">
              <ul class="social-icons">
                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                <li><a href="#"><i class="fa fa-google"></i></a></li>
                <li><a href="#"><i class="fa fa-youtube"></i></a></li>
                <li><a href="#"><i class="fa fa-twitter"></i></a></li>
              </ul>
            </div>
            <div class="col-md-6 ">
              <ul class="social-icons pull-right">
               @if(Auth::check())
               <li class="hidden-xs"> <a> Welcome <b>{{ session('fid') }} </b> </a></li>
               <li><a href="{{ url('user/profile?view=frontend') }}"><i class="fa fa-user-plus"></i> {{ __('core.m_profile') }}</a></li>
               <li><a href="{{ url('dashboard') }}"><i class="fa fa-television"></i> Dashboard </a></li>
               <li><a href="{{ url('user/logout') }}"><i class="fa fa-sign-out"></i> {{ __('core.m_logout') }} </a></li>
               @else
                <li class="hidden-xs"> <a> Welcome <b> Guest </b> </a></li>
                <li><a href="{{ url('user/login') }}"><i class="fa fa-lock"></i> {{ __('core.signin') }} </a></li>
                <li><a href="{{ url('user/register') }}"><i class="fa fa-user-plus"></i> {{ __('core.signup') }} </a></li>
               @endif 
              </ul>
            </div>

          </div>
          
        </div>
      
    </div>
    <!-- Navbar -->
    <nav class="navbar navbar-default navbar-static-top bg-white">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="{{ url('') }}">
            <img src="{{ asset('frontend/default/images/logo.png') }}" alt="{{ config('cnf_appname') }}" />
          </a>
        </div> 
         <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
           @include('layouts.default.navigation')
        </div>
      </div>
    </nav>       
    <!-- End Navbar -->
  </div>  

    <!-- Main Content Begin Here -->
    <section id="main-content">
        @include($pages)
    </section></section>
    <!-- Main Content Begin Here -->


    <!-- Footer Section -->
    <footer>
      <!-- Container Starts -->
      <div class="container">
        <!-- Row Starts -->
        <div class="row section">
          <!-- Footer Widget Starts -->
          <div class="footer-widget col-md-3 col-xs-12 wow fadeIn">
            <h3 class="small-title">
              About Us
            </h3>
            <p>
              Etiam ornare condimentum massa et scelerisque. Mauris nibh ipsum, laoreet at venenatis ac, rutrum sed risus, 
            </p> 
            <p>Aliquam magna nibh, mattis a urna nec. Semper venenatis magna.</p>
            <div class="social-footer">
              <a href="#"><i class="fa fa-facebook icon-round"></i></a>
              <a href="#"><i class="fa fa-twitter icon-round"></i></a>
              <a href="#"><i class="fa fa-linkedin icon-round"></i></a>
              <a href="#"><i class="fa fa-google-plus icon-round"></i></a>
            </div>         
          </div><!-- Footer Widget Ends -->
          
          <!-- Footer Widget Starts -->
          <div class="footer-widget col-md-3 col-xs-12 wow fadeIn" data-wow-delay=".2s">
            <h3 class="small-title">
              Twitter
            </h3>
            <ul class="recent-tweets">

              
              
            </ul>
          </div><!-- Footer Widget Ends -->

          <!-- Footer Widget Starts -->
          <div class="footer-widget col-md-3 col-xs-12 wow fadeIn" data-wow-delay=".5s">
            <h3 class="small-title">
              Other Links
            </h3>
            <ul class="nav">
                 <li class="nav-item">
                  <a class="nav-link active" href="{{ url('') }}">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="{{ url('privacy') }}">Privacy Policy</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="{{ url('toc') }}">Terms of services</a>
                </li>

            </ul>
            
          </div><!-- Footer Widget Ends -->

          <!-- Footer Widget Starts -->
          <div class="footer-widget col-md-3 col-xs-12 wow fadeIn" data-wow-delay=".8s">
            <h3 class="small-title">
              Subscribe Us
            </h3>
            <div class="contact-us">
              <p>Tellus aliquam at. Pellentesque gravida vel eros et pretium</p>
              <form>
              <div class="form-group">
                <input type="text" class="form-control" id="exampleInputName2" placeholder="Enter your name">
              </div>
              <div class="form-group">
                <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter your email">
              </div>
              <button type="submit" class="btn btn-common">Submit</button>
            </form>
            </div>
          </div><!-- Footer Widget Ends -->
        </div><!-- Row Ends -->
      </div><!-- Container Ends -->
      
      <!-- Copyright -->
      <div id="copyright">
        <div class="container">
          <div class="row text-center">
            
              <p class="copyright-text">
                ©  {{ date('Y') }} <b>{{ config('sximo.cnf_comname') }} </b>. All right reserved. Designed with by <a href="#">CrudEngine</a>
              </p>
            
          </div>
        </div>
      </div>
      <!-- Copyright  End-->
      
    </footer>
    <!-- Footer Section End-->

    <!-- JavaScript & jQuery Plugins -->
    <!-- jQuery Load -->
    
    <script src="{{ asset('frontend/default/js/script.js') }}"></script>

  </body>
</html>