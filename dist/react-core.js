"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.getComponentRef = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _stringFormat = _interopRequireDefault(require("string-format"));

var serviceWorker = _interopRequireWildcard(require("./service-worker"));

var _m2Core = require("m2-core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-line
function render(rootApp) {
  if (!rootApp && !rootApp.component && !rootApp.components) {
    console.error('React根组件参数component(s)尚未配置, 应用无法启动！');
    return;
  } // 注入string.format


  _stringFormat["default"] && _stringFormat["default"].extend(String.prototype, {});

  var _app_root = rootApp.component || rootApp;

  if (rootApp.components && !_m2Core.DataType.isEmptyArray(rootApp.components)) {
    var _root = [];
    rootApp.components.forEach(function (item) {
      return _root.push(item);
    });
    _app_root = _root;
  }

  var _renderApp = function _renderApp(app) {
    (0, _reactDom.render)(app, document.getElementById(rootApp.root || 'root'));
  };

  _renderApp(_app_root); // If you want your app to work offline and load faster, you can change
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