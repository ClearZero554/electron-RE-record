import Vue from 'vue';
import Root from './root';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ipcUtil from './ipc';
import VueCookies from 'vue-cookies';
import Icon from '@/components/Icon/index';
import '@/assets/css/index.css';
import Loading from "@/components/Loading/index.vue";
Vue.use(VueCookies);
Vue.use(ElementUI);
Vue.component('Icon', Icon);
Vue.component('Loading', Loading);
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue(); // 创建全局事件总线

let loop = setInterval(() => {
  if (ipcUtil.status()) {
    clearInterval(loop);
    new Vue(Root).$mount('#app');
  }
}, 10);
