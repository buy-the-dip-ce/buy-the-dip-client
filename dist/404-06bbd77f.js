'use strict';

var web = require('solid-js/web');

const _tmpl$ = ["<div", ">404</div>"];

const NotFound = () => {
  return web.ssr(_tmpl$, web.ssrHydrationKey());
};

exports["default"] = NotFound;
