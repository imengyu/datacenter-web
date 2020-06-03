<template>
  <a-layout class="admin-main">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" v-model="menuSelectKeys" @click="menuClicked">
        <a-menu-item v-for="(item, i) in appMenu" :key="i.toString()">
          <a-icon :type="item.icon" />
          <span>{{item.title}}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout class="main">
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <a-dropdown>
          <div class="admin-head">
            <user-head v-if="authed && authedUserInfo" :src="authedUserInfo.userhead"></user-head>
            <span v-if="authed && authedUserInfo">{{authedUserInfo.name}}</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link to="/admin/setting">系统设置</router-link>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">个人中心</a>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/logout">退出登录</router-link>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px', marginBottom: '10px' }"
      >
        <router-view v-if="authInfoLoaded" />
      </a-layout-content>
      <a-layout-footer style="text-align: center; padding: 10px;padding-top: 0;">
        © 2020 梦欤 版权所有
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from 'vuex-class'
import UserHead from './components/UserHead.vue';
import $ from 'jquery'

@Component(<any>{
  components: {
    'user-head': UserHead
  }
})
export default class BackPages extends Vue {
  name = "BackPages";
  collapsed = false;

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;
  @State(state => state.global.authedUserName) authedUserName : any;

  menuSelectKeys : Array<string> = [];
  authInfoLoaded = false;

  onAuthInfoLoaded(authed : boolean) {
    if(!authed) {
      $('#loading').fadeIn()
      this.$router.push({ path: '/login?redirect_to=' + this.$route.path })
    }else{
      this.authInfoLoaded = true;
      $('#loading').fadeOut();
    }
  }

  mounted() {
    this.getMenuDefSelectIndex();
  }

  @Watch("$route")
  onRouteChanged() {
    this.getMenuDefSelectIndex();
  }

  appMenu = [
    {
      path: '/admin/',
      title: '数据总览',
      icon: 'home'
    },
    {
      path: '/admin/products',
      title: '产品管理',
      icon: 'appstore'
    },
    {
      path: '/admin/devices',
      title: '设备管理',
      icon: 'control'
    },
    {
      path: '/admin/groups',
      title: '分组管理',
      icon: 'tags'
    },
    {
      path: '/admin/auth-types',
      title: '认证管理',
      icon: 'unlock'
    },
    {
      path: '/admin/get-data',
      title: '数据获取',
      icon: 'bar-chart'
    },
    {
      path: '/admin/setting',
      title: '系统设置',
      icon: 'setting'
    },
    {
      path: '/logout',
      title: '退出登录',
      icon: 'arrow-left'
    },
  ];

  getMenuDefSelectIndex() {
    let path = this.$route.path;
    for (let i = 0; i < this.appMenu.length; i++) {
      if(this.appMenu[i].path == path) {
        this.menuSelectKeys = [ i.toString() ];
        break;
      }
    }
    return this.menuSelectKeys;
  }
  menuClicked(v : { item, key, keyPath }) {
    if(this.appMenu[parseInt(v.key)].path == '/logout') {
      let that = this;
      this.$confirm({
        title: '您想要退出登录吗?',
        okText: '退出登录',
        cancelText: '不退出',
        onOk() { that.$router.push({ path: '/logout' }) },
        onCancel() { that.getMenuDefSelectIndex() },
      });
    }else {
      this.$router.push({ path: this.appMenu[parseInt(v.key)].path });
    }
  } 

}
</script>

<style lang="scss">

.admin-main {

  position: relative;
  height: 100%;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    :hover {
      color: #1890ff;
    }
  }
  .logo {
    height: 32px;
    background-image: url('./assets/images/logo-white.svg');
    background-repeat: no-repeat;
    background-position: center;
    margin: 16px;
    color: #fff;
    text-transform: uppercase;
  }

  .admin-head {
    float: right;
    margin-right: 30px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
      user-select: none;
    }
    img {
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
  }
}
</style>

