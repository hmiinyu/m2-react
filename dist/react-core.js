"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.getComponentRef = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _reactHotLoader = require("react-hot-loader");

var _stringFormat = _interopRequireDefault(require("string-format"));

var serviceWorker = _interopRequireWildcard(require("./service-worker"));

var _m2Core = require("m2-core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function render(rootApp) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!rootApp && !rootApp.components) {
    console.error('React根组件参数components尚未配置, 应用无法启动！');
    return;
  } // 注入string.format


  _stringFormat["default"] && _stringFormat["default"].extend(String.prototype, {});
  var _app_root = rootApp;

  if (rootApp.components && !_m2Core.DataType.isEmptyArray(rootApp.components)) {
    var _root = [];
    rootApp.components.forEach(function (item) {
      return _root.push(item);
    });
    _app_root = _root;
  }

  var _opts = _objectSpread({}, {
    hot: false,
    // 是否支持热更新(默认不支持)
    modules: [] // 热更新的模块(路径)

  }, options);

  var _renderApp = function _renderApp(app) {
    (0, _reactDom.render)(_opts.hot ? _react["default"].createElement(_reactHotLoader.AppContainer, null, _react["default"].createElement(_react["default"].Fragment, null, app)) : app, document.getElementById(rootApp.root || 'root'));
  };

  _renderApp(_app_root);

  if (_opts.hot && module.hot && _m2Core.DataType.isObject(_opts.modules)) {
    var _modules = Object.values(_opts.modules);

    if (!_modules.length) return;
    module.hot.accept(_modules, function () {
      if (_m2Core.DataType.isFunction(_opts.loadModules)) {
        _app_root = _opts.loadModules(_opts.modules);

        _renderApp(_app_root);
      }
    });
  } // If you want your app to work offline and load faster, you can change
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


var getComponentRef = function getComponentRef(refKey, component) {
  if (!refKey || !component) return;
  var ref = component[refKey] || component.refs[refKey];
  if (!ref) return;
  return ref.getWrappedInstance ? ref.getWrappedInstance() : ref;
};

exports.getComponentRef = getComponentRef;