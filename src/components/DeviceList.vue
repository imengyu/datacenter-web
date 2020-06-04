<template>
  <a-layout>
    <a-layout-header style="background-color: #fff; padding: 0;">
      <!--搜索表单-->
      <a-form :form="searchForm" layout="inline" @submit="handleSearch">
        <a-form-item>
          <a-button type="primary" @click="onAddNewDevice"><a-icon type="plus"/>新建设备</a-button>
          <a-button class="ml-2 mr-2" :disabled="dataLoadStatus == 'loading'" @click="onRefesh"><a-icon type="redo"/></a-button>
        </a-form-item>
        <a-form-item>
          <a-select
            show-search
            v-decorator="[ 'productId', ]"
            placeholder="选择所属产品，输入可以筛选"
            option-filter-prop="children"
            style="width: 210px"
            :filter-option="filterOption"
          >
            <a-select-option v-for="d in dataProductList" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="[
              'name',
              { rules: [{ required: false }] },
            ]"
            placeholder="输入设备名称查询" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="[
              'remarks',
              { rules: [{ required: false }] },
            ]"
            placeholder="输入设备备注查询" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button html-type="reset" class="ml-2" @click="handleSearchReset">
            清除
          </a-button>
        </a-form-item>
      </a-form>
    </a-layout-header>
    <a-layout-content style="background-color: #fff">
      <a-config-provider>
        <template v-slot:renderEmpty>
          <empty-view v-if="Object.keys(searchValues).length>0" 
            text="当前搜索条件下没有数据，请尝试扩大搜索范围"
            buttonText="清除搜索条件"
            @button-click="handleSearchReset" />
          <empty-view v-else
            text="这里还没有设备哦"
            buttonText="创建设备"
            @button-click="onAddNewDevice" />
        </template>
        <!--表格-->
        <a-table :columns="columns" :dataSource="data" :loading="dataLoadStatus=='loading'" 
          v-if="dataLoadStatus=='success'||dataLoadStatus=='loading'" :pagination="false" :rowKey="'id'">

          <span slot="product" slot-scope="record">
            <show-in-list v-model="record.productId" usePropValue="name" :list="dataProductList" />
          </span>

          <span slot="state" slot-scope="record">
            <a-badge v-if="record.nowState==0" status="warning" text="未激活" />
            <a-badge v-else-if="record.nowState==1" status="error" text="未上线" />
            <a-badge v-else-if="record.nowState==2" status="success" text="已上线" />
            <a-badge v-else-if="record.nowState==3" status="default" text="已禁用" />

            <a-switch class="ml-2" :default-checked="record.enable_state" @change="onEditDeviceState(record)" />
          </span>
          <span slot="action" slot-scope="record">
            <a href="javascript:;" title="修改记录" @click="onEditDevice(record)">修改</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="修改记录" @click="onManagemenyDevice(record)">管理</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="删除记录" @click="onDeleteDevice(record)">删除</a>
          </span>
        </a-table>
      </a-config-provider>
      <!--分页-->
      <a-pagination
        class="mt-3"
        v-if="dataLoadStatus=='success'||dataLoadStatus=='loading'" 
        showSizeChanger
        @change="onPageOrShowSizeChanged"
        @showSizeChange="onPageOrShowSizeChanged"
        :pageSize.sync="dataPageSize"
        v-model="dataPageIndex"
        :total="dataAllCount"
      ></a-pagination>
      <error-view v-else-if="dataLoadStatus=='failed'" class="error" @retry="loadAll" />
    </a-layout-content>
    <!--添加编辑设备对话框-->
    <a-modal :title="(editingIsNew?'添加':'编辑') + '设备'" v-model="editingData" 
      @ok="handleEditOk" @cancel="handleEditCancel" okText="保存" cancelText="取消" :maskClosable="false"
      :confirmLoading="editingSubmiting" :width="600" :destroyOnClose="false">
      <a-form :form="editForm" :layout="'horizontal'">
        <a-form-item label="设备名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input
            :disabled="!editingIsNew"
            v-decorator="[
              'name', 
              { rules: [{ required: true, message: '请输入设备名称 !' }], },
            ]"
          />
        </a-form-item>
        <a-form-item label="属于产品" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select
            show-search
            :disabled="!editingIsNew"
            v-decorator="[ 'productId', { rules: [{ required: true, message: '请选择设备所属产品 !' }], },]"
            placeholder="选择产品，输入可以筛选"
            option-filter-prop="children"
            style="width: 210px"
            :filter-option="filterOption"
          >
            <a-select-option v-for="d in dataProductList" :key="d.id">
              {{ d.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-textarea
            v-decorator="[ 'remarks' ]"
            :maxLength="100"
            placeholder="输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

      </a-form>
    </a-modal>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import api, { CommonApiError } from "../api";
import CommonUtils from "../utils/CommonUtils";
import { Device } from "../model/Device";
import { State } from "vuex-class";
import { TreeNode } from "ant-design-vue/types/tree-node";
import { Product } from "../model/Product";


@Component
export default class DeviceList extends Vue {

  @Prop({default:0}) currentShowId : number;

  @Watch('currentShowId')
  onCurrentShowIdChanged() {
    if(this.currentShowId != 0) this.searchValues['productId'] = this.currentShowId;
    else this.searchValues['productId'] = undefined;
    this.loadDevicePage(1);
  }
  mounted() {
    this.searchForm = this.$form.createForm(this, <any>{ name: 'advanced_search' });
    this.editForm = this.$form.createForm(this, <any>{ name: 'edit_object' });
    this.loadAll()
  }

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;

  editingData = false;
  editingIsNew = false;
  editingSubmiting = false;
  editingObject : Device = null;

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '所属产品',
      scopedSlots: { customRender: 'product' },
      key: 'productId',
    },
    {
      title: '状态/启用',
      scopedSlots: { customRender: 'state' },
      key: 'state',
    },
    {
      title: '最后上线时间',
      dataIndex: 'lastUpTime',
      key: 'lastUpTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      key: 'action',
    },
  ];

  treeGroupsDataRoot = [ { id: 0, pId: null, value: '0', title: '顶级设备' }, ];
  treeGroupsData = this.treeGroupsDataRoot;

  data : Array<Device> = [];
  dataLoadStatus : 'loading'|'success'|'failed' = 'loading';
  dataPageSize = 10;
  dataPageIndex = 1;
  dataPageCount = 0;
  dataAllCount = 0;

  dataProductList : Array<Product> = [];

  isSearchMode = false;

  searchForm = null;
  editForm = null;

  searchValues = {};

  //搜索表单事件

  handleSearch(e) {
    e.preventDefault();
    this.searchForm.validateFields((error, values) => {
      if(!error) {
        this.searchValues = values;
        this.loadDevicePage(1);
      }
    });
  }
  handleSearchReset() {
    this.searchForm.resetFields();
    this.searchValues = {};
    this.loadDevicePage(1);
  }
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  //表单编辑事件

  handleEditOk() {
    let that = this;
    that.editingSubmiting = true;
    return new Promise((resolve, reject) => {
      this.editForm.validateFields((error, values) => {
        if(error) reject(error);
        else {
          if(this.editingIsNew) {
            //数据处理
            let valueSolved = that.editingObject, i = 0, k = Object.keys(values);
            for(let c = k.length; i < c; i++) 
              that.editingObject[k[i]] = values[k[i]];
            api.device.add(valueSolved).then((value) => {
              that.$message.info('新增设备成功！');
              that.handleEditCancel();
              that.loadDevicePage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.editingSubmiting = false;
              that.$message.error('新增设备失败！' + e.errorMessage);
              resolve();
            })
          } else {
            let valueSolved = that.editingObject, i = 0, k = Object.keys(values);
            for(let c = k.length; i < c; i++) 
              that.editingObject[k[i]] = values[k[i]];
            api.device.update(that.editingObject.id, valueSolved).then((value) => {
              that.$message.info('修改设备成功！');
              that.handleEditCancel();
              that.loadDevicePage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.$message.error('修改设备失败！' + e.errorMessage);
              that.editingSubmiting = false;
              resolve();
            })
          }
        }
        resolve();
      });
    }).catch(() => that.editingSubmiting = false);
  }
  handleEditCancel() {
    this.editingData = false;
    this.editingIsNew = false;
    this.editingObject = null;
    this.editingSubmiting = false;
  }

  //操作事件

  onPageOrShowSizeChanged(current : number, pageSize : number) {
    this.dataPageIndex = current;
    this.dataPageSize = pageSize;
    this.loadDevicePage(undefined);
  }
  onRefesh() {
    this.dataLoadStatus = 'loading';
    setTimeout(() => this.loadDevicePage(undefined), 800);
  }
  onAddNewDevice() {
    this.treeGroupsData = this.treeGroupsDataRoot;
    this.editingData = true;
    this.editingIsNew = true;
    this.editingObject = new Device();
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onEditDeviceState(record : Device) {
    api.device.updateDeviceEnableState(record.id, record.enableState != 1).then(() => {
      this.$message.success('更新设备状态成功！');
      this.onUpdateDeviceRecord(record);
    }).catch((e) => {
      this.$message.error('更新设备状态失败！' + e);
    })
  }
  onEditDevice(record : Device) {
    this.editingData = true;
    this.editingIsNew = false;
    this.editingObject = record;
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onManagemenyDevice(record : Device) {
    this.$emit('on-manage-item', record.id);
  }
  onDeleteDevice(record : Device) {
    let that = this;
    this.$confirm({
      title: '你真的要删除这个设备吗?',
      content: '请注意，此操作不能恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '不删除',
      onOk() {
        return new Promise((resolve, reject) => {
          api.device.delete(record.id).then((value) => {
            that.$message.info('删除设备成功！');
            that.loadDevicePage(undefined);
            resolve();
          }).catch((e : CommonApiError) => {
            that.$message.error('删除设备失败：' + e.errorMessage);
            reject(e.errorMessage);
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }
  onUpdateDeviceRecord(record : Device) {
    api.device.get(record.id).then((d) => {
      record.nowState = d.data.nowState;
      record.lastUpTime = d.data.lastUpTime;
      record.currentConnectIp = d.data.currentConnectIp;
    }).catch((e) => {
      this.$message.error('更新设备状态数据失败！' + e);
    })
  }

  //更新表单

  updateEditFromValues() {
    setTimeout(() => {
      //设置表单
      this.editForm.setFieldsValue({
        'name': this.editingObject.name,
        'productId': (this.editingIsNew && this.currentShowId > 0) ? this.currentShowId : this.editingObject.productId, 
        'remarks': this.editingObject.remarks,
      });
    }, 200);
  }

  //加载

  loadAll() {
    this.loadDevicePage(1);
    this.loadProductList();
  }
  loadProductList() {
    api.product.getListDataCurrentUserId().then((d) => {
      this.dataProductList = d.data;
    }).catch((e) => {
      this.$error({
        title: '错误',
        content: '加载数据失败：' + e
      });
    })
  }
  loadDevicePage(page) {
    if(typeof page === 'undefined') page = this.dataPageIndex - 1;
    else page = page - 1;
    this.dataLoadStatus = 'loading';

    let searchData = { 'search': CommonUtils.getSearchParams(this.searchValues) };

    api.device.getPage(page, this.dataPageSize, searchData).then((value) => {
      
      this.dataPageIndex = value.data.number + 1;
      this.dataPageCount = value.data.totalPages;
      this.dataAllCount = value.data.totalElements;
      this.data = value.data.content;
      this.dataLoadStatus = 'success';

    }).catch((e : CommonApiError) => {
      this.dataLoadStatus = 'failed';
      this.$error({
        title: '加载数据失败',
        content: e.errorMessage
      })
    })
  }

}
</script>

<style lang="scss">
.empty-view {
  text-align: center; 
  padding: 65px 10px;
}
</style>

