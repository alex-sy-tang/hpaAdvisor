$(document).ready(function(){
  $(window).scroll(function(event){
    if($(document).scrollTop()>50){
      $(".navbar").removeClass('navbar-dark').addClass('navbar-light');
      $(".navbar").removeClass('bg-dark').addClass('bg-light');
    }else{
      $(".navbar").removeClass('navbar-light').addClass('navbar-dark');
      $(".navbar").removeClass('bg-light').addClass('bg-dark');
    }
  })

})

$("#dashboard button").click(function(event){
  $('#dashboard button').toggleClass('button-toggle');
  console.log(this);
})
$("#more .saved").click(function(event){
  $("more .saved").toggleClass('clicked');
  console.log(this);
})
