// https://github.com/ghiculescu/jekyll-table-of-contents
// Updated by https://mazhuang.org
(function($){
  $.fn.toc = function(options) {
    var defaults = {
      noBackToTopLinks: false,
      title: '文章目录',
      minimumHeaders: 2,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ul', // values: [ol|ul]
      showEffect: 'show', // values: [show|slideDown|fadeIn|none]
      showSpeed: 0 // set to 0 to deactivate effect
    },
    settings = $.extend(defaults, options);

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    var headers = $(settings.headers).filter(function() {
      if ($(this).parent('blockquote').length > 0) {
        return false;
      }
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
      $('.post-directory-title').css('display', 'none');
      return;
    }

    if (0 === settings.showSpeed) {
      settings.showEffect = 'none';
    }

    var render = {
      show: function() { output.hide().html(html).show(settings.showSpeed); },
      slideDown: function() { output.hide().html(html).slideDown(settings.showSpeed); },
      fadeIn: function() { output.hide().html(html).fadeIn(settings.showSpeed); },
      none: function() { output.html(html); }
    };

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); }
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>';

    var level = get_level(headers[0]),
    this_level,
    html = "<p><strong class=\"toc-title\">" + settings.title + "</strong></p>\n";
    html += " <"+settings.listType+" class=\"toc\">";
    headers.on('click', function() {
      if (!settings.noBackToTopLinks) {
        window.location.hash = this.id;
      }
    })
    .addClass('clickable-header')
    .each(function(_, header) {
      this_level = get_level(header);
      if (!settings.noBackToTopLinks && this_level === highest_level) {
        $(header).addClass('top-level-header').after(return_to_top);
      }
      if (this_level === level) {// same level as before; same indenting
        html += "<li class=\"toc-item toc-level-" + this_level + "\">";
        html += "<a class=\"jumper\" href='#" + fixedEncodeURIComponent(header.id) + "'>";
        html += "<span class='toc-text'>" + header.innerHTML + "</span>";
        html += "</a>";

      } else if (this_level <= level){ // higher level than before; end parent ol
        for(i = this_level; i < level; i++) {
          html += "</li></"+settings.listType+">"
        }
        html += "<li class='toc-item toc-level-" + this_level + "'><a class=\"jumper\" href='#" + fixedEncodeURIComponent(header.id) + "'>";
        html += "<span class='toc-text'>" + header.innerHTML + "</span>";
        html += "</a>";
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          html += "<"+settings.listType+" class='toc-child'><li class='toc-item toc-level-" + i + "'>"
        }
        html += "<a class=\"jumper\" href='#" + fixedEncodeURIComponent(header.id) + "'>";
        html += "<span class='toc-text'>" + header.innerHTML + "</span>";
        html += "</a>";
      }
      level = this_level; // update for the next one
    });
    html += "</"+settings.listType+">";
    if (!settings.noBackToTopLinks) {
      $(document).on('click', '.back-to-top', function() {
        $(window).scrollTop(0);
        window.location.hash = '';
      });
    }

    render[settings.showEffect]();
  };
})(jQuery);

$(document).ready(function(){
  $('.post-directory').toc();

  var fixmeTop = $('#post-directory-module').offset().top;
  var tocSections = $('.clickable-header');
  var tocSectionOffsets = [];

  var calculateTocSections = function(){
    tocSectionOffsets = [];
    tocSections.each(function(index, section){
      tocSectionOffsets.push(section.offsetTop);
    })
  }
  calculateTocSections();
  // Calculates the toc section offsets, which can change as images get loaded
  $(window).bind('load', calculateTocSections);

  var highlightTocSection = function(){
    var highlightIndex = 0;
    var sectionsCount = tocSectionOffsets.length;
    var currentScroll = $(window).scrollTop();

    if (currentScroll+60 > tocSectionOffsets[sectionsCount-1]) {
      highlightIndex = sectionsCount;
    } else {
      for (var i=0; i<sectionsCount; i++) {
        if (currentScroll+60 <= tocSectionOffsets[i]) {
          highlightIndex = i;
          break;
        }
      }
    }
    if (highlightIndex == 0) {
      highlightIndex += 1;
    }
    $('.toc-item .jumper').removeClass('on');
    $('.toc-item .jumper').eq(highlightIndex-1).addClass('on');
  }
  highlightTocSection();

  var updateTocHeight = function() {
      var height = document.documentElement.clientHeight;
      height = height || 'auto';
      $('.post-directory').css('max-height', height);
  }

  $(window).scroll(function() {
    var currentScroll = $(window).scrollTop();
    if (currentScroll >= fixmeTop) {
      $('#post-directory-module').css({
        top: '0',
        position: 'fixed',
        width: 'inherit'
      });
      $('.post-directory').css('overflow', 'auto');
    } else {
      $('#post-directory-module').css({
        position: 'inherit',
        width: 'inherit'
      });
      $('.post-directory').css('overflow', 'hidden');
      $('.post-directory').scrollTop(0);
    }

    highlightTocSection();
  });

  updateTocHeight();

  $(window).on("resize", function() {
      updateTocHeight();
  });
});

$(".jumper").on("click", function( e ) {
  e.preventDefault();
  $("body, html").animate({
    scrollTop: $( $(this).attr('href') ).offset().top
  }, 600);
});
