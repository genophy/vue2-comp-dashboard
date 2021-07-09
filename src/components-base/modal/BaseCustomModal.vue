<!--
  FileDesc  : 自定义弹框
  Author    : g_eno_phy
  Date      : 2020-05-03 12:49
  Version   :
  Usage     :
    - template
      <BaseCustomModal></BaseCustomModal>

    - props

    - event

    - method

-->

<template>
  <div ref="BaseCustomModalRef" class="b__custom-modal" :style="{width:compWidth,height:compHeight }">
    <div v-if="componentConfig.title" ref="titleRef" class="modal-header">
      <div class="title">{{ componentConfig.title }}</div>
      <div class="op-group">
        <div v-if="componentConfig.isShowBtnClose" class="op-item el-icon-close" @click="handleClose(false)"></div>
      </div>
    </div>
    <keep-alive :exclude="excludeList">
      <div ref="BaseCustomModalContainerRef" class="modal-body">
      </div>
    </keep-alive>
  </div>
</template>

<script>
import Vue from 'vue';
import { ModalUtil, Constants } from '@/libs/util';

export default {
  name : 'BaseCustomModal',
  props: {
    // 组件配置
    componentConfig: {type: Object}
  },
  data() {
    return {
      customInstance: null,
      excludeList   : []
    };
  },
  computed: {
    compWidth() {
      return this.componentConfig?.width || 'unset';
    },
    compHeight() {
      return this.componentConfig?.height || 'unset';
    }
  },
  created() {
  },
  /**
   *
   */
  mounted() {
    // 生成组件
    this.$_generateComponent(this.$options.propsData);
    // 设置对话框可移动
    this.$_setModalMoveAble();
  },
  beforeDestroy() {
    if (this.customInstance) {
      this.customInstance.$destroy();
      this.customInstance = null;
    }
  },
  methods: {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */
    handleClose(v) {
      // MODAL_CLOSE_FLAG 有弹框页面设置，若设置了，则返回设置的值，若值为true，则关闭后返回 emitClose 为 true
      ModalUtil.emitClose(this, this.customInstance?.MODAL_CLOSE_FLAG || v);
    },
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ public ] ____________________________________________________ */

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

    /**
     * 生成组件
     */
    $_generateComponent(propsData) {
      // 获取配置
      const propsTemp = window.$lodash.cloneDeep(propsData);
      // 去除componentConfig
      delete propsTemp.componentConfig;
      // 生成component
      const CustomComponent = Vue.extend(this.componentConfig.component);
      this.excludeList      = [this.componentConfig.component.name];
      this.customInstance   = new CustomComponent({
        propsData: propsTemp,
        router   : window.$router,
        store    : window.$xStore.xInstance
      });

      this.customInstance.$once(Constants.EMIT.CLOSE_THIS_MODAL, (value) => {
        ModalUtil.emitClose(this, value);
      });
      this.customInstance.$mount();
      // 子组件增加 is-modal 样式，需要在$mount()后执行
      this.customInstance.$el.classList.add('ly-is-modal');
      this.$refs.BaseCustomModalContainerRef.appendChild(this.customInstance.$el);
    },
    /**
     * 设置对话框可移动
     */
    $_setModalMoveAble() {
      // 设置对话框可移动
      if (this.$refs.titleRef) {
        const oTitle = this.$refs.titleRef;
        const oModal = this.$refs.BaseCustomModalRef;
        oTitle.addEventListener('mousedown', function (ev) {
          const oEvent = ev || event;
          oEvent.preventDefault();
          oModal.style.cursor  = 'move';
          const distanceX      = oEvent.clientX - oModal.offsetLeft;
          const distanceY      = oEvent.clientY - oModal.offsetTop;
          document.onmousemove = function (ev) {
            const oEvent = ev || event;
            oEvent.preventDefault();
            let _x, _y;
            _x = oEvent.clientX - distanceX;
            _y = oEvent.clientY - distanceY;
            if (_x < 0) _x = 0;
            if (_x > (document.body.clientWidth - oModal.offsetWidth)) _x = (document.body.clientWidth - oModal.offsetWidth);

            if (_y < 0) _y = 0;
            if (_y > document.body.clientHeight - oModal.offsetHeight) _y = document.body.clientHeight - oModal.offsetHeight;

            oModal.style.left = _x + 'px';
            oModal.style.top  = _y + 'px';
          };
          document.onmouseup   = function (ev) {
            const oEvent = ev || event;
            oEvent.preventDefault();
            oModal.style.cursor  = 'default';
            // 存储位置区域比列或者具体数据
            document.onmousemove = null;
            document.onmouseup   = null;
          };
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
/*
    01.显示与浮动 (display,float)
    02.定位(position,left,z-index)
    03.尺寸(width,height)
    04.边框及相关属性（margin,padding,border,outline）
    05.字体样式(font)
    06.背景（background）
    07.其它样式(opacity,cursors,transform,...)
*/

.b__custom-modal {
  position  : absolute;
  min-width : 400px;
  display   : flex;
  flex-flow : column nowrap;

  &:not(.center) {
    /*left      : 50%;*/
    /*top       : 100px;*/
    /*transform : translateX(-50%);*/
  }

  &.center {
    /*left      : 50%;*/
    /*top       : 50%;*/
    /*transform : translate(-50%, -50%);*/
  }

  .modal-header {
    position         : sticky;
    top              : 0;
    z-index          : 10;
    flex-shrink      : 0;
    display          : flex;
    flex-flow        : row nowrap;
    align-items      : center;
    background-color : var(--bg-modal-header);
    user-select      : none;

    .title {
      flex-grow   : 1;
      height      : 30px;
      line-height : 30px;
      padding     : 0 16px;
      color       :  var(--color-text);
    }

    .op-group {
      flex-shrink : 0;

      .op-item {
        padding : 0 8px;
        color   : var(--color-text);
        cursor  : pointer;
      }
    }

  }

  .modal-body {
    flex-grow  : 1;
    position   : relative;
    max-height : 100vh;
    overflow   : auto;
  }
}

</style>
