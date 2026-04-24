// SimpleTracker 类：简单的前端埋点上报工具
class SimpleTracker {
  constructor() {
    // config: 配置项，包含应用ID、上报地址、是否调试模式
    this.config = {
      appId: "", // 应用唯一标识
      reportUrl: "", // 数据上报的 API 地址
      debug: false, // 是否启用调试（打印日志）
      batchSize: 10, // 批量上报的条数
      batchInterval: 1000, // 批量上报的间隔时间
      batchTimeout: 10000, // 批量上报的超时时间
      batchMaxSize: 100, // 批量上报的最大条数
      batchMaxInterval: 10000, // 批量上报的最大间隔时间
      batchMaxTimeout: 10000, // 批量上报的最大超时时间
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
  init(options = {}) {
    // 合并用户传入的配置到默认配置
    this.config = { ...this.config, ...options };
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
  getCommonInfo() {
    return {
      appId: this.config.appId, // 应用唯一标识
      url: location.href, // 当前访问的网址
      ua: navigator.userAgent, // 用户浏览器 UA 信息
      timestamp: Date.now(), // 当前时间戳
    };
  }

  /**
   * 上报自定义事件
   * @param {string} eventName 事件名称，如 'click', 'page_view'
   * @param {Object} params 可选，业务附加参数，KV结构
   * 使用案例：
   *   tracker.track('login', { userId: '123' })
   */
  track(eventName, params = {}) {
    // 组装要上报的数据
    const data = {
      event: eventName, // 事件名称
      ...this.common, // 公共参数
      ...params, // 业务自定义的参数
      timestamp: Date.now(), // 精确记录事件发生的时间
    };

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
  send(data) {
    // 没有配置上报地址则停止
    if (!this.config.reportUrl) return;

    // navigator.sendBeacon 是原生 API，第一个参数是 URL，第二个参数是内容
    // 用 Blob 封装数据，确保 Content-Type = application/json
    navigator.sendBeacon?.(
      this.config.reportUrl,
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
  }
}

// 创建唯一实例（通常一个项目里全局只用一个 Tracker 工具）
const tracker = new SimpleTracker();

// 导出实例，外部可以直接使用 import tracker from '...'
export default tracker;
