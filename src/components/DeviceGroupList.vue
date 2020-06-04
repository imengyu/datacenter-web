<template>
  <a-layout>
    <a-layout-header style="background-color: #fff; padding: 0;">
      <!--搜索表单-->
      <a-form :form="searchForm" layout="inline" @submit="handleSearch">
        <a-form-item>
          <a-button type="primary" @click="onAddNewDeviceGroup"><a-icon type="plus"/>新建分组</a-button>
          <a-button  class="ml-2 mr-2" :disabled="dataLoadStatus == 'loading'" @click="onRefesh"><a-icon type="redo"/></a-button>
        </a-form-item>
        <a-form-item label="输入分组名称查询">
          <a-input v-decorator="[
              'name',
              { rules: [{ required: false }] },
            ]" />
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
            text="这里还没有分组哦"
            buttonText="创建分组"
            @button-click="onAddNewDeviceGroup" />
        </template>
        <!--表格-->
        <a-table :columns="columns" :dataSource="data" :loading="dataLoadStatus=='loading'" 
        v-if="dataLoadStatus=='success'||dataLoadStatus=='loading'" :pagination="false" :rowKey="'id'">
          <span slot="action" slot-scope="industry, record">
            <a href="javascript:;" title="修改记录" @click="onEditDeviceGroup(record)">修改</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="修改记录" @click="onManagemenyDeviceGroup(record)">管理</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="删除记录" @click="onDeleteDeviceGroup(record)">删除</a>
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
    <!--添加编辑分组对话框-->
    <a-modal :title="(editingIsNew?'添加':'编辑') + '分组'" v-model="editingData" 
      @ok="handleEditOk" @cancel="handleEditCancel" okText="保存" cancelText="取消" :maskClosable="false"
      :confirmLoading="editingSubmiting" :width="600" :destroyOnClose="false">
      <a-form :form="editForm" :layout="'horizontal'">
        <a-form-item label="分组名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input
            :disabled="!editingIsNew"
            v-decorator="[
              'name', 
              { rules: [{ required: true, message: '请输入分组名称 !' }], },
            ]"
          />
        </a-form-item>
        <a-form-item label="父分组" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-tree-select
            style="width: 100%"
            :disabled="!editingIsNew"
            v-decorator="[ 'parentId', ]"
            placeholder="选择父分组，留空则为顶级分组"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data-simple-mode="true"
            :tree-data="treeGroupsData"
            :load-data="onLoadDeviceGroupTreeData"
          />
        </a-form-item>
        <a-form-item label="备注" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
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
import { DeviceGroup } from "../model/DeviceGroup";
import { State } from "vuex-class";
import { TreeNode } from "ant-design-vue/types/tree-node";


@Component
export default class DeviceGroupList extends Vue {

  @Prop({default:0}) currentShowId : number;

  @Watch('currentShowId')
  onCurrentShowIdChanged() {
    this.loadDeviceGroupPage(1);
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
  editingObject : DeviceGroup = null;

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分组ID',
      dataIndex: 'identifier',
      key: 'identifier',
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

  treeGroupsDataRoot = [ { id: 0, pId: null, value: '0', title: '顶级分组' }, ];
  treeGroupsData = this.treeGroupsDataRoot;

  data : Array<DeviceGroup> = [];
  dataLoadStatus : 'loading'|'success'|'failed' = 'loading';
  dataPageSize = 10;
  dataPageIndex = 1;
  dataPageCount = 0;
  dataAllCount = 0;

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
        this.loadDeviceGroupPage(1);
      }
    });
  }
  handleSearchReset() {
    this.searchForm.resetFields();
    this.searchValues = {};
    this.loadDeviceGroupPage(1);
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
            api.deviceGroup.add(valueSolved).then((value) => {
              that.$message.info('新增分组成功！');
              that.handleEditCancel();
              that.loadDeviceGroupPage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.editingSubmiting = false;
              that.$message.error('新增分组失败！' + e.errorMessage);
              resolve();
            })
          } else {
            let valueSolved = that.editingObject, i = 0, k = Object.keys(values);
            for(let c = k.length; i < c; i++) 
              that.editingObject[k[i]] = values[k[i]];
            api.deviceGroup.update(that.editingObject.id, valueSolved).then((value) => {
              that.$message.info('修改分组成功！');
              that.handleEditCancel();
              that.loadDeviceGroupPage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.$message.error('修改分组失败！' + e.errorMessage);
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
    this.loadDeviceGroupPage(undefined);
  }
  onRefesh() {
    this.dataLoadStatus = 'loading';
    setTimeout(() => this.loadDeviceGroupPage(undefined), 800);
  }
  onAddNewDeviceGroup() {
    this.treeGroupsData = this.treeGroupsDataRoot;
    this.editingData = true;
    this.editingIsNew = true;
    this.editingObject = new DeviceGroup();
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onEditDeviceGroup(record : DeviceGroup) {
    this.editingData = true;
    this.editingIsNew = false;
    this.editingObject = record;
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onManagemenyDeviceGroup(record : DeviceGroup) {
    this.$emit('on-current-show-changed', record.id);
  }
  onDeleteDeviceGroup(record : DeviceGroup) {
    let that = this;
    this.$confirm({
      title: '你真的要删除这个分组吗?',
      content: '请注意，删除分组将会删除其下所有分组，此操作不能恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '不删除',
      onOk() {
        return new Promise((resolve, reject) => {
          api.deviceGroup.delete(record.id).then((value) => {
            that.$message.info('删除分组成功！');
            that.loadDeviceGroupPage(undefined);
            resolve();
          }).catch((e : CommonApiError) => {
            that.$message.error('删除分组失败：' + e.errorMessage);
            reject(e.errorMessage);
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  //更新表单

  updateEditFromValues() {
    setTimeout(() => {
      //请求当前对应条目的Tree数据
      if(this.editingObject.parentId == 0 || this.editingObject.parentId == null) 
        this.treeGroupsData = this.treeGroupsDataRoot;
      else {
        api.deviceGroup.get(this.editingObject.parentId).then((value) => {
          var data : DeviceGroup = value.data;
          this.treeGroupsData = [
            { id: data.id, pId: null, value: data.id.toString(), title: data.name }
          ];
        });
      }
      //设置表单
      this.editForm.setFieldsValue({
        'name': this.editingObject.name,
        'parentId': this.editingObject.parentId, 
        'remarks': this.editingObject.remarks,
      });
    }, 200);
  }

  //加载

  loadAll() {
    this.loadDeviceGroupPage(1);
  }
  loadDeviceGroupPage(page) {
    if(typeof page === 'undefined') page = this.dataPageIndex - 1;
    else page = page - 1;
    this.dataLoadStatus = 'loading';

    let searchData = { 'search': CommonUtils.getSearchParams(this.searchValues) };

    ((this.currentShowId == 0 || this.currentShowId == null) ? 
      api.deviceGroup.getPage(page, this.dataPageSize, searchData)
      : api.deviceGroup.getPageByParentId(this.currentShowId, page, this.dataPageSize, searchData)).then((value) => {
      
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
  onLoadDeviceGroupTreeData(treeNode : TreeNode) {
    return new Promise(resolve => {
      const id = parseInt(treeNode.value);
      setTimeout(() => {
        if(id == null || id == this.editingObject.parentId) {
          resolve();
          return;
        }
        (id == 0 ? 
          api.deviceGroup.getTreeDataCurrentUserId()
          : api.deviceGroup.getTreeDataCurrentByParentId(id)).then((value) => {
          var data = [];
          value.data.forEach(element => {
            if(id != 0 || element.parentId == 0)
              data.push({
                id: element.id,
                pId: id,
                value: element.id,
                title: element.name
              })
          });
          this.treeGroupsData = this.treeGroupsData.concat(data);
          resolve();
        }).catch((e) => {
          this.$message.error('加载数据失败：' + e);
          resolve();
        })
      }, 200);
    });
  }

}
</script>

<style lang="scss">
.empty-view {
  text-align: center; 
  padding: 65px 10px;
}
</style>

