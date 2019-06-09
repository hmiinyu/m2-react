import React from 'react'; // eslint-disable-line
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import { UrlUtil } from 'm2-core';

export const loadRoutesConfig = (rootApp, childRoutes) => {
  if (!rootApp && !rootApp.components) {
    console.error('React根组件参数components尚未配置, 应用无法启动！');
    return;
  }

  const routes = [{
    path: '/',
    component: rootApp.components || rootApp,
    children: childRoutes
  }].filter(item => item.components || (item.children && item.children.length > 0));

  const handleDefaultRoute = (route) => {
    const childRoutes = route.children;
    if (!route.extra && childRoutes && childRoutes.length > 0) {
      const defaultRoute = childRoutes.find(child => child.isDefault);
      if (defaultRoute) {
        const first = { ...defaultRoute };
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

export const renderRoutes = (routesConfig, contextPath, routeType = 'hash') => {
  // Resolve route config object
  const children = [];
  const renderRouteItem = (item, routeContextPath) => {
    let newContextPath;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = `${routeContextPath}/${item.path || ''}`;
    }
    newContextPath = newContextPath.replace(/\/+/g, '/');
    if (item.component && item.children) {
      const childRoutes = renderRoutes(item.children, newContextPath);
      children.push(
        <Route
          key={newContextPath}
          render={props => <item.component {...props}>{childRoutes}</item.component>}
          path={newContextPath}
        />
      );
    } else if (item.component) {
      children.push(<Route key={newContextPath} component={item.component} path={newContextPath} exact />);
    } else if (item.children) {
      item.children.forEach(child => renderRouteItem(child, newContextPath));
    }
  };
  routesConfig.forEach(item => renderRouteItem(item, contextPath));
  // Use Switch so that only the first matched route is rendered.
  return routeType === 'hash' ? (
    <HashRouter>
      <Switch>{children}</Switch>
    </HashRouter>
  ) : (
    <BrowserRouter>
      <Switch>{children}</Switch>
    </BrowserRouter>
  );
};

export const getRouteParam = (name, props) => {
  if (name && props && props.match) {
    return props.match.params[name];
  }
  return '';
};

export const getRouteQueryParam = (name, props) => {
  if (name && props && props.location) {
    return UrlUtil.getQueryValue(name, props.location.search);
  }
  return '';
};

export const getParam = (name, props, query = false) => {
  return query ? getRouteQueryParam(name, props) : getRouteParam(name, props);
};
