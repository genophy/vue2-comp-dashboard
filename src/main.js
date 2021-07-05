import App from '@/App.vue';
import directives from '@/libs/directive';
import filters from '@/libs/filter';
import router from '@/libs/router';
import * as xStore from '@/libs/x-store';
import axios from 'axios';
import * as eCharts from 'echarts';
import elementResizeDetectorMaker from 'element-resize-detector';
import ElementUI from 'element-ui';
import lodash from 'lodash';
import Vue from 'vue';

Vue.config.productionTip = false;
// directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});

// filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

window.$elementResizer   = elementResizeDetectorMaker();  // 元素大小改变监听实例
window.$echarts          = eCharts;                       // 图表
window.$bmap             = window.BMap;                   // 百度地图对象
window.$bmapGenerate     = function (container, opts) {   // 生成百度地图主题实例
  // const mapInstance = new window.$bmap.Map(container, opts);
  // bmapInstance.getContainer().style.backgroundColor = 'rgba(16, 62, 114, 1)';     // 背景色
  // bmapInstance.setMapStyle({styleJson: communityStyle});                          // 地图风格
  return window.$bmap ? new window.$bmap.Map(container, opts) : null;
};
window.$bmapInstanceList = [];                          // 百度地图实例汇总 [{id,instance}]

window.$axios  = Vue.prototype.$axios = axios;
window.$lodash = Vue.prototype.$lodash = lodash;
window.$xStore = Vue.prototype.$xStore = xStore;
window.$router = router;

Vue.use(ElementUI, {size: 'small', zIndex: 1000});

window.$vue = new Vue({
  router,
  store : xStore.xInstance,
  render: h => h(App)
}).$mount('#app');
