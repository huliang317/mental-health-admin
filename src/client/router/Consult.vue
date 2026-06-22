<template>
  <div class="consult-page">
    <div class="consult-wrap">
      <!-- 左侧侧边栏 -->
      <div class="consult-left">
        <!-- AI助手卡片 -->
        <div class="ai-card">
          <div class="avatar-circle">
            <el-icon  class="robot-icon"><MoonNight /></el-icon>
          </div>
          <h3 class="ai-name">Hush AI助手</h3>
          <div class="status-tag">
            <span class="green-dot"></span>
            <span>在线服务中</span>
          </div>
        </div>

        <!-- 情绪花园模块 -->
        <Guarden :id="currentId" ref="guardenRef" />
        <!-- 会话历史 -->
        <History v-model="currentId"/>
        
      </div>

      <!-- 右侧聊天主窗口 -->
      <Chat :id="currentId" @reset-garden="resetGarden" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ref, watch } from 'vue'
import Guarden from '../component/consult/Guarden.vue';
import History from '../component/consult/History.vue';
import Chat from '../component/consult/Chat.vue';

defineOptions({
  name: 'Consult'
})

const currentId = ref()
const guardenRef = ref()

const resetGarden = () => {
  // 调用 Guarden 组件的重置方法
  guardenRef.value?.resetToDefault()
}
</script>

<style scoped>
/* 页面外层容器 */
.consult-page {
  padding: 20px;
  background: #f5f7fa;
}

/* 左右分栏容器 */
.consult-wrap {
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
  align-items: flex-start;
}

/* ===== 左侧栏 ===== */
.consult-left {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== 右侧聊天区 ===== */
.consult-right {
  flex: 1;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-width: 0;
}

/* 左侧通用卡片 */
.ai-card,
.mood-card,
.history-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.history-card {
  max-height: 200px;        /* 新增：限制最大高度 */
  overflow-y: auto;          /* 新增：内容超出时滚动 */
}

/* AI助手头部卡片 */
.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgb(160, 207, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

}
.robot-icon {
  font-size: 24px;
  color: #fff;
  
}
.ai-name {
  text-align: center;
  color: #d48806;
  margin: 8px 0 4px;
  font-size: 16px;
}
.status-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}
.green-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
}
</style>