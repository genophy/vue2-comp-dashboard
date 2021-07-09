<!--
  FileDesc  :
  Author    : g_eno_phy
  Date      : 2020-05-01 20:35
  Version   :
  Usage     :
    - template
      <BaseWrapperBox></BaseWrapperBox>

    - props

    - event
      @on-resize    {width,height}

    - method

-->

<template>
  <div ref="wrapperBoxRef" class="b__wrapper-box wrapper-box">
    <div class="wrapper-box__container">
      <slot :boxSize="boxSize" :ready="ready"></slot>
    </div>
  </div>
</template>

<script>
import { CommonsUtil } from '@/libs/util';

export default {
  name: 'BaseWrapperBox',
  data() {
    return {
      boxSize: {},
      ready  : false
    };
  },
  computed: {},
  mounted() {
    // 监听容器高度
    window.$elementResizer.listenTo(this.$refs.wrapperBoxRef, element => {
      this.$nextTick(() => {
        CommonsUtil.debounce('base-wrapper-resize_' + CommonsUtil.randomStrId(), () => {
          this.boxSize = {width: element.offsetWidth, height: element.offsetHeight};
          // 发送resize命令
          this.$emit('on-resize', this.boxSize);
          this.ready = true;
        }, 50);
      });
    });
  }
};
</script>
<style lang="less" scoped>
/*
    01.显示与浮动 (display,float)
    02.定位(position,left,z-index)
    03.尺寸(width,height)
    04.边框及相关属性（margin,padding,border,outline）
    05.字体样式(font)
    06.背景（background）
    07.其它样式(opacity,cursors,transform,...)
*/
.wrapper-box {
  position  : relative;
  height    : 100%;
  width     : 100%;

  &__container {
    position : relative;
    height   : 100%;
    width    : 100%;
  }
}
</style>
