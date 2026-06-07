/* Sximo builder & Sximo 5 Inc 
	copyright 2014 . sximo builder com  & Sximo5.net
*/

jQuery(document).ready(function($){
	
	if($.cookie("sximo-sidebar") =='minimize-sidemenu'){
		$("body").addClass("minimize-sidemenu");
		$('#sidemenu').removeClass('expanded-menu');
	} else {
		$("body").removeClass("minimize-sidemenu");
		$('#sidemenu').addClass('expanded-menu');
	}
	var sidebar_height = $( window ).height() - 60;
	$('.sidebar-collapse').css('height',sidebar_height+'px');
	$(window).bind("load resize", function() {
		if ($(this).width() < 769) {
			$('body').addClass('body-small');
			
		} else {
			$('body').removeClass('body-small')
		}
		var sidebar_height = $( window ).height() - 60;
		$('.sidebar-collapse').css('height',sidebar_height+'px');

	})

	  /*Return to top*/
	  var offset = 220;
	  var duration = 500;
	  var button = $('<a href="#" class="back-to-top"><i class="fa fa-angle-up"></i></a>');
	  button.appendTo("body");
	  
	  jQuery(window).scroll(function() {
	    if (jQuery(this).scrollTop() > offset) {
	        jQuery('.back-to-top').fadeIn(duration);
	    } else {
	        jQuery('.back-to-top').fadeOut(duration);
	    }
	  });

	  $('.sidebar-collapse').scrollbar();
	$('.back-to-top').click(function(event) {
	  event.preventDefault();
	  jQuery('html, body').animate({scrollTop: 0}, duration);
	  return false;
	});
	$('.date').datepicker({format:'dd-mm-yyyy',autoClose:true})
	$('.datetime').datetimepicker({format: 'dd-mm-yyyy hh:ii:ss',autoClose:true});
  	$(".select2").select2({ width:"100%"});	
	$('.panel-trigger').click(function(e){
		e.preventDefault();
		$(this).toggleClass('active');
	});

	$('.dropdown, .btn-group').on('show.bs.dropdown', function(e){
		$(this).find('.dropdown-menu').first().stop(true, true).fadeIn(100);
	});
	$('.dropdown, .btn-group').on('hide.bs.dropdown', function(e){
		$(this).find('.dropdown-menu').first().stop(true, true).fadeOut(100);
	});
	$('.popup').click(function (e) {
		e.stopPropagation();
	});	
	$('.editor').summernote({ height: 250});	
     window.prettyPrint && prettyPrint();

	$('.nav li ul li.active').parents('li').addClass('active');

    $('.navbar-minimalize').click(function () {
      var w = $("body");
		w.toggleClass("minimize-sidemenu");
			
		if( w.hasClass('minimize-sidemenu'))
		{
			$('#sidemenu').removeClass('expanded-menu');
			$.cookie("sximo-sidebar",'minimize-sidemenu', {expires: 365, path: '/'});
		} else {
			$('#sidemenu').addClass('expanded-menu');
			 $.cookie("sximo-sidebar",'maximaze-sidemenu', {expires: 365, path: '/'});	
		}		
    })	
	$('.clearCache').click(function(){
		$('.ajaxLoading').show();
		var url = $(this).attr('href');
		$.get( url  , function( data ) {
		 $('.ajaxLoading').hide();
		 notyMessage(data.message); 
		     
		});
		return false;
	}); 
	$('.confirm_logout').on('click',function(){
		if(confirm('Logout from application ?'))
		{
			return true;
		}
		return false;
	})

	$(".checkall").click(function() {
		var cblist = $(".ids");
		if($(this).is(":checked"))
		{				
			cblist.prop("checked", !cblist.is(":checked"));
		} else {	
			cblist.removeAttr("checked");
		}	
	});

	$('.checkall').on('ifChecked', function(event) {
	    $('.ids').iCheck('check');
	});
	$('.checkall').on('ifUnchecked', function(event) {
	    $('.ids').iCheck('uncheck');
	});

    $('input[type="checkbox"].minimal-green, input[type="radio"].minimal-green').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    }); 	
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    }); 

    $('.validated').parsley();

    $('.onsearch').keyup(function( e ){
		if (e.keyCode === 13) {
	      val = $(this).val();
	      target =  $(this).data('target');
	      window.location.href = target + '?s='+val ;	     
	    }
	})	

})
function SximoConfirmDelete( url )
{
	if(confirm('Are u sure deleting this record ? '))
	{
		window.location.href = url;	
	}
	return false;
}
function SximoDelete(  )
{	
	var total = $('input[class="ids"]:checkbox:checked').length;
	if(confirm('are u sure removing selected rows ?'))
	{
		$('input[name="action_task"]').val('delete');
		$('#SximoTable').submit();// do the rest here	
	}	
}






function SximoChangeState(p1)
{	
	//var total = $('input[class="ids"]:checkbox:checked').length;
	total = document.querySelectorAll('input[type="checkbox"]:checked').length;
	if (total > 1) {
	    alert ("Selezionare un solo preventivo alla volta");
	}
	else if (total === 0) {
	    alert ("Selezionare almeno un preventivo");
	}
	else{
	    if(confirm('sei sicuro di voler cambiare lo stato?'))
	        {
	        	$('input[name="action_task"]').val('changeState');
	        	$('input[name="state"]').val(p1);
	        	$('#SximoTable').submit();// do the rest here	
	        }
	    }
}








function SximoInserisciNonConformita(p1){
    if(confirm('sei sicuro di voler inserire una non conformità?'))
	   {
            $('input[name="action_task"]').val('inserisciNonConformita');
            $('input[name="id_preventivo"]').val(p1);
            $('#SximoTable').submit();// do the rest here
	   }
}



function SximoInserisciPreventivo(p1){
    if(confirm('sei sicuro di voler inserire un preventivo?'))
	   {
            $('input[name="action_task"]').val('inserisciPreventivo');
            $('input[name="id_cliente"]').val(p1);
            $('#SximoTable').submit();// do the rest here
	   }
}




function SximoCopy(  )
{	
	var total = $('input[class="ids"]:checkbox:checked').length;
	if(confirm('are u sure removing selected rows ?'))
	{
		$('#SximoTable').submit();// do the rest here	
	}	
}	
function SximoModal( url , title)
{
	
	$('#sximo-modal-content').html(' ....Loading content , please wait ...');
	$('.modal-title').html(title);
	$('#sximo-modal-content').load(url,function(){
	});
	$('#sximo-modal').modal('show');	
}

function notyMessage(message)
{
	 $.toast({
	    heading: 'success',
	    text: message,
	    position: 'top-right',		           
	   	icon: 'success',
	    hideAfter: 3000,
	    stack: 6
	});	
}
function notyMessageError(message)
{
	 $.toast({
	    heading: 'error',
	    text: message,
	    position: 'top-right',		           
	    icon: 'error',
	    hideAfter: 3000,
	    stack: 6
	});	
}

function reloadData( id,url   )
{
	$.get( url ,function( data ) {
		$( id +'Grid' ).html( data );
		
	});
}
function ajaxViewClose( id )
{
	$( id +'View' ).html('');	
	$( id +'Grid' ).show();	
	$('#sximo-modal').modal('hide');
}
function ajaxViewDetail( id , url )
{
	if(url !='#')
	 {
		$('.ajaxLoading').show();
		$.get( url ,function( data ) {
			$( id +'View').html( data );
			$( id +'Grid').hide( );
			var w = $(window); 
			var duration = 300;
			$('html, body').animate({scrollTop: 0}, duration);
			$('.ajaxLoading').hide();
		});		
	} else {
		alert('No Link with' + url);
	}	
}
function ajaxFilter( id ,url )
{
	var attr = '';
	$( id +'Filter :input').each(function() {
		if(this.value !='') { attr += this.name+'='+this.value+'&'; }
	});	

	reloadData(id, url+"?"+attr);
}
function ajaxCopy(  id , url )
{	
	if(confirm('Areu sure Copy selected row(s)'))
	{
		var datas = $( id +'Table :input').serialize();
			$.post( url ,datas,function( data ) {
				if(data.status =='success')
				{
					notyMessage(data.message );
					ajaxFilter( id ,url+'/data' );
				} else {
					notyMessage(data.message );
				}				
			});			
	} else {
		return false;
	}
}
function loadNestedLookup(url , id )
{
	if($(id).is(':empty'))
	{
		$(id).html('<p class"text-center" style="line-height:100px; text-align:center;"> Loading Content .... Please wait </p>');
		$.get(url,function(data)
		{
			$(id).load(url);	
		})		
	}	
}
function addMoreFiles(id){

   $("."+id+"Upl").append('<input type="file" name="'+id+'[]" />')
}
;(function ($, window, document, undefined) {

    $.fn.Sdtable = function( options ) {

    	var settings = $.extend({
            tableId     : 'datatable',
            table   	: 'table',
            action      : 'action'	
     
        }, options);

        return this.each( function() {
			var gridData 	= settings.tableId+'Table';
			var gridTbl 	= settings.tableId+'Grid';
			var gridView 	= settings.tableId+'View';
        	$( gridData +' tbody').on('click', 'tr.odd', function () { $(this).toggleClass('selected'); });
        	$( gridData +' tbody ').on('click', 'tr.even', function () { $(this).toggleClass('selected'); });
			$('.Action_Row').click(function () {
				var code = $(this).attr('code');
				if( code =='reload') { settings.table.ajax.reload();}
				if( code =='add') {
			       		var url = settings.action + '/create';			       		
			       		var mode = $(this).attr('mode');
						var title = $(this).attr('data-original-title');
						if(mode =='native')
						{
							Sdt_ViewDetail( settings.tableId , url  );
						} else {
							SximoModal(  url  , title  );
						}					
				}

				var rows = settings.table.rows('.selected').data().length ;
		        if(rows)
		        {
		        	var id = settings.table.row('.selected').data().rowId;
					
					if(code =='view')
					{
						var url =  settings.action + '/show/'+id;
						var mode = $(this).attr('mode');
						var title = $(this).attr('data-original-title');
						if(mode =='native')
						{
							Sdt_ViewDetail( settings.tableId , url  );
						} else {
							SximoModal(  url  , title  );
						}
						
						

					}  else if(code =='copy') {

						var rows = settings.table.rows('.selected').data();
						var ss = [];
			        	for(var i=0; i<rows.length; i++){
			        		var ids = rows[i].rowId;
		                    ss.push(ids) ;
			        	}
			        	if(confirm('Are sure Clone/Copy selected row(s) ?'))
			        	{
			        		var url =  settings.action ;
							$.post( url  ,{ids:ss,action_task:'copy'},function( data ) {
								if(data.status =='success')
								{
									notyMessage(data.message);	
									 settings.table.ajax.reload();
								} else {
									notyMessageError(data.message);	
								}				
							});	
			        	}	

					} else if(code =='edit') {
			       		var url = settings.action + '/update/'+id;			       		
			       		var mode = $(this).attr('mode');
						var title = $(this).attr('data-original-title');
						if(mode =='native')
						{
							Sdt_ViewDetail( settings.tableId , url  );
						} else {
							SximoModal(  url  , title  );
						}					

					} else if(code =='remove'){

						var rows = settings.table.rows('.selected').data();
						var ss = [];
			        	for(var i=0; i<rows.length; i++){
			        		var ids = rows[i].rowId;
		                    ss.push(ids) ;
			        	}
			        	if(confirm('Are sure Remove selected row(s) ?'))
			        	{
			        		var url =   settings.action;
							$.post( url ,{ids:ss,action_task:'delete'},function( data ) {
								if(data.status =='success')
								{
									notyMessage(data.message);	
									settings.table.ajax.reload();
								} else {
									notyMessageError(data.message);	
								}				
							});		
			        	}					

					} else {

					}
				}	
		    });	



        });

    }

}(jQuery));

;(function ($, window, document, undefined) {

    var pluginName = "sximMenu",
        defaults = {
            toggle: true
        };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var $this = $(this.element),
                $toggle = this.settings.toggle;

            $this.find('li.active').has('ul').children('ul').addClass('collapse in');
            $this.find('li').not('.active').has('ul').children('ul').addClass('collapse');

            $this.find('li').has('ul').children('a').on('click', function (e) {
                e.preventDefault();

                $(this).parent('li').toggleClass('active').children('ul').collapse('toggle');

                if ($toggle) {
                    $(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');
                }
            });
        }
    };

    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
