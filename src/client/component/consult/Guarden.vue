<template>
  <div class="mood-card">
    <h4 class="card-title">情绪花园</h4>
    <div class="mood-circle" :class="getMoodCircleClass(emotionData.riskLevel)">
      <div class="circle-inner">
        <p class="mood-type">{{ emotionData.primaryEmotion || '中性' }}</p>
        <p class="mood-num">{{ emotionData.emotionScore ?? 50 }}</p>
      </div>
    </div>

    <p class="mood-desc">今天感觉 {{ emotionData.label || '很不错' }}</p>

    <div class="mood-dot-group">
      <span 
        v-for="i in 5" 
        :key="i"
        class="dot" 
        :class="{ active: i <= Math.ceil((emotionData.emotionScore || 50) / 20) }"
      ></span>
    </div>

    <div class="mood-status">
      <span class="status-dot" :class="getStatusClass(emotionData.riskLevel)"></span>
      <span class="status-text">{{ getStatusText(emotionData.riskLevel) }}</span>
    </div>

    <div class="tip-box" :class="getTipBoxClass(emotionData.riskLevel)">
      <span class="heart-icon">{{ getHeartIcon(emotionData.riskLevel) }}</span>
      <div class="tip-text">
        <p>给你的小建议</p>
        <p class="tip-desc">{{ emotionData.suggestion || '情绪状态平稳' }}</p>
      </div>
    </div>

    <div v-if="emotionData.improvementSuggestions && emotionData.improvementSuggestions.length" 
         class="improve-box" 
         :class="getImproveBoxClass(emotionData.riskLevel)">
      <p class="improve-title">{{ getImproveIcon(emotionData.riskLevel) }} 治愈小行动</p>
      <ul>
        <li v-for="item in emotionData.improvementSuggestions" :key="item">
          <span class="improve-icon">✦</span>
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'Guarden'
})

const { token } = useAuthStore()

const props = defineProps<{
  id?: number
}>()

const sessionId = computed(() => {
  if (!props.id) return ''
  return `session_${props.id}`
})

// 默认数据
const defaultEmotionData = {
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: '情绪状态平稳',
  improvementSuggestions: [],
  keywords: [],
  label: '很不错',
  icon: ''
}

const emotionData = ref({ ...defaultEmotionData })

// 重置到默认状态
const resetToDefault = () => {
  emotionData.value = { ...defaultEmotionData }
}

const getStatusClass = (riskLevel: number) => {
  if (riskLevel === 0) return 'status-normal'
  if (riskLevel === 1) return 'status-warning'
  return 'status-danger'
}

const getStatusText = (riskLevel: number) => {
  const map: Record<number, string> = {
    0: '正常',
    1: '轻度',
    2: '中度',
    3: '重度'
  }
  return map[riskLevel] || '正常'
}

const getMoodCircleClass = (riskLevel: number) => {
  if (riskLevel === 0) return 'mood-normal'
  if (riskLevel === 1) return 'mood-warning'
  return 'mood-danger'
}

const getTipBoxClass = (riskLevel: number) => {
  if (riskLevel === 0) return 'tip-normal'
  if (riskLevel === 1) return 'tip-warning'
  return 'tip-danger'
}

const getImproveBoxClass = (riskLevel: number) => {
  if (riskLevel === 0) return 'improve-normal'
  if (riskLevel === 1) return 'improve-warning'
  return 'improve-danger'
}

const getHeartIcon = (riskLevel: number) => {
  if (riskLevel === 0) return '💚'
  if (riskLevel === 1) return '💛'
  return '❤️‍🩹'
}

const getImproveIcon = (riskLevel: number) => {
  if (riskLevel === 0) return '🌱'
  if (riskLevel === 1) return '🌿'
  return '🌳'
}

const fetchEmotion = async () => {
  if (!sessionId.value) {
    resetToDefault()
    return
  }
  try {
    const response = await axios.get(
      `/api/psychological-chat/session/${sessionId.value}/emotion`,
      { headers: { token } }
    )
    if (response.data.code === '200') {
      const data = response.data.data
      emotionData.value = {
        primaryEmotion: data.primaryEmotion || '中性',
        emotionScore: data.emotionScore ?? 50,
        isNegative: data.isNegative || false,
        riskLevel: data.riskLevel ?? 0,
        suggestion: data.suggestion || '情绪状态平稳',
        improvementSuggestions: data.improvementSuggestions || [],
        keywords: data.keywords || [],
        label: data.label || '很不错',
        icon: data.icon || ''
      }
    } else {
      ElMessage.error(response.data.msg || '获取失败')
    }
  } catch (error) {
    console.error('请求失败：', error)
    ElMessage.error('获取失败，请重试')
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    fetchEmotion()
  } else {
    resetToDefault()
  }
})

onMounted(() => {
  if (props.id) {
    fetchEmotion()
  } else {
    resetToDefault()
  }
})

// 暴露方法给父组件
defineExpose({
  resetToDefault
})
</script>

<style scoped>
.card-title {
  margin: 0 0 10px;
  color: #8c5230;
  font-size: 15px;
  font-weight: 600;
}
.mood-card {
  background: #fdf6e8;
  border-radius: 12px;
  padding: 16px;
}
.mood-circle {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.circle-inner {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

/* 情绪圆环颜色 */
.mood-normal .circle-inner {
  background: #f8c8e0;
}
.mood-warning .circle-inner {
  background: #f7d8a8;
}
.mood-danger .circle-inner {
  background: #f5a8a8;
}

.mood-type {
  margin: 0;
  color: #b85c8c;
  font-size: 14px;
  font-weight: 600;
}
.mood-num {
  margin: 2px 0 0;
  font-size: 22px;
  font-weight: bold;
  color: #b85c8c;
}
.mood-desc {
  text-align: center;
  color: #666;
  margin: 0 0 10px;
  font-size: 13px;
}
.mood-dot-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e8d2d8;
  transition: all 0.3s;
}
.dot.active {
  background: #f2a8bc;
  transform: scale(1.1);
}

/* 状态标签 */
.mood-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.status-normal {
  background: #52c41a;
}
.status-warning {
  background: #faad14;
}
.status-danger {
  background: #f5222d;
}
.status-text {
  font-size: 13px;
  color: #666;
}

/* 给小建议盒子 */
.tip-box {
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}
.tip-normal {
  background: #f0f7ff;
}
.tip-warning {
  background: #fff7e6;
}
.tip-danger {
  background: #fff0f0;
}

.heart-icon {
  font-size: 20px;
}
.tip-text p {
  margin: 0;
  font-size: 13px;
}
.tip-desc {
  font-size: 12px;
  color: #666;
}

/* 治愈小行动盒子 */
.improve-box {
  margin-top: 10px;
  border-radius: 8px;
  padding: 12px 14px;
  transition: all 0.3s;
}
.improve-normal {
  background: #f0f7ff;
  border-left: 3px solid #52c41a;
}
.improve-warning {
  background: #fff7e6;
  border-left: 3px solid #faad14;
}
.improve-danger {
  background: #fff0f0;
  border-left: 3px solid #f5222d;
}

.improve-title {
  font-size: 13px;
  font-weight: 600;
  color: #8c5230;
  margin: 0 0 8px 0;
}
.improve-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.improve-box ul li {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
  display: flex;
  align-items: center;
  gap: 6px;
}
.improve-icon {
  color: #f2a8bc;
  font-size: 10px;
}
</style>