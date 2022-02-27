'use strict';

var web = require('solid-js/web');
var index = require('./index-61a6595e.js');
require('./index.js');
require('express');
require('path');
require('solid-js');

const Home = () => {
  return web.createComponent(index.Home, {});
};

exports["default"] = Home;
