@extends('layouts.app')

@section('content')
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
      <div class="sbox-content clearfix">

   <!-- Start blast email -->

    {!! Form::open(array('url'=>'core/users/doblast/', 'class'=>'form-horizontal ')) !!}
          <div class="form-group  " >
          <label for="ipt" class=" control-label col-md-3">  </label>
          <div class="col-md-12">
              <ul class="parsley-error-list">
                @foreach($errors->all() as $error)
                  <li>{{ $error }}</li>
                @endforeach
              </ul>                
           </div> 
          </div> 
      
<div class="col-sm-6">
          <div class="form-group  " >
          <label for="ipt" class=" control-label col-md-3">  {{ Lang::get('core.fr_emailsubject') }}   </label>
          <div class="col-md-9">
               {!! Form::text('subject',null,array('class'=>'form-control input-sm', 'placeholder'=>'','required'=>'true')) !!} 
           </div> 
          </div> 
          <div class="form-group  " >
          <label for="ipt" class=" control-label col-md-3"> {{ Lang::get('core.fr_emailsendto') }}   </label>
          <div class="col-md-9">
           @foreach($groups as $row)
            <div class="checkbox checkbox-success">
              <input type="checkbox"   name="groups[]" value="{{ $row->group_id}}" class="minimal-green" /> <label> {{ $row->name }}</label>
            </div>


           @endforeach
           </div> 
          </div>        
      
</div>
<div class="col-sm-6">
          <div class="form-group  " >
          <div for="ipt" class=" control-label col-md-3">  Status   </div>
          <div class="col-md-9"> 

                <div class="radio radio-success">
                    <input type="radio" name="uStatus" value="all" required="true" class="minimal-green" > <label> All Status</label>
                </div>
                <div class="radio radio-success">
                    <input type="radio"  name="uStatus" value="1" required="true" class="minimal-green"> <label> Active </label>
                </div>  
                <div class="radio radio-success">
                    <input type="radio"  name="uStatus" value="0" required="true" class="minimal-green"> <label> Unconfirmed</label>
                </div>
                <div class="radio radio-success">
                    <input type="radio"  name="uStatus" value="2" required="true" class="minimal-green"> <label> Blocked</label>
                </div>                                
           </div> 

          </div>  
</div>
 
 <div class="col-sm-12">


 
          <div class="form-group "  >
         
          <div style=" padding:10px;">
       <label for="ipt" class=" control-label "> {{ Lang::get('core.fr_emailmessage') }} </label>
           <textarea class="form-control editor" rows="10"   name="message"></textarea> 
       </div>
           <p> {{ Lang::get('core.fr_emailtag') }} : </p>
           <small> [fullname] [first_name] [last_name] [email]  </small>
         
          </div> 

            
                    

          
          <div class="form-group" >
          <label for="ipt" class=" control-label col-md-3"> </label>
          <div class="col-md-9">
              <button type="submit" name="submit" class="btn btn-primary">{{ Lang::get('core.sb_send') }} Mail </button>
           </div> 
          </div> 
  </div>                     
     {!! Form::close() !!}


    <!-- / blast email -->


      </div>
    </div>
  </div>
</div>

@stop