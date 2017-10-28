---
layout: null
---
  $(document).ready(function() {
    $('a.blog-button').click(function(e) {
      if ($('.header-cover').hasClass('collapsed')) return
      currentWidth = $('.header-cover').width()
      if (currentWidth < 960) {
        $('.header-cover').addClass('collapsed')
        $('.content-wrapper').addClass('animated slideInRight')
      } else {
        $('.header-cover').css('max-width', currentWidth)
        $('.header-cover').animate({
          'max-width': '530px',
          'width': '40%'
        }, 400, swing = 'swing', function() {})
      }
    })

    if (window.location.hash && window.location.hash == '#blog') {
      $('.header-cover').addClass('collapsed')
    }

    if (window.location.pathname !== '{{ site.baseurl }}' && window.location.pathname !== '{{ site.baseurl }}index.html' && window.location.pathname !== '/') {
      $('.header-cover').addClass('collapsed')
    }

    $('.mobile-menu').click(function() {
      $('.navigation-wrapper').toggleClass('visible animated slideInDown')
      $('.fa.fa-bars').toggleClass('hidden')
      $('.fa.fa-times').toggleClass('visible hidden')
    })

    $('.navigation-wrapper .blog-button').click(function() {
      $('.navigation-wrapper').toggleClass('visible')
      $('.fa.fa-bars').toggleClass('hidden')
      $('.fa.fa-times').toggleClass('visible hidden')
    })

    $(".archive h3").each(function() {
      var archive = $(this);
      var icon = archive.find("i");
      var posts = archive.next("ul").slideUp();
      var state = false;
      $(archive).click(function() {
        $(icon).toggleClass("fa-caret-right fa-caret-down");
        state = !state;
        posts.slideToggle(state);
      });
    });
  })
