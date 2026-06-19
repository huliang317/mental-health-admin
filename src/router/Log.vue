<template>
  <div class="article-container">
    <div class="title">
      <span>情绪日志</span>
    </div>

     <!-- 搜索条件 -->
    <div class="filters">
      <span>用户ID: </span>
      <el-input 
        v-model="inputID" 
        style="width: 200px" 
        placeholder="请输入用户ID:"
      />
      
      <span>情绪评分区间：</span> 
      <el-select 
        v-model="minMoodScore" 
        placeholder="请选择" 
        style="width: 150px" 
        clearable
      >
        <el-option
          v-for="item in score"
          :key="item.id"
          :value="item.id"
        />
      </el-select>
      <span>———</span>
      <el-select 
        v-model="maxMoodScore" 
        placeholder="请选择" 
        style="width: 150px" 
        clearable
      >
        <el-option
          v-for="item in score"
          :key="item.id"
          :value="item.id"
        />
      </el-select>
    </div>
    
    <!-- 按钮 -->
    <div class="button-row">
      <el-button type="primary" style="width: 120px" @click="handleSearch">搜索</el-button>
      <el-button style="width: 120px" @click="handleReset">重置</el-button>
    </div>

    <!-- 列表数据 -->
    <div>
      <Loglist :tableData="tableData" @refresh="handleSearch" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import axios from 'axios';
import Loglist from '@/component/log/Loglist.vue';

defineOptions({
  name: 'Log'
})

const inputID = ref('')
const minMoodScore = ref('')
const maxMoodScore = ref('')
const token = localStorage.getItem('token')
const tableData = ref<any[]>([])

const score = [
  { id:'1' },
  { id:'2' },
  { id:'3' },
  { id:'4' },
  { id:'5' },
  { id:'6' },
  { id:'7' },
  { id:'8' },
  { id:'9' },
  { id:'10' },
]

function handleSearch(){
  if(maxMoodScore.value < minMoodScore.value)  ElMessage.error('最大值要比最小值大')
  else{
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '/api/emotion-diary/admin/page',
    headers: { 
        token
    },
    params:{
      maxMoodScore: maxMoodScore.value || '',
      minMoodScore: minMoodScore.value || '',
      userId: inputID.value || ''
    }
  };

  axios.request(config)
  .then((response) => {
   const data = response.data.data || {}
    tableData.value = data.records || []
    console.log('列表数据：', tableData.value)
    console.log(tableData)
  })
  .catch((error) => {
    console.log(error);
  });
  }
  
}
function handleReset(){
  inputID.value = ''
  minMoodScore.value = ''
  maxMoodScore.value = ''
  
  handleSearch()
}

handleSearch()
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