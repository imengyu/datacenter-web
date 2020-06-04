<template>
  <div>
    <a-row v-show="currentShowDeviceId == 0 && dataDeviceInfo" type="flex" justify="center" align="top" :glutter="6">
      <a-col class="gutter-row" :span="6">
        <a-statistic title="设备总数" :value="dataDeviceInfo.allCount" style="margin-right: 50px">
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <a-statistic :value="dataDeviceInfo.activatedCount" style="margin-right: 50px">
          <template v-slot:title>
             <a-badge color="cyan" text="已激活设备" />
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <a-statistic :value="dataDeviceInfo.connectedCount" style="margin-right: 50px">
          <template v-slot:title>
            <a-badge color="green" text="当前在线设备" />
          </template>
        </a-statistic>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <!--<a-statistic title="设备在线时长" :value="0" style="margin-right: 50px">
          <template v-slot:suffix>
             <span> / 100%</span>
          </template>
        </a-statistic>-->
      </a-col>
    </a-row>
    <device-list ref="deviceList" v-show="currentShowDeviceId == 0" class="mt-3"
      :currentShowId="currentShowDeviceId" @on-manage-item="onManageItem"></device-list>
    <div v-show="currentShowDeviceId > 0">

      <div class="mb-3">
        <a-button type="primary" @click="onBackUp"><a-icon type="arrow-left" />返回上一级</a-button>
        <h3 v-if="currentShowDevice" class="ml-3 disply-inline-block">{{ currentShowDevice.name }}</h3>
      </div>

      <div v-if="currentShowDeviceLoadStatus=='loading'" class="center-view" :style="{ height:'400px' }"><a-spin /></div>
      <error-view v-else-if="currentShowDeviceLoadStatus=='failed'" :errText="currentShowDeviceLoadErr" class="error" @retry="loadAll" />

      <div v-if="currentShowDeviceLoadStatus=='success'" class="mt-2">
        <a-tabs type="card" default-active-key="1">
          <a-tab-pane key="1" tab="设备信息">
            <div v-if="currentShowDevice" class="prop-card">
              <a-row :gutter="16">
                <a-col :span="12">
                  <div class="inline-show-prop block">
                    <label>产品名称</label>
                    <div>{{ currentShowDeviceProduct.name }}</div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>产品 Key</label>
                    <div>
                      {{ currentShowDeviceProduct.productKey }}
                      <a href="javascript:void(0)" type="link" class="ml-2" 
                        v-clipboard:copy="currentShowDeviceProduct.productKey"
                        v-clipboard:success="() => $message.success('已复制到剪贴板！')"
                        v-clipboard:error="() => $message.failed('您的浏览器不支持复制剪贴板，请手动复制')"
                      >复制</a>
                    </div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>设备名称</label>
                    <div>
                      {{ currentShowDevice.name }}
                      <a href="javascript:void(0)" type="link" class="ml-2" 
                        v-clipboard:copy="currentShowDevice.name"
                        v-clipboard:success="() => $message.success('已复制到剪贴板！')"
                        v-clipboard:error="() => $message.failed('您的浏览器不支持复制剪贴板，请手动复制')"
                      >复制</a>
                    </div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>设备 SecretKey</label>
                    <div>
                      **********
                      <a href="javascript:void(0)" type="link" class="ml-2" >查看</a>
                    </div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>设备备注名称</label>
                    <div>
                      {{ currentShowDevice.remarks }}
                       <a href="javascript:void(0)" type="link" class="ml-2" 
                        v-clipboard:copy="currentShowDevice.remarks"
                        v-clipboard:success="() => $message.success('已复制到剪贴板！')"
                        v-clipboard:error="() => $message.failed('您的浏览器不支持复制剪贴板，请手动复制')"
                      >复制</a>
                    </div>
                  </div>
                  
                  
                </a-col>
                <a-col :span="12">
                  <div class="inline-show-prop block">
                    <label>创建时间</label>
                    <div>{{ currentShowDevice.createAt }}</div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>激活时间</label>
                    <div>{{currentShowDevice.activateTime}}</div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>最后上线时间</label>
                    <div>{{currentShowDevice.lastUpTime}}</div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>当前连接 IP 地址</label>
                    <div>{{currentShowDevice.currentConnectIp}}</div>
                  </div>
                  <div class="inline-show-prop block">
                    <label>当前状态</label>
                    <div>
                      <a-badge v-if="currentShowDevice.nowState==0" status="warning" text="未激活" />
                      <a-badge v-else-if="currentShowDevice.nowState==1" status="error" text="未上线" />
                      <a-badge v-else-if="currentShowDevice.nowState==2" status="success" text="已上线" />
                      <a-badge v-else-if="currentShowDevice.nowState==3" status="default" text="已禁用" />
                    </div>
                  </div>

                  
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="设备数据">
            
          </a-tab-pane>
        </a-tabs>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from 'vuex-class'
import api, { CommonApiError, LoadStatus } from "../../api";
import DeviceList from "../../components/DeviceList.vue";
import { Product } from "../../model/Product";
import { Device } from "../../model/Device";

@Component({
  components: {
    'device-list': DeviceList
  }
})
export default class Products extends Vue {
  name = "Products";

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;

  currentShowDeviceId = 0;
  currentShowDevice : Device | null = null;
  currentShowDeviceProduct : Product | null = null;
  currentShowDeviceLoadStatus : LoadStatus = 'notload';
  currentShowDeviceLoadErr = '';

  dataDeviceInfo = null;

  mounted() {
    this.loadDatas();
  }
  loadDatas() {
    api.device.getAllDeviceOverview().then((d) => this.dataDeviceInfo = d.data)
    .catch((e) => this.$message.error("加载数据失败！" + e)) 
  }
  loadCurrentItem() {
    this.currentShowDeviceLoadStatus = 'loading';
    api.device.get(this.currentShowDeviceId).then((d) => {
      this.currentShowDevice = d.data;
      api.product.get(this.currentShowDevice.productId).then((d) => {
        this.currentShowDeviceProduct = d.data;
        this.currentShowDeviceLoadStatus = 'success';
      }).catch((e) => {
        this.currentShowDeviceLoadStatus = 'failed';
        this.currentShowDeviceLoadErr = e;
      })
    }).catch((e) => {
      this.currentShowDeviceLoadStatus = 'failed';
      this.currentShowDeviceLoadErr = e;
    })
  }

  onBackUp() {
    this.currentShowDeviceId = 0;
  }
  onManageItem(id : number) {
    this.currentShowDeviceId = id;
    this.loadCurrentItem();
  }


}
</script>

<style>

</style>
