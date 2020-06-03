<template>
  <div class="empty-view">
    <img src="../assets/images/empty.svg" style="width: auto;height: 100px;" />
    <p class="text-secondary">{{text}}</p>
    <a-button type="primary" @click="$emit('button-click')">{{buttonText}}</a-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";


@Component
export default class EmptyView extends Vue {

  @Prop({default:'暂无数据'}) text : string;
  @Prop({default:'刷新'}) buttonText : string;

}
</script>

<style lang="scss">
.empty-view {
  text-align: center; 
  padding: 65px 10px;
}
</style>

