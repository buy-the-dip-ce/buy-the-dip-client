'use strict';

var web = require('solid-js/web');
var index = require('./index.js');

const _tmpl$ = ["<div", "><div class=\"sample\">\uD648 \uC785\uB2C8\uB2E4.</div></div>"];

const Home = () => {
  return [web.createComponent(index.Title, {
    children: "Title of page"
  }), web.createComponent(index.Meta, {
    name: "example",
    content: "whatever"
  }), web.ssr(_tmpl$, web.ssrHydrationKey())];
};

exports.Home = Home;
