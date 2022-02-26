'use strict';

var web = require('solid-js/web');
var express = require('express');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const _tmpl$ = ["<div", "></div>"];

const App = () => {
  return web.ssr(_tmpl$, web.ssrHydrationKey());
};

const app = express__default["default"]();
const port = 8080;
app.use(express__default["default"].static(path__default["default"].join(__dirname, "../public")));
app.get("*", (req, res) => {
  let html;

  try {
    html = web.renderToString(() => web.createComponent(App, {}));
  } catch (err) {
    console.error(err);
  } finally {
    res.send(html);
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
