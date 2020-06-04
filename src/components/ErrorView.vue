<template>
  <div class="error">
    <a-icon type="exclamation-circle" />
    <h1>{{text}}</h1>
    <p>{{errText}}</p>
    <a-button @click="$emit('retry')">{{buttonText}}</a-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";


@Component
export default class EmptyView extends Vue {

  @Prop({default:'数据加载失败'}) text : string;
  @Prop({default:'未知错误'}) errText : string;
  @Prop({default:'重试'}) buttonText : string;

}
</script>

