import Vue from 'vue';
import VueRouter from 'vue-router';

// 屏蔽路由错误
const originalPush    = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

VueRouter.prototype.push    = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path    : '/',
    redirect: '/Home'
  },
  {
    path     : '/home',
    name     : 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path    : '**',
    name    : '404',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

// 路由反转，可用于设置水印
router.beforeResolve((to, from, next) => {
  next();
});

export default router;
