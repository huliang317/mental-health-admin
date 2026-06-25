<template>
  <div class="table-scroll">
    <el-table :data="tableData || []" row-key="id" stripe style="width: 100%">
    <el-table-column prop="id" label="ID" width="80" align="center" />
    <el-table-column prop="username" label="用户" width="120" align="center" />
    <el-table-column prop="diaryDate" label="记录日期" width="120" align="center" />
    
    <!--  情绪评分  -->
    <el-table-column label="情绪评分" width="180" align="center">
      <template #default="scope">
        <el-rate 
          v-model="scope.row.moodScore" 
          disabled 
          :max="10"
          :colors="['#F56C6C', '#E6A23C', '#67C23A']"
          :void-color="'#DCDFE6'"
        />
        <span style="margin-left: 8px; font-size: 13px; font-weight: 600; color: #303133;">
          {{ scope.row.moodScore }}/10
        </span>
      </template>
    </el-table-column>
    
    <el-table-column label="生活指标" width="160" align="center">
      <template #default="scope">
        <div class="life-indicators">
          <span>🛌 睡眠: {{ scope.row.sleepQuality }}/5</span>
          <span>📊 压力: {{ scope.row.stressLevel }}/5</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="emotionTriggers" label="情绪触发因素" min-width="120" align="center">
      <template #default="scope">
        <span>{{ scope.row.emotionTriggers || '-' }}</span>
      </template>
    </el-table-column>
    
    <el-table-column prop="diaryContentPreview" label="日记内容" min-width="150" align="center">
      <template #default="scope">
        <span>{{ scope.row.diaryContentPreview || '-' }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="操作" width="150" align="center" fixed="right">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDetail(scope.row)">
          详情
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>

    <!-- 空状态 -->
    <template #empty>
      <div class="empty-state">
        <div class="empty-text">暂无相关记录</div>
      </div>
    </template>
  </el-table>
  </div>

  <!-- 详情弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="📖 日记详情"
    width="90%"
    style="max-width: 520px" 
    append-to-body
    :close-on-click-modal="true"
  >
    <div v-if="currentDetail" class="detail-content">
      <!-- 头部信息 -->
      <div class="detail-header">
        <div class="detail-user">
          <span class="user-avatar">👤</span>
          <span class="user-name">{{ currentDetail.username }}</span>
        </div>
        <div class="detail-date">{{ currentDetail.diaryDate }}</div>
      </div>

      <!-- 情绪评分 -->
      <div class="detail-section">
        <div class="section-title">😊 情绪评分</div>
        <div class="section-body score-row">
          <el-rate 
            v-model="currentDetail.moodScore" 
            disabled 
            :max="10"
            :colors="['#F56C6C', '#E6A23C', '#67C23A']"
            :void-color="'#DCDFE6'"
            :size="28"
          />
          <span class="score-number">{{ currentDetail.moodScore }}/10</span>
        </div>
      </div>

      <!-- 生活指标 -->
      <div class="detail-section">
        <div class="section-title">📊 生活指标</div>
        <div class="section-body indicators-row">
          <div class="indicator-item">
            <span class="indicator-label">睡眠质量</span>
            <el-progress 
              :percentage="(currentDetail.sleepQuality || 0) * 20" 
              :color="sleepColor(currentDetail.sleepQuality)"
              :stroke-width="8"
            />
            <span class="indicator-value">{{ currentDetail.sleepQuality }}/5</span>
          </div>
          <div class="indicator-item">
            <span class="indicator-label">压力水平</span>
            <el-progress 
              :percentage="(currentDetail.stressLevel || 0) * 20" 
              :color="stressColor(currentDetail.stressLevel)"
              :stroke-width="8"
            />
            <span class="indicator-value">{{ currentDetail.stressLevel }}/5</span>
          </div>
        </div>
      </div>

      <!-- 情绪触发因素 -->
      <div v-if="currentDetail.emotionTriggers" class="detail-section">
        <div class="section-title">🎯 情绪触发因素</div>
        <div class="section-body">
          <el-tag type="warning" size="large" effect="plain">
            {{ currentDetail.emotionTriggers }}
          </el-tag>
        </div>
      </div>

      <!-- 主导情绪 -->
      <div v-if="currentDetail.dominantEmotion" class="detail-section">
        <div class="section-title">💡 主导情绪</div>
        <div class="section-body">
          <el-tag :type="getEmotionType(currentDetail.dominantEmotion)" size="large" effect="dark" round>
            {{ currentDetail.dominantEmotion }}
          </el-tag>
        </div>
      </div>

      <!-- 日记内容 -->
      <div class="detail-section">
        <div class="section-title">📝 日记内容</div>
        <div class="section-body">
          <div class="diary-content">
            {{ currentDetail.diaryContent || currentDetail.diaryContentPreview || '暂无内容' }}
          </div>
        </div>
      </div>

      <!-- AI分析状态 -->
      <div class="detail-section">
        <div class="section-title">🤖 AI分析状态</div>
        <div class="section-body">
          <el-tag 
            :type="currentDetail.aiAnalysisStatus === 'COMPLETED' ? 'success' : 'info'" 
            size="large"
            round
          >
            {{ currentDetail.aiAnalysisStatus === 'COMPLETED' ? '✅ 已完成' : '⏳ 等待分析' }}
          </el-tag>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false" size="large">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

defineOptions({
  name: 'Loglist'
})

const props = defineProps<{
  tableData: any[]
}>()

const { token } = useAuthStore()

// 弹窗
const dialogVisible = ref(false)
const currentDetail = ref<any>(null)

// 睡眠颜色
const sleepColor = (value: number) => {
  if (value >= 4) return '#67C23A'
  if (value >= 3) return '#E6A23C'
  return '#F56C6C'
}

// 压力颜色
const stressColor = (value: number) => {
  if (value <= 2) return '#67C23A'
  if (value <= 3) return '#E6A23C'
  return '#F56C6C'
}

// 情绪标签颜色
const getEmotionType = (emotion: string) => {
  const map: Record<string, string> = {
    '开心': 'success',
    '平静': 'info',
    '焦虑': 'warning',
    '悲伤': 'danger',
    '愤怒': 'danger'
  }
  return map[emotion] || 'info'
}

const handleDetail = (row: any) => {
  dialogVisible.value = true
  currentDetail.value = row
  console.log(row)
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${row.username}」的日记记录吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await axios.delete(`/api/emotion-diary/admin/${row.id}`, {
      headers: { token }
    })

    if (response.data.code === '200' || response.data.success === true) {
      ElMessage.success('删除成功！')
      emit('refresh')
    } else {
      ElMessage.error(response.data.msg || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败：', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

const emit = defineEmits<{
  (e: 'refresh'): void
}>()
</script>

<style scoped>
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.life-indicators {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #303133;
}

.life-indicators span {
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 30px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

/* 详情弹窗样式 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.user-avatar {
  font-size: 24px;
}

.detail-date {
  color: #909399;
  font-size: 14px;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.section-body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-number {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.indicators-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.indicator-label {
  font-size: 13px;
  color: #606266;
  min-width: 60px;
}

.indicator-item .el-progress {
  flex: 1;
}

.indicator-value {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  min-width: 30px;
}

.diary-content {
  background: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  line-height: 1.8;
  font-size: 14px;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
  border: 1px solid #ebeef5;
}
</style>