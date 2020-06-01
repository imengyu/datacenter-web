<template>
  <div class="log-outer">
    <div class="log-bg"></div>
    <div v-if="authed && authedUserInfo" class="log-box authed">
      <user-head :src="authedUserInfo.head_img"></user-head>
      <h4>{{ authedUserName }}</h4>
      <span>您已经登录</span>
      <a-button type="primary" block @click="doRedirectBack">前往控制台</a-button>
      <a-button class="mt-2" block @click="goSignOut">退出登录</a-button>
    </div>
    <div v-else-if="!authed && !signInRedirecting" class="log-box">
      <div class="log-title">
        <h1>用户登录</h1>
        <span>SIGN IN</span>
      </div>
      <a-form class="log-form" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
              },
            ]"
            placeholder="用户名/手机号/邮箱"
          ><a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" /></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ],
              },
            ]"
            type="password"
            placeholder="密码"
          ><a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" /></a-input>
        </a-form-item>           
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            记住我
          </a-checkbox>

          <a-button type="primary" html-type="submit" class="login-form-button" :loading="signInSubmiting">
            {{signInSubmiting?'正在登录':'登录'}}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div v-else class="log-box loading">
      <div class="css-loading small"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from 'vuex-class';
import md5 from 'md5';
import api, { CommonApiError, CommonApiResult } from "../api";
import UserHead from '../components/UserHead.vue';
import { WrappedFormUtils } from "ant-design-vue/types/form/form";
import CommonUtils from "../utils/CommonUtils";
import constConfig from "../const/Const";

@Component(<any>{
  components: {
    'user-head': UserHead
  }
})
export default class Login extends Vue {
  name = "Login";
  form : WrappedFormUtils | null = null;
  signInSubmiting = false;
  signInRedirecting = false;

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;
  @State(state => state.global.authedUserName) authedUserName : any;

  mounted() {
    this.form = this.$form.createForm(this, <any>{ name: 'normal_login' });
    (<any>this.$parent).headerTransparent = true;
  }
  handleSubmit(e) {
    if(e) e.preventDefault();
    if(this.form) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.signInSubmiting = true;
          var valuesSolved = {
            name: values.username,
            password: md5(values.password),
            remember: values.remember,
          }
          api.auth.login(valuesSolved).then((data : CommonApiResult) => {    
            var userId = data.data.userId;
            if(data.code == 200) {

              //设置Cookie
              CommonUtils.setCookieWithPathAndExpireSec(data.data.authTokenName, data.data.authToken, new URL(api.config.getApiPath()).host, data.data.expireSecond);

              //重载信息
              this.$store.dispatch('global/requestReloadAuthStatus');
              this.signInSubmiting = false;
              this.signInRedirecting = true;

              setTimeout(() =>{
                this.doRedirectBack();
              }, 800)
              
            }
            
          }).catch((errData : CommonApiError) => {
            this.signInSubmiting = false;
            if(errData.networkError) {
              this.$error({ title: '登录失败', content: '请检查您的网络连接？' + errData.errorMessage, });
            }else {
              if(errData.errorApiData.code == 462)
                this.$error({
                  title: '登录失败',
                  content: '用户名或密码错误'
                })
              else if(errData.errorApiData.code == 463)
                this.$error({
                  title: '登录失败',
                  content: '您已被封禁，无法登录，请联系管理员解封'
                })
              else{
                const h = this.$createElement;
                this.$error({
                  title: '登录失败',
                  content: h('div', [
                    h('span', { style: 'text-ailgn: center' }, errData.errorApiData.message),
                  ]),
                });
                if(this.form) { this.form.resetFields(); }

              }
            }
          })
        }
      });
    }
  }

  doRedirectBack() {
    if(this.$route.query && this.$route.query.redirect_to) 
      this.$router.push(<string>this.$route.query.redirect_to);
    else 
      this.$router.push('/admin/');
  }
  goSignOut() {
    this.$router.push({ path: '/logout' });
  }
}
</script>
