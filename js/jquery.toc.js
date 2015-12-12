// https://github.com/ghiculescu/jekyll-table-of-contents
(function($){
    
    function Stack(){
        this.dataStore = []
        this.top    = 0;
        this.push   = push
        this.pop    = pop
        this.peek   = peek
        this.length = length;
        this.toc_number = toc_number;
        this.inc_number = inc_number;
    }
    
    function push(element){
        this.dataStore[this.top++] = element;
    }
    
    function peek(element){
        return this.dataStore[this.top-1];
    }
    
    function pop(){
        return this.dataStore[--this.top];
    }
    
    function clear(){
        this.top = 0
    }
    
    function length(){
        return this.top
    }
    
    function toc_number() {
        var num = "";
        for (i = 0; i < this.top; i++) {
            num += this.dataStore[i] + ".";
        }
        return num;
    }
    
    function inc_number() {
        this.dataStore[this.top - 1]++;
    }
    
  $.fn.toc = function(options) {
    var defaults = {
      noBackToTopLinks: false,
      title: '文章目录',
      minimumHeaders: 3,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ul', // values: [ol|ul]
      showEffect: 'show', // values: [show|slideDown|fadeIn|none]
      showSpeed: 'slow' // set to 0 to deactivate effect
    },
    settings = $.extend(defaults, options);

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
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
    
    var stack = new Stack();
    stack.push(0);
    var level = get_level(headers[0]),
      this_level,
      html = "<strong class=\"toc-title\">" + settings.title + "</strong>\n";
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
        stack.inc_number();
        html += "<li class=\"toc-item toc-level-" + this_level + "\">";
        html += "<a class=\"toc-link\" href='#" + fixedEncodeURIComponent(header.id) + "'>";
//        html += "<span class='toc-number'>" + stack.toc_number() + "</span>"
        html += "<span class='toc-text'>" + header.innerHTML + "</span>";
        html += "</a>";
        
      } else if (this_level <= level){ // higher level than before; end parent ol
        for(i = this_level; i < level; i++) {
          stack.pop();
          html += "</li></"+settings.listType+">"
        }
        stack.inc_number();
        html += "<li class='toc-item toc-level-" + this_level + "'><a href='#" + fixedEncodeURIComponent(header.id) + "'>";
//        html += "<span class='toc-number'>" + stack.toc_number() + "</span>"
        html += "<span class='toc-text'>" + header.innerHTML + "</span>";
        html += "</a>";
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
      if (stack.length() > 1) {
          return;
      }
        for(i = this_level; i > level; i--) {
          stack.push(0);
          html += "<"+settings.listType+" class='toc-child'><li class='toc-item toc-level-" + i + "'>"
        }
        stack.inc_number();
        html += "<a href='#" + fixedEncodeURIComponent(header.id) + "'>";
//        html += "<span class='toc-number'>" + stack.toc_number() + "</span>"
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
