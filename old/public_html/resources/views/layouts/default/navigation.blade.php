<?php  $menus = SiteHelpers::menus('top') ;?>
<ul class="nav navbar-nav  navbar-right">
    <li><a href="{{ url('') }}"> Home</a></li>
    @foreach ($menus as $menu)
        @if($menu['module'] =='separator')
        <li class="divider"></li>        
        @else
            <li><!-- HOME -->
                <a 
                @if($menu['menu_type'] =='external')
                    href="{{ URL::to($menu['url'])}}" 
                @else
                    href="{{ URL::to($menu['module'])}}" 
                @endif
             
                 @if(count($menu['childs']) > 0 ) class="dropdown-toggle" data-toggle="dropdown" @endif>
                    <i class="{{$menu['menu_icons']}}"></i>                 
                    @if(config('sximo.cnf_multilang') ==1 && isset($menu['menu_lang']['title'][session('lang')]) && $menu['menu_lang']['title'][session('lang')]!='')
                        {{ $menu['menu_lang']['title'][session('lang')] }}
                    @else
                        {{$menu['menu_name']}}
                    @endif             
                    @if(count($menu['childs']) > 0 )
                     <b class="caret"></b> 
                    @endif  
                </a> 
                @if(count($menu['childs']) > 0)
                <ul class="dropdown-menu dropdown-menu-right">
                @foreach ($menu['childs'] as $menu2)
                    @if($menu2['module'] =='separator')
                        <li class="divider"> </li>        
                    @else
                    <li class="
                        @if(count($menu2['childs']) > 0) dropdown-submenu @endif
                        @if(Request::is($menu2['module'])) active @endif">
                        <a 
                            @if($menu2['menu_type'] =='external')
                                href="{{ url($menu2['url'])}}" 
                            @else
                                href="{{ url($menu2['module'])}}" 
                            @endif
                                        
                        >
                            <i class="{{ $menu2['menu_icons'] }}"></i> 
                            @if(config('sximo.cnf_multilang') ==1 && isset($menu2['menu_lang']['title'][session('lang')]))
                                {{ $menu2['menu_lang']['title'][session('lang')] }}
                            @else
                                {{$menu2['menu_name']}}
                            @endif                        
                        </a>
                    @endif
                 @endforeach     
                </ul>
                @endif
            </li>
        @endif
    @endforeach    
   
</ul>            

