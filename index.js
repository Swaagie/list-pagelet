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
    var data = this.data.slice().sort(function(a, b) {
      a = a[order];
      b = b[order];

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    console.log(reply, order);

    if (reply) return reply(null, data)
    return data;
  },

  //
  // Collection of objects, each object represents one list item.
  //
  data: [{
    name: 'KnockoutJS',
    link: 'http://knockoutjs.com/',
    downloads: 10,
    followers: 20,
  }, {
    name: 'AngularJS',
    link: 'https://angularjs.org/',
    downloads: 110,
    followers: 8
  }],

  /**
   * Called on GET, provide data to render the list.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    render(null, {
      data: this.sort(null, this.order[0]),
      order: this.order
    });
  }
}).on(module);