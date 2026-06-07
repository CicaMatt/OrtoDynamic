

$(document).ready(function() {

  // Declare Carousel jquery object
  var owl = $("#home-slider");

  // Carousel initialization
  owl.owlCarousel({
      loop:true,
      margin:0,
      navSpeed:500,
      nav:true,
      items:1,
   //   autoPlay : true,
      dots:false,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
  });


  // add animate.css class(es) to the elements to be animated
  function setAnimation ( _elem, _InOut ) {
    // Store all animationend event name in a string.
    // cf animate.css documentation
    var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    _elem.each ( function () {
      var $elem = $(this);
      var $animationType = 'animated ' + $elem.data( 'animation-' + _InOut );

      $elem.addClass($animationType).one(animationEndEvent, function () {
        $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
      });
    });
  }

// Fired before current slide change
  owl.on('change.owl.carousel', function(event) {
      var $currentItem = $('.owl-item', owl).eq(event.item.index);
      var $elemsToanim = $currentItem.find("[data-animation-out]");
      setAnimation ($elemsToanim, 'out');
  });

// Fired after current slide has been changed
  owl.on('changed.owl.carousel', function(event) {

      var $currentItem = $('.owl-item', owl).eq(event.item.index);
      var $elemsToanim = $currentItem.find("[data-animation-in]");
      setAnimation ($elemsToanim, 'in');
  })



  $('.client-slider').owlCarousel({
      loop:true,
      margin:10,
      nav:false,
      dots:false,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:3
          },
          1000:{
              items:5
          }
      }
  }) 

  $('.thumbs').portfolio({
      cols: 4,
      transition: 'slideDown'
  });  

/* Portpolio JS */

  $('ul.portfolio-filter li a').on('click',function(){
    $('ul.portfolio-filter li ').removeClass('active');
    var value = $(this).data('filter');
    if(value =='all') {
      $('.faqs .faq').show();
    } else {
      $('.faqs .faq').hide();
      $(value).show();
    } 
   
    $(this).parent('li').addClass('active')  

    return false;
   
  })
  $('.togglet').on('click',function(){
    var toog = $(this).parent('.faq').find('.togglec').toggle();
  })

  $('#portfolio-mansonry-grid').masonry({
     itemSelector: '.item',
     columnWidth: 200,
  });
/* End Portpolio JS */
})