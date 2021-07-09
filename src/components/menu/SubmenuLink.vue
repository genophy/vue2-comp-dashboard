<!--
  FileDesc  :
  webUrl    :
  Author    : g_eno_phy (2021-07-06 11:05)
  Version   :
  Usage     :
    - template
      <SubmenuLink></SubmenuLink>
    - props
    - event
    - method

-->

<template>
  <div class="c__submenu-link" @mouseenter="mouseEnter = true" @mouseleave="mouseEnter = false">
    <div class="menu" @click="handleClickMenu(menu)">
      <span class="name">{{ menu.name }}</span>
    </div>
    <div v-if=" menu.children && menu.children.length > 0" class="submenu">
      <transition name="slider">
        <div v-if="mouseEnter" class="submenu-container">
          <SubmenuLink v-for="mItem in menu.children" :key="mItem.name" :menu="mItem" @click="handleClickMenu"></SubmenuLink>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name : 'SubmenuLink',
  props: {
    menu: {
      type: Object
    }
  },
  data () {
    return {
      isQuerying  : false,    // 是否正在查询
      isSubmitting: false,    // 是否正在提交
      mouseEnter  : false
    };
  },
  computed: {},
  watch   : {},
  created () {},
  mounted () {
  },
  beforeDestroy () {},
  methods: {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */
    handleClickMenu (menu) {
      this.mouseEnter = false;
      this.$emit('click', menu);
    }
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
.c__submenu-link {
  position : relative;

  .menu {
    position : relative;

    .name {
      display     : block;
      padding     : 0 24px;
      height      : 40px;
      line-height : 40px;
      font-size   : 16px;
      font-weight : 800;
      color       : var(--color-front-sub);
      background  : var(--color-bg);
      text-align  : center;
      word-break  : keep-all;
      white-space : nowrap;
      cursor      : pointer;


    }

    &:hover {
      .name {
        color : var(--color-front);
      }

    }
  }

  .submenu {
    display    : block;
    position   : absolute;
    z-index    : 11;
    top        : 0;
    right      : 2px;
    background : var(--color-bg);
    transform  : translateX(100%);

    .submenu-container {
      border-left    : 2px solid var(--color-border-lite);
      padding-bottom : 16px;
    }
  }
}

.slider-enter-active {
  transform-origin : top left;
  transition       : all .3s linear;
}

.slider-leave-active {
  transform-origin : top left;
  transition       : all .1s linear;
}

.slider-enter, .slider-leave-to {
  transform : rotateX(90deg);
}
</style>
