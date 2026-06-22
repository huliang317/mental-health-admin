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
    <Card1 v-if="emotionTrend.length > 0"
           :userActivity="userActivity" 
           :consultationStats="consultationStats" 
           :emotionTrend="emotionTrend" 
    />
  </div>
</template>

<script lang="ts" setup>
import Card1 from '@/component/data/Card1.vue';
import Card2 from '@/component/data/Card2.vue';
import axios from 'axios'
import { ref,reactive,onMounted,computed } from 'vue';
import { useAuthStore } from '@/stores/auth'

defineOptions({
  name: 'Data'
})

const card2 = ref({
  totalUsers: '加载中',          // 总用户数
  activeUsers: '加载中',          // 活跃用户
  totalDiaries: '加载中',           // 总日记数
  totalSessions: '加载中',      // 总会话数
  avgMoodScore: '加载中',           // 平均情绪评分
  todayNewUsers: '加载中',          // 今日新增用户
  todayNewDiaries: '加载中',        // 今日新增日记
  todayNewSessions: '加载中'       // 今日新增会话
})
let emotionTrend = ref<any[]>([])
let consultationStats = ref({})
let userActivity = ref([{}])

let card2List =computed(() =>[
    { 
      id: 'licard01', 
      text1: '总用户数', 
      num: card2.value.totalUsers, 
      renum: card2.value.activeUsers, 
      footText: '活跃用户',
      icon: 'UserFilled',
      bgColor: '#9e51e7'
    },
    { 
      id: 'licard02', 
      text1: '情绪日志', 
      num: card2.value.totalDiaries, 
      renum: card2.value.todayNewDiaries, 
      footText: '今日新增',
      icon: 'Notebook',
      bgColor: '#409eff'
    },
    { 
      id: 'licard03', 
      text1: '咨询会话', 
      num: card2.value.totalSessions, 
      renum: card2.value.todayNewSessions, 
      footText: '进行中',
      icon: 'ChatDotRound',
      bgColor: '#e6a23c'
    },
    { 
      id: 'licard04', 
      text1: '平均情绪', 
      num: `${card2.value.avgMoodScore}/10`, 
      renum: '情绪健康指数', 
      footText: '健康指数',
      icon: 'Star',
      bgColor: '#67c23a'
    },
])
let card1list = ''

onMounted(()=>{
  const { token } = useAuthStore()

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '/api/data-analytics/overview',
    headers: { 
        token
    }
  };

  axios.request(config)
  .then((response) => {
    //  console.log(response.data);
     card2.value = response.data.data.systemOverview
     emotionTrend.value = response.data.data.emotionTrend
     consultationStats.value = response.data.data.consultationStats
     userActivity.value = response.data.data.userActivity
    //  console.log(emotionTrend.value,consultationStats.value,userActivity.value)
  })
  .catch((error) => {
    console.log(error);
  });
})

</script>

<style scoped>
.card-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>