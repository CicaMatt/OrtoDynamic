<div>

  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab"> Fontawesome</a></li>
    <li role="presentation"><a href="#iconmoon" aria-controls="profile" role="tab" data-toggle="tab"> IconMoon</a></li>

  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="home">
       @include('sximo.menu.fontawesome')
    </div>
    <div role="tabpanel" class="tab-pane" id="iconmoon">
        @include('sximo.menu.icomoon')
    </div>

  </div>

</div>
<style type="text/css">
    .icon-list-demo { font-size: 10px; }
    .icon-list-demo i{ font-size: 16px; }
    .fonticon-wrap i {font-size: 16px;  }

</style>
<script type="text/javascript">
    $(document).ready(function(){

        $('.icon-list-demo  i , .material-icon-list-demo i ,.feather-icons i').on('click',function(){
            val = $(this).attr('class');
           // alert(val);
            $('input[name=menu_icons]').val(val);
            $('#sximo-modal').modal('hide');

        })
    })
</script>