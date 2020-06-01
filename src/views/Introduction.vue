<template>
  <div class="text-center about">
    <h1>项目介绍</h1>
    <p>您好，欢迎来到我的项目。</p>

    <h4>关于这个项目</h4>

    <h4>关于制作者</h4>

    <p>梦欤（<a href="https://www.imyzc.com" target="_blank">www.imyzc.com</a>）</p>
    <p><a-icon type="copyright" /> 2020 梦欤 版权所有</p>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Introduction extends Vue {
  name = "Introduction";

  mounted() {
    (<any>this.$parent).headerTransparent = false;
  }
}
</script>

<style lang="scss">
.about{
  padding: 50px;
  font-size: 16px;

  h4 {
    font-size: 25px;
    font-weight: bold;
    color: #0ba6ff;
  }
  p {
    margin: 15px 0;
    font-size: 18px;
  }
  img {
    max-width: 90%;
    border: 1px solid #000;
  }
}
</style>
