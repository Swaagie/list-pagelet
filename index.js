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
  // the list is generated.
  //
  order: null,

  //
  // Collection of objects, each object represents one list item.
  //
  data: [{
    title: 'Knockout.JS',
    link: 'http://knockoutjs.com/'
  }],

  /**
   * Called on GET, provide data to render the list.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    var list = this
      , sort;

    //
    // If order is a user provided function simply pass that to sort.
    //
    if ('function' === typeof this.order) sort = this.order;
    if (!sort) sort = function sort(a, b) {
      // implement sort by key.
    };

    render(null, {
      data: this.data.sort(sort)
    });
  }
}).on(module);