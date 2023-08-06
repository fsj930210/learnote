<template>
  <div class="MessageBord">
    <BarTop />
  </div>
</template>
<script setup lang="ts">
import BarTop from '@renderer/components/BarTop/index.vue';
</script>

<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
