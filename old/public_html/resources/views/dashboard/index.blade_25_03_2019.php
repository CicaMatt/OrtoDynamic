@extends('layouts.app')


@section('content')
<div class="page-content row"> 
<div class="page-content-wrapper m-t">

  
<div class="sbox" style="border-top: none">
    <div class="sbox-title"> <h3>Sample Dashboard <small> Just change any content here with real data </small></h3></div>
    <div class="sbox-content">
    <div class="ribon-sximo">
        <section >

                <div class="row m-l-none m-r-none m-t  white-bg shortcut " >
                    <div class="col-sm-3  p-sm ribon-grey">
                        <span class="pull-left m-r-sm "><i class="fa fa-opencart"></i></span> 
                        <a href="{{ url('builder/create') }}"  class="clear">
                            <span class="h3 block m-t-xs"><strong>$ 26,900     </strong>
                            </span> <small >   Sales in last 24h </small>
                        </a>
                    </div>              
                    <div class="col-sm-3 p-sm ribon-grey2">
                        <span class="pull-left m-r-sm "><i class="fa fa-area-chart"></i></span>
                        <a href="javascript:void(0)" class="clear " onclick="$('.unziped').toggle()">
                            <span class="h3 block m-t-xs"><strong> 98,100  </strong>
                            </span> <small > Sales in current month </small> 
                        </a>
                    </div>              
                    <div class="col-sm-3   p-sm ribon-grey3">
                        <span class="pull-left m-r-sm "><i class="fa fa-dashboard "></i></span>
                        <a >
                            <span class="h3 block m-t-xs"><strong> Income last month </strong>
                            </span> <small > Income last month </small> 
                        </a>
                    </div>                  
  
                    <div class="col-sm-3   p-sm ribon-grey4">
                        <span class="pull-left m-r-sm "><i class="icon-bar-chart "></i></span>
                        <a >
                            <span class="h3 block m-t-xs"><strong>  424,120</strong>
                            </span> <small > Sals current year  </small> 
                        </a>
                    </div>    

                </div> 

        </section>          
    </div>
    
<div class="row">

        <div class="col-sm-4">
            <h1 class="m-b-xs">
                26,900
            </h1>
            <small>
                Sales in current month
            </small>
            <div id="sparkline1" class="m-b-sm"></div>
            <div class="row">
                <div class="col-xs-4">
                    <small class="stats-label">Pages / Visit</small>
                    <h4>236 321.80</h4>
                </div>

                <div class="col-xs-4">
                    <small class="stats-label">% New Visits</small>
                    <h4>46.11%</h4>
                </div>
                <div class="col-xs-4">
                    <small class="stats-label">Last week</small>
                    <h4>432.021</h4>
                </div>
            </div>

        </div>
        <div class="col-sm-4">
            <h1 class="m-b-xs">
                98,100
            </h1>
            <small>
                Sales in last 24h
            </small>
            <div id="sparkline2" class="m-b-sm"></div>
            <div class="row">
                <div class="col-xs-4">
                    <small class="stats-label">Pages / Visit</small>
                    <h4>166 781.80</h4>
                </div>

                <div class="col-xs-4">
                    <small class="stats-label">% New Visits</small>
                    <h4>22.45%</h4>
                </div>
                <div class="col-xs-4">
                    <small class="stats-label">Last week</small>
                    <h4>862.044</h4>
                </div>
            </div>


        </div>
        <div class="col-sm-4">

            <div class="row m-t-xs">
                <div class="col-xs-6">
                    <h5 class="m-b-xs">Income last month</h5>
                    <h1 class="no-margins">160,000</h1>
                    <div class="font-bold text-navy">98% <i class="fa fa-bolt"></i></div>
                </div>
                <div class="col-xs-6">
                    <h5 class="m-b-xs">Sals current year</h5>
                    <h1 class="no-margins">42,120</h1>
                    <div class="font-bold text-navy">98% <i class="fa fa-bolt"></i></div>
                </div>
            </div>


            <table class="table small m-t-sm">
                <tbody>
                <tr>
                    <td>
                        <strong>142</strong> Projects

                    </td>
                    <td>
                        <strong>22</strong> Messages
                    </td>

                </tr>
                <tr>
                    <td>
                        <strong>61</strong> Comments
                    </td>
                    <td>
                        <strong>54</strong> Articles
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong>154</strong> Companies
                    </td>
                    <td>
                        <strong>32</strong> Clients
                    </td>
                </tr>
                </tbody>
            </table>



        </div>

    </div>
</div>
</div>  



</div>
</div> 

<script type="text/javascript" src="{{ asset('sximo5/js/plugins/jquery.sparkline.min.js') }}"></script>
    <script>
        $(document).ready(function() {

            var sparklineCharts = function(){
                $("#sparkline1").sparkline([34, 43, 43, 35, 44, 32, 44, 52], {
                    type: 'line',
                    width: '100%',
                    height: '50',
                    lineColor: '#1ab394',
                    fillColor: "transparent"
                });

                $("#sparkline2").sparkline([32, 11, 25, 37, 41, 32, 34, 42], {
                    type: 'line',
                    width: '100%',
                    height: '50',
                    lineColor: '#1ab394',
                    fillColor: "transparent"
                });

                $("#sparkline3").sparkline([34, 22, 24, 41, 10, 18, 16,8], {
                    type: 'line',
                    width: '100%',
                    height: '50',
                    lineColor: '#1C84C6',
                    fillColor: "transparent"
                });
            };

            var sparkResize;

            $(window).resize(function(e) {
                clearTimeout(sparkResize);
                sparkResize = setTimeout(sparklineCharts, 500);
            });

            sparklineCharts();

       })
    </script>    
                     
@stop