'use strict';

var web = require('solid-js/web');
var index = require('./index-b0eee994.js');
require('./index.js');
require('express');
require('path');
require('solid-js');

const Home = () => {
  return web.createComponent(index.Home, {});
};

exports["default"] = Home;
