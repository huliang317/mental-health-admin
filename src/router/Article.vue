<template>
  <div class="article-container">
    <div class="title">
      <span>知识文章</span>
      <Add ref="addRef" />
    </div>
    
    <!-- 搜索条件 -->
    <div class="filters">
      <span>文章标题：</span>
      <el-input 
        v-model="inputTitle" 
        style="width: 200px" 
        placeholder="请输入文章标题"
      />
      
      <span>请选择分类：</span> 
      <Myselect 
        :options="cateData" 
        :type="0"
        @change="handleCategoryChange"
      />
      
      <span>请选择状态：</span> 
      <Myselect 
        :type="1"
        @change="handleStatusChange"
      />
    </div>
    
    <!-- 按钮 -->
    <div class="button-row">
      <el-button type="primary" style="width: 120px" @click="handleSearch">搜索</el-button>
      <el-button style="width: 120px" @click="handleReset">重置</el-button>
    </div>

    <!-- 文章列表 -->
    <ArticleList 
      :search-data="searchData" 
      @refresh="handleSearch"
      @edit="handleEdit"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import Myselect from '@/component/page/Myselect.vue'
import ArticleList from '@/component/article/ArticleList.vue'
import Add from '@/component/article/Add.vue'

defineOptions({
  name: 'Article'
})

const addRef = ref<InstanceType<typeof Add>>()

const inputTitle = ref('')
const cateData = ref<any[]>([])
const selectedCategory = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)
const { token } = useAuthStore()

const searchData = ref({
  records: [],
  total: 0,
  current: 1,
  size: 10,
  pages: 0
})

const handleCategoryChange = (data: { id: number; useData: string }) => {
  selectedCategory.value = String(data.id)
}

const handleStatusChange = (data: { id: number; useData: string }) => {
  selectedStatus.value = String(data.id)
}

const handleEdit = (row: any) => {
  addRef.value?.openDialog('edit', row)
}

// ✅ 搜索（支持页码参数）
const handleSearch = async (page?: number) => {
  try {
    const params: any = {
      currentPage: page || searchData.value.current || 1,
      size: searchData.value.size || 10
    }
    
    if (inputTitle.value) params.title = inputTitle.value
    if (selectedCategory.value) params.categoryId = String(selectedCategory.value)
    if (selectedStatus.value) params.status = String(selectedStatus.value)
    
    const response = await axios.get('/api/knowledge/article/page', {
      headers: { token },
      params
    })
    
    if (response.data.code === '200') {
      const data = response.data.data || {}
      searchData.value = {
        records: data.records || [],
        total: data.total || 0,
        current: data.current || 1,
        size: data.size || 10,
        pages: data.pages || 0
      }
      
      if (data.records?.length === 0) {
        ElMessage.info('暂无数据')
      }
    } else {
      ElMessage.error(response.data.msg || response.data.message || '请求失败')
      searchData.value = { records: [], total: 0, current: 1, size: 10, pages: 0 }
    }
  } catch (error) {
    console.log('请求失败：', error)
    ElMessage.error('请求失败，请检查网络')
  }
}

// ✅ 分页切换
const handlePageChange = (page: number) => {
  handleSearch(page)
}

// 重置
const handleReset = () => {
  inputTitle.value = ''
  selectedCategory.value = null
  selectedStatus.value = null
  handleSearch(1)
}

const fetchData = async () => {
  try {
    const response = await axios.get('/api/knowledge/category/tree', {
      headers: { token }
    })
    cateData.value = response.data.data || []
  } catch (error) {
    console.log('请求失败：', error)
  }
}

onMounted(() => {
  fetchData()
  handleSearch(1)
})
</script>

<style scoped>
.article-container {
  padding: 10px;
}

.title {
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.filters span {
  margin-left: 5px;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>