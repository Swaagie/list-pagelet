pipe.once('frameworks:initialize', function init(pagelet) {
  'use strict';

  var base = $(pagelet.placeholders)
    , order = base.find('.order');

  order.on('change', function change() {

  });
});