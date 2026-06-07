{!! Form::open(array('url'=> $module, 'class'=>'form-vertical','files' => true , 'parsley-validate'=>'','novalidate'=>' ' ,'id'=>'importForm')) !!}

<div class="row " id="importUpload">
	<div class="col-md-7">
		<p class="alert alert-warning">
			<i class="fa fa-warning"></i>  Please read this note !  
		</p>	
		<p>
		Please Make sure your CSV file format field column same as database fields. <br />please download template bellow 
		</p><br />
		<a href="{{ url( $module.'/import?template=true')}}" class="btn btn-sm btn-default btn-block"><i class="fa fa-download"></i> Download template </a>
	</div>
	<div class="col-md-5">
		<div class="form-group  " >
			<label> Upload CSV File : </label>
			<input type="file" name="fileimport" id="fileimport" class="inputfile" />
			<label for='fileimport' style="width: 100%"><i class='fa fa-upload'></i> Choose a file</label>
			<div class='fileimport_preview'></div>
		</div>

		<div class="form-group  " >
		
		<button type="submit" class="btn btn-default btn-sm btn-block " name="submit" ><i class='fa fa-upload'></i> Import Now  </button>
		<input type="hidden" name="action_task" value="import"></input>
		</div>
	</div>

</div>		

<div class="row " >
	<div class="col-md-12" id="importPreview">

	</div>	
</div>
{!! Form::close() !!}

<script type="text/javascript">
	$(function(){
		$(".inputfile").on('change',function () { 
			 uploadPreview(this) 
		});

		var form = $('#importForm'); 
		form.parsley();
		form.submit(function(){
			
			if(form.parsley().isValid()) {			
				var options = { 
					dataType:      'json', 
					beforeSubmit : function() {
						
					},
					success: function(data){
						if(data.status =='success')
						{
							notyMessage(data.message);	
							$('#sximo-modal').modal('hide');
							window.location.href = '{{ $url }}';
						} else {
							notyMessageError(data.message);	
						}
						
					}  
				}  
				$(this).ajaxSubmit(options); 
				return false;
							
			} else {
				return false;
			}		
		
		});


	})
</script>