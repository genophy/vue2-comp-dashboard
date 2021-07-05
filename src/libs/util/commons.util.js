import { Constants } from '@/libs/util/index';

/**
 * @descript
 * @author  g_eno_phy
 * @version 0.1
 *
 */

export default class CommonsUtil {

  /**
   * 随机字符串
   * @returns {*}
   */
  static randomStrId () {
    const temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push(String.fromCharCode(65 + Math.floor(Math.random() * 19) + i));
    }
    return temp.reduce((pre, next) => pre + next);
  }

  /**
   * 音频对象
   * @type {HTMLAudioElement}
   */
  static audio = null;

  /**
   * 播放警告音
   */
  static playSoundWarning (src) {
    if (!CommonsUtil.audio) {
      CommonsUtil.audio = new Audio();
    }

    if (typeof CommonsUtil.audio.pause === 'function' && typeof CommonsUtil.audio.play === 'function') {
      CommonsUtil.audio.pause();
      CommonsUtil.audio.src = src; // require('@/assets/mp3/jingbao.mp3');
      CommonsUtil.audio.play();
    }
  }

  static debounceObjs = {};

  /**
   * 抖动
   * @param id  必填
   * @param fn  方法
   * @param timeout
   * @param isImmediate 是否立刻执行
   */
  static debounce (id, fn, timeout = 1000, isImmediate = false) {
    if (!id) {
      return;
    }
    // 若debounce id存在，则先清空。
    if (CommonsUtil.debounceObjs[id]) {
      clearTimeout(CommonsUtil.debounceObjs[id]);
    } else if (isImmediate && typeof fn === 'function') { // 若需要立刻执行 且方法可用 ，则立即执行方法
      fn();
    }
    CommonsUtil.debounceObjs[id] = setTimeout(() => {
      // 若不是立刻执行，且方法可用
      if (!isImmediate && typeof fn === 'function') {
        fn();
      }
      if (CommonsUtil.debounceObjs[id]) {
        clearTimeout(CommonsUtil.debounceObjs[id]);
      }
      CommonsUtil.debounceObjs[id] = null;
    }, timeout);
  }

  static throttleObjs = {};

  /**
   * 节流,防止快速点击多次，只有第一次点击，才会返回false。
   * if( util.throttle() ) return; // 为true表示正在计时
   * @param id
   * @param timeout
   * @return {boolean}
   */
  static throttling (id, timeout = 400) {
    // 若debounce id存在，返回true
    if (CommonsUtil.throttleObjs[id]) {
      return true;
    }
    CommonsUtil.throttleObjs[id] = setTimeout(() => {
      if (CommonsUtil.throttleObjs[id]) {
        clearTimeout(CommonsUtil.throttleObjs[id]);
      }
      CommonsUtil.throttleObjs[id] = null;
    }, timeout);
    return false;
  };

  static intervalIds = {};

  /**
   * 循环执行某个方法
   * @param id
   * @param callback
   * @param timeout
   */
  static setInterval (id, callback, timeout = 1000) {
    // 若debounce id存在，返回true
    if (CommonsUtil.intervalIds[id]) {
      clearInterval(CommonsUtil.intervalIds[id]);
    }
    if (typeof callback === 'function') {
      CommonsUtil.intervalIds[id] = setInterval(callback, timeout);
    }
  }

  /**
   * 清空循环执行的方法
   * @param id
   */
  static clearInterval (id) {
    clearInterval(CommonsUtil.intervalIds[id]);
    CommonsUtil.intervalIds[id] = null;
  }

  /**
   * 清空所有缓存
   */
  static clearAllStorage () {
    // sessionStorage.clear();
    Object.keys(Constants.LOCAL_STORAGE).forEach(key => {
      localStorage.removeItem(Constants.LOCAL_STORAGE[key]);
    });
  }

  /*
   * 百度地图实例
   * @type {{saveInstance(*=, *): void, getInstanceById(*): *}}
   */
  static bMap = {
    /**
     * 根据id获取实例
     * @param id
     * @returns {Popper | [] | Popper.update | WebAssembly.Instance | Object}
     */
    getInstanceById (id) {
      if (window.$bmapInstanceList instanceof Array) {
        const instanceObj = window.$lodash.find(window.$bmapInstanceList, item => item.id === id) || {};
        return instanceObj.instance;
      }
    },
    /**
     * 保存实例
     * @param id
     * @param instance
     */
    addInstance (id, instance) {
      // 若找不到mapId对应的instance，则保存
      if (window.$bmapInstanceList instanceof Array && !this.getInstanceById(id)) {
        window.$bmapInstanceList.push({id, instance});
      }
    },
    /**
     * 删除实例
     * @param id
     */
    removeInstanceById (id) {
      if (window.$bmapInstanceList instanceof Array) {
        window.$lodash.remove(window.$bmapInstanceList, item => item.id === id);
      }
    },
    /**
     * 清空实例列表
     */
    clearAll () {
      window.$bmapInstanceList = [];
    }
  };
}
