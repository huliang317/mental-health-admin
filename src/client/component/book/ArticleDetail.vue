<template>
  <el-dialog
    v-model="dialogVisible"
    title="文章详情"
    width="90%"
    style="max-width: 700px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div v-if="article" class="article-detail">
      <!-- 标题 -->
      <h2 class="detail-title">{{ article.title }}</h2>

      <!-- 元信息 -->
      <div class="detail-meta">
        <span>
          <el-icon><User /></el-icon>
          {{ article.authorName || '系统管理员' }}
        </span>
        <span>
          <el-icon><Calendar /></el-icon>
          {{ article.createdAt || article.publishedAt || '' }}
        </span>
        <span>
          <el-icon><View /></el-icon>
          阅读量: {{ article.readCount || 0 }}
        </span>
        <el-tag size="small" :color="getTagColor(article.categoryName)">
          {{ article.categoryName }}
        </el-tag>
      </div>

      <!-- 封面图 -->
      <div v-if="article.coverImage" class="detail-cover">
        <img :src="'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'" alt="封面" />
      </div>

      <!-- 摘要 -->
      <div v-if="article.summary" class="detail-summary">
        <strong>摘要：</strong>{{ article.summary }}
      </div>

      <!-- 标签 -->
      <div v-if="article.tags" class="detail-tags">
        <span class="tag-label">标签：</span>
        <el-tag
          v-for="tag in article.tags.split(',')"
          :key="tag"
          size="small"
          type="info"
          round
        >
          {{ tag.trim() }}
        </el-tag>
      </div>

      <!-- 正文内容 -->
      <div class="detail-content" v-html="article.content || '暂无内容'"></div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { User, Calendar, View } from '@element-plus/icons-vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'ArticleDetail'
})

const { token } = useAuthStore()

interface Article {
  id: string
  title: string
  categoryName: string
  authorName: string
  coverImage: string
  createdAt: string
  publishedAt: string
  readCount: number
  summary: string
  tags: string
  content: string
  status?: number
  statusText?: string
}

const dialogVisible = ref(false)
const article = ref<Article | null>(null)
const loading = ref(false)

const getTagColor = (category: string) => {
  const map: Record<string, string> = {
    '压力缓解': '#ecf5ff',
    '情绪管理': '#fdf6ec',
    '心理健康基础': '#f0f9eb',
    '人际关系': '#f9f0ff'
  }
  return map[category] || '#f4f4f5'
}

// 打开弹窗并请求详情
const open = async (id: string) => {
  dialogVisible.value = true
  loading.value = true
  article.value = null

  try {
    const response = await axios.get(`/api/knowledge/article/${id}`, {
      headers: { token }
    })
    if (response.data.code === '200') {
      article.value = response.data.data
    } else {
      ElMessage.error(response.data.msg || '获取文章详情失败')
    }
  } catch (error) {
    console.error('获取文章详情失败：', error)
    ElMessage.error('获取文章详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const close = () => {
  dialogVisible.value = false
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style scoped>
.article-detail {
  max-height: 500px;
  overflow-y: auto;
  padding: 4px 0;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #909399;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.detail-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-cover {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-summary {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
  line-height: 1.6;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-label {
  font-size: 13px;
  color: #909399;
}

.detail-content {
  font-size: 15px;
  color: #303133;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.detail-content :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}
</style>