'use strict';

var web = require('solid-js/web');
var index$1 = require('./index-ae5d24b5.js');
var index = require('./index.js');
require('express');
require('path');
require('solid-js');

const Home = () => {
  return [web.createComponent(index.Title, {
    children: "Title of page"
  }), web.createComponent(index.Meta, {
    name: "example",
    content: "whatever"
  }), web.createComponent(index$1.Home, {})];
};

exports["default"] = Home;
