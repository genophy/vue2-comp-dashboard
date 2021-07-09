<!--
  FileDesc  : 顶部进度动画
  webUrl    :
  Author    : g_eno_phy (2020-06-29 09:45)
  Version   :
  Usage     :
    - template
      <BasePageLoader></BasePageLoader>
    - props
    - event
    - method

-->

<template>
  <div class="b__page-loader">
    <div v-show="showProgressLoader" class="progress"></div>
  </div>
</template>

<script>
import { xComputed } from '@/libs/x-store';

export default {
  name    : 'BasePageLoader',
  props   : {},
  data() {
    return {
      isQuerying  : false,    // 是否正在查询
      isSubmitting: false     // 是否正在提交
    };
  },
  computed: {
    showProgressLoader: xComputed('showProgressLoader')
  },
  watch   : {},
  created() {},
  mounted() {
  },
  beforeDestroy() {},
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
.b__page-loader {
  position       : fixed;
  top            : 0;
  left           : 0;
  width          : 100vw;
  max-height     : 4px;
  z-index        : 9999;
  overflow       : hidden;
  pointer-events : none;

  .progress {
    width            : 200vw;
    height           : 4px;
    background-image : linear-gradient(to right, #409eff, #fff, #409eff, #fff, #409eff);
    animation        : p-anime 2s linear infinite;
  }
}

@keyframes p-anime {
  from {
    transform : translateX(-50%);
  }
  to {
    transform : translateX(0%);
  }
}
</style>
