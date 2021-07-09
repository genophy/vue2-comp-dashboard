<!--
  FileDesc  :
  webUrl    :
  Author    : g_eno_phy (2021-07-05 18:44)
  Version   :
  Usage     :
    - template
      <Main></Main>
    - props
    - event
    - method

-->

<template>
  <div class="v__main">

    <div class="header">
      <div class="title">整合项目</div>
      <div class="menus">
        <div v-for="mItem in menus" :key="mItem.name" class="menu">
          <MenuLink :menu="mItem"></MenuLink>
        </div>
      </div>
      <div class="op">
        <div class="theme-list">
          <div v-for="item in themeList" :key="item.name" :title="item.name" class="theme-item" :class="[selectedTheme]" :style="{color:item.color,backgroundColor:item.bg}"
               @click="handleClickTheme(item)"></div>
        </div>
      </div>
    </div>
    <div class="body"></div>
    <div class="footer"></div>
  </div>
</template>

<script>
import MenuLink from '@/components/menu/MenuLink';
import { CommonsUtil } from '@/libs/util';
import HttpClientUtil from '@/libs/util/http-client.util';

export default {
  name      : 'Main',
  components: {MenuLink},
  props     : {},
  data () {
    return {
      isQuerying   : false,    // 是否正在查询
      isSubmitting : false,     // 是否正在提交
      menus        : [],// 菜单
      themeList    : [
        {id: 'default', name: '默认', color: '#fff', bg: '#42b983'},
        {id: 'dark', name: '深色', color: '#fff', bg: '#222'},
        {id: 'red', name: '红色', color: '#fff', bg: '#b41414'}
      ],
      selectedTheme: 'default'
    };
  },
  computed: {},
  watch   : {},
  created () {},
  mounted () {
    HttpClientUtil.get('static/json/menu.json').then(({data}) => {
      this.menus = data;
    });
  },
  beforeDestroy () {},
  methods: {
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________________________________________________________________________ */
    /* _____________________ [ handle ] ____________________________________________________ */


    /**
     * 点击主题
     * @param theme
     */
    handleClickTheme (theme) {
      this.selectedTheme = theme.id;
      CommonsUtil.setWebsiteInfo({theme: theme.id});
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
.header {
  display          : flex;

  height           : 80px;
  width            : 100%;

  color            : var(--color-front);
  background-color : var(--color-bg);

  .title {
    padding     : 0 32px;
    height      : 80px;
    line-height : 80px;
    font-size   : 32px;
    font-weight : 800;

  }
}

.menus {
  display     : flex;
  align-items : center;
  flex-grow   : 1;
}

.op {
  display     : flex;
  align-items : center;
}

.theme-list {
  display     : flex;
  align-items : center;
  padding     : 0 32px;

  .theme-item {
    width         : 32px;
    height        : 32px;
    margin        : 4px;
    border-radius : 50%;
    border        : 2px solid #fff;
    cursor        : pointer;

    &.selected {
      transform : scale(1.2);
    }
  }
}
</style>
