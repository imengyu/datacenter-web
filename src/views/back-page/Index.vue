<template>
  <div>
    <a-row type="flex" justify="center" align="top" :glutter="6">
      <a-col class="gutter-row" :span="4">
        <a-statistic title="产品总数" :value="0" style="margin-right: 50px">
          <template v-slot:suffix>
            <a-icon type="team" />
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <a-statistic title="设备" :value="0" style="margin-right: 50px">
          <template v-slot:suffix>
            <a-icon type="user" />
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <a-statistic title="当前在线设备" :value="0" style="margin-right: 50px">
          <template v-slot:suffix>
             <span> / 100%</span>
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <a-statistic title="设备在线时长" :value="0" style="margin-right: 50px">
          <template v-slot:suffix>
             <span> / 100%</span>
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <a-statistic title="设备消息条数" :value="123" style="margin-right: 50px">
          <template v-slot:suffix>
            <a-icon type="global" />
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="4">
        
      </a-col>
    </a-row>
    <div class="mt-5 mb-5">
      <a-skeleton avatar :paragraph="{rows: 4}" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from 'vuex-class'
import api, { CommonApiError } from "../../api";

@Component
export default class Index extends Vue {
  name = "Index";

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;

  customerCount = 0;
  customerMineCount = 0;

  mounted() {
    this.loadDatas();
  }
  loadDatas() {

  }
}
</script>

<style>

</style>
