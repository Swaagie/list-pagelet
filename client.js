pipe.once('list:initialize', function init(pagelet) {
  'use strict';

  var base = $(pagelet.placeholders)
    , order = base.find('.order')
    , collection = base.find('.collection')
    , items = collection.find('.item');

  /**
   * Update the absolute position of each item. If an error occurs do nothing.
   *
   * @param {Error} error
   * @param {Object} data Collection.
   * @api private
   */
  function sort(error, data) {
    if (error) return;

    data.forEach(function each(item, i) {
      collection.find('#' + item.id).css('transform', 'translate3d(0,'+ item.y +',0)');
    });
  }

  //
  // Different data order selected, call the server side sort and update the list.
  //
  order.on('change', function change() {
    pagelet.sort($(this).find(':selected').val(), sort);
  });

  //
  // Update the height of the container if the list of items does not fit the
  // visible height of the container. This is required since the items are
  // absolutely positioned and will not have flow.
  //
  var height = items.length * items.outerHeight() * 1.2
    , current = collection.height();

  if (current < height) collection.height(height);
});