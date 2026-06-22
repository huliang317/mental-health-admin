<template>
  <div class="history-card">
    <h4 class="card-title">会话历史</h4>

    <div 
      class="history-item" 
      v-for="item in historyList" 
      :key="item.id"
    >
      <div class="history-item-content" @click="handleHistoryClick(item.id)">
        <div class="history-header">
          <span>{{ item.title }}</span>
        </div>
        <p class="history-time">{{ item.time }}</p>
        <p class="history-content">{{ item.content }}</p>
        <div class="history-footer">
          <span>
            <el-icon><ChatRound /></el-icon>
            {{ item.count }}
          </span>
          <span>
            <el-icon><Clock /></el-icon>
            {{ item.duration }}min
          </span>
        </div>
      </div>
      <!-- 删除按钮 -->
      <div class="history-delete" @click="handleDelete(item.id)">
        <el-icon><Delete /></el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

defineOptions({
  name: 'History'
})

const { token } = useAuthStore()

interface HistoryItem {
  id: number
  title: string
  time: string
  content: string
  count: number
  duration: number
}

const historyList = ref<HistoryItem[]>([])

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// 获取会话列表
const fetchHistory = () => {
  const config = {
    method: 'get',
    url: '/api/psychological-chat/sessions',
    headers: { token }
  }

  axios.request(config)
    .then((response) => {
      const records = response.data.data?.records || []
      historyList.value = records.map((item: any) => ({
        id: item.id,
        title: item.sessionTitle,
        time: item.startedAt,
        content: item.lastMessageContent,
        count: item.messageCount,
        duration: item.durationMinutes
      }))
    })
    .catch((error) => {
      console.log(error)
    })
}

// 点击历史记录
const handleHistoryClick = (id: number) => {
  emit('update:modelValue', id)
}

// ✅ 删除会话
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该会话吗？删除后无法恢复', '提示', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const config = {
      method: 'delete',
      url: `/api/psychological-chat/sessions/${id}`,
      headers: { token }
    }

    axios.request(config)
      .then((response) => {
        if (response.data.code === '200') {
          ElMessage.success('删除成功')
          // 从列表中移除
          historyList.value = historyList.value.filter(item => item.id !== id)
          // 如果删除的是当前选中的会话，重置父组件
          if (props.modelValue === id) {
            emit('update:modelValue', undefined)
          }
        } else {
          ElMessage.error(response.data.msg || '删除失败')
        }
      })
      .catch((error) => {
        console.log(error)
        ElMessage.error('删除失败，请重试')
      })
  }).catch(() => {})
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.history-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item-content {
  flex: 1;
  cursor: pointer;
  padding: 4px 0;
}

.history-item-content:hover {
  background: #f5f7fa;
  border-radius: 8px;
}

.history-delete {
  flex-shrink: 0;
  padding: 4px 8px;
  cursor: pointer;
  color: #c0c4cc;
  transition: color 0.2s;
  border-radius: 50%;
}

.history-delete:hover {
  color: #f56c6c;
  background: #fef0f0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #333;
}

.history-time {
  font-size: 12px;
  color: #999;
  margin: 4px 0;
}

.history-content {
  font-size: 14px;
  color: #555;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
}

.history-footer {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
</style>