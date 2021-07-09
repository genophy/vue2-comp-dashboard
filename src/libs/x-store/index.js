/**
 * @description vueX功能类
 *      - xGet                  获取值
 *          xGet('windowSize')
 *      - xAsyncSet             同步设置值
 *          xAsyncSet('windowSize', value);
 *      - xSet                  设置值
 *          xSet('windowSize', value);
 *      - vue computed
 *          computed: {
 *              ...xMapState(['windowSize']),           // 直接 {{windowSize}} 可获取值
 *              ...mapGetters({
 *                  windowSize2': 'windowSize'          // 直接 {{windowSize2}} 可获取值
 *              }),
 *              windowSize3: xComputed('windowSize')    // 直接 {{windowSize3}} 可获取值
 *          },
 *       - xSubscribe
 *          xSubscribe('id-123456','windowSize',function(value){ })
 *       - xUnSubscribe
 *          xUnSubscribe('id-123456')
 * @author  g_eno_phy
 * @version 2020-04-24 10:51
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// 默认值
const states = [
  {windowSize: {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}},
  {websiteInfo: {}},
  {menuList: []},
  {currentMenuPath: ''},
  {showProgressLoader: false},
  {includeRouteList: []}
];

// 订阅id列表
const subscribeIds = [];

/**
 * mixins
 * @param name
 * @param defaultValue
 * @returns {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const _mixinsModule = (name, defaultValue = null) => {
  const state = {
    [name]: defaultValue
  };

  const getters = {
    [name]: state => {
      return state[name];
    }
  };

  const mutations = {
    [name]: (state, payload) => {
      state[name] = payload;
    }
  };

  const actions = {
    [name]: ({commit}, payload) => {
      commit(name, payload);
    }
  };

  return {state, getters, mutations, actions};
};

/**
 * async set value
 * usage
 *      XStore.xSet('windowSize',{width: 0, height: 0})
 * @param name
 * @param value
 * @returns {*|undefined|Promise<any>|void}
 */
const xAsyncSet = (name, value = null) => {
  return xInstance.commit(name, value);
};

/**
 * set value
 * usage
 *      XStore.xSet('windowSize',{width: 0, height: 0})
 * @param name
 * @param value
 * @returns {*|undefined|Promise<any>|void}
 */
const xSet = (name, value) => {
  return xInstance.dispatch(name, value);
};
/**
 * get value
 * @param name
 * @returns {null | *}
 */
const xGet = (name) => {
  return xInstance.getters[name];
};

/**
 * computed
 * usage
 *      windowSize: xComputed(StoreConfig.WINDOW_SIZE)
 * @param name
 * @returns {{}}
 */
const xComputed = (name) => {
  return {
    get () {
      return xGet(name);
    },
    set (v) {
      return xAsyncSet(name, v);
    }
  };
};

/**
 * mapState
 * usage
 *      ...xComputedMapState([StoreConfig.WINDOW_SIZE])
 * @param names
 */
const xMapState = (names = []) => {
  const obj = {};
  names.forEach(name => {
    obj[name] = state => state[name];
  });
  return Vuex.mapState(obj);
};

/**
 * 订阅，组件销毁前，一定要取消订阅xUnSubscribe
 * @param id
 * @param name
 * @param fn
 */
const xSubscribe = (id, name, fn) => {
  // 若id不存在，则新增
  if (!~subscribeIds.indexOf(id)) {
    subscribeIds.push(id);
  }

  xInstance.subscribe(mutation => {
    if (mutation.type === name && typeof fn === 'function') {
      if (~subscribeIds.indexOf(id)) {
        fn(mutation.payload);
      }
    }
  });
};

/**
 * 取消订阅
 * @param id
 */
const xUnSubscribe   = (id) => {
  const idx = subscribeIds.indexOf(id);
  if (~idx) {
    subscribeIds.splice(idx, 1);
  }
};
/**
 * 混合名称
 */
const _mixinsModules = (names) => {
  const obj = {};
  names.forEach(name => {
    let defaultValue = null;
    if (name && typeof name !== 'string') {
      defaultValue = Object.values(name)[0];
      name         = Object.keys(name)[0];
    }
    obj[name] = _mixinsModule(name, defaultValue);
  });
  return obj;
};

/**
 * 实例化Store
 * 模块为静态设置
 * @type {Store<unknown>}
 */
const xInstance = new Vuex.Store({
  strict : debug, /* 在严格模式下，任何 mutation 处理函数以外编辑 Vuex state 都会抛出错误。 */
  plugins: debug ? [createLogger()] : [],
  modules: {
    ..._mixinsModules(states)
  }
});
export {
  xAsyncSet,
  xSet,
  xGet,
  xComputed,
  xMapState,
  xSubscribe,
  xUnSubscribe,
  xInstance
};
