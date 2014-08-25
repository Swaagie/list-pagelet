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

  //
  // Key or function which denotes how the data should be ordered before
  // the list is generated. By default modules will be sorted on
  // downloadCount. Always sorts from high to low.
  //
  order: 'downloads',

  //
  // Collection of objects, each object represents one list item.
  //
  data: [{
    name: 'KnockoutJS',
    link: 'http://knockoutjs.com/',
    downloads: 10
  }, {
    name: 'AngularJS',
    link: 'https://angularjs.org/',
    downloads: 110
  }],

  /**
   * Called on GET, provide data to render the list.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    var list = this
      , order = list.order;

    //
    // If order is a user provided function simply pass that to sort.
    //
    if ('function' !== typeof order) order = function sort(a, b) {
      a = a[order];
      b = b[order];

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    render(null, {
      data: this.data.sort(order)
    });
  }
}).on(module);