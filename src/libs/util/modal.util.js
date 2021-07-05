/**
 * @description
 * @author  g_eno_phy
 * @version 0.1
 *
 */
import { xAsyncSet } from '@/libs/x-store';
import Vue from 'vue';
import { CommonsUtil, Constants } from '@/libs/util';
import BaseCustomModal from '@/components-base/modal/BaseCustomModal';
import BaseConfirmModal from '@/components-base/modal/BaseConfirmModal';
import BaseInfoModal from '@/components-base/modal/BaseInfoModal';

export default class ModalUtil {
  static allCusModals = [];

  //  自定义modal实例
  $_customInstance;
  $_customModalBoxNode;
  $_customModalNode;

  // 消息实例
  $_messageInstance;

  /**
   * 打开确认对话框
   * @param props
   * @param props.title                       标题
   * @param props.msg                         信息
   * @param props.innerHtml                   innerHtml
   * @param props.btnOkText                   ok按钮文字
   * @param props.btnCancelText               cancel按钮文字
   * @param options
   * @param options.isShowBtnClose            是否显示关闭按钮，默认true
   * @param options.isOverlayCloseAble        点击背景是否可以关闭，默认false
   * @param options.title                     标题，同props.title
   * @returns {Promise<*>}
   */
  openConfirm(props = {}, options = {}) {
    options.isShowBtnClose     = undefined === options.isShowBtnClose ? true : options.isShowBtnClose;
    options.isOverlayCloseAble = undefined === options.isOverlayCloseAble ? false : options.isOverlayCloseAble;
    options.title              = props.title || '';
    return this.openModal(BaseConfirmModal, props, options);
  }

  /**
   * 打开信息对话框
   * @param props
   * @param props.title                       标题
   * @param props.msg                         信息
   * @param props.innerHtml                   innerHtml
   * @param props.btnOkText                   ok按钮文字
   * @param options
   * @param options.isShowBtnClose            是否显示关闭按钮，默认true
   * @param options.isOverlayCloseAble        点击背景是否可以关闭，默认false
   * @param options.title                     标题，同props.title
   * @returns {Promise<*>}
   */
  openInfo(props = {}, options = {}) {
    options.isShowBtnClose     = undefined === options.isShowBtnClose ? true : options.isShowBtnClose;
    options.isOverlayCloseAble = undefined === options.isOverlayCloseAble ? false : options.isOverlayCloseAble;
    options.title              = props.title || '';
    return this.openModal(BaseInfoModal, props, options);
  }

  /**
   * 打开自定义modal
   *      const ModalUtil = new ModalUtil()
   *      ModalUtil.openModal(Component,{}).then(value => {}}
   *      注：value的值，由modal内组件$emit('on-close-this-modal',v)来确定。但一般认为不返回value，表示直接点击了（取消|关闭）等按钮
   * @param component                         组件对象
   * @param props                             组件props
   * @param options
   * @param options.title                     弹框名称
   * @param options.isBgColorAble             是否显示背景色，默认true
   * @param options.isShowBtnClose            是否显示关闭按钮，默认true
   * @param options.isOverlayCloseAble        点击遮罩是否可以关闭，默认false
   * @param options.width                     宽度
   * @param options.height                    高度
   * @returns {Promise<any>}
   */
  openModal(component, props = {}, options = {}) {
    // ModalUtil.allCusModals.push(this);

    options.isBgColorAble      = window.$lodash.isNil(options.isBgColorAble) ? true : options.isBgColorAble;
    options.isShowBtnClose     = window.$lodash.isNil(options.isShowBtnClose) ? true : options.isShowBtnClose;
    options.isOverlayCloseAble = window.$lodash.isNil(options.isOverlayCloseAble) ? false : options.isOverlayCloseAble;

    const that = this;
    return new Promise((resolve) => {
      // 获取 elementUI 当前的z-index + 1
      const zIndex = window.$vue.$ELEMENT.zIndex || 1000; // 1000; // + window.$vue.$Modal.methods.handleGetModalIndex();
      // 创建modal节点
      that.$_customModalNode              = document.createElement('div');
      that.$_customModalNode.className    = 'ly-global-modal';
      that.$_customModalNode.style.zIndex = `${zIndex}`;
      // 半透明背景
      const overlay                       = document.createElement('div');
      overlay.className                   = 'ly-global-modal__overlay';
      overlay.style.zIndex                = `${zIndex}`;

      // 若阴影可以关闭
      if (options.isOverlayCloseAble) {
        overlay.addEventListener('click', () => {
          that.closeModal();
        });
      }

      // 盒子容器
      // 内容
      const box        = document.createElement('div');
      box.className    = 'ly-global-modal__box';
      box.style.zIndex = `${zIndex}`;

      // 自定义组件
      const CustomComponent = Vue.extend(BaseCustomModal);
      const propsDataTemp   = Object.assign({}, props, {
        componentConfig: {
          component     : component,
          title         : options.title,
          isShowBtnClose: options.isShowBtnClose,
          isBgColorAble : options.isBgColorAble,
          width         : options.width,
          height        : options.height,
          zIndex        : zIndex
        }
      });
      // @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项/
      // 实例化，并且传值
      that.$_customInstance = new CustomComponent({
        propsData: propsDataTemp
      });
      /*
       * 监听 @on-close-this-modal 方法，获取传值，然后将结果resolve调用方法里
       *    - modal组件需要emit事件：  this.$emit('on-close-this-modal', value);
       *    - 调用组件 ModalUtil.openModal(SignIn).then(value => {...})
       */
      that.$_customInstance.$once(Constants.EMIT.CLOSE_THIS_MODAL, (value) => {
        resolve(value);
      });

      // 装载
      that.$_customInstance.$mount();

      // 内容追加
      that.$_customModalNode.appendChild(overlay);
      box.appendChild(that.$_customInstance.$el);
      that.$_customModalNode.appendChild(box);

      // body下追加modal节点
      document.body.appendChild(that.$_customModalNode);
      const _container = that.$_customModalNode;
      setTimeout(() => {
        _container.className = [_container.className || '', 'visible'].join(' ');
      }, 10);
    });
  }

  /**
   * 打开自定义侧边modal
   *      const ModalUtil = new ModalUtil()
   *      ModalUtil.openSideModal(Component,{}).then(value => {}}
   *      注：value的值，由modal内组件$emit('on-close-this-modal',v)来确定。但一般认为不返回value，表示直接点击了（取消|关闭）等按钮
   * @param component                         组件对象
   * @param props                             组件props
   * @param options
   * @param options.isBgColorAble             是否显示背景色，默认true
   * @param options.isOverlayAble             是否显示遮罩，默认false
   * @param options.isOverlayCloseAble        点击遮罩否可以关闭，默认false
   * @param options.direction                 从哪里弹出，默认'right'，可以是  'top','left','left-bottom','right','right-bottom','bottom'
   * @returns {Promise<any>}
   */
  openSideModal(component, props = {}, options = {}) {
    options.isBgColorAble      = options.isBgColorAble === undefined ? true : options.isBgColorAble;
    options.isOverlayAble      = options.isOverlayAble === undefined ? false : options.isOverlayAble;
    options.isOverlayCloseAble = options.isOverlayCloseAble === undefined ? false : options.isOverlayCloseAble;
    options.direction          = options.direction || 'right-bottom';

    const that = this;
    return new Promise((resolve) => {
      // 获取 elementUI 当前的z-index + 1
      const zIndex = window.$vue.$ELEMENT.zIndex || 1000; // 1000; // + window.$vue.$Modal.methods.handleGetModalIndex();

      // 创建modal节点
      that.$_customModalNode           = document.createElement('div');
      that.$_customModalNode.className = ['ly-global-side-modal', options.isBgColorAble ? '' : 'transparent', options.direction].join(' ');

      // 半透明背景
      const overlay        = document.createElement('div');
      overlay.className    = 'ly-global-side-modal__overlay';
      overlay.style.zIndex = zIndex;

      //  若允许背景，且阴影可以关闭
      if (options.isOverlayAble && options.isOverlayCloseAble) {
        overlay.addEventListener('click', () => {
          that.closeModal();
        });
      }

      // 盒子容器

      that.$_customModalBoxNode              = document.createElement('div');
      that.$_customModalBoxNode.className    = 'ly-global-side-modal__box';
      that.$_customModalBoxNode.style.zIndex = zIndex;

      // 内容
      const container     = document.createElement('div');
      container.className = 'ly-global-side-modal__container';

      // 自定义组件
      const CustomComponent = Vue.extend(component);
      // @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
      // 实例化，并且传值
      that.$_customInstance = new CustomComponent({
        propsData: props
      });
      /*
       * 监听 @on-close-this-modal 方法，获取传值，然后将结果resolve调用方法里
       *    - modal组件需要emit事件：  this.$emit('on-close-this-modal', value);
       *    - 调用组件 ModalUtil.openModal(SignIn).then(value => {...})
       */
      that.$_customInstance.$once(Constants.EMIT.CLOSE_THIS_MODAL, (value) => {
        resolve(value);
      });

      // 装载
      that.$_customInstance.$mount();
      // 子组件增加 ly-is-modal 样式，需要在$mount()后执行
      that.$_customInstance.$el.classList.add('ly-is-modal');
      // 内容追加组件实例
      container.appendChild(that.$_customInstance.$el);
      // modal节点追加内容和背景
      that.$_customModalBoxNode.appendChild(container);

      // 若允许背景
      if (options.isOverlayAble) {
        that.$_customModalNode.appendChild(overlay);
      }
      that.$_customModalNode.appendChild(that.$_customModalBoxNode);

      // body下追加modal节点
      document.body.appendChild(that.$_customModalNode);
      const _container = that.$_customModalNode; // .getElementsByClassName('ly-global-modal__container')[0];
      setTimeout(() => {
        _container.className = [_container.className || '', 'visible'].join(' ');
      }, 10);
    });
  }

  /**
   * 关闭自定义modal实例
   *      - ModalUtil.closeModal()
   */
  closeModal() {
    this.$_customModalNode.className = [
      (this.$_customModalNode.className || '').replace('visible', '').replace(/\s+/g, ' '),
      'invisible'
    ].join(' ');

    // 延迟关闭
    setTimeout(() => {
      if (this.$_customModalNode && this.$_customModalNode.parentNode) {
        this.$_customModalNode.parentNode.removeChild(this.$_customModalNode);

        // 若存在实例，则销毁
        if (this.$_customInstance) {
          this.$_customInstance.$destroy();
        }
        this.$_customInstance     = null;
        this.$_customModalBoxNode = null;
        this.$_customModalNode    = null;
      }
    }, Constants.MODAL_CLOSE_DURATION);
  }

  /**
   * 显示自定义modal实例
   */
  showModal() {
    this.$_customModalNode.style.display = 'block';
  }

  /**
   * 隐藏自定义modal实例
   */
  hideModal() {
    this.$_customModalNode.style.display = 'none';
  }

  /**
   * 发送关闭
   * @param scope
   * @param data
   */
  static emitClose = (scope, data) => {
    scope.$emit(Constants.EMIT.CLOSE_THIS_MODAL, data);
  };

  /**
   * 关闭所有对话框实例
   */
  static closeAllModal() {
    // ModalUtil.allCusModals.forEach(item => item.closeModal());
    // ModalUtil.allCusModals = [];
    const bodyChildren = document.body.children;
    for (let i = 0; i < bodyChildren.length; i++) {
      // 若子元素是全局modal则删除
      if (~bodyChildren[i].className.indexOf('ly-global-modal') || ~bodyChildren[i].className.indexOf('ly-global-side-modal')) {
        document.body.removeChild(bodyChildren[i]);
      }
    }
  }

  /**
   * 打开elementUI的全局提示:this.$message.info(config)
   *      - content , duration, closable
   * @param msg 信息
   * @param isControlByDebounce  是否用debounce进行限制
   */
  static openMsgInfo(msg, isControlByDebounce = true) {
    // 若没有设置message，则直接返回
    if (!msg) {
      return;
    }
    const openMsg = () => {
      this.$_messageInstance && this.$_messageInstance.close();
      this.$_messageInstance = window.$vue.$message({message: msg, showClose: true});
    };

    // 若用debounce进行限制，
    if (isControlByDebounce) {
      // 采用debounce限制弹出框，在300毫秒内，不弹出第二次
      CommonsUtil.debounce('elementUIMessage', () => {
        openMsg();
      }, Constants.MODAL_CLOSE_DURATION, true);
    } else {
      openMsg();
    }
  }

  /**
   * 打开elementUI的全局提示:this.$message.success(config)
   *      - content , duration, closable
   * @param msg 信息
   * @param isControlByDebounce  是否用debounce进行限制
   */
  static openMsgSuccess(msg, isControlByDebounce = true) {
    // 若没有设置message，则直接返回
    if (!msg) {
      return;
    }

    const openMsg = () => {
      this.$_messageInstance && this.$_messageInstance.close();
      this.$_messageInstance = window.$vue.$message({message: msg, type: 'success', showClose: true});
    };
    // 若用debounce进行限制，
    if (isControlByDebounce) {
      // 采用debounce限制弹出框，在300毫秒内，不弹出第二次
      CommonsUtil.debounce('elementUIMessage', () => {
        openMsg();
      }, Constants.MODAL_CLOSE_DURATION, true);
    } else {
      openMsg();
    }
  }

  /**
   * 打开elementUI的全局提示:this.$message.warning(config)
   *      - content , duration, closable
   * @param msg 信息
   * @param isControlByDebounce  是否用debounce进行限制
   */
  static openMsgWarning(msg, isControlByDebounce = true) {
    // 若没有设置message，则直接返回
    if (!msg) {
      return;
    }
    const openMsg = () => {
      this.$_messageInstance && this.$_messageInstance.close();
      this.$_messageInstance = window.$vue.$message({message: msg, type: 'warning', showClose: true});
    };

    // 若用debounce进行限制，
    if (isControlByDebounce) {
      // 采用debounce限制弹出框，在300毫秒内，不弹出第二次
      CommonsUtil.debounce('elementUIMessage', () => {
        openMsg();
      }, Constants.MODAL_CLOSE_DURATION, true);
    } else {
      openMsg();
    }
  }

  /**
   * 打开elementUI的全局提示:this.$message.error(config)
   *      - content , duration, closable
   * @param msg 信息
   * @param isControlByDebounce  是否用debounce进行限制
   */
  static openMsgError(msg, isControlByDebounce = true) {
    // 若没有设置message，则直接返回
    if (!msg) {
      return;
    }
    const openMsg = () => {
      this.$_messageInstance && this.$_messageInstance.close();
      this.$_messageInstance = window.$vue.$message({message: msg, type: 'error', showClose: true});
    };

    // 若用debounce进行限制，
    if (isControlByDebounce) {
      // 采用debounce限制弹出框，在300毫秒内，不弹出第二次
      CommonsUtil.debounce('elementUIMessage', () => {
        openMsg();
      }, Constants.MODAL_CLOSE_DURATION, true);
    } else {
      openMsg();
    }
  }

  /**
   * 关闭elementUI的Message
   */
  static closeAllMessage() {
    window.$vue.$message.close();
  }

  /**
   * 打开elementUI的全局loading。可以close()
   * @param msg 信息
   */
  static openLoading(msg) {
    // 若没有设置message，则直接返回
    if (!msg) {
      return;
    }
    window.$vue.$message.close();
    return window.$vue.$loading({
      lock      : true,
      text      : msg,
      background: 'rgba(0, 0, 0, 0.2)'
    });
  }

  /**
   * 弹出警告信息，过滤掉中断请求
   * @param err
   * @param defaultValue
   */
  static toastWarn(err, defaultValue = '请求失败') {
    if (err && err.message === 'interrupt') {
      return;
    }
    ModalUtil.openMsgWarning(err?.message || defaultValue);
  }

  /**
   * 弹出错误信息，过滤掉中断请求
   * @param err
   * @param defaultValue
   */
  static toastError(err, defaultValue = '请求失败') {
    if (err && err.message === 'interrupt') {
      return;
    }
    ModalUtil.openMsgError(err?.message || defaultValue);
  }

  /**
   * 显示progress Loader，顶部进度动画
   */
  static showPageLoader() {
    // 强制设置鼠标样式
    document.body.style.setProperty('cursor', 'progress', 'important');
    xAsyncSet('showProgressLoader', true);
  }

  /**
   * 隐藏progress Loader，顶部进度动画
   */
  static hidePageLoader() {
    // 移除body鼠标样式
    document.body.style.removeProperty('cursor');
    xAsyncSet('showProgressLoader', false);
  }
}
