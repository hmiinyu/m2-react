"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderRoutes = exports.loadRoutesConfig = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var loadRoutesConfig = function loadRoutesConfig(rootApp, childRoutes) {
  if (!rootApp && !rootApp.components) {
    console.error('React根组件参数components尚未配置, 应用无法启动！');
    return;
  }

  var routes = [{
    path: '/',
    component: rootApp.components || rootApp,
    children: childRoutes
  }].filter(function (item) {
    return item.components || item.children && item.children.length > 0;
  });

  var handleDefaultRoute = function handleDefaultRoute(route) {
    var childRoutes = route.children;

    if (!route.extra && childRoutes && childRoutes.length > 0) {
      var defaultRoute = childRoutes.find(function (child) {
        return child.isDefault;
      });

      if (defaultRoute) {
        var first = _objectSpread({}, defaultRoute);

        first.path = route.path;
        first.exact = true;
        first.autoDefaultRoute = true; // mark it so that the simple nav won't show it.

        route.children.unshift(first);
      }

      route.children.forEach(handleDefaultRoute);
    }
  };

  routes.forEach(handleDefaultRoute);
  return routes;
};

exports.loadRoutesConfig = loadRoutesConfig;

var renderRoutes = function renderRoutes(routesConfig, contextPath) {
  var routeType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hash';
  // Resolve route config object
  var children = [];

  var renderRouteItem = function renderRouteItem(item, routeContextPath) {
    var newContextPath;

    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = "".concat(routeContextPath, "/").concat(item.path || '');
    }

    newContextPath = newContextPath.replace(/\/+/g, '/');

    if (item.component && item.children) {
      var childRoutes = renderRoutes(item.children, newContextPath);
      children.push(_react.default.createElement(_reactRouterDom.Route, {
        key: newContextPath,
        render: function render(props) {
          return _react.default.createElement(item.component, props, childRoutes);
        },
        path: newContextPath
      }));
    } else if (item.component) {
      children.push(_react.default.createElement(_reactRouterDom.Route, {
        key: newContextPath,
        component: item.component,
        path: newContextPath,
        exact: true
      }));
    } else if (item.children) {
      item.children.forEach(function (child) {
        return renderRouteItem(child, newContextPath);
      });
    }
  };

  routesConfig.forEach(function (item) {
    return renderRouteItem(item, contextPath);
  }); // Use Switch so that only the first matched route is rendered.

  return routeType === 'hash' ? _react.default.createElement(_reactRouterDom.HashRouter, null, _react.default.createElement(_reactRouterDom.Switch, null, children)) : _react.default.createElement(_reactRouterDom.BrowserRouter, null, _react.default.createElement(_reactRouterDom.Switch, null, children));
};

exports.renderRoutes = renderRoutes;