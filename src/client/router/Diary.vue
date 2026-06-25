<template>
  <div class="diary-container">
    <!-- 顶部标题栏 -->
    <header class="page-header">
      <div class="header-content">
        <span class="heart-icon">❤️</span>
        <h1>情绪日记</h1>
      </div>
    </header>

    <main class="main-content">
      <!-- 第一部分：今日情绪评分 -->
      <section class="card score-section">
        <h2 class="section-title">今日情绪评分</h2>
        <p class="section-subtitle">您今天的整体情绪状态如何？(1-10分)</p>
        <el-rate
          v-model="form.score"
          :max="10"
          show-score
          text-color="#ff9900"
          score-template="{value}"
          size="large"
          class="custom-rate"
        />
      </section>

      <!-- 第二部分：主要情绪选择 -->
      <section class="card emotion-section">
        <h2 class="section-title">主要情绪</h2>
        <div class="emotion-grid">
          <div
            v-for="item in emotions"
            :key="item.value"
            class="emotion-item"
            :class="{ active: form.selectedEmotion === item.value }"
            @click="form.selectedEmotion = item.value"
          >
            <div class="emoji-wrapper">
              <span class="emoji">{{ item.emoji }}</span>
            </div>
            <span class="label">{{ item.label }}</span>
          </div>
        </div>
      </section>

      <!-- 第三部分：详细记录 -->
      <section class="card detail-section">
        <h2 class="section-title">详细记录</h2>

        <!-- 触发因素 -->
        <div class="form-group">
          <label>情绪触发因素</label>
          <el-input
            v-model="form.trigger"
            type="textarea"
            placeholder="今天什么事情影响了您的情绪？"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </div>

        <!-- 今日感想 -->
        <div class="form-group">
          <label>今日感想</label>
          <el-input
            v-model="form.thoughts"
            type="textarea"
            placeholder="写下您今天的想法、感受或发生的有趣事情..."
            :rows="6"
            maxlength="2000"
            show-word-limit
          />
        </div>

        <!-- 底部两列选择 -->
        <div class="row-selects">
          <div class="form-group half-width">
            <label>睡眠质量</label>
            <el-select v-model="form.sleepQuality" placeholder="请选择" style="width: 100%">
              <el-option label="非常好" :value=5 />
              <el-option label="好" :value=4 />
              <el-option label="一般" :value=3 />
              <el-option label="差" :value=2 />
              <el-option label="非常差" :value=1 />
            </el-select>
          </div>
          <div class="form-group half-width">
            <label>压力水平</label>
            <el-select v-model="form.stressLevel" placeholder="请选择" style="width: 100%">
              <el-option label="无压力" :value=1 />
              <el-option label="轻微" :value=2 />
              <el-option label="中等" :value=3 />
              <el-option label="高压" :value=4 />
              <el-option label="重压" :value=5 />
            </el-select>
          </div>
        </div>

        <!-- 按钮组 -->
        <div class="action-buttons">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" color="#5c9ded" @click="submitForm">提交记录</el-button>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

defineOptions({
  name: 'Diary'
})

const { token } = useAuthStore()

// 模拟的情绪数据，包含颜色和Emoji
const emotions = [
  { label: '开心', value: '开心', emoji: '😊', color: '#fdd835' },
  { label: '平静', value: '平静', emoji: '😐', color: '#42a5f5' },
  { label: '焦虑', value: '焦虑', emoji: '😰', color: '#ef5350' },
  { label: '悲伤', value: '悲伤', emoji: '😔', color: '#78909c' },
  { label: '兴奋', value: '激动', emoji: '😃', color: '#4caf50' },
  { label: '疲惫', value: '疲倦', emoji: '😑', color: '#5c6bc0' },
  { label: '惊讶', value: '惊讶', emoji: '😮', color: '#ff9800' },
  { label: '困惑', value: '困惑', emoji: '🤔', color: '#333333' },
];

// 表单数据模型
const form = reactive({
  score: 0,
  selectedEmotion: '',
  trigger: '',
  thoughts: '',
  sleepQuality: undefined as number | undefined,
  stressLevel: undefined as number | undefined,
});

// 提交逻辑
const submitForm = () => {
  if (!form.selectedEmotion) {
    ElMessage.warning('请选择一种主要情绪');
    return;
  }
  else if (!form.score) {
    ElMessage.warning('请选择您的今日情绪评分');
    return;
  }
  else if (!form.trigger) {
    ElMessage.warning('请告诉我您的情绪契机');
    return;
  }
  else if (!form.thoughts) {
    ElMessage.warning('请描述您今天的想法');
    return;
  }
  else if (form.sleepQuality === undefined) {
    ElMessage.warning('请选择您的压力水平');
    return;
  }
  else if (form.stressLevel === undefined) {
    ElMessage.warning('请选择您的压力水平');
    return;
  }

  fetchDate()
  resetForm()
}

const fetchDate = async() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const date = `${year}-${month}-${day}`  // 2026-06-23


  let data = JSON.stringify({ 
    diaryDate: date,
    moodScore: Math.round(form.score),
    dominantEmotion: form.selectedEmotion,
    emotionTriggers: form.trigger,
    diaryContent: form.thoughts,
    sleepQuality: form.sleepQuality,
    stressLevel: form.stressLevel
   })

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/api/emotion-diary',
    headers: { 
        token, 
        'Content-Type': 'application/json'
    },
    data : data
  };
  console.log(data)
  await axios.request(config).then((response) => 
  {
    if(response.data.code === '200'){
    ElMessage.success(response.data.message);
    console.log(response)
  }else{
    ElMessage.error(response.data.message)
    }
  }).catch((error) => 
  {
    ElMessage.error('提交失败')
    console.log(error);
  });
} 

// 重置逻辑
const resetForm = () => {
  form.score = 0;
  form.selectedEmotion = '';
  form.trigger = '';
  form.thoughts = '';
  form.sleepQuality = undefined;
  form.stressLevel = undefined;
};
</script>

<style scoped>
/* 全局容器 */
.diary-container {
  min-height: 100vh;
  background-color: #f5f7fa; /* 浅灰背景 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 顶部 Header */
.page-header {
  background: linear-gradient(90deg, #bce672 0%, #e6d569 100%); /* 绿黄渐变 */
  padding: 20px 0;
  color: white;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.heart-icon {
  font-size: 24px;
  margin-right: 10px;
}

.header-content h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

/* 主内容区 */
.main-content {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.02);
  border: 1px solid #ebeef5;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-top: 0;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
}

/* 评分组件调整 */
.custom-rate {
  --el-rate-icon-size: 28px; /* 放大星星 */
}

/* 情绪网格布局 */
.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列 */
  gap: 15px;
}

@media (max-width: 600px) {
  .emotion-grid {
    grid-template-columns: repeat(2, 1fr); /* 手机端变2列 */
  }
  .row-selects {
    flex-direction: column;
    gap: 0;
  }
  .card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding-left: 12px;
  }
  .header-content h1 {
    font-size: 18px;
  }
  .main-content {
    padding: 0 8px;
    margin: 12px auto;
  }
  .action-buttons {
    flex-direction: column;
  }
  .action-buttons .el-button {
    width: 100%;
  }
}

.emotion-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.emotion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 选中状态 */
.emotion-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
  font-weight: bold;
}

.emoji-wrapper {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.emoji {
  font-size: 32px;
}

.label {
  font-size: 14px;
  color: #606266;
}

/* 表单区域 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.row-selects {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.half-width {
  flex: 1;
}

/* 按钮区域 */
.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-top: 30px;
}

.action-buttons .el-button--primary {
  /* 模仿截图中的蓝色 */
  background-color: #5c9ded;
  border-color: #5c9ded;
}
</style>


