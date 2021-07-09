/<!--
    FileDesc  :  确认弹框
    Author    :
    Date      :
    Version   :
    Usage     :
        - template
            <BaseConfirmModal></BaseConfirmModal>

        - props

        - event

        - method

-->

<template>
  <div :class="['b__confirm-modal', className]">
    <div class="b__confirm-modal__body">
      <p v-show="msg" class="ly-font-size-12 ly-py-16 "> {{ msg }} </p>
      <div v-show="innerHtml" class="ly-font-size-12 ly-py-16 " v-html="innerHtml"></div>
    </div>
    <div class="ly-btn-group-inline gap-none b__confirm-modal__footer ly-p-8 ">
      <el-button class="ly-btn-group-inline__item btn-reset" @click="handleCancel()">{{ btnCancelText }}</el-button>
      <el-button type="primary" class="ly-btn-group-inline__item btn-submit" :disabled="isSubmitting" @keypress.native.enter="handleOk()"
                 @click="handleOk()">
        {{ btnOkText }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { ModalUtil } from '@/libs/util';

export default {
  name : 'BaseConfirmModal',
  props: {
    // 确认按钮文字
    btnOkText: {
      type   : String,
      default: '确认'
    },
    // 取消按钮文字
    btnCancelText: {
      type   : String,
      default: '取消'
    },
    // 宽度
    className: {
      type   : String,
      default: 'ly-w-400'
    },
    // 内容信息
    msg: {
      type   : String,
      default: ''
    },
    // innerHtml
    innerHtml: {
      type   : String,
      default: ''
    }
  },
  data () {
    return {
      // 是否正在请求数据
      isSubmitting: false
    };
  },
  computed: {},
  created () {
  },
  mounted () {
  },

  methods: {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */
    /**
     * 取消，执行关闭的对话框的请求。不直接执行关闭操作
     */
    handleCancel () {
      ModalUtil.emitClose(this, false);
    },
    /**
     * 确认，执行关闭的对话框的请求。不直接执行关闭操作
     */
    handleOk () {
      this.isSubmitting = true;
      ModalUtil.emitClose(this, true);
    }
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ public ] ____________________________________________________ */

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ private: *,query,action,init ] ______________________________ */

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

.b__confirm-modal {
  &__header {
    position    : sticky;
    top         : 0;
    z-index     : 10;
    /* ly-text-center ly-font-border ly-p-t-20   ly-p-b-10*/
    text-align  : left;
    font-weight : bolder;
    font-size   : 16px;
    padding     : 24px 24px 0;
    color       : var(--color-front);
    background  : var(--color-bg);
  }

  &__body {
    overflow   : auto;
    min-height : 1rem;
    max-height : calc(80vh - 100px);
    color      : var(--color-bg);
    padding    : 8px 24px;

    &.infinite {
      max-height : none;
    }
  }

  &__footer {
    margin-top : 24px;
  }
}

</style>
