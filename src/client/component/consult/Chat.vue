<template>
  <div class="consult-right">
    <!-- 顶部标题栏 -->
    <div class="chat-header">
      <div class="header-left">
        <div class="heart-circle">❤️</div>
        <div class="header-text">
          <h3>Hush AI助手</h3>
          <p>您的贴心AI心理健康助手</p>
        </div>
      </div>
      <div class="add-btn" @click="add">+</div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-content" ref="chatContentRef">
      <div v-for="item in chatData" :key="item.id">
        <!-- AI消息（左） -->
        <div class="ai-msg" v-if="item.senderType === 2">
          <div class="msg-avatar">
            <el-icon><MoonNight /></el-icon>
          </div>
          <div class="msg-box ai-box">
            <p>{{ item.content }}</p>
            <span class="msg-time">{{ item.createdAt }}</span>
          </div>
        </div>

        <!-- 用户消息（右） -->
        <div class="user-msg" v-if="item.senderType === 1">
          <div class="msg-box user-box">
            <p>{{ item.content }}</p>
            <span class="msg-time">{{ item.createdAt }}</span>
          </div>
          <div class="msg-avatar user-avatar">
            <el-icon><UserFilled /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="chat-input-area">
      <textarea 
        v-model="inputMessage"
        class="input-box" 
        placeholder="请输入您想要分享的内容..." 
        maxlength="500"
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <div class="input-bottom">
        <span class="tip-text">按Enter发送</span>
        <span class="word-count">{{ inputMessage.length }}/500</span>
        <button class="send-btn" @click="sendMessage">➤</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { watch, ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name: 'Chat' })
const emit = defineEmits(['reset-garden'])

const auth = useAuthStore()
const token = auth.token

interface Chat {
  id: number;
  content: string;
  senderType: number;
  createdAt: string;
}

const defaultChat: Chat[] = [
  { id: 1, content: '我是你的AI情绪帮手，有任何问题都可以问我吖😊', senderType: 2, createdAt: '' }
]

const chatData = ref<Chat[]>([...defaultChat])
const inputMessage = ref('')
const chatContentRef = ref<HTMLElement | null>(null)
const props = defineProps<{ id?: number | string }>()
const useId = ref<number | string | undefined>(props.id)

const isStart = ref(true)
const sending = ref(false)
let abortController: AbortController | null = null

function extractText(obj: any): string {
  if (typeof obj === 'string') return obj
  if (typeof obj !== 'object' || obj === null) return ''
  const candidates = [obj.content, obj.data, obj.reply, obj.text, obj.message, obj.answer, obj.output, obj.response, obj.msg]
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c
    if (typeof c === 'object' && c !== null) {
      const nested = extractText(c)
      if (nested) return nested
    }
  }
  return ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
    }
  })
}

const fetchMessages = async () => {
  if (!useId.value) return
  try {
    const response = await axios.get(
      `/api/psychological-chat/sessions/${useId.value}/messages`,
      { headers: { token } }
    )
    if (response.data.code === '200') {
      chatData.value = response.data.data || []
      scrollToBottom()
      isStart.value = false
    } else {
      ElMessage.error(response.data.msg || '获取消息失败')
    }
  } catch (error) {
    console.error('请求失败：', error)
    ElMessage.error('获取消息失败，请重试')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  if (sending.value) return
  const content = inputMessage.value.trim()
  if (!content) {
    ElMessage.warning('请不要输入空白信息')
    return
  }

  if (!useId.value && !isStart.value) {
    ElMessage.error('当前会话ID丢失，请重新选择会话或新建对话')
    return
  }

  inputMessage.value = ''
  sending.value = true

  const userMsgId = Date.now()
  chatData.value.push({
    id: userMsgId,
    content,
    senderType: 1,
    createdAt: new Date().toLocaleString()
  })
  scrollToBottom()

  const aiMsgId = userMsgId + 1
  const aiMsg = reactive<Chat>({
    id: aiMsgId,
    content: '',
    senderType: 2,
    createdAt: ''
  })
  chatData.value.push(aiMsg)
  scrollToBottom()

  // 新建会话逻辑
  if (isStart.value) {
    try {
      const title = 'Hush AI助手 - ' + new Date().toLocaleString()
      const res = await axios.post('/api/psychological-chat/session/start', {
        initialMessage: content,
        sessionTitle: title
      }, { headers: { token } })
      useId.value = res.data.data.sessionId
      isStart.value = false
    } catch (error) {
      console.error(error)
      chatData.value = chatData.value.filter(m => m.id !== userMsgId && m.id !== aiMsgId)
      isStart.value = true
      sending.value = false
      ElMessage.error('创建会话失败')
      return
    }
  }

  abortController = new AbortController()
  let hasError = false

  try {
    const response = await fetch('/api/psychological-chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        token: token || ''
      },
      body: JSON.stringify({ sessionId: useId.value, userMessage: content }),
      signal: abortController.signal
    })

    if (!response.ok || !response.body) {
      throw new Error(`流式请求失败: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentEvent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed === '') {
          currentEvent = ''
          continue
        }
        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.slice(6).trim()
          continue
        }

        // ✅ 核心修复：捕获后端返回的 event:error
        if (trimmed.startsWith('data:') && currentEvent === 'error') {
          const raw = trimmed.slice(5).trim()
          let errMsg = '对话服务异常'
          try {
            const parsed = JSON.parse(raw)
            errMsg = parsed.msg || parsed.message || parsed.error || JSON.stringify(parsed)
          } catch {
            if (raw) errMsg = raw
          }

          chatData.value = chatData.value.filter(m => m.id !== aiMsgId)
          ElMessage.error(errMsg)
          console.error('[SSE] 后端返回错误:', errMsg, '| sessionId:', useId.value)
          hasError = true
          break
        }

        // 正常流式消息处理
        if (trimmed.startsWith('data:') && currentEvent === 'message') {
          const raw = trimmed.slice(5).trim()
          if (!raw || raw === '[DONE]') continue

          let text = ''
          try {
            const parsed = JSON.parse(raw)
            if (typeof parsed === 'string') {
              try { text = extractText(JSON.parse(parsed)) } catch { text = parsed }
            } else if (typeof parsed === 'object' && parsed !== null) {
              text = extractText(parsed)
            }
          } catch {
            if (typeof raw === 'string') text = raw
          }

          if (text && typeof text === 'string') {
            aiMsg.content += text
            aiMsg.createdAt = new Date().toLocaleString()
            scrollToBottom()
          }
        }
      }

      if (hasError) break
    }

    // 只有在未收到 error 事件且内容为空时才提示兜底信息
    if (!hasError && !aiMsg.content) {
      chatData.value = chatData.value.filter(m => m.id !== aiMsgId)
      ElMessage.warning('AI 未返回有效内容')
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      chatData.value = chatData.value.filter(m => m.id !== aiMsgId)
      return
    }
    console.error('[SSE] 流式请求异常:', error)
    chatData.value = chatData.value.filter(m => m.id !== aiMsgId)
    ElMessage.error('发送失败，请重试')
  } finally {
    sending.value = false
    abortController = null
  }
}

function add() {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  chatData.value = [...defaultChat]
  useId.value = undefined
  inputMessage.value = ''
  isStart.value = true
  sending.value = false
  emit('reset-garden')
}

// ✅ 切换会话时确保 ID 正确赋值并中断旧流
watch(() => props.id, (newId) => {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  sending.value = false

  if (newId) {
    useId.value = newId
    isStart.value = false
    fetchMessages()
  } else {
    chatData.value = [...defaultChat]
    useId.value = undefined
    isStart.value = true
  }
})

onMounted(() => {
  if (props.id) {
    useId.value = props.id
    isStart.value = false
    fetchMessages()
  }
})

onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
})
</script>

<style scoped>
.consult-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

/* 顶部标题栏 */
.chat-header {
  background: #f8c647;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.heart-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.header-text h3 {
  margin: 0;
  font-size: 17px;
}
.header-text p {
  margin: 2px 0 0;
  font-size: 12px;
  opacity: 0.9;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  color: #f8c647;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

/* ===== 聊天内容区域 ===== */
.chat-content {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 480px;
}

/* ===== AI消息（左） ===== */
.ai-msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: flex-start;
  max-width: 85%;
}

/* ===== 用户消息（右） ===== */
.user-msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  justify-content: flex-end;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(160, 207, 255);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
}

.user-avatar {
  background: #f8c647;
}

.msg-box {
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
}

.ai-box {
  background: #ffffff;
  border-radius: 0 12px 12px 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.user-box {
  background: #f8c647;
  color: #fff;
  border-radius: 12px 0 12px 12px;
}

.msg-box p {
  margin: 0;
  color: #333;
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.user-box p {
  color: #fff;
}

.msg-time {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  display: block;
  text-align: right;
}

.user-box .msg-time {
  color: rgba(255, 255, 255, 0.7);
}

/* ===== 底部输入框 ===== */
.chat-input-area {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
  background: #fff;
}
.input-box {
  width: 100%;
  min-height: 60px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 10px;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
}
.input-box:focus {
  border-color: #f8c647;
}
.input-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}
.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f8c647;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn:hover {
  background: #e6b53a;
}
</style>