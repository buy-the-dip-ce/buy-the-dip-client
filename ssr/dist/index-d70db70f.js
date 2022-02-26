'use strict';

var web = require('solid-js/web');

const _tmpl$ = ["<div", ">\uBA54\uC778</div>"];

const Home = () => {
  return web.ssr(_tmpl$, web.ssrHydrationKey());
};

exports["default"] = Home;
