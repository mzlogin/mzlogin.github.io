'use strict';
$(function () {
  var flowchart = window.flowchart;
  var uuid = function () {
    return new Date().getTime()
  };
  $('code.language-flow').each(function (i, n) {
    var codePre = $(n);
    if (codePre.attr('flow-flag') == 'compiled') {
      return
    }
    var codeText = codePre.text();
    var _uuid = uuid();
    var div = $('<div id="div_' + _uuid + '"></div>');
    div.css({'overflow-x': 'auto'});
    codePre.parent().before(div);
    codePre.parent().before($('<a class="look-source" id="' + _uuid + '" href="javascript:void(0)">source</a>'));
    codePre.parent().hide();
    var chart;
    if (chart) {
      chart.clean();
    }
    chart = flowchart.parse(codeText);
    chart.drawSVG('div_' + _uuid, {
      // 'x': 30,
      // 'y': 50,
      'line-width': 3,
      'line-length': 50,
      'text-margin': 10,
      'font-size': 14,
      'font': 'normal',
      'font-family': 'Helvetica',
      'font-weight': 'normal',
      'font-color': 'black',
      'line-color': 'black',
      'element-color': 'black',
      'fill': 'white',
      'yes-text': 'yes',
      'no-text': 'no',
      'arrow-end': 'block',
      'scale': 1,
      'symbols': {
        'start': {
          'font-color': 'red',
          'element-color': 'green',
          'fill': 'yellow'
        },
        'end': {
          'class': 'end-element'
        }
      },
      'flowstate': {
        'past': {'fill': '#CCCCCC', 'font-size': 12},
        'current': {'fill': 'yellow', 'font-color': 'red', 'font-weight': 'bold'},
        'future': {'fill': '#FFFF99'},
        'request': {'fill': 'blue'},
        'invalid': {'fill': '#444444'},
        'approved': {'fill': '#58C4A3', 'font-size': 12, 'yes-text': 'APPROVED', 'no-text': 'n/a'},
        'rejected': {'fill': '#C45879', 'font-size': 12, 'yes-text': 'n/a', 'no-text': 'REJECTED'}
      }
    });
  });
  $('body').on('click.source', 'a.look-source', function () {
    var $this = $(this);
    $this.nextAll('pre').slideToggle();
  })
});

// code from https://bqxu.me/assets/flow.js
