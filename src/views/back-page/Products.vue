<template>
  <a-layout>
    <a-layout-header style="background-color: #fff; padding: 0;">
      <a-form :form="searchForm" layout="inline" @submit="handleSearch">
        <a-form-item label="产品名称">
          <a-input v-decorator="[
              'name',
              { rules: [{ required: false }] },
            ]" />
        </a-form-item>
        <a-form-item label="产品类别">
          <a-select style="width: 120px" 
            v-decorator="[
              'type',
              { rules: [{ required: false }] },
            ]">
            <a-select-option value="1">普通产品</a-select-option>
            <a-select-option value="2">VIP 产品</a-select-option>
            <a-select-option value="3">VVIP 产品</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button html-type="reset" class="ml-2" @click="handleReset">
            清除
          </a-button>
        </a-form-item>
      </a-form>
    </a-layout-header>
    <a-layout-content style="background-color: #fff">
      <a-button type="primary" class="mb-3" @click="onAddNewProduct"><a-icon type="plus"/>创建产品</a-button>
      <a-button class="mb-3" :disabled="dataLoadStatus == 'loading'" @click="onRefesh"><a-icon type="redo"/></a-button>
      <a-config-provider>
        <template v-slot:renderEmpty>
          <empty-view v-if="searchValues.length>0" 
            text="当前搜索条件下没有数据，请尝试扩大搜索范围"
            buttonText="清除搜索条件"
            @button-click="handleReset" />
          <empty-view v-else
            text="您还没有产品哦"
            buttonText="创建产品"
            @button-click="onAddNewProduct" />
        </template>
        <a-table :columns="columns" :dataSource="data" :loading="dataLoadStatus=='loading'" 
        v-if="dataLoadStatus=='success'||dataLoadStatus=='loading'" :pagination="false" :rowKey="'id'">
          <span slot="action" slot-scope="industry, record">
            <a href="javascript:;" title="修改记录" @click="onEditProduct(record)">修改</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="修改记录" @click="onManagemenyProduct(record)">管理</a>
            <a-divider type="vertical" />
            <a href="javascript:;" title="删除记录" @click="onDeleteProduct(record)">删除</a>
          </span>
        </a-table>
      </a-config-provider>
      <a-pagination
        class="mt-3"
        v-if="dataLoadStatus=='success'||dataLoadStatus=='loading'" 
        showSizeChanger
        @change="onPageOrShowSizeChanged"
        @showSizeChange="onPageOrShowSizeChanged"
        :pageSize.sync="dataPageSize"
        v-model="dataPageIndex"
        :total="dataAllCount"
      />
      <div v-else-if="dataLoadStatus=='failed'" class="error">
        <a-icon type="exclamation-circle" />
        <h1>数据加载失败</h1>
        <a-button type="link" @click="loadAll">重试</a-button>
      </div>
    </a-layout-content>

    <a-modal :title="(editingIsNew?'添加':'编辑') + '产品'" v-model="editingData" 
      @ok="handleEditOk" @cancel="handleEditCancel" okText="保存" cancelText="取消" :maskClosable="false"
      :confirmLoading="editingSubmiting" :width="600" :destroyOnClose="false">
      <a-form :form="editForm" :layout="'horizontal'">
        <a-form-item label="产品名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input
            v-decorator="[
              'name', 
              { rules: [{ required: true, message: '请输入产品名称 !' }], },
            ]"
          />
        </a-form-item>
        <a-form-item v-if="!editingIsNew" label="产品 Key" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input
            v-decorator="[ 'productKey' ]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item label="产品类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select 
            style="width: 100%"
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '请选择产品类型!' }] },
            ]"
            placeholder="请选择产品类型"
          >
            <a-select-option value="1">普通产品</a-select-option>
            <a-select-option value="2">VIP 产品</a-select-option>
            <a-select-option value="3">VVIP 产品</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from 'vuex-class'
import api, { CommonApiError } from "../../api";
import Base64 from "../../utils/Base64";
import { Product } from "../../model/Product";
import CommonUtils from "../../utils/CommonUtils";

@Component
export default class Products extends Vue {
  name = "Products";

  @State(state => state.global.authed) authed : boolean;
  @State(state => state.global.authedUserInfo) authedUserInfo : any;

  editingData = false;
  editingIsNew = false;
  editingSubmiting = false;
  editingObject : Product = null;

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品 Key',
      dataIndex: 'productKey',
      key: 'productKey',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      key: 'action',
    },
  ];
  data : Array<Product> = [];
  dataLoadStatus : 'loading'|'success'|'failed' = 'loading';
  dataPageSize = 10;
  dataPageIndex = 1;
  dataPageCount = 0;
  dataAllCount = 0;

  isSearchMode = false;

  searchForm = null;
  editForm = null;

  searchValues = {};

  mounted() {
    this.searchForm = this.$form.createForm(this, <any>{ name: 'advanced_search' });
    this.editForm = this.$form.createForm(this, <any>{ name: 'edit_object' });
    this.loadAll();
  }

  handleSearch(e) {
    e.preventDefault();
    this.searchForm.validateFields((error, values) => {
      if(!error) {
        this.searchValues = values;
        this.loadProductPage(1);
      }
    });
  }
  handleReset() {
    this.searchForm.resetFields();
    this.searchValues = {};
    this.loadProductPage(1);
  }

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
            api.product.add(valueSolved).then((value) => {
              that.$message.info('新增产品成功！');
              that.handleEditCancel();
              that.loadProductPage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.editingSubmiting = false;
              that.$message.error('新增产品失败！' + e.errorMessage);
              resolve();
            })
          } else {
            let valueSolved = that.editingObject, i = 0, k = Object.keys(values);
            for(let c = k.length; i < c; i++) 
              that.editingObject[k[i]] = values[k[i]];
            api.product.update(that.editingObject.id, valueSolved).then((value) => {
              that.$message.info('修改产品成功！');
              that.handleEditCancel();
              that.loadProductPage(undefined);
              that.editingSubmiting = false;
              resolve();
            }).catch((e : CommonApiError) => {
              that.$message.error('修改产品失败！' + e.errorMessage);
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

  onPageOrShowSizeChanged(current, pageSize) {
    this.dataPageIndex = current;
    this.dataPageSize = pageSize;
    this.loadProductPage(undefined);
  }
  onRefesh() {
    this.dataLoadStatus = 'loading';
    setTimeout(() => this.loadProductPage(undefined), 800);
  }
  onAddNewProduct() {
    this.editingData = true;
    this.editingIsNew = true;
    this.editingObject = new Product();
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onEditProduct(record) {
    this.editingData = true;
    this.editingIsNew = false;
    this.editingObject = record;
    this.editingSubmiting = false;
    this.updateEditFromValues();
  }
  onManagemenyProduct(record) {

  }
  onDeleteProduct(record) {
    let that = this;
    this.$confirm({
      title: '你真的要删除这个产品吗?',
      content: '请注意，删除产品后将不能恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '不删除',
      onOk() {
        return new Promise((resolve, reject) => {
          api.product.delete(record.id).then((value) => {
            that.$message.info('删除产品成功！');
            that.loadProductPage(undefined);
            resolve();
          }).catch((e : CommonApiError) => {
            that.$message.error('删除产品失败：' + e.errorMessage);
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
      this.editForm.setFieldsValue({
        'name': this.editingObject.name,
        'type': this.editingObject.type,
        'productKey': this.editingIsNew ? undefined : this.editingObject.productKey,
      });
    }, 100);
  }

  //加载

  loadAll() {
    this.loadProductPage(1);
  }
  loadProductPage(page) {
    if(typeof page === 'undefined') page = this.dataPageIndex - 1;
    else page = page - 1;
    this.dataLoadStatus = 'loading';
    api.product.getPage(page, this.dataPageSize, {
      'search': CommonUtils.getSearchParams(this.searchValues)
    }).then((value) => {
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

<style>

</style>
