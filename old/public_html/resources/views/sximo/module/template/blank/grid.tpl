@extends('layouts.app')
@section('content')
<section class="page-header row">
    <h1> {{ $pageTitle }} <small> {{ $pageNote }} </small></h1>
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-home"></i> Home</a></li>
      <li  class="active"> {{ $pageTitle }} </li>
    </ol>
  </section>

<div class="page-content row">
  <div class="page-content-wrapper no-margin">

    <div class="sbox">
      <div class="sbox-title">
        <h1> {{ $pageTitle }} <small> {{ $pageNote }} </small></h1>
      </div>
      <div class="sbox-content">




      </div>
    </div>
  </div>
</div>

@stop