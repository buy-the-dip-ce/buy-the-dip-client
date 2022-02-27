'use strict';

var web = require('solid-js/web');
var index = require('./index.js');

const _tmpl$ = ["<div", "><div class=\"sample\">\uD3EC\uC2A4\uD2B8 \uB514\uD14C\uC77C \uC785\uB2C8\uB2E4.</div></div>"];

const Home = () => {
  return [web.createComponent(index.Title, {
    children: "Title of page"
  }), web.createComponent(index.Meta, {
    name: "example",
    content: "whatever"
  }), web.createComponent(index.Link, {
    rel: "stylesheet",
    href: "./style.css"
  }), web.ssr(_tmpl$, web.ssrHydrationKey())];
};

exports.Home = Home;
