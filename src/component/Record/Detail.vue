<template>
  <div>
    <span @click="open">详情</span>
  </div>

  <!-- 弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="会话详情"
    width="90%"
    style="max-width: 600px"
    append-to-body
    :z-index="3000"
    @close="handleClose"
  >
    <div class="message-container" ref="messageContainer">
      <div
        v-for="msg in messageList"
        :key="msg.id"
        class="message-item"
        :class="msg.senderType === 1 ? 'message-user' : 'message-ai'"
      >
        <div class="message-sender">
          {{ msg.senderType === 1 ? '👤 用户' : '🤖 AI助手' }}
          <span class="message-time">{{ msg.createdAt }}</span>
        </div>
        <div class="message-content">{{ msg.content }}</div>
      </div>

      <!-- 空状态 -->
      <div v-if="messageList.length === 0 && loaded" class="empty-state">
        <span>暂无消息</span>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

defineOptions({
  name: 'Detail'
})

const props = defineProps<{
  row: any
}>()

const { token } = useAuthStore()
const dialogVisible = ref(false)
const loading = ref(false)
const loaded = ref(false)
const messageList = ref<any[]>([])

const open = async () => {
  dialogVisible.value = true
  loading.value = true
  loaded.value = false
  messageList.value = []

  try {
    const config = {
      method: 'get',
      url: `/api/psychological-chat/sessions/${props.row.id}/messages`,
      headers: { token }
    }

    const response = await axios.request(config)

    if (response.data.code === '200') {
      const data = response.data.data || []
      messageList.value = Array.isArray(data) ? data : []
    } else {
      ElMessage.error(response.data.msg || '获取消息失败')
    }
  } catch (error) {
    console.error('请求失败：', error)
    ElMessage.error('获取消息失败，请重试')
  } finally {
    loading.value = false
    loaded.value = true
  }
}

const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
span {
  color: #409EFF;
  cursor: pointer;
}
span:hover {
  color: #66b1ff;
}

/* 消息容器 */
.message-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 0;
}

/* 消息项 */
.message-item {
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
}

.message-user {
  background-color: #f0f7ff;
  border-left: 3px solid #409EFF;
}

.message-ai {
  background-color: #f5f7fa;
  border-left: 3px solid #67c23a;
}

.message-sender {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.message-time {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
  margin-left: 10px;
}

.message-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

/* 滚动条美化 */
.message-container::-webkit-scrollbar {
  width: 6px;
}

.message-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.message-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.message-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 弹窗遮罩修复 */
:deep(.el-dialog__wrapper) {
  z-index: 3000 !important;
}
</style>