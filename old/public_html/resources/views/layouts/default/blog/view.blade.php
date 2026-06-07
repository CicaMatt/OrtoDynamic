<section id="blog" class="section">
      <!-- Container Starts -->
      <div class="container">  
        <h1 class="section-title wow  animated" style="visibility: visible;">
            {{ $posts->title}}
        </h1>
        <div class="section-tool align-middle">
            <i class="fa fa-eye "></i>  <span>  Views (<b> {{ $posts->views }} </b>)  </span>   
            <i class="fa fa-user "></i>  <span>  {{ ucwords($posts->username) }}  </span>   
            <i class="icon-calendar3"></i>  <span> {{ date("M j, Y " , strtotime($posts->created)) }} </span> 
            <i class="fa fa-comment-o "></i>   <span>  {{ $posts->comments }} comment(s)  </span> 
        </div>
       
        <!-- Row Starts -->
        <div class="row">  

            <div class="col-md-2"></div>
            <div class="col-md-8">
                <div class="blog-item-wrapper" style="margin: 20px 0;">   
                <div>
                  @if(file_exists('./uploads/images/'.$posts->image) && $posts->image !='' )
                  <img src="{{ asset('uploads/images/'.$posts->image) }}" alt="" class="img-fluid img-responsive">
                  @endif
                </div>                                  
                  {!! PostHelpers::formatContent($posts->note) !!}  
                </div>  

                
                <h4 class="blog-item-comment-title"><i class="icon-comment"></i> Comments </h4>
                @foreach($comments as $comm)
                <div class="blog-item-comments">
                   
                    <div class="avatar">
                    <?php if( file_exists( './uploads/users/'.$comm->avatar) && $comm->avatar !='') { ?>
                        <img src="{{ asset('uploads/users').'/'.$comm->avatar }} " border="0" width="60" class="img-circle" />
                    <?php  } else { ?> 
                        <img alt="" src="http://www.gravatar.com/avatar/{{ md5($comm->email) }}" width="60" class="img-circle" />
                    <?php } ?> 
                    </div>
                    <div class="content">
                         <div class="info" >
                            {{ ucwords($comm->username) }} | 
                            {{ date("M j, Y " , strtotime($comm->posted)) }}
                        </div>
                        {!! PostHelpers::formatContent($comm->comments) !!}
                        <div class="tools">
                            @if(Session::get('gid') == '1' OR $comm->userID == Session::get('uid')) 
                            <a href="{{ url('posts/remove/'.$posts->pageID.'/'. $posts->alias.'/'.$comm->commentID) }}" class="text-danger remove"><i class="fa fa-minus-circle"></i> Remove  </a>
                            @endif
                        </div>
                    </div> 
                </div>
                @endforeach
                <div class="blog-item-comments">
                   
                    <div class="avatar">
                        {!! SiteHelpers::avatar('60') !!}    
                    </div>
                    <div class="content">
                        <h4> Leave Comment </h4>
                         <form method="post"  action="{{ url('posts/comment') }}" parsley-validate novalidate class="form">
                        {{ csrf_field() }}
                            <textarea rows="5" placeholder="Leave comments here ...." class="form-control " required name="comments"></textarea><br />
                            <button type="submit" class="btn btn-primary "> Submit Comment </button>    
                            <input type="hidden" name="pageID" value="{{ $posts->pageID }}" />    
                            <input type="hidden" name="alias" value="{{ $posts->alias }}" />                      
                        </form>
                    </div> 
                </div>

                </div>


            </div>
            <div class="col-md-2"></div>        
          
          

        </div><!-- Row Ends -->

      </div><!-- Container Ends -->
    </section>

    <script type="text/javascript">
        $(function(){
            $('.remove').on('click',function(){
                if(confirm('Remove comment ?'))
                {
                    return true;
                }
                return false;
            })
        })
    </script>