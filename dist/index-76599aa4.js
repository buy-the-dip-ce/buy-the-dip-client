'use strict';

var web = require('solid-js/web');
var index = require('./index.js');
require('solid-js');
require('express');
require('path');

var styles = {"poststyle":"post-style-module_poststyle__v2MM9"};

const _tmpl$ = ["<div", " class=\"", "\">\uD3EC\uC2A4\uD2B8 \uD648 \uC785\uB2C8\uB2E4.<!--#-->", "<!--/--></div>"];

const Home$1 = () => {
  return web.ssr(_tmpl$, web.ssrHydrationKey(), web.escape(styles.poststyle, true), web.escape(web.createComponent(index.Link, {
    href: "/",
    children: "\uD648\uC73C\uB85C \uC774\uB3D9"
  })));
};

const Home = () => {
  return web.createComponent(Home$1, {});
};

exports["default"] = Home;
