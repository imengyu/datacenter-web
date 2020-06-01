import Vue from 'vue'
import Router from 'vue-router'
import IndexRedirect from '../views/IndexRedirect.vue'
import DefaultNotFound from '../views/DefaultNotFound.vue'

import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'

import Index from '../views/Index.vue'
import About from '../views/About.vue'
import Introduction from '../views/Introduction.vue'
import ErrorPage from '../views/ErrorPage.vue'

import Settings from '../views/Settings.vue'

import BackPages from '../BackPages.vue'
import FrontPages from '../FrontPages.vue'

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
          meta: { title: '后台首页' }
        },
        {
          path: 'setting',
          name: 'Settings',
          component: Settings,
          meta: { title: '系统设置' }
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
