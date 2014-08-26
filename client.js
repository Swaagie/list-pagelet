pipe.once('list:initialize', function init(pagelet) {
  'use strict';

  var base = $(pagelet.placeholders)
    , order = base.find('.order');

  /**
   * Update the absolute position of each item.
   *
   * @param {Object} data Collection.
   * @api private
   */
  function sort(data) {
    data.forEach(function each(item, i) {
      base.find('#' + item.id).css('top', item.top);
    });
  }

  //
  // Different data order selected, call the server side sort and update the list.
  //
  order.on('change', function change() {
    pagelet.sort($(this).find(':selected').val(), sort);
  });
});