<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 左侧导航区 -->
      <el-aside width="220px" class="layout-aside">
        <div class="logo">
          <div class="logo-icon">
            <el-icon :size="30"><MoonNight /></el-icon>
          </div>
          <div class="logo-text">
            <h2>心理健康AI助手</h2>
            <p>管理后台</p>
          </div>
        </div>
        <nav class="nav-menu">
          <router-link to="/admin/data" class="nav-item" active-class="active">
            数据分析
          </router-link>
          <router-link to="/admin/article" class="nav-item" active-class="active">
            知识文章
          </router-link>
          <router-link to="/admin/record" class="nav-item" active-class="active">
            咨询记录
          </router-link>
          <router-link to="/admin/log" class="nav-item" active-class="active">
            情绪日志
          </router-link>
        </nav>
      </el-aside>

      <!-- 右侧主内容区 -->
      <el-container class="layout-main">
        <!-- 顶部 Header -->
        <el-header class="layout-header">
          <div class="header-left">
            <span class="breadcrumb">首页 / 仪表盘</span>
          </div>
          <div class="header-right">
            <span class="username">{{ username }}</span>
            <el-popover placement="bottom" trigger="hover" :width="100" popper-class="exit-popover">
              <template #reference>
                <span class="avatar">👤</span>
              </template>
              <span class="logout-text" @click="exit">退出登录</span>
            </el-popover>
          </div>
        </el-header>

        <!-- 主体内容区 -->
        <el-main class="layout-content">
          <div class="content-card">
            <RouterView></RouterView>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script lang="ts" setup>
defineOptions({
  name: 'Container'
})

import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { token, username } = auth

function exit() {
  auth.clearAuth()

  if (!token) {
    router.push('/login')
    return
  }

  const config = {
    method: 'post',
    url: '/api/user/logout',
    headers: { token }
  }

  axios.request(config)
    .then((response) => {
      console.log('退出响应：', response.data)
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch((error) => {
      console.log('退出失败：', error)
      router.push('/login')
    })
}
</script>

<style>
/*  不加 scoped */
.exit-popover {
  padding: 12px 24px !important;
  font-size: 16px !important;
}

.logout-text {
  cursor: pointer;
  color: #333;
  display: block;
  text-align: center;
}

.logout-text:hover {
  color: #409eff;
}
</style>

<style scoped>
/* 整体布局 - 占满全屏 */
.common-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100%;
}

/* ========== 左侧导航栏样式 ========== */
.layout-aside {
  background: linear-gradient(180deg, #304156 0%, #263445 100%);
  color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Logo 区域 */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  margin-top: 10px;
}

.logo-icon{
  size: 50px;
}


.logo-text h2 {
  font-size: 14px;
  margin: 0;
  line-height: 1.3;
  text-align: left;
}

.logo-text p {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
  text-align: left;
}

.logo-sub {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.8;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 10px;
}

/* 给 router-link 加样式 */
.nav-item {
  display: block;
  padding: 12px 20px;
  margin: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 激活状态 */
:deep(.active) {
  background: #409eff !important;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* ========== 右侧主区域样式 ========== */
.layout-main {
  background-color: #f0f2f5;
  min-width: 0;
}

/* 顶部 Header 样式 */
.layout-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 14px;
  color: #333;
}


.avatar {
  font-size: 20px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  background-color: #f0f2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}

.avatar:hover {
  background-color: #e6e9ed;
}

/* ========== 主体内容区域样式 ========== */
.layout-content {
  padding: 20px;
  overflow-y: auto;
}

/* 内容卡片 */
.content-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 400px;
}

.content-card h3 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

.content-card p {
  color: #666;
  line-height: 1.6;
}

/* 滚动条美化 */
.layout-content::-webkit-scrollbar {
  width: 6px;
}

.layout-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.layout-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.layout-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* ========== 移动端适配 ========== */
@media (max-width: 768px) {
  .layout-aside {
    width: 180px !important;
  }

  .layout-header {
    padding: 0 12px;
    height: 50px;
  }

  .breadcrumb {
    font-size: 12px;
  }

  .username {
    font-size: 12px;
  }

  .layout-content {
    padding: 10px;
  }

  .content-card {
    padding: 10px;
    border-radius: 8px;
    min-height: 300px;
  }

  .logo {
    padding: 0 8px;
  }

  .logo-text h2 {
    font-size: 12px;
  }

  .nav-item {
    padding: 10px 14px;
    margin: 0 6px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .layout-aside {
    width: 60px !important;
  }

  .logo-text,
  .logo-icon {
    display: none;
  }

  .nav-item {
    padding: 12px 0;
    margin: 0 6px;
    text-align: center;
    font-size: 12px;
  }

  .header-left {
    gap: 8px;
  }

  .header-right {
    gap: 8px;
  }
}
</style>