'use strict';

var web = require('solid-js/web');
var express = require('express');
var path = require('path');
var solidJs = require('solid-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

function intercept([value, setValue], get, set) {
  return [get ? () => get(value()) : value, set ? v => setValue(set(v)) : setValue];
}

function createIntegration(get, set, init, utils) {
  let ignore = false;

  const wrap = value => typeof value === "string" ? {
    value
  } : value;

  const signal = intercept(solidJs.createSignal(wrap(get()), {
    equals: (a, b) => a.value === b.value
  }), undefined, next => {
    !ignore && set(next);
    return next;
  });
  init && solidJs.onCleanup(init((value = get()) => {
    ignore = true;
    signal[1](wrap(value));
    ignore = false;
  }));
  return {
    signal,
    utils
  };
}
function normalizeIntegration(integration) {
  if (!integration) {
    return {
      signal: solidJs.createSignal({
        value: ""
      })
    };
  } else if (Array.isArray(integration)) {
    return {
      signal: integration
    };
  }

  return integration;
}
function staticIntegration(obj) {
  return {
    signal: [() => obj, next => Object.assign(obj, next)]
  };
}
function pathIntegration() {
  return createIntegration(() => ({
    value: window.location.pathname + window.location.search + window.location.hash,
    state: history.state
  }), ({
    value,
    replace,
    scroll,
    state
  }) => {
    if (replace) {
      window.history.replaceState(state, "", value);
    } else {
      window.history.pushState(state, "", value);
    }

    if (scroll) {
      window.scrollTo(0, 0);
    }
  }, notify => bindEvent(window, "popstate", () => notify()), {
    go: delta => window.history.go(delta)
  });
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|\/+$|\s+/g;

function normalize(path) {
  const s = path.replace(trimPathRegex, "");
  return s ? s.startsWith("?") ? s : "/" + s : "";
}

function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return undefined;
  }

  const basePath = normalize(base);
  const fromPath = from && normalize(from);
  let result = "";

  if (!fromPath || path.charAt(0) === "/") {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }

  return result + normalize(path) || "/";
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}
function joinPaths(from, to) {
  return normalize(from).replace(/\/*(\*.*)?$/g, "") + normalize(to);
}
function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
function createMatcher(path, partial) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return location => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;

    if (lenDiff < 0 || lenDiff > 0 && splat === undefined && !partial) {
      return null;
    }

    const match = {
      path: len ? "" : "/",
      params: {}
    };

    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const locSegment = locSegments[i];

      if (segment[0] === ":") {
        match.params[segment.slice(1)] = locSegment;
      } else if (segment.localeCompare(locSegment, undefined, {
        sensitivity: "base"
      }) !== 0) {
        return null;
      }

      match.path += `/${locSegment}`;
    }

    if (splat) {
      match.params[splat] = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
    }

    return match;
  };
}
function scoreRoute(route) {
  const [pattern, splat] = route.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
  const map = new Map();
  const owner = solidJs.getOwner();
  return new Proxy({}, {
    get(_, property) {
      if (!map.has(property)) {
        solidJs.runWithOwner(owner, () => map.set(property, solidJs.createMemo(() => fn()[property])));
      }

      return map.get(property)();
    },

    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    },

    ownKeys() {
      return Reflect.ownKeys(fn());
    }

  });
}

const MAX_REDIRECTS = 100;
const RouterContextObj = solidJs.createContext();
const RouteContextObj = solidJs.createContext();
const useRouter = () => invariant(solidJs.useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
const useRoute = () => solidJs.useContext(RouteContextObj) || useRouter().base;
function createRoute(routeDef, base = "", fallback) {
  const {
    path: originalPath,
    component,
    data,
    children
  } = routeDef;
  const isLeaf = !children || Array.isArray(children) && !children.length;
  const path = joinPaths(base, originalPath);
  const pattern = isLeaf ? path : path.split("/*", 1)[0];
  return {
    originalPath,
    pattern,
    element: component ? () => solidJs.createComponent(component, {}) : () => {
      const {
        element
      } = routeDef;
      return element === undefined && fallback ? solidJs.createComponent(fallback, {}) : element;
    },
    preload: routeDef.component ? component.preload : routeDef.preload,
    data,
    matcher: createMatcher(pattern, !isLeaf)
  };
}
function createBranch(routes, index = 0) {
  return {
    routes,
    score: scoreRoute(routes[routes.length - 1]) * 10000 - index,

    matcher(location) {
      const matches = [];

      for (let i = routes.length - 1; i >= 0; i--) {
        const route = routes[i];
        const match = route.matcher(location);

        if (!match) {
          return null;
        }

        matches.unshift({ ...match,
          route
        });
      }

      return matches;
    }

  };
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
  const routeDefs = Array.isArray(routeDef) ? routeDef : [routeDef];

  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];

    if (def && typeof def === 'object' && def.hasOwnProperty('path')) {
      const route = createRoute(def, base, fallback);
      stack.push(route);

      if (def.children) {
        createBranches(def.children, route.pattern, fallback, stack, branches);
      } else {
        const branch = createBranch([...stack], branches.length);
        branches.push(branch);
      }

      stack.pop();
    }
  } // Stack will be empty on final return


  return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i = 0, len = branches.length; i < len; i++) {
    const match = branches[i].matcher(location);

    if (match) {
      return match;
    }
  }

  return [];
}
function createLocation(path, state) {
  const origin = new URL("http://sar");
  const url = solidJs.createMemo(prev => {
    const path_ = path();

    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b) => a.href === b.href
  });
  const pathname = solidJs.createMemo(() => url().pathname);
  const search = solidJs.createMemo(() => url().search.slice(1));
  const hash = solidJs.createMemo(() => url().hash.slice(1));
  const key = solidJs.createMemo(() => "");
  return {
    get pathname() {
      return pathname();
    },

    get search() {
      return search();
    },

    get hash() {
      return hash();
    },

    get state() {
      return state();
    },

    get key() {
      return key();
    },

    query: createMemoObject(solidJs.on(search, () => extractSearchParams(url())))
  };
}
function createRouterContext(integration, base = "", data, out) {
  const {
    signal: [source, setSource],
    utils = {}
  } = normalizeIntegration(integration);
  const basePath = resolvePath("", base);
  const output = web.isServer && out ? Object.assign(out, {
    matches: [],
    url: undefined
  }) : undefined;

  if (basePath === undefined) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (basePath && !source().value) {
    setSource({
      value: basePath,
      replace: true,
      scroll: false
    });
  }

  const [isRouting, start] = solidJs.useTransition();
  const [reference, setReference] = solidJs.createSignal(source().value);
  const [state, setState] = solidJs.createSignal(source().state);
  const location = createLocation(reference, state);
  const referrers = [];
  const baseRoute = {
    pattern: basePath,
    params: {},
    path: () => basePath,
    outlet: () => null,

    resolvePath(to) {
      return resolvePath(basePath, to);
    }

  };
  baseRoute.data = data && data({
    data: undefined,
    params: {},
    location,
    navigate: navigatorFactory(baseRoute)
  });

  function navigateFromRoute(route, to, options) {
    // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
    solidJs.untrack(() => {
      if (typeof to === "number") {
        if (!to) ; else if (utils.go) {
          utils.go(to);
        } else {
          console.warn("Router integration does not support relative routing");
        }

        return;
      }

      const {
        replace,
        resolve,
        scroll,
        state: nextState
      } = {
        replace: false,
        resolve: true,
        scroll: true,
        ...options
      };
      const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);

      if (resolvedTo === undefined) {
        throw new Error(`Path '${to}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }

      const current = reference();

      if (resolvedTo !== current || nextState !== state()) {
        if (web.isServer) {
          if (output) {
            output.url = resolvedTo;
          }

          setSource({
            value: resolvedTo,
            replace,
            scroll,
            state: nextState
          });
        } else {
          const len = referrers.push({
            value: current,
            replace,
            scroll,
            state
          });
          start(() => {
            setReference(resolvedTo);
            setState(nextState);
            solidJs.resetErrorBoundaries();
          }).then(() => {
            if (referrers.length === len) {
              navigateEnd({
                value: resolvedTo,
                state: nextState
              });
            }
          });
        }
      }
    });
  }

  function navigatorFactory(route) {
    // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
    route = route || solidJs.useContext(RouteContextObj) || baseRoute;
    return (to, options) => navigateFromRoute(route, to, options);
  }

  function navigateEnd(next) {
    const first = referrers[0];

    if (first) {
      if (next.value !== first.value || next.state !== first.state) {
        setSource({ ...next,
          replace: first.replace,
          scroll: first.scroll
        });
      }

      referrers.length = 0;
    }
  }

  solidJs.createRenderEffect(() => {
    const {
      value,
      state
    } = source();

    if (value !== solidJs.untrack(reference)) {
      start(() => {
        setReference(value);
        setState(state);
      });
    }
  });

  if (!web.isServer) {
    function handleAnchorClick(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find(el => el instanceof Node && el.nodeName.toUpperCase() === "A");
      if (!a) return;
      const isSvg = a instanceof SVGAElement;
      const href = isSvg ? a.href.baseVal : a.href;
      const target = isSvg ? a.target.baseVal : a.target;
      if (target || !href && !a.hasAttribute('state')) return;
      const rel = (a.getAttribute("rel") || "").split(/\s+/);
      if (a.hasAttribute("download") || rel && rel.includes("external")) return;
      const url = isSvg ? new URL(href, document.baseURI) : new URL(href);
      if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
      const to = url.pathname + url.search + url.hash;
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(baseRoute, to, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state && JSON.parse(state)
      });
    }

    document.addEventListener("click", handleAnchorClick);
    solidJs.onCleanup(() => document.removeEventListener("click", handleAnchorClick));
  }

  return {
    base: baseRoute,
    out: output,
    location,
    isRouting,
    renderPath: utils.renderPath || (path => path),
    navigatorFactory
  };
}
function createRouteContext(router, parent, child, match) {
  const {
    base,
    location,
    navigatorFactory
  } = router;
  const {
    pattern,
    element: outlet,
    preload,
    data
  } = match().route;
  const path = solidJs.createMemo(() => match().path);
  const params = createMemoObject(() => match().params);
  preload && preload();
  const route = {
    parent,
    pattern,

    get child() {
      return child();
    },

    path,
    params,
    outlet,

    resolvePath(to) {
      return resolvePath(base.path(), to, path());
    }

  };
  route.data = data ? data({
    data: parent.data,
    params,
    location,
    navigate: navigatorFactory(route)
  }) : parent.data;
  return route;
}

const Router = props => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (web.isServer ? staticIntegration({
    value: url || ""
  }) : pathIntegration());
  const routerState = createRouterContext(integration, base, data, out);
  return web.createComponent(RouterContextObj.Provider, {
    value: routerState,

    get children() {
      return props.children;
    }

  });
};
const Routes = props => {
  const router = useRouter();
  const parentRoute = useRoute();
  const branches = solidJs.createMemo(() => createBranches(props.children, joinPaths(parentRoute.pattern, props.base || ""), Outlet));
  const matches = solidJs.createMemo(() => getRouteMatches(branches(), router.location.pathname));

  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }

  const disposers = [];
  let root;
  const routeStates = solidJs.createMemo(solidJs.on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];

    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];

      if (prev && prevMatch && nextMatch.route.pattern === prevMatch.route.pattern) {
        next[i] = prev[i];
      } else {
        equal = false;

        if (disposers[i]) {
          disposers[i]();
        }

        solidJs.createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i]);
        });
      }
    }

    disposers.splice(nextMatches.length).forEach(dispose => dispose());

    if (prev && equal) {
      return prev;
    }

    root = next[0];
    return next;
  }));
  return web.createComponent(solidJs.Show, {
    get when() {
      return routeStates() && root;
    },

    children: route => web.createComponent(RouteContextObj.Provider, {
      value: route,

      get children() {
        return route.outlet();
      }

    })
  });
};
const Route = props => props;
const Outlet = () => {
  const route = useRoute();
  return web.createComponent(solidJs.Show, {
    get when() {
      return route.child;
    },

    children: child => web.createComponent(RouteContextObj.Provider, {
      value: child,

      get children() {
        return child.outlet();
      }

    })
  });
};

const Home = solidJs.lazy(() => Promise.resolve().then(function () { return require('./index-d70db70f.js'); }));
const NotFound = solidJs.lazy(() => Promise.resolve().then(function () { return require('./404-a6bf94d6.js'); }));

const AppRoutes = () => {
  return web.createComponent(Routes, {
    get children() {
      return [web.createComponent(Route, {
        path: "/",

        get element() {
          return web.createComponent(Home, {});
        }

      }), web.createComponent(Route, {
        path: "/*all",

        get element() {
          return web.createComponent(NotFound, {});
        }

      })];
    }

  });
};

const App = () => {
  return web.createComponent(Router, {
    get children() {
      return web.createComponent(AppRoutes, {});
    }

  });
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
