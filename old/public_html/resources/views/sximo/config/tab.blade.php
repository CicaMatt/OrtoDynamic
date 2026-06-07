<?php

$tabs = array(
		'' 		        => ''. Lang::get('core.tab_siteinfo'),
		'email'			=> ' '. Lang::get('core.tab_email'),
		'security'		=> ' '. Lang::get('core.tab_loginsecurity') ,
		'translation'	=>' '.Lang::get('core.tab_translation')
	);

?>

<ul class="nav nav-tabs m-b" style="margin-bottom: 20px;">
@foreach($tabs as $key=>$val)
	<li  @if($key == $active) class="active" @endif><a href="{{ URL::to('sximo/config/'.$key)}}"> {!! $val !!}  </a></li>
@endforeach

</ul>