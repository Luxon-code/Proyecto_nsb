$(document).ready(function(){
    $('.dropup').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
});
$(document).ready(function(){
  $('.accordion-item').hover(function() {
      const button = $(this).find('.accordion-button.collapsed');
      const divCollapse = $(this).find('.accordion-collapse.collapse');
      if (button.length) {
          button.removeClass('collapsed');
          button.attr('aria-expanded', 'true');
          divCollapse.stop(true, true).delay(200).slideDown(500);
      }
  });

  $('.accordion-item').mouseleave(function() {
      const button = $(this).find('.accordion-button:not(.collapsed)');
      const divCollapse = $(this).find('.accordion-collapse');
      if (button.length) {
          button.addClass('collapsed');
          button.attr('aria-expanded', 'false');
          divCollapse.stop(true, true).delay(200).slideUp(500);
      }
  });
});