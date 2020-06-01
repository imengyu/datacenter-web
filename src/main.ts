import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import NProgress from 'nprogress'
import $ from 'jquery'
import api from './api';

import 'ant-design-vue/dist/antd.css';
import './utils/BaseExtends'
import './assets/scss/root.scss';

Vue.use(Antd);

Vue.config.productionTip = false

let app : Vue;
let axiosInstance : AxiosInstance;

function createApp() {
  NProgress.configure({     
    easing: 'ease',  // 动画方式    
    speed: 500,  // 递增进度条的速度    
    showSpinner: false, // 是否显示加载ico    
    trickleSpeed: 200, // 自动递增间隔    
    minimum: 0.3 // 初始化时的最小百分比
  })

  //Axios
  axiosInstance = initAxios();

  /* eslint-disable no-new */
  app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
    
  //当路由进入前
  router.beforeEach((to, from , next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();

    if(!to.meta.noLoading) $('#loading').fadeIn();
    if (to.meta.title) document.title = to.meta.title + ' - Mini IoT Platform';
    else document.title = 'Mini IoT Platform';

    next();
  });
  //当路由进入后：关闭进度条
  router.afterEach(() => {  
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
    $('#loading').fadeOut();
  })

}
function initAxios() : AxiosInstance {
  let instance = axios.create();

  instance.defaults.withCredentials = true;
  /* Axios 响应的拦截器 */
  instance.interceptors.response.use(function (response) { 
    return response; 
  }, function (err) {
    console.error(err);
  });

  /* Axios 请求的拦截器，用于 api 加密 */
  instance.interceptors.request.use((config : AxiosRequestConfig) => {
    //return ApiAutoAuthUtils.autoSolveApi(config);
    console.log(`[API] ${config.method} Request ${config.url}`)
    return config;
  }, err => {
    return Promise.reject(err)
  });

  api.init(instance);
  //ApiAutoAuthUtils.autoCheckTime();
  
  return instance;
}

createApp();