function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

// SimpleTracker 类：简单的前端埋点上报工具
var SimpleTracker = /*#__PURE__*/function () {
  function SimpleTracker() {
    _classCallCheck(this, SimpleTracker);
    // config: 配置项，包含应用ID、上报地址、是否调试模式
    this.config = {
      appId: "",
      // 应用唯一标识
      reportUrl: "",
      // 数据上报的 API 地址
      debug: false // 是否启用调试（打印日志）
    };
    // common: 公共参数（初始化时生成，与每个事件一同上报）
    this.common = {};
  }

  /**
   * 初始化方法，设置用户自定义的配置项
   * @param {Object} options 外部传入的初始化参数，会合并到 config 中
   * 使用案例：
   *   tracker.init({ appId: 'my-app', reportUrl: '/report', debug: true });
   */
  return _createClass(SimpleTracker, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // 合并用户传入的配置到默认配置
      this.config = _objectSpread2(_objectSpread2({}, this.config), options);
      // 获取并缓存公共参数
      this.common = this.getCommonInfo();
      // 如果打开了 debug 模式，则控制台打印初始化完成信息
      if (this.config.debug) {
        console.log("[Tracker] 初始化成功", this.config);
      }
    }

    /**
     * 获取公共参数方法（如需扩展可在这里添加）
     * @returns {Object} 包含 appId、当前页面URL、浏览器UA、当前时间戳
     */
  }, {
    key: "getCommonInfo",
    value: function getCommonInfo() {
      return {
        appId: this.config.appId,
        // 应用唯一标识
        url: location.href,
        // 当前访问的网址
        ua: navigator.userAgent,
        // 用户浏览器 UA 信息
        timestamp: Date.now() // 当前时间戳
      };
    }

    /**
     * 上报自定义事件
     * @param {string} eventName 事件名称，如 'click', 'page_view'
     * @param {Object} params 可选，业务附加参数，KV结构
     * 使用案例：
     *   tracker.track('login', { userId: '123' })
     */
  }, {
    key: "track",
    value: function track(eventName) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // 组装要上报的数据
      var data = _objectSpread2(_objectSpread2(_objectSpread2({
        event: eventName
      }, this.common), params), {}, {
        // 业务自定义的参数
        timestamp: Date.now() // 精确记录事件发生的时间
      });

      // 如果开启 debug，会打印即将上报的数据内容
      if (this.config.debug) {
        console.log("[Tracker] 上报", data);
      }

      // 调用发送函数，把数据发出去
      this.send(data);
    }

    /**
     * 发送请求方法，目前采用 sendBeacon（更适合前端上报，尤其是页面卸载场景）
     * 可后续扩展支持 批量/失败重试/离线缓存 等高级功能
     * @param {Object} data 需要上报的完整内容
     */
  }, {
    key: "send",
    value: function send(data) {
      var _navigator$sendBeacon, _navigator;
      // 没有配置上报地址则停止
      if (!this.config.reportUrl) return;

      // navigator.sendBeacon 是原生 API，第一个参数是 URL，第二个参数是内容
      // 用 Blob 封装数据，确保 Content-Type = application/json
      (_navigator$sendBeacon = (_navigator = navigator).sendBeacon) === null || _navigator$sendBeacon === void 0 || _navigator$sendBeacon.call(_navigator, this.config.reportUrl, new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
    }
  }]);
}(); // 创建唯一实例（通常一个项目里全局只用一个 Tracker 工具）
var tracker = new SimpleTracker();

export { tracker as default };
