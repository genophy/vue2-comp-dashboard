/**
 * @description
 * @author  g_eno_phy
 * @version 0.1
 *
 */
export default class Constants {
  /**
   * 缓存前缀
   */
  static STORAGE_PREFIX = process.env.VUE_APP_STORAGE_PREFIX || 'VUE2_COMP_DASHBOARD';

  /**
   *
   * @type {{MENU_LIST_SEQ: string, ROUTE_LIST: string, BTN_PERMISSION_LIST: string, MENU_LIST: string, USER_NAME: string, ROUTE_LIST_SEQ: string}}
   */
  static  LOCAL_STORAGE = {
    WEBSITE_INFO: `${Constants.STORAGE_PREFIX}_WEBSITE_INFO`, // 网站信息
    TOKEN       : `${Constants.STORAGE_PREFIX}_LOCAL_TOKEN`,
    USER_INFO   : `${Constants.STORAGE_PREFIX}_LOCAL_STORAGE_USER_INFO` // 用户信息
  };

  /** mark modal 组件关闭的时间间隙： 默认300毫秒。点击关闭，触发隐藏动画（300毫秒），之后直接删除元素 */
  static MODAL_CLOSE_DURATION = 300;

  static EMIT = {
    CLOSE_THIS_MODAL: 'on-close-this-modal'
  };

  static  CODE = {
    /* Response状态码 */
    RESPONSE_STATUS: {
      '401': '请重新登录',
      '502': '无法连接服务器',
      '503': '服务不可用', //  '服务器重启中，请稍后',
      '404': '未找到资源'
    }
  };

  // 时间范围配置
  static datePickerRangeOptions = {
    shortcuts: [{
      text: '最近7天',
      onClick (picker) {
        const end   = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近30天',
      onClick (picker) {
        const end   = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }]
  };

}
