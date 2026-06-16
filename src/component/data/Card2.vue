<template>
  <el-card class="card">
    <el-icon class="people" :style="{ backgroundColor: iconBgColor }">
      <component :is="iconName" />
    </el-icon>
    <div class="info">
      <span class="title">{{ title }}</span>
      <p class="number">{{ number }}</p>
      <span class="foot">{{ footText }}: {{ footValue }}</span>
    </div>
  </el-card>
</template>


<script lang="ts" setup>
import { ref } from 'vue';

defineOptions({
  name: 'Card2'
})
let total_num = ref('')
let reactive_num = ref('')

defineProps({
  // 图标名称（字符串）
  iconName: {
    type: String,
    default: 'UserFilled'
  },
  iconBgColor: {
    type: String,
    default: '#9e51e7'
  },
  title: String,
  number: [Number, String],
  footText: String,
  footValue: [Number, String]
})

</script>

<style scoped>
.card {
  width: 23%;
  height: 120px;
}

:deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 16px;
}

.people {
  font-size: 48px;
  background-color: #9e51e7;
  border-radius: 12px;
  padding: 10px;
  color: #fff;
}

.info {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 三行均匀分布 */
}

.title {
  color: #8b9090;
  font-size: 14px;
  margin-top: 5px;
}

.number {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.foot {
  color: #8b9090;
  font-size: 12px;
  margin-bottom: 5px;
}
</style>