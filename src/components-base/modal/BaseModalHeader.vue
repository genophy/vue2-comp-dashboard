<!--
  FileDesc  :
  Author    : g_eno_phy
  Date      : 2020-05-03 12:42
  Version   :
  Usage     :
    - template
      <BaseModalHeader></BaseModalHeader>

    - props

    - event

    - method

-->

<template>
  <div class="b__modal-header">
    <div class="title-wrapper">
      <span class="title">{{title}}</span>
    </div>
    <div class="title-op">
      <span class="btn-close" @close="handleClose">X</span>
    </div>
  </div>
</template>

<script>
export default {
  name    : 'BaseModalHeader',
  props   : {
    title      : {type: String},
    isCloseAble: {type: Boolean, default: true}
  },
  data() {
    return {};
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods : {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ public ] ____________________________________________________ */

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

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
</style>
