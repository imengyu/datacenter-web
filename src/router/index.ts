import Vue from 'vue'
import Router from 'vue-router'
import IndexRedirect from '../views/web-page/IndexRedirect.vue'
import DefaultNotFound from '../views/web-page/DefaultNotFound.vue'

import Login from '../views/web-page/Login.vue'
import Logout from '../views/web-page/Logout.vue'


import About from '../views/web-page/About.vue'
import Introduction from '../views/web-page/Introduction.vue'
import ErrorPage from '../views/web-page/ErrorPage.vue'

import BackPages from '../BackPages.vue'
import FrontPages from '../FrontPages.vue'


import Index from '../views/back-page/Index.vue'
import Settings from '../views/back-page/Settings.vue'
import Devices from '../views/back-page/Devices.vue'
import Products from '../views/back-page/Products.vue'
import DeviceGroup from '../views/back-page/DeviceGroup.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: FrontPages,
      children: [
        {
          path: '',
          name: 'IndexRedirect',
          component: IndexRedirect,
          meta: { title: '正在跳转', noLoading: true }
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: { title: '登录', noLoading: true }
        },
        {
          path: 'logout',
          name: 'Logout',
          component: Logout,
          meta: { title: '登出', noLoading: true }
        },
        {
          path: 'about',
          name: 'About',
          component: About,
          meta: { title: '关于项目' }
        },
        {
          path: 'introduction',
          name: 'Introduction',
          component: Introduction,
          meta: { title: '项目介绍' }
        },
        {
          path: 'error',
          name: 'ErrorPage',
          component: ErrorPage,
          meta: { title: '错误' }
        },
      ]
    },
    {
      path: '/admin/',
      component: BackPages,
      children: [
        {
          path: '',
          name: 'Index',
          component: Index,
          meta: { 
            title: '后台首页',
          }
        },
        {
          path: 'setting',
          name: 'Settings',
          component: Settings,
          meta: { 
            title: '系统设置',
          }
        },
        {
          path: 'devices',
          name: 'Devices',
          component: Devices,
          meta: { 
            title: '设备管理',
          }
        },
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { 
            title: '产品管理',
          }
        },
        {
          path: 'groups',
          name: 'DeviceGroup',
          component: DeviceGroup,
          meta: { 
            title: '分组管理',
          }
        },
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: DefaultNotFound,
      meta: { title: '404' }
    },
    
  ]
})
