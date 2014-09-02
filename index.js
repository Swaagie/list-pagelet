'use strict';

var Pagelet = require('pagelet')
  , pagelet;

//
// Extend the default pagelet and store the extended instance. This allows
// the constructor to access the __super__ property.
//
pagelet = Pagelet.extend({
  view: 'view.hbs',
  css: 'css.styl',
  js: 'client.js',

  //
  // Depend on the latest jQuery, will be loaded via the page.
  //
  dependencies: [
    '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'
  ],

  //
  // Key or function which denotes how the data should be ordered before
  // the list is generated. By default modules will be sorted on
  // downloadCount. Always sorts from high to low.
  //
  order: ['downloads', 'followers'],

  //
  // Allow sort to be called from the client, this will resort the data and return
  // the changed list.
  //
  rpc: ['sort'],

  /**
   * Sort data on provided order. This method is also available via RPC.
   *
   * @param {Function} reply Completion callback
   * @param {String} order Key on objects used to sort by.
   * @returns {Array} Data collection.
   * @api public
   */
  sort: function sort(reply, order) {
    var data = this.data;

    function by(a, b) {
      a = a[order] || 0;
      b = b[order] || 0;

      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    }

    function map(item, i) {
      item.y = i * 120 + '%';
      return item;
    }

    //
    // Extract the data from the data source, and return a sorted and mapped
    // collection if the source is a synchronous function or plain dataset.
    //
    if ('function' === typeof data && !data.length) data = data.call(this);
    if ('function' !== typeof data) return reply(null, data.slice().sort(by).map(map));

    //
    // Assume data is an asynchronous function, that accepts the callback as
    // first parameter and uses a error first callback pattern.
    //
    data.call(this, function get(error, data) {
      if (error) return reply(error);
      reply(null, data.slice().sort(by).map(map));
    })
  },

  //
  // Collection of objects, each object represents one list item.
  // This can also be a function, async or sync, that returns a collection.
  // The asynchronous function should accept callback as argument.
  // The following properties for an object are required: id, name, link
  //
  data: [],

  /**
   * Called on GET, provide data to render the list.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    var list = this;
    list.sort(function sorted(error, data) {
      render(error, {
        data: data,
        order: list.order
      });
    }, list.order[0]);
  }
}).on(module);