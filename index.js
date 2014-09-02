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
  // Default property which will be used to order the data before
  // the list is generated. Always sorts from high to low.
  //
  order: '',

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
      a = a.properties[order] || 0;
      b = b.properties[order] || 0;

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
  // Default required keys per object: id, name, link and properties.
  //
  data: [],

  /**
   * Called on GET, provide data to render the list.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    var list = this
      , order = list.order;

    list.sort(function sorted(error, data) {
      if (error) return render(error);

      render(null, {
        keys: Object.keys(data[0].properties),
        order: order,
        data: data
      });
    }, order);
  },

  /**
   * Getter that provides a Handlebars helper function. This will show the
   * value of the property that the list is currently ordered by.
   *
   * @returns {Function} Handlebars helper.
   * api public
   */
  get show() {
    var order = this.order;

    return function show(options) {
      return options.data.key !== order ? ' style="display:none"' : '';
    }
  },

  /**
   * Getter that provides a Handlebars helper function. This will set a selected
   * property on property option that the list is currently order by.
   *
   * @returns {Function} Handlebars helper.
   * api public
   */
  get select() {
    var order = this.order;

    return function select(options) {
      return this === order ? ' selected' : '';
    }
  },

  /**
   * Override the default constructor to register the handlebars
   * helper functions once.
   *
   * @api private
   */
  constructor: function constructor() {
    pagelet.__super__.constructor.apply(this, arguments);

    this.temper.require('handlebars').registerHelper('show', this.show);
    this.temper.require('handlebars').registerHelper('select', this.select);
  }
}).on(module);