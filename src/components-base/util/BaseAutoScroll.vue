<!--
  FileDesc  : 纵向自动滚动
  webUrl    :
  Author    : g_eno_phy (2020-08-18 13:49)
  Version   :
  Usage     :
    - template
      <BaseAutoScroll></BaseAutoScroll>
    - props
    - event
    - method

-->

<template>
  <div ref="baseAutoScroll" class="b__auto-scroll">
    <div ref="baseAutoScrollContent" class="b__auto-scroll__container" :class="{'scrolling':isScrolling}">
      <slot></slot>
    </div>
  </div>

</template>

<script>

export default {
  name    : 'BaseAutoScroll',
  props   : {
    // 经过scrollScope范围，过程时间(ms)
    duration           : {
      type   : Number,
      default: 10000
    },
    // 在duration时间内滚动的范围。('component' | 'content' | Number) component，表示该组件可视高度。content，表示整个列表。否则指定高度数字(px)
    scrollScope        : {
      type   : [Number, String],
      default: 'component'
    },
    // 鼠标划过是否暂停
    isMouseStop        : {
      type   : Boolean,
      default: true
    },
    // 是否以守护程序方式继续后台运行，默认false。当页面隐藏的时候，不会滚动
    isDaemon           : {
      type   : Boolean,
      default: false
    },
    // 是否支持鼠标滑轮控制，必须开启[:isMouseStop]，这个操作的设置才有效
    isMousewheelControl: {
      type   : Boolean,
      default: true
    },
    // 是否从底部开始滚动
    isScrollFromBottom : {
      type   : Boolean,
      default: true
    }

  },
  data() {
    return {
      isScrolling        : false, // 是否正在滚动
      isListenered       : false, // 是否设置过监听
      componentSize      : 0, // 组件高度px
      contentSize        : 0, // 内容高度px
      scrollScopeDuration: 0, // 滚动范围内，滚动结束所需要的时间px
      scrollOffsetCurrent: 0, // 当前应该滚动的高度，用于累加赋值px
      scrollSizeUnit100ms: 0, // 每100毫秒滚动的高度px
      interval           : null, // 轮循
      animateDuration    : 600
    };
  },
  computed: {
    // 滚动的百分比
    scrollPerNum() {
      const scrollPerNum = Number((this.scrollOffsetCurrent + this.componentSize) / (this.contentSize + this.componentSize) * 100).toFixed();
      return this.contentSize === 0 ? 0 : (scrollPerNum < 0 ? 0 : (scrollPerNum > 100 ? 100 : scrollPerNum));
    }
  },
  watch   : {
    scrollPerNum(v) {
      this.$emit('on-progress', v);
    }

  },
  updated() {
    this.$_addALlListener();
    if (this.$_checkForSlotContentLengthChange() && this.$refs.baseAutoScrollContent) {
      this.startScroll();
    }
  },
  mounted() {
    this.$_addALlListener();
    if (this.$_checkForSlotContentLengthChange() && this.$refs.baseAutoScrollContent) {
      this.startScroll();
    }
  },

  beforeDestroy() {
    // 停止滚动
    this.stopScroll();
    // 移除事件监听
    this.$_removeAllListener();
    // progress 置 0
    this.$emit('on-progress', 0);
  },
  methods: {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ public ] ____________________________________________________ */

    /**
     * begin scroll
     *  1. pause scroll
     *  2. calculate size
     *  3. reset scroll position
     *  4. start scroll
     */
    startScroll() {
      this.pauseScroll();
      // 若内容高度为不0.则进行滚动
      if (this.$_calculateSize() !== 0) {
        this.resetScroll();
        this.keepScroll();
      }
    },

    /**
     * stop scroll
     *  1. pause scroll
     *  2. reset scroll
     */
    stopScroll() {
      // 暂停滚动
      this.pauseScroll();
      // 重置滚动属性
      this.resetScroll();
    },
    /**
     * start scroll
     */
    keepScroll() {
      const that = this;

      if (this.interval) {
        clearInterval(this.interval);
      }
      if (!that.$refs.baseAutoScrollContent) {
        return;
      }
      // 只有初始化滚动条完毕 ，且当内容高度 大于 当前组件可视高度，才会自动滚动
      if (that.contentSize > that.componentSize) {
        that.interval = setInterval(() => {
          that.scrollOffsetCurrent = that.scrollOffsetCurrent + that.scrollSizeUnit100ms;

          // 若scrollOffsetCurrent长度超过总长度，则从组件以下区域开始
          if (that.scrollOffsetCurrent >= that.contentSize) {
            that.scrollOffsetCurrent                          = -that.componentSize;
            that.$refs.baseAutoScrollContent.style.visibility = 'hidden';
            that.isScrolling                                  = false;
            that.$emit('on-scroll-end');
          } else {
            that.$refs.baseAutoScrollContent.style.visibility = 'visible';
            //  若允许后台运行，且已经在后台，则设置动画间隔时间为0ms
            this.isScrolling                                  = !(this.isDaemon && document.visibilityState === 'hidden');
          }
          that.$refs.baseAutoScrollContent.style.transform = `translateY(${-that.scrollOffsetCurrent}px)`;
        }, that.animateDuration);
      } else {
        // 重置滚动
        that.resetScroll();
      }
    },
    /**
     * pause scroll
     */
    pauseScroll() {
      if (this.interval) {
        this.isScrolling = false;
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    /**
     * reset scroll offset
     * @param isToTop 是否定位到顶部
     */
    resetScroll(isToTop = true) {
      // 内容高度 大于 当前组件可视高度 ,且允许从底部滚动，才允许重置到底部
      if (isToTop) {
        this.scrollOffsetCurrent = 0;
      } else {
        this.scrollOffsetCurrent = this.contentSize > this.componentSize && this.isScrollFromBottom ? -this.componentSize : 0;
      }
      this.$refs.baseAutoScrollContent.style.visibility = 'hidden';
      this.isScrolling                                  = false;
      this.$refs.baseAutoScrollContent.style.transform  = `translateY(${-this.scrollOffsetCurrent}px)`;
      this.$refs.baseAutoScrollContent.style.visibility = 'visible';
    },

    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */
    /**
     * init scroll
     * @return {boolean}
     */
    $_addALlListener() {
      const that = this;
      // 若slot中没有值，则返回
      if (!that.$slots.default || !that.$slots.default[0]) {
        this.$_removeAllListener();
        return false;
      }

      if (that.$refs.baseAutoScrollContent && !that.isListenered) {
        that.isListenered = true;

        // 监听鼠标
        // 若允许鼠标划过，即停止滚动，则设置监听
        if (that.isMouseStop) {
          that.$refs.baseAutoScroll.addEventListener('mouseover', that.$_scrollMouseOver);
          that.$refs.baseAutoScroll.addEventListener('mouseout', that.$_scrollMouseOut);
          if (that.isMousewheelControl) {
            that.$refs.baseAutoScroll.addEventListener('mousewheel', that.$_scrollMouseWheel);
          }
        }
        window.addEventListener('visibilitychange', that.$_scrollVisibilityChange);
        return true;
      }
    },
    /**
     * 移除所有事件
     */
    $_removeAllListener() {
      if (this.isListenered) {
        this.isListenered = false;
        this.$refs.baseAutoScroll.removeEventListener('mouseover', this.$_scrollMouseOver);
        this.$refs.baseAutoScroll.removeEventListener('mouseout', this.$_scrollMouseOut);
        this.$refs.baseAutoScroll.removeEventListener('mousewheel', this.$_scrollMouseWheel);
        window.removeEventListener('visibilitychange', this.$_scrollVisibilityChange);
      }
    },
    /**
     * scroll mouse over
     * @param e
     */
    $_scrollMouseOver(e) {
      e.preventDefault();
      e.stopPropagation();
      this.pauseScroll();
    },
    /**
     * scroll mouse out
     * @param e
     */
    $_scrollMouseOut(e) {
      e.preventDefault();
      e.stopPropagation();
      this.keepScroll();
    },
    /**
     * scroll mouse wheel
     * @param e
     */
    $_scrollMouseWheel(e) {
      e.preventDefault();
      e.stopPropagation();
      const scrollOffsetCurrent = this.scrollOffsetCurrent + Math.floor(e.wheelDeltaY / 3);
      if (scrollOffsetCurrent > -this.componentSize && scrollOffsetCurrent < this.contentSize) {
        // 若内容高度小于等于组件高度不进行滚动 直接设置0
        this.scrollOffsetCurrent                         = this.contentSize <= this.componentSize ? 0 : scrollOffsetCurrent;
        this.$refs.baseAutoScrollContent.style.transform = `translateY(${-this.scrollOffsetCurrent}px)`;
      }
    },
    /**
     * scroll visibility change
     * @param e
     */
    $_scrollVisibilityChange(e) {
      // 若非后台运行，则当窗口可见改变的时候，进行相关操作
      if (!this.isDaemon) {
        if (document.visibilityState === 'hidden') {
          this.pauseScroll();
        } else {
          this.keepScroll();
        }
      }
    },
    /**
     * 检查slot内容高度是否改变
     * @returns {boolean}
     */
    $_checkForSlotContentLengthChange() {
      let height = 0;
      if (this.$slots.default && this.$slots.default[0] && this.$slots.default[0].elm && this.$slots.default[0].elm.offsetHeight) {
        height = Array.from(this.$slots.default).map(item => item.elm.offsetHeight).reduce((t, h) => t + h);
      }
      if (height !== this.lengthPrev) {
        this.lengthPrev = height;
        return true;
      }
      return false;
    },
    /**
     * 计算尺寸
     */
    $_calculateSize() {
      const that = this;
      // 若内容为空
      if (!that.$refs.baseAutoScrollContent) {
        that.contentSize = 0;
      } else {
        that.componentSize = that.$refs.baseAutoScroll.offsetHeight;
        that.contentSize   = that.$refs.baseAutoScrollContent.offsetHeight;

        // 计算出每100毫秒滚动的高度
        switch (that.scrollScope) {
          case 'component': // 组件高度
            that.scrollSizeUnit100ms = that.componentSize / that.duration * that.animateDuration;
            break;
          case 'content': // 整个内容高度
            that.scrollSizeUnit100ms = that.contentSize / that.duration * that.animateDuration;
            break;
          default: // 指定高度
            that.scrollSizeUnit100ms = that.scrollScope / that.duration * that.animateDuration;
            break;
        }
      }
      return that.contentSize;
    }
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ private: *,query,fetch,action,init ] ________________________ */

  }
};
</script>
<style scoped lang="less">
.b__auto-scroll {
  position : relative;
  overflow : hidden;
  height   : 100%;
  width    : 100%;

  &__container {
    display : block;
    width   : 100%;

    &:not(.scrolling) {
      transition : all 0ms linear 0ms;
    }

    &.scrolling {
      transition : all 600ms linear 0ms;
    }
  }
}

</style>
