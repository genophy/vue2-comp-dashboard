<!--
  FileDesc  :
  webUrl    :
  Author    : g_eno_phy (2021-07-06 10:44)
  Version   :
  Usage     :
    - template
      <MenuLink></MenuLink>
    - props
    - event
    - method

-->

<template>
  <div class="c__menu-link " @mouseenter="mouseEnter=true" @mouseleave="mouseEnter=false">
    <div class="menu" @click="handleClickMenu(menu)">
      <span class="name">{{ menu.name }}</span>
    </div>
    <div v-if=" menu.children && menu.children.length > 0" class="submenu">
      <div class="ly-relative">
        <transition name="slider">
          <div v-if="mouseEnter" class="submenu-container">
            <SubmenuLink v-for="mItem in menu.children" :key="mItem.name" :menu="mItem" @click="handleClickMenu"></SubmenuLink>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import SubmenuLink from '@/components/menu/SubmenuLink';

export default {
  name      : 'MenuLink',
  components: {SubmenuLink},
  props     : {
    // 菜单
    menu: {type: Object}
  },
  data () {
    return {
      isQuerying  : false,    // 是否正在查询
      isSubmitting: false,     // 是否正在提交
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
.c__menu-link {
  position : relative;

  .menu {
    position : relative;

    .name {
      display     : block;
      padding     : 0 32px;
      height      : 60px;
      line-height : 60px;
      font-size   : 18px;
      font-weight : 800;
      text-align  : center;
      color       : var(--color-front-sub);
      background  : var(--color-bg);
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


}

.submenu {
  display    : block;
  position   : absolute;
  z-index    : 10;
  left       : 50%;
  top        : 60px;
  background : var(--color-bg);
  transform  : translateX(-50%);

  .submenu-container {
    //border-top     : 2px solid var(--color-border-lite);
    padding-bottom : 16px;
  }
}

.slider-enter-active {
  transform-origin : top left;
  transition       : all .3s ease;
}

.slider-leave-active {
  transform-origin : top left;
  transition       : all .1s linear;
}

.slider-enter, .slider-leave-to {
  transform : translateY(-16px) rotateX(90deg);
}
</style>
