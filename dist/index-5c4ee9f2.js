'use strict';

var web = require('solid-js/web');
var index$1 = require('./index-8bbc3519.js');
var index = require('./index.js');
require('solid-js');
require('express');
require('path');

const Home = () => {
  return [web.createComponent(index.Title, {
    children: "Title of page"
  }), web.createComponent(index.Meta, {
    name: "example",
    content: "whatever"
  }), web.createComponent(index$1.Home, {})];
};

exports["default"] = Home;
