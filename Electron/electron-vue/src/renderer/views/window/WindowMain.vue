<template>
  <BarLeft />
  <div class="pageBox">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import {onMounted} from 'vue';
import BarLeft from '@renderer/components/BarLeft/index.vue';
onMounted(() => {
  ipcRenderer.invoke('showWindow')
})
</script>
<style scoped lang="scss">
.pageBox {
  flex: 1;
  height: 100%;
  border-top: 1px solid #e6e6e6;
  box-sizing: border-box;
  display: flex;
  margin-top: -1px;
}
</style>
