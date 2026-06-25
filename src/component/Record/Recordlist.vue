<template>
  <div class="table-scroll">
    <el-table :data="tableData" stripe style="width: 100%" >
    <el-table-column prop="id" label="会话ID" width="150" />
    
    <!--  如果有 emotionTag 字段就保留，没有就隐藏或删除 -->
    <el-table-column label="会话信息" >
      <template #default="scope">
        <div class="session-info">
          <div class="session-title">{{ scope.row.sessionTitle || '未命名会话' }}</div>
          <div class="session-last-msg">{{ scope.row.lastMessageContent || '' }}</div>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="messageCount" align="center" label="消息数" width="100" />
    <el-table-column prop="lastMessageTime" label="时间" width="180" />
    <el-table-column 
        prop="operate" 
        align="center"  
        label="操作" 
        width="100"
    >
        <template #default="scope">        
          <Detail :row="scope.row" />       
        </template>
    </el-table-column>
  </el-table>
  </div>

  <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNum"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      class="pagination"
      @current-change="changePage"
    />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import Detail from './Detail.vue';
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';

defineOptions({
  name: 'Recordlist'
})

const tableData = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const { token } = useAuthStore()

const fetchData = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '/api/psychological-chat/sessions',
    headers: { 
      token
    },
    params:{
      currentPage: pageNum.value,
      size: pageSize.value,
    }
  };

  axios.request(config)
    .then((response) => {     
      const data = response.data.data || {}
      
      tableData.value = data.records || []
      total.value = data.total || 0
      
      if (tableData.value.length === 0) {
        ElMessage.info('暂无咨询会话记录')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const changePage = (val: number) => {
  pageNum.value = val
  fetchData()
}

fetchData()
</script>

<style scoped>
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 4px;
  width: 100%;
}

.session-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-last-msg {
  font-size: 13px;
  color: #6c757d;
  word-break: break-word;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>