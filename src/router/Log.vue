<template>
  <div class="article-container">
    <div class="title">
      <span>情绪日志</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Log'
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