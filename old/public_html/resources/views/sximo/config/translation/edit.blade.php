@extends('layouts.app')

@section('content')
<div class="page-content row">
	<div class="page-content-wrapper m-t">

		<div class="sbox">
			<div class="sbox-title">
				<h1> {{ $pageTitle }} <small> {{ $pageNote }} </small></h1>
			</div>
			<div class="sbox-content">

			@include('sximo.config.tab',array('active'=>'translation'))
		 	
			<div class="col-sm-8">
				<ul class="nav nav-tabs" >
				@foreach($files as $f)
					@if($f != "." and $f != ".." and $f != 'info.json')
					<li @if($file == $f) class="active" @endif  >
					<a href="{{ URL::to('sximo/config/translation?edit='.$lang.'&file='.$f)}}">{{ $f }} </a></li>
					@endif
				@endforeach
				</ul>
				<hr />
				{!! Form::open(array('url'=>'sximo/config/savetranslation/', 'class'=>'form-vertical ')) !!}
					<table class="table table-striped">
						<thead>
							<tr>
								<th> Pharse </th>
								<th> Translation </th>

							</tr>
						</thead>
						<tbody>	
							
							<?php foreach($stringLang as $key => $val) : 
								if(!is_array($val)) 
								{
								?>
								<tr>	
									<td><?php echo $key ;?></td>
									<td><input type="text" name="<?php echo $key ;?>" value="{{ $val }}" class="form-control input-sm" />
									
									</td>
								</tr>
								<?php 
								} else {
									foreach($val as $k=>$v)
									{ ?>
										<tr>	
											<td><?php echo $key .' - '.$k ;?></td>
											<td><input type="text" name="<?php echo $key ;?>[<?php echo $k ;?>]" value="{{ $v }}" class="form-control  input-sm" />
											
											</td>
										</tr>						
									<?php }
								}
							endforeach; ?>
						</tbody>
						
					</table>
					<input type="hidden" name="lang" value="{{ $lang }}"  />
					<input type="hidden" name="file" value="{{ $file }}"  />
					<button type="submit" class="btn btn-info"> Save Translation</button>
				{!! Form::close() !!}


			</div>
		</div>
	</div>
</div>

@endsection