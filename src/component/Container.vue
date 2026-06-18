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
          <router-link to="/data" class="nav-item" active-class="active">
            数据分析
          </router-link>
          <router-link to="/article" class="nav-item" active-class="active">
            知识文章
          </router-link>
          <router-link to="/record" class="nav-item" active-class="active">
            咨询记录
          </router-link>
          <router-link to="/log" class="nav-item" active-class="active">
            情绪日志
          </router-link>
        </nav>
      </el-aside>

      <!-- 右侧主内容区 -->
      <el-container class="layout-main">
        <!-- 顶部 Header -->
        <el-header class="layout-header">
          <div class="header-left">
            <span class="menu-toggle">☰</span>
            <span class="breadcrumb">首页 / 仪表盘</span>
          </div>
          <div class="header-right">
            <span class="username">管理员</span>
            <span class="avatar">👤</span>
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

const router = useRouter()
const route = useRoute()

// 如果当前路径是 /container，重定向到 /data
if (route.path === '/container') {
  router.push('/data')
}
</script>

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

.menu-toggle {
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.menu-toggle:hover {
  color: #409eff;
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
</style>