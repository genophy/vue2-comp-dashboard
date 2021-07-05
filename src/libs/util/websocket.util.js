/**
 * @description
 * @author  g_eno_phy
 * @version 0.1
 *
 */
import { Constants } from '@/libs/util/index';

const heartCheck = {
  timeout         : 20000, // 心跳每20秒发一次
  timeoutObj      : null,
  serverTimeoutObj: null,
  start           : function (ws) {
    const self = this;
    clearTimeout(self.timeoutObj);
    clearTimeout(self.serverTimeoutObj);
    self.timeoutObj = setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      ws.send(JSON.stringify({test: 'connect beat'}));
      self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
        ws.close();
      }, self.timeout);
    }, self.timeout);
  }
};

export default class WebsocketUtil {
  // 连接地址
  _url = '';

  // ws对象
  _websocket;

  // 重连
  _isConnecting = false;

  // 重连间隙时间 30秒
  _reconnectDuration = 30000;

  // 发送信息对的方法
  _onMessage;

  constructor (url, onMessage) {
    // 若用户未登陆，直接返回
    if (!localStorage.getItem(Constants.LOCAL_STORAGE.USER_INFO)) {
      return;
    }
    this._url       = url;
    this._onMessage = onMessage;
    this._initWebsocket();
  }

  sendMessage (msg) {
    heartCheck.start(this._websocket);
    if (this._websocket) {
      this._websocket.send(msg);
    }
  }

  _reconnect () {
    // 若用户未登陆，直接返回
    if (!localStorage.getItem(Constants.LOCAL_STORAGE.USER_INFO)) {
      return;
    }
    if (this._isConnecting) {
      return;
    }
    this._isConnecting = true;
    setTimeout(() => {
      this._initWebsocket();
      this._isConnecting = false;
    }, this._reconnectDuration);
  }

  _initWebsocket () {
    const that = this;
    try {
      that._websocket = new WebSocket(this._url);
      if (typeof that._onMessage === 'function') {
        that._websocket.onmessage = (msgEvent) => {
          const reData = JSON.parse(msgEvent.data || '{}');
          // 若不是测试数据
          if (!reData.test) {
            that._onMessage(reData);
          }
        };
      }
      that._websocket.onopen  = function () {
        heartCheck.start(that._websocket);
        that.sendMessage(JSON.stringify({test: 'connect'}));
      };
      that._websocket.onerror = function (e) {
        that._reconnect();
        console.error('ws连接错误', e);
      };
      that._websocket.onclose = function (e) {
        that._reconnect();
        console.error('ws连接关闭', e);
      };
    } catch (e) {
      that._reconnect();
    }
  }
}
