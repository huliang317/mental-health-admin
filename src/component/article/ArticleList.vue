<template>
  <div class="article-table-wrap">
    <div class="table-scroll">
      <el-table 
      :data="searchData!.records || []" 
      border 
      stripe 
      style="width: 100%"
      :header-cell-style="headerCellStyle"
    >
      <!-- 序号 -->
      <el-table-column 
        label="序号" 
        type="index" 
        width="60" 
        align="center"
        :index="indexMethod"
      />
      
      <!-- 文章标题 -->
      <el-table-column 
        label="文章标题" 
        prop="title" 
        align="left" 
        min-width="180"
        show-overflow-tooltip
      />
      
      <!-- 分类 -->
      <el-table-column 
        label="分类" 
        prop="categoryName" 
        align="center" 
        width="120"
      >
        <template #default="scope">
          <el-tag type="primary" size="small" round>
            {{ scope.row.categoryName }}
          </el-tag>
        </template>
      </el-table-column>
      
      <!-- 作者 -->
      <el-table-column 
        label="作者" 
        prop="authorName" 
        align="center" 
        width="100" 
      />
      
      <!-- 阅读量 -->
      <el-table-column 
        label="阅读量" 
        prop="readCount" 
        align="center" 
        width="80" 
      >
        <template #default="scope">
          <span class="read-count">
            <el-icon><View /></el-icon>
            {{ scope.row.readCount || 0 }}
          </span>
        </template>
      </el-table-column>
      
      <!-- 状态 -->
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <el-tag 
            :type="getStatusType(scope.row.status)"
            size="small"
            round
          >
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <!-- 发布时间 -->
      <el-table-column 
        label="发布时间" 
        prop="publishedAt" 
        align="center" 
        width="170"
      >
        <template #default="scope">
          {{ scope.row.publishedAt ? formatDate(scope.row.publishedAt) : '-' }}
        </template>
      </el-table-column>
      
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="260" fixed="right">
        <template #default="scope">
          <el-button 
            link 
            type="primary" 
            size="small"
            @click="handleEdit(scope.row)"
          >
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          
          <el-button 
            link 
            :type="scope.row.status === 1 ? 'warning' : 'success'"
            size="small"
            @click="handleStatusChange(scope.row)"
          >
            <el-icon><Switch /></el-icon>
            {{ scope.row.status === 1 ? '下线' : '发布' }}
          </el-button>
          
          <el-button 
            link 
            type="danger" 
            size="small"
            @click="handleDelete(scope.row)"
          >
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <div class="empty-state">
          <div class="empty-text">暂无相关文章</div>
          <div class="empty-tip">点击「添加文章」创建第一篇文章吧</div>
        </div>
      </template>
    </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNum"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="searchData!.total || 0"
      class="pagination"
      @current-change="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Edit, Delete, Switch } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

defineOptions({
  name: 'ArticleList'
})

const props = defineProps<{
  searchData?: {
    records?: any[]
    total?: number
    current?: number
    size?: number
    pages?: number
  }
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'refresh'): void
  (e: 'edit', row: any): void
}>()

const pageNum = ref(1)
const pageSize = ref(10)
const { token } = useAuthStore()

// 表头样式
const headerCellStyle = {
  background: '#f5f7fa',
  color: '#303133',
  fontWeight: 600
}

// 序号从 1 开始
const indexMethod = (index: number) => {
  return (pageNum.value - 1) * pageSize.value + index + 1
}

// 格式化时间
const formatDate = (date: string) => {
  if (!date) return '-'
  return date.replace('T', ' ').slice(0, 16)
}

// 状态文字
const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '草稿',
    1: '已发布',
    2: '已下线'
  }
  return map[status] || '未知'
}

// 状态标签颜色
const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'danger'
  }
  return map[status] || 'info'
}

watch(() => props.searchData, (newData) => {
  if (newData?.current) {
    pageNum.value = newData.current
  }
  if (newData?.size) {
    pageSize.value = newData.size
  }
}, { immediate: true, deep: true })

const changePage = (val: number) => {
  pageNum.value = val
  emit('page-change', val)
}

//  编辑 - 触发父组件
const handleEdit = (row: any) => {
  emit('edit', row)
}

// 状态切换
const handleStatusChange = async (row: any) => {
  try {
    const newStatus = row.status === 1 ? 2 : 1
    const actionText = newStatus === 1 ? '发布' : '下线'
    
    await ElMessageBox.confirm(
      `确定要${actionText}文章「${row.title}」吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
    )
    
    const response = await axios.put(
      `/api/knowledge/article/${row.id}/status`,
      { status: String(newStatus) },
      { headers: { token } }
    )
    
    if (response.data.code === '200' || response.data.success === true) {
      ElMessage.success(`${actionText}成功！`)
      emit('refresh')
    } else {
      ElMessage.error(response.data.msg || response.data.message || `${actionText}失败`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('状态更新失败：', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章「${row.title}」吗？此操作不可恢复！`,
      '警告',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
    )
    
    const response = await axios.delete(`/api/knowledge/article/${row.id}`, {
      headers: { token }
    })
    
    if (response.data.code === '200' || response.data.success === true) {
      ElMessage.success('删除成功！')
      emit('refresh')
    } else {
      ElMessage.error(response.data.msg || response.data.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败：', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}
</script>

<style scoped>
.article-table-wrap {
  margin-top: 16px;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.empty-tip {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.read-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
}

:deep(.el-button) {
  margin: 0 2px;
}
</style>