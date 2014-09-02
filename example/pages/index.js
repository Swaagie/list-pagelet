'use strict';

var Page = require('bigpipe').Page
  , pagelet = require('../../');

Page.extend({
  path: '/',              // HTTP route we should respond to.
  view: './index.hbs',    // The base template we need to render.
  pagelets: {             // The pagelets that should be rendered.
    list: pagelet.extend({
      data: [{
        id: 'knockout',
        name: 'KnockoutJS',
        link: 'http://knockoutjs.com/',
        properties: {
          downloads: 10,
          followers: 20
        }
      }, {
        id: 'angular',
        name: 'AngularJS',
        link: 'https://angularjs.org/',
        properties: {
          downloads: 110,
          followers: 8
        }
      }, {
        id: 'meteor',
        name: 'Meteor',
        link: 'https://www.meteor.com/',
        properties: {
          downloads: 2099,
          followers: 4
        }
      }]
    })
  }
}).on(module);
