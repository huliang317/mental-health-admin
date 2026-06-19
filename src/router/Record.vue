<template>
  <div class="article-container">
    <div class="title">
      <span>咨询记录</span>
    </div>
  </div>
  <div>
    <Recordlist />
  </div>
</template>

<script lang="ts" setup>
import Recordlist from '@/component/Record/Recordlist.vue';

defineOptions({
  name: 'Record'
})
</script>

<style scoped>
.title {
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.article-container {
  padding: 10px;
}
</style>