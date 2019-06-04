import React from 'react'; // eslint-disable-line
import { render as _render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import format from 'string-format';
import * as serviceWorker from './service-worker';
import { DataType } from 'm2-core';

export function render(rootApp, options = {}) {
  if (!rootApp && !rootApp.components) {
    console.error('React根组件参数components尚未配置, 应用无法启动！');
    return;
  }

  // 注入string.format
  format && format.extend(String.prototype, {});

  let _app_root = rootApp;
  if (rootApp.components && !DataType.isEmptyArray(rootApp.components)) {
    const _root = [];
    rootApp.components.forEach((item) => _root.push(item));
    _app_root = (_root);
  }

  const _opts = { ...{
      hot: false, // 是否支持热更新(默认不支持)
      modules: [] // 热更新的模块(路径)
    }, ...options
  };
  const _renderApp = (app) => {
    _render(
      _opts.hot ? (
        <AppContainer>
          <>{app}</>
        </AppContainer>) : app,
      document.getElementById(rootApp.root || 'root')
    )
  };

  _renderApp(_app_root);

  if (_opts.hot && module.hot && DataType.isObject(_opts.modules)) {
    const _modules = Object.values(_opts.modules);
    if (!_modules.length) return;
    module.hot.accept(_modules, () => {
      if (DataType.isFunction(_opts.loadModules)) {
        _app_root = _opts.loadModules(_opts.modules);
        _renderApp(_app_root);
      }
    });
  }

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
}

/**
 * @method 获取组件的子组件的引用(包含refs, wrappedComponentRef)
 * @param {String} refKey 当前引用的子组件key(可能是ref值或form表单)
 * @param {Object} component 当前的父组件
 * @returns {Object} 获取子组件的引用
 */
export const getComponentRef = (refKey, component) => {
  if (!refKey || !component) return;
  const ref = component[refKey] || component.refs[refKey];
  if (!ref) return;
  return ref.getWrappedInstance ? ref.getWrappedInstance() : ref;
};
