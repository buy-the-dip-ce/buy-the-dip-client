'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var web = require('solid-js/web');
var express = require('express');
var path = require('path');
var solidJs = require('solid-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function isWrappable(obj) {
  return obj != null && typeof obj === "object" && (obj.__proto__ === Object.prototype || Array.isArray(obj));
}

function setProperty(state, property, value, force) {
  if (!force && state[property] === value) return;

  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
}

function mergeStoreNode(state, value, force) {
  const keys = Object.keys(value);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key], force);
  }
}

function updatePath(current, path, traversed = []) {
  let part,
      next = current;

  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
          isArray = Array.isArray(current);

    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }

      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }

      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;

      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }

      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }

    next = current[part];
    traversed = [part].concat(traversed);
  }

  let value = path[0];

  if (typeof value === "function") {
    value = value(next, traversed);
    if (value === next) return;
  }

  if (part === undefined && value == undefined) return;

  if (part === undefined || isWrappable(next) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(next, value);
  } else setProperty(current, part, value);
}

function createStore(state) {
  function setStore(...args) {
    updatePath(state, args);
  }

  return [state, setStore];
}

function reconcile(value, options = {}) {
  return state => {
    if (!isWrappable(state) || !isWrappable(value)) return value;
    const targetKeys = Object.keys(value);

    for (let i = 0, len = targetKeys.length; i < len; i++) {
      const key = targetKeys[i];
      setProperty(state, key, value[key]);
    }

    const previousKeys = Object.keys(state);

    for (let i = 0, len = previousKeys.length; i < len; i++) {
      if (value[previousKeys[i]] === undefined) setProperty(state, previousKeys[i], undefined);
    }

    return state;
  };
}

function regexparam (str, loose) {
	if (str instanceof RegExp) return { keys:false, pattern:str };
	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
	arr[0] || arr.shift();

	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		} else if (c === ':') {
			o = tmp.indexOf('?', 1);
			ext = tmp.indexOf('.', 1);
			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
		} else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys: keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
	};
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const normalizeRegex = /^\/+|\/+$|\s+/;

function normalize(path) {
  const s = path.replace(normalizeRegex, '');
  return s ? '/' + s : '';
}

function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return undefined;
  }

  const basePath = normalize(base);
  const fromPath = from && normalize(from);
  let result = '';

  if (!fromPath || path.charAt(0) === '/') {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }

  return result + normalize(path) || '/';
}
function createMatcher(path, options) {
  const {
    keys,
    pattern
  } = regexparam(path, !options.end);
  return p => {
    const matches = pattern.exec(p);

    if (!matches) {
      return null;
    }

    const params = keys.reduce((acc, _, i) => {
      acc[keys[i]] = matches[i + 1];
      return acc;
    }, {});
    return [matches[0] || '/', params];
  };
}
function parseQuery(queryString) {
  return queryString.split('&').reduce((acc, pair) => {
    const [key, value] = pair.split('=', 2);

    if (key) {
      acc[key.toLowerCase()] = value;
    }

    return acc;
  }, {});
}
function renderPath(path) {
  return path;
}

const MAX_REDIRECTS = 100;
const RouterContext = solidJs.createContext();
const RouteContext = solidJs.createContext();
const useRouter = () => {
  const router = solidJs.useContext(RouterContext);

  if (!router) {
    throw new Error('No router context defined - ensure your application is wrapped with a Router component');
  }

  return router;
};
const useRoute = () => solidJs.useContext(RouteContext) || useRouter().base;
const defaultUtils = {
  resolvePath,
  createMatcher,
  parseQuery,
  renderPath
};

function normalizeIntegration(integration) {
  if (!integration) {
    return {
      signal: solidJs.createSignal({
        value: ''
      })
    };
  } else if (Array.isArray(integration)) {
    return {
      signal: integration
    };
  }

  return integration;
}

function createRouter(integration, basePath = '', overrides) {
  const {
    signal: [source, setSource],
    utils: intUtils
  } = normalizeIntegration(integration);
  const utils = { ...defaultUtils,
    ...intUtils,
    ...overrides
  };
  const path = utils.resolvePath('', basePath);

  if (path === undefined) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (path && !source().value) {
    setSource({
      value: path,
      mode: 'init'
    });
  }

  const baseRoute = createRouteState(utils, path, path, false, () => [path, {}]);
  const referrers = [];
  const [isRouting, start] = solidJs.useTransition();
  const [reference, setReference] = solidJs.createSignal(source().value);
  const [location] = createStore({
    get path() {
      return reference().split('?', 1)[0];
    },

    get queryString() {
      return reference().split('?', 2)[1] || '';
    }

  });

  function redirect(mode, to, options = {
    resolve: false
  }) {
    const currentRoute = solidJs.useContext(RouteContext) || baseRoute;
    const resolvedTo = options.resolve ? currentRoute.resolvePath(to) : utils.resolvePath('', to);

    if (resolvedTo === undefined) {
      throw new Error(`Path '${path}' is not a routable path`);
    }

    const redirectCount = referrers.push({
      ref: solidJs.untrack(reference),
      mode
    });

    if (redirectCount > MAX_REDIRECTS) {
      throw new Error('Too many redirects');
    }

    start(() => setReference(resolvedTo));
  }

  function handleRouteEnd(nextRef) {
    const first = referrers.shift();

    if (first) {
      if (nextRef !== first.ref) {
        setSource({
          value: nextRef,
          mode: first.mode
        });
      }

      referrers.length = 0;
    }
  }

  solidJs.createRenderEffect(() => {
    start(() => setReference(source().value));
  });
  solidJs.createRenderEffect(() => {
    handleRouteEnd(reference());
  });
  return {
    base: baseRoute,
    location,
    query: createMapMemo(() => location.queryString ? utils.parseQuery(location.queryString) : {}),
    isRouting,
    utils,

    push(to, options) {
      redirect('push', to, options);
    },

    replace(to, options) {
      redirect('replace', to, options);
    }

  };
}
function createRoute(pattern = '', end = false) {
  const router = useRouter();
  const parent = useRoute();
  const path = parent.resolvePath(pattern);

  if (path === undefined) {
    throw new Error(`${pattern} is not a valid path`);
  }

  if (parent.end && !end) {
    throw new Error(`Route '${path}' parent is a terminal route`);
  }

  const matcher = router.utils.createMatcher(path, {
    end
  });
  const match = solidJs.createMemo(() => matcher(router.location.path));
  return createRouteState(router.utils, router.base.path, path, end, match);
}
function createRouteState(utils, basePath, path, end, matchSignal) {
  const match = solidJs.createMemo(() => {
    const routeMatch = matchSignal();
    return routeMatch ? routeMatch[0] : undefined;
  });
  return {
    path,
    end,
    match,
    params: createMapMemo(() => {
      const routeMatch = matchSignal();
      return routeMatch ? routeMatch[1] : {};
    }),

    resolvePath(path) {
      const matchPath = match();
      return matchPath !== undefined ? utils.resolvePath(basePath, path, matchPath) : undefined;
    }

  };
}

function createMapMemo(fn) {
  const map = solidJs.createMemo(fn);
  const data = solidJs.createMemo(map, undefined, {
    equals: (a, b) => {
      reconcile(b, {
        key: null
      })(a);
      return true;
    }
  });
  const [state] = createStore({
    get map() {
      return data();
    }

  });
  return new Proxy({}, {
    get(_, key) {
      return state.map[key];
    },

    ownKeys() {
      return Reflect.ownKeys(map());
    },

    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    }

  });
}

function MatchRoute(props) {
  return web.createComponent(Route, web.mergeProps(props, {
    component: solidJs.Match
  }));
}

function renderChildren(props, args) {
  const children = props.children;
  return typeof children === 'function' && children.length ? solidJs.untrack(() => children(...args)) : children;
}

function Route(props) {
  const {
    path,
    end,
    component: Comp = solidJs.Show
  } = props;
  const router = useRouter();
  const route = createRoute(path, end);
  return web.createComponent(Comp, {
    get when() {
      return route.match() !== undefined;
    },

    get children() {
      return web.createComponent(RouteContext.Provider, {
        value: route,

        get children() {
          return renderChildren(props, [route, router]);
        }

      });
    }

  });
}
function Router(props) {
  const {
    integration,
    basePath,
    utils
  } = props;
  const router = createRouter(integration, basePath, utils);
  return web.createComponent(RouterContext.Provider, {
    value: router,

    get children() {
      return props.children;
    }

  });
}

function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

function intercept(signal, get, set) {
  const [value, setValue] = signal;
  return [get ? () => get(value()) : value, set ? v => setValue(set(v)) : setValue];
}

function createIntegration(get, set, init, utils) {
  const signal = intercept(solidJs.createSignal({
    value: get()
  }, {
    equals: (a, b) => a.value === b.value
  }), undefined, next => {
    const {
      value,
      mode
    } = next;
    mode && set(value, mode);
    return next;
  });
  init && solidJs.onCleanup(init((value = get()) => {
    signal[1]({
      value
    });
  }));
  return {
    signal,
    utils
  };
}
function pathIntegration() {
  return createIntegration(() => window.location.pathname + window.location.search, (value, mode) => {
    if (mode === 'push') {
      window.history.pushState(null, '', value);
    } else {
      window.history.replaceState(null, '', value);
    }
  }, notify => bindEvent(window, 'popstate', () => notify()));
}

const _tmpl$ = ["<div", ">404</div>"];
const Posts = solidJs.lazy(() => Promise.resolve().then(function () { return require('./index-5b3fda9a.js'); }));
const PostDetail = solidJs.lazy(() => Promise.resolve().then(function () { return require('./index-9d36b72c.js'); }));
const Home = solidJs.lazy(() => Promise.resolve().then(function () { return require('./index-f24e0c08.js'); }));
solidJs.lazy(() => Promise.resolve().then(function () { return require('./404-a6bf94d6.js'); }));

const AppRoutes = () => {
  return web.createComponent(solidJs.Switch, {
    get fallback() {
      return web.ssr(_tmpl$, web.ssrHydrationKey());
    },

    get children() {
      return [web.createComponent(MatchRoute, {
        path: "/posts/:id",
        children: route => web.createComponent(PostDetail, {})
      }), web.createComponent(MatchRoute, {
        path: "/posts",

        get children() {
          return web.createComponent(Posts, {});
        }

      }), web.createComponent(MatchRoute, {
        path: "/",

        get children() {
          return web.createComponent(Home, {});
        }

      })];
    }

  });
};

const App = ({
  url
}) => {
  return web.createComponent(Router, {
    get integration() {
      return web.isServer ? solidJs.createSignal({
        value: url
      }) : pathIntegration();
    },

    get children() {
      return web.createComponent(AppRoutes, {});
    }

  });
};

const MetaContext = solidJs.createContext();
const cascadingTags = ["title", "meta"];

const MetaProvider = props => {
  const indices = new Map(),
        [tags, setTags] = solidJs.createSignal({});
  solidJs.onMount(() => {
    const ssrTags = document.head.querySelectorAll(`[data-sm=""]`); // `forEach` on `NodeList` is not supported in Googlebot, so use a workaround

    Array.prototype.forEach.call(ssrTags, ssrTag => ssrTag.parentNode.removeChild(ssrTag));
  });
  const actions = {
    addClientTag: (tag, name) => {
      // consider only cascading tags
      if (cascadingTags.indexOf(tag) !== -1) {
        setTags(tags => {
          const names = tags[tag] || [];
          return { ...tags,
            [tag]: [...names, name]
          };
        }); // track indices synchronously

        const index = indices.has(tag) ? indices.get(tag) + 1 : 0;
        indices.set(tag, index);
        return index;
      }

      return -1;
    },
    shouldRenderTag: (tag, index) => {
      if (cascadingTags.indexOf(tag) !== -1) {
        const names = tags()[tag]; // check if the tag is the last one of similar

        return names && names.lastIndexOf(names[index]) === index;
      }

      return true;
    },
    removeClientTag: (tag, index) => {
      setTags(tags => {
        const names = tags[tag];

        if (names) {
          names[index] = null;
          return { ...tags,
            [tag]: names
          };
        }

        return tags;
      });
    }
  };

  if (web.isServer) {
    actions.addServerTag = tagDesc => {
      const {
        tags = []
      } = props; // tweak only cascading tags

      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const index = tags.findIndex(prev => {
          const prevName = prev.props.name || prev.props.property;
          const nextName = tagDesc.props.name || tagDesc.props.property;
          return prev.tag === tagDesc.tag && prevName === nextName;
        });

        if (index !== -1) {
          tags.splice(index, 1);
        }
      }

      tags.push(tagDesc);
    };

    if (Array.isArray(props.tags) === false) {
      throw Error("tags array should be passed to <MetaProvider /> in node");
    }
  }

  return web.createComponent(MetaContext.Provider, {
    value: actions,

    get children() {
      return props.children;
    }

  });
};

const MetaTag = (tag, props) => {
  const c = solidJs.useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  const {
    addClientTag,
    removeClientTag,
    addServerTag,
    shouldRenderTag
  } = c;
  let index = -1;
  solidJs.createComputed(() => {
    index = addClientTag(tag, props.name || props.property);
    solidJs.onCleanup(() => removeClientTag(tag, index));
  });

  if (web.isServer) {
    addServerTag({
      tag,
      props
    });
    return null;
  }

  return web.createComponent(web.Show, {
    get when() {
      return shouldRenderTag(tag, index);
    },

    get children() {
      return web.createComponent(web.Portal, {
        get mount() {
          return document.head;
        },

        get children() {
          return web.createComponent(web.Dynamic, web.mergeProps({
            component: tag
          }, props));
        }

      });
    }

  });
};
function renderTags(tags) {
  return tags.map(tag => {
    const keys = Object.keys(tag.props);
    const props = keys.map(k => k === "children" ? "" : ` ${k}="${tag.props[k]}"`).join("");
    return tag.props.children ? `<${tag.tag} data-sm=""${props}>${// Tags might contain multiple text children:
    //   <Title>example - {myCompany}</Title>
    Array.isArray(tag.props.children) ? tag.props.children.join("") : tag.props.children}</${tag.tag}>` : `<${tag.tag} data-sm=""${props}/>`;
  }).join("");
}
const Title = props => MetaTag("title", props);
const Meta = props => MetaTag("meta", props);
const Link = props => MetaTag("link", props);

const app = express__default["default"]();
const port = 8080;
app.use(express__default["default"].static(path__default["default"].join(__dirname, "../public")));
app.get("*", (req, res) => {
  let app;
  const tags = []; // mutated during render so you can include in server-rendered template later

  try {
    app = web.renderToString(() => web.createComponent(MetaProvider, {
      tags: tags,

      get children() {
        return web.createComponent(App, {
          get url() {
            return req.url;
          }

        });
      }

    }));
  } catch (err) {
    console.error(err);
  } finally {
    res.send(`
            <!doctype html>
            <html>
                <head>
                ${renderTags(tags)}
                ${web.generateHydrationScript()}
                </head>
                <body>
                <div id="root">${app}</div>
                </body>
            </html>
            `);
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

exports.Link = Link;
exports.Meta = Meta;
exports.Title = Title;
