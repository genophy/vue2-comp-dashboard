/**
 * @description 请求功能类
 *              - 依赖 axios
 * @author  g_eno_phy
 * @version 0.1
 *
 */
import { CommonsUtil, Constants, ModalUtil } from '@/libs/util';
import axios from 'axios';

// 中断
const CancelToken = axios.CancelToken;

window.$axiosRequestList  = []; // 普通请求
window.$axiosDownloadList = []; // 下载请求

/* 默认请求超时为 3 秒 */
axios.defaults.timeout = 3000;

/* url前缀 https://www.example.com:8080/<%=VUE_APP_URL_PREFIX%>/xxx */
// axios.defaults.baseURL = '';

// axios.defaults.transformRequest = [function (data) {
//   return qs.stringify(data);
// }];
// 不需要加载页面进度的url列表
const silenceUrlList = ['/login.do'];

/* 请求拦截器，设置跨域，一般不需要主动设置，应全有服务端设置 */
axios.interceptors.request.use(config => {
  if (!~silenceUrlList.indexOf(config.url)) ModalUtil.showPageLoader(); // 显示页面进度条
  config.headers['Access-Control-Allow-Origin']      = '*'; // cookie模式下不能设置为*，应设置具体域名，如http://www.example.com
  config.headers['Access-Control-Allow-Methods']     = 'POST,GET,OPTIONS,DELETE,HEAD,PUT,PATCH';
  config.headers['Access-Control-Allow-Headers']     = 'Origin, X-Requested-With, Content-Type, Accept, token';
  config.headers['Access-Control-Allow-Credentials'] = 'true';  // 保持前端跨域时携带的cookie
  config.headers.token                               = localStorage.getItem(Constants.LOCAL_STORAGE.TOKEN) || '';
  config.headers.timestamp                           = Date.now();
  return config;
});

/* 响应拦截器，对接口返回errorCode进行判断跳转 */
axios.interceptors.response.use(response => {
  ModalUtil.hidePageLoader(); // 隐藏页面进度条
  const responseData = response.data;
  if (responseData.code === 200) { // 处理错误码，若返回成功则进入resolve

    return Promise.resolve(responseData);
  } else if (response.config.responseType === 'blob') { // 取请求头用
    return Promise.resolve(responseData);
  } else if (responseData.code === 1005) { // 用户会话过期
    return Promise.reject(responseData);
  } else {
    // 是接口返回参数的错误
    return Promise.reject(responseData);
  }
}, error => {
  ModalUtil.hidePageLoader(); // 隐藏页面进度条
  // 处理状态码
  if (error && error.message === 'interrupt') {
    console.log('已中断请求');
  } else if (error && error.response) {
    const statusCode = error.response.status;
    switch (statusCode) {
      case 401:   // 若用户session为空
        // 清空所有存储
        CommonsUtil.clearAllStorage();
        break;
      case 502:   // 无法连接服务器
      case 503:   // 服务器重启
      case 404: // 接口未找到
        // ModalUtil.openMsgWarning(Constants.CODE.RESPONSE_STATUS[`${statusCode}`] || '');
        break;
      default: // 其他错误
        // MarkModalUtil.openViewDesignMessageError(`网络请求异常(${statusCode})`);
        break;
    }
  } else {
    // 其他错误
    // ModalUtil.openMsgWarning('系统异常');
  }
  // 是接口返回参数的错误
  return Promise.reject(error);
});

export default class HttpClientUtil {
  /**
   * 封装get方法
   * @param url
   * @param params
   * @returns {Promise}
   */

  static get = (url, params = {}) => {
    return axios.get(url, {params: params});
  };

  /**
   * 下载
   * @param url
   * @param method  GET | POST
   * @param queryParams
   * @param fnProgress  function 进度，返回 0-100 数字
   */
  static download = (url, method = 'GET', queryParams = {}, fnProgress) => {
    // 发送请求
    return axios({
      url               : this.rebuildQueryParams(url, queryParams),
      baseURL           : '',
      method            : method, // GET POST
      responseType      : 'blob', // blob arraybuffer json text
      timeout           : 0,
      cancelToken       : new CancelToken(c => {  // 强行中断请求要用到的
        window.$axiosDownloadList.push(c);
      }),
      onDownloadProgress: (e) => {
        if (e.total) {
          if (typeof fnProgress === 'function') {
            fnProgress(e);
          }
        }
      }
    });
  };

  /**
   * 封装post - query请求
   */
  static postQuery = ((url, queryParams = {}) => {
    return axios.post(this.rebuildQueryParams(url, queryParams), {}, {
      cancelToken: new CancelToken(c => {  // 强行中断请求要用到的
        window.$axiosRequestList.push(c);
      })
    });
  });

  /**
   * 封装post - jsonData请求
   * @param url
   * @param data
   */
  static postJsonData = (url, data = {}) => {
    return axios.post(url, data, {
      cancelToken: new CancelToken(c => {  // 强行中断请求要用到的
        window.$axiosRequestList.push(c);
      })
    });
  };
  /**
   * 封装post - formData请求
   * @param url
   * @param data
   * @param containNull 是否允许值包含null
   * @returns {Promise<T>}
   */

  static postFormData = (url, data = {}, containNull = false) => {
    const formData = new FormData();
    for (const item in data) {
      if (item) {
        // 对数组，进行额外追加
        if (data[item] && Array.isArray(data[item])) {
          data[item].forEach(val => {
            formData.append(item, val);
          });
        } else {
          // 若不允许有null出现
          if (!containNull && (data[item] === null || data[item] === undefined)) {
            data[item] = '';
          }
          formData.append(item, data[item]);
        }
      }
    }

    return axios.post(url, formData, {
      timeout    : 120000, // 120秒
      cancelToken: new CancelToken(c => {  // 强行中断请求要用到的
        window.$axiosRequestList.push(c);
      })
    });
  };

  /**
   * 中断请求
   */
  static interruptRequest () {
    if (window.$axiosRequestList && window.$axiosRequestList.length > 0) {        // 强行中断时才向下执行
      window.$axiosRequestList.forEach(item => {
        item('interrupt');// 给个标志，中断请求
      });
    }
    window.$axiosRequestList = [];
  }

  /**
   * 中断下载
   */
  static interruptDownload () {
    if (window.$axiosDownloadList && window.$axiosDownloadList.length > 0) {        // 强行中断时才向下执行
      window.$axiosDownloadList.forEach(item => {
        item('interrupt');// 给个标志，中断请求
      });
    }
    window.$axiosDownloadList = [];
  }

  /**
   * 重建query - params
   * @private
   * @param url
   * @param queryParams
   * @return {string | any}  '?key1=value1&key2=value2' or ''
   */
  static rebuildQueryParams (url, queryParams) {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url;
    }
    queryParams          = queryParams || {};
    const queryParamsArr = [];
    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key) && queryParams[key] !== undefined) {
        queryParamsArr.push(`${key}=${encodeURIComponent(queryParams[key])}`);
      }
    }
    // 查询参数字符串
    const queryParamsStr = queryParamsArr[0] ? `?${queryParamsArr.join('&')}` : '';
    return `${url}${queryParamsStr}`;
  }
}
