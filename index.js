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

  dependencies: [
    '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'
  ],

  //
  // Key or function which denotes how the data should be ordered before
  // the list is generated. By default modules will be sorted on
  // downloadCount. Always sorts from high to low.
  //
  order: ['downloads', 'followers'],

  rpc: ['sort'],

  get sort() {
    var order = this.order[0];

    return function(a, b) {
      a = a[order];
      b = b[order];

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
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
    var sort = this.sort;

    //
    // Provide data to renderer after sorting.
    //
    render(null, {
      data: this.data.sort(sort),
      order: this.order
    });
  }
}).on(module);