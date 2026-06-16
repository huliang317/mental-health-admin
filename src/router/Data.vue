<template>
  <div class="card-list">
    <Card2
      v-for="item in card2List"
      :key="item.id"
      :icon-name="item.icon"
      :icon-bg-color="item.bgColor"
      :title="item.text1"
      :number="item.num"
      :foot-text="item.footText"
      :foot-value="item.renum"
    />
  </div>
</template>

<script lang="ts" setup>
import Card1 from '@/component/data/Card1.vue';
import Card2 from '@/component/data/Card2.vue';
import { reactive } from 'vue';

defineOptions({
  name: 'Data'
})

// 建议统一类型
let card2List = reactive([
    { 
      id: 'licard01', 
      text1: '总用户数', 
      num: 3, 
      renum: 1, 
      footText: '活跃用户',
      icon: 'UserFilled',
      bgColor: '#9e51e7'
    },
    { 
      id: 'licard02', 
      text1: '情绪日志', 
      num: 2, 
      renum: 0, 
      footText: '今日新增',
      icon: 'Notebook',
      bgColor: '#409eff'
    },
    { 
      id: 'licard03', 
      text1: '咨询会话', 
      num: 8, 
      renum: 0, 
      footText: '进行中',
      icon: 'ChatDotRound',
      bgColor: '#e6a23c'
    },
    { 
      id: 'licard04', 
      text1: '平均情绪', 
      num: '7/10', 
      renum: '情绪健康指数', 
      footText: '健康指数',
      icon: 'Star',
      bgColor: '#67c23a'
    },
])
</script>

<style scoped>
.card-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>