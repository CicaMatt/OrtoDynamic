@extends('layouts.app')

@section('content')
<?php usort($tableGrid, "SiteHelpers::_sort") ?>
<section class="page-header row">
	<h2> {{ $pageTitle }} <small> {{ $pageNote }} </small></h2>
	<ol class="breadcrumb">
		<li><a href="{{ url('') }}"> Dashboard </a></li>
		<li class="active"> {{ $pageTitle }} </li>		
	</ol>
</section>
<div class="page-content row">
	<div class="page-content-wrapper no-margin">

		<div class="sbox">
			<div class="sbox-title">
				<h1> All Records <small> </small></h1>
			</div>
			<div class="sbox-content">

		<ul class="nav nav-tabs " >
		  <li class="active"><a href="#info" data-toggle="tab"> All Posts </a></li>
		  <li ><a href="#config" data-toggle="tab"> Post Setting </a></li>
		</ul>

	<div class="tab-content" style="margin-top: 0;">
		  <div class="tab-pane active" id="info" style="padding: 30px 0;">


			<!-- Toolbar Top -->
			<div class="row">
				<div class="col-md-4"> 	
					@if($access['is_add'] ==1)
					<a href="{{ url('core/posts/create?return='.$return) }}" class="btn btn-default btn-sm"  
						title="{{ __('core.btn_create') }}"><i class=" fa fa-plus "></i> Create New </a>
					@endif

					<div class="btn-group">
						<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon-menu5"></i> Bulk Action </button>
				        <ul class="dropdown-menu">
				         @if($access['is_excel'] ==1)
							<li><a href="{{ url( $pageModule .'/export?do=excel&return='.$return) }}"><i class="fa fa-download"></i> Export CSV </a></li>	
						@endif
						@if($access['is_add'] ==1)
							<li><a href="{{ url($pageModule .'/import?return='.$return) }}" onclick="SximoModal(this.href, 'Import CSV'); return false;"><i class="fa fa-cloud-upload"></i> Import CSV</a></li>
							<li><a href="javascript://ajax" class=" copy " title="Copy" ><i class="fa fa-copy"></i> Copy selected</a></li>
						@endif	
							<li><a href="{{ url($pageModule) }}"  ><i class="fa fa-times"></i> Clear Search </a></li>
				          	<li role="separator" class="divider"></li>
				         @if($access['is_remove'] ==1)
							 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}"><i class="fa fa-trash-o"></i>
							Remove Selected </a></li>
						@endif 
				          
				        </ul>
				     </div>    
				        <a href="#config" data-toggle="tab" class="btn btn-default btn-sm"><i class="fa fa-cog"></i> Config </a>
				       
				</div>
				<div class="col-md-4 pull-right">
					<div class="input-group">
					      <div class="input-group-btn">
					        <button type="button" class="btn btn-default btn-sm " 
					        onclick="SximoModal('{{ url($pageModule."/search") }}','Advance Search'); " ><i class="fa fa-filter"></i> Filter </button>
					      </div><!-- /btn-group -->
					      <input type="text" class="form-control input-sm onsearch" data-target="{{ url($pageModule) }}" aria-label="..." placeholder=" Type And Hit Enter ">
					    </div>
				</div>    
			</div>					
			<!-- End Toolbar Top -->

			<!-- Table Grid -->
			<div class="table-responsive" style="padding-bottom: 70px;">
 			{!! Form::open(array('url'=>'core/posts?'.$return, 'class'=>'form-horizontal m-t' ,'id' =>'SximoTable' )) !!}
			
		    <table class="table table-striped table-hover " id="{{ $pageModule }}Table">
		        <thead>
					<tr>
						<th style="width: 3% !important;" class="number"> No </th>
						<th  style="width: 3% !important;"> <input type="checkbox" class="checkall minimal-green" /></th>
						<th  style="width: 10% !important;">{{ __('core.btn_action') }}</th>
						
						@foreach ($tableGrid as $t)
							@if($t['view'] =='1')				
								<?php $limited = isset($t['limited']) ? $t['limited'] :''; 
								if(SiteHelpers::filterColumn($limited ))
								{
									$addClass='class="tbl-sorting" ';
									if($insort ==$t['field'])
									{
										$dir_order = ($inorder =='desc' ? 'sort-desc' : 'sort-asc'); 
										$addClass='class="tbl-sorting '.$dir_order.'" ';
									}
									echo '<th align="'.$t['align'].'" '.$addClass.' width="'.$t['width'].'">'.\SiteHelpers::activeLang($t['label'],(isset($t['language'])? $t['language'] : array())).'</th>';				
								} 
								?>
							@endif
						@endforeach
						
					  </tr>
		        </thead>

		        <tbody>        						
		            @foreach ($rowData as $row)
		                <tr>
							<td > {{ ++$i }} </td>
							<td ><input type="checkbox" class="ids minimal-green" name="ids[]" value="{{ $row->pageID }}" />  </td>
							<td>

							 	<div class="dropdown">
								  <button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown"> Action </button>
								  <ul class="dropdown-menu">
								 	@if($access['is_detail'] ==1)
									<li><a href="{{ url('posts/'.$row->alias)}}" target="_blank" class="tips" title="{{ __('core.btn_view') }}"> {{ __('core.btn_view') }} </a></li>
									@endif
									@if($access['is_edit'] ==1)
									<li><a  href="{{ url('core/posts/'.$row->pageID.'/edit?return='.$return) }}" class="tips" title="{{ __('core.btn_edit') }}"> {{ __('core.btn_edit') }} </a></li>
									@endif
									<li class="divider" role="separator"></li>
									@if($access['is_remove'] ==1)
										 <li><a href="javascript://ajax"  onclick="SximoDelete();" class="tips" title="{{ __('core.btn_remove') }}">
										Remove Selected </a></li>
									@endif 
								  </ul>
								</div>

							</td>														
						 @foreach ($tableGrid as $field)
							 @if($field['view'] =='1')
							 	<?php $limited = isset($field['limited']) ? $field['limited'] :''; ?>
							 	@if(SiteHelpers::filterColumn($limited ))
							 	 <?php $addClass= ($insort ==$field['field'] ? 'class="tbl-sorting-active" ' : ''); ?>
								 <td align="{{ $field['align'] }}" width=" {{ $field['width'] }}"  {!! $addClass !!} >					 
								 	{!! SiteHelpers::formatRows($row->{$field['field']},$field ,$row ) !!}						 
								 </td>
								@endif	
							 @endif					 
						 @endforeach			 
		                </tr>
						
		            @endforeach
		              
		        </tbody>
		      
		    </table>
			<input type="hidden" name="action_task" value="" />
			
			{!! Form::close() !!}
			@include('footer')
			</div>
			<!-- End Table Grid -->

		  </div>

		   <div class="tab-pane" id="config" style="padding: 30px 0;">

			<fieldset>
				<legend> Post Configuration </legend>
				

				{!! Form::open(array('url'=>'core/posts/config', 'class'=>'form-horizontal' ,'id' =>'' )) !!}
				 <div class="form-group  " >
						<label class="col-md-4" > Allow Comment system    </label>
						<div class="col-md-8">									
					  		<input type="checkbox" name="commsys" class="checkbox minimal-red" value="1"
					  		@if($conpost['commsys'] ==1) checked @endif
					  		 />	
					  	</div>					
				  </div> 
				 <div class="form-group  " >
						<label class="col-md-4" > Display Image in every post(s)   </label>	
						<div class="col-md-8">								
					  		<input type="checkbox" name="commimage" class="checkbox minimal-red" value="1"
					  		@if($conpost['commimage'] ==1) checked @endif
					  		 />
					  	</div>						
				  </div> 
				 <div class="form-group  " >
						<label class="col-md-4" > Display Latest post(s)   </label>	
						<div class="col-md-8">								
					  		<input type="checkbox" name="commlatest" class="checkbox minimal-red" value="1"
					  		@if($conpost['commlatest'] ==1) checked @endif
					  		 />
					  	</div>						
				  </div>

				 <div class="form-group  " >
						<label class="col-md-4" > Display Popular post(s)   </label>	
						<div class="col-md-8">								
					  		<input type="checkbox" name="commpopular" class="checkbox minimal-red" value="1" 
					  		@if($conpost['commpopular'] ==1) checked @endif
					  		/>
					  	</div>						
				  </div>				  

				 <div class="form-group  " >
						<label class="col-md-4" > Allow Share post(s) :    </label>	
						<div class="col-md-8">								
					  		<input type="checkbox" name="commshare" class="checkbox minimal-red" value="1" 
					  		@if($conpost['commshare'] ==1) checked @endif
					  		/>
					  	</div>							
				  </div> 
				 <div class="form-group  " >
						<label class="col-md-4" > Share post(s) API KEY :    </label>	
						<div class="col-md-8">								
					  		<input type="text" name="commshareapi" class="form-control" value="{{ $conpost['commshareapi'] }}"  />

					  		Get your own API : <a href="http://www.sharethis.com/get-sharing-tools/" target="_blank"> http://www.sharethis.com/get-sharing-tools/ </a>
					  	</div>							
				  </div> 	  	  	

				 <div class="form-group  " >
						<label class="col-md-4" > Display post(s) per/page  </label>
						<div class="col-md-8">									
					  		<input type="text" name="commperpage" class="form-control" style="width: 50px;" value="{{ $conpost['commperpage'] }}" />
					  	</div>							
				  </div> 
				 <div class="form-group  " >
						<label class="col-md-4" >   </label>
						<div class="col-md-8">									
					  		<button type="submit" class="btn btn-primary"> Save Configuration </button>
					  	</div>							
				  </div> 

				  {!! Form::close() !!}
			</fieldset> 


		</div>
	</div>  
</div>	


@stop