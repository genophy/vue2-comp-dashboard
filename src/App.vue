<template>
  <div id="app">
    <BasePageLoader></BasePageLoader>
    <router-view/>
  </div>
</template>

<script>
import BasePageLoader from '@/components-base/util/BasePageLoader';

export default {
  components: {BasePageLoader}
};
</script>
<style lang="less">
@import "~element-ui/lib/theme-chalk/index.css";
@import "./assets/style/index";

body {
  overflow : auto;
}

#app {
  -webkit-font-smoothing  : antialiased;
  -moz-osx-font-smoothing : grayscale;
  color                   : #2c3e50;
  height                  : 100%;
  min-height              : 400px;
  min-width               : 1024px;
}

</style>
