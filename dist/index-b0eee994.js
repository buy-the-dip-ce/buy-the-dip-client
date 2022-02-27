'use strict';

var web = require('solid-js/web');
var index = require('./index.js');
require('solid-js');

var styles = {"home":"style-module_home__qKXDk"};

const _tmpl$ = ["<div", "><div class=\"", "\">\uD648 \uC785\uB2C8\uB2E4.</div><!--#-->", "<!--/--></div>"];

const Home = () => {
  return [web.createComponent(index.Title, {
    children: "Title of page"
  }), web.createComponent(index.Meta, {
    name: "example",
    content: "whatever"
  }), web.ssr(_tmpl$, web.ssrHydrationKey(), web.escape(styles.home, true), web.escape(web.createComponent(index.Link, {
    href: "/posts",
    children: "\uD3EC\uC2A4\uD2B8\uB85C \uC774\uB3D9"
  })))];
};

exports.Home = Home;
