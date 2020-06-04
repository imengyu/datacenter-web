<template>
  <div>
    <device-group-list v-if="currentEditGroupId==null||currentEditGroupId==0" @on-current-show-changed="onCurrentShowChanged" :currentShowId="0"></device-group-list>
    <div v-else>
      <div v-if="currentEditGroupLoadStatus=='loading'" class="center-view" :style="{ height:'400px' }"><a-spin /></div>
      <error-view v-else-if="currentEditGroupLoadStatus=='failed'" :errText="currentEditGroupLoadErr" class="error" @retry="loadAll" />
      
      <a-button type="primary" @click="onBackUp" class="mb-3"><a-icon type="arrow-left" />返回上一级</a-button>

      <div v-if="currentEditGroup" class="prop-card">
        <a-row :gutter="16">
          <a-col :span="10">
            <div class="inline-show-prop">
              <label>分组名称</label>
              <div>{{ currentEditGroup.name }}</div>
            </div>
            <div class="inline-show-prop">
              <label>分组ID</label>
              <div>
                {{ currentEditGroup.identifier }}
                <a href="javascript:void(0)" type="link" class="ml-2" 
                  v-clipboard:copy="currentEditGroup.identifier"
                  v-clipboard:success="() => $message.success('已复制到剪贴板！')"
                  v-clipboard:error="() => $message.failed('您的浏览器不支持复制剪贴板，请手动复制')"
                >复制</a>
              </div>
            </div>
            <div class="inline-show-prop">
              <label>创建时间</label>
              <div>{{ currentEditGroup.createAt }}</div>
            </div>
            
          </a-col>
          <a-col :span="4">
            <div class="inline-show-prop">
              <label>设备总数</label>
              <div>0</div>
            </div>
            <div class="inline-show-prop">
              <label>激活设备</label>
              <div>0</div>
            </div>
            <div class="inline-show-prop">
              <label>当前在线</label>
              <div>0</div>
            </div>
          </a-col>
          <a-col :span="10">
            <div class="inline-show-prop">
              <label>分组描述</label>
              <div>
                {{ currentEditGroup.remarks }}
                <a href="javascript:void(0)" type="link" class="ml-2" 
                  @click="$refs.childGroupList.onEditDeviceGroup(currentEditGroup)">编辑</a>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="currentEditGroupLoadStatus=='success'" class="mt-2">
        <a-tabs type="card" default-active-key="1">
          <a-tab-pane key="1" tab="子分组列表">
            <device-group-list ref="childGroupList" @on-current-show-changed="onCurrentShowChanged" :currentShowId="currentEditGroupId"></device-group-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="设备列表">
            
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
import Base64 from "../../utils/Base64";
import CommonUtils from "../../utils/CommonUtils";
import { DeviceGroup } from "../../model/DeviceGroup";
import DeviceGroupList from "../../components/DeviceGroupList.vue";

@Component({
  components: {
    'device-group-list': DeviceGroupList
  }
})
export default class DeviceGroups extends Vue {
  name = "DeviceGroups";

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;

  currentEditGroupId : number | null = null;
  currentEditGroup : DeviceGroup = null;
  currentEditGroupLoadStatus : LoadStatus = 'notload';
  currentEditGroupLoadErr = '';

  mounted() {
    this.onRouteChanged();
  }

  onCurrentShowChanged(newId) {
    this.currentEditGroupId = newId;
    if(this.currentEditGroupId &&  this.currentEditGroupId > 0)
      this.loadCurrentEditGroupInfo();
  }
  @Watch("currentEditGroupId")
  onCurrentEditGroupIdChanged() {
    
  }
  @Watch("$route")
  onRouteChanged() {
    if(typeof this.$route.query.edit === 'string')
      this.currentEditGroupId = parseInt(this.$route.query.edit);
    else this.currentEditGroupId = null;
  }

  onBackUp() {
    this.onCurrentShowChanged(this.currentEditGroup == null ? 0 : this.currentEditGroup.parentId);
  }

  loadCurrentEditGroupInfo() {
    this.currentEditGroupLoadStatus = 'loading';
    api.deviceGroup.get(this.currentEditGroupId).then((v) => {
      this.currentEditGroup = v.data;
      this.currentEditGroupLoadStatus = 'success';
    }).catch((e) => {
      this.currentEditGroupLoadStatus = 'failed';
      this.currentEditGroupLoadErr = e;
    })
  }


}
</script>

<style>

</style>
