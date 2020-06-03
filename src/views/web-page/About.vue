<template>
  <div class="text-center about">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component 
export default class About extends Vue {
  name = "About";

  mounted() {
    this.$store.dispatch('global/setHeaderTransparent', false);
  }

}
</script>

<style>
.about{
  padding: 50px;
  font-size: 16px;
}
</style>
