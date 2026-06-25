<template>
  <div class="knowledge-container">
    <!-- 顶部 Banner -->
    <header class="page-banner">
      <div class="banner-content">
        <el-icon :size="40" color="#fff"><Reading /></el-icon>
        <h1>心理健康知识库</h1>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main class="main-layout">
      <!-- 左侧：推荐阅读 (Top List) -->
      <aside class="sidebar">
        <div class="card sidebar-card">
          <h3 class="sidebar-title">推荐阅读</h3>
          <ul class="recommend-list">
            <li
              v-for="(item, index) in recommendList"
              :key="item.id"
              class="recommend-item"
            >
              <div class="item-main">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="item-title">{{ item.title }}</span>
              </div>
              <div class="item-meta">
                <el-icon><View /></el-icon>
                <span>{{ item.views }}</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <!-- 右侧：文章列表 (Card List) -->
      <section class="content-area">
        <div
          v-for="article in articleList"
          :key="article.id"
          class="card article-card"
          @click="handleArticleClick(article)"
        >
          <!-- 封面图区域 -->
          <div class="article-cover">
            <img :src="imgURL" alt="cover" />
          </div>

          <!-- 文章内容区域 -->
          <div class="article-info">
            <div class="info-header">
              <h2 class="article-title">{{ article.title }}</h2>
              <el-tag size="small" effect="plain" :color="getTagColor(article.categoryName)">
                {{ article.categoryName }}
              </el-tag>
            </div>

            <div class="info-details">
              <div class="detail-row">
                <el-icon><User /></el-icon>
                <span>{{ article.authorName || '系统管理员' }}</span>
              </div>
              <div class="detail-row">
                <el-icon><Calendar /></el-icon>
                <span>{{ article.createdAt || '2026-01-01' }}</span>
              </div>
              <div class="detail-row highlight">
                <el-icon><View /></el-icon>
                <span>阅读量: {{ article.readCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--  分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </section>
    </main>
  </div>

  <ArticleDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Reading, View, User, Calendar } from '@element-plus/icons-vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import ArticleDetail from '../component/book/ArticleDetail.vue';

defineOptions({
  name: 'Knowledge'
});

const imgURL = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'

const detailRef = ref()

const handleArticleClick = (article: any) => {
  console.log('完整 article：', article)
  console.log(article.id)
  detailRef.value?.open(article.id)
}

// 左侧推荐列表（固定，或从接口获取）
const recommendList = ref([
  { id: 1, title: '正念练习入门指南', views: 42 },
  { id: 2, title: '学生心理压力应对策略', views: 35 },
  { id: 3, title: '职场压力管理指南', views: 31 },
  { id: 4, title: '睡眠质量与心理健康', views: 27 },
  { id: 5, title: '情绪调节的五个有效策略', views: 23 },
]);

interface article {
  id:string,
  authorName:string,
  coverImage:string,
  createdAt:string,
  categoryName:string,
  readCount:number,
  title:string
}

const { token } = useAuthStore()

// 右侧文章列表
const articleList = ref<article[]>([]);

//  分页参数
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)

//  获取数据（支持分页）
const fetchData = async () => {
  const config = {
    method: 'get',
    url: '/api/knowledge/article/page',
    params: {
      currentPage: currentPage.value,
      size: pageSize.value
    },
    headers: { token }
  };

  try {
    const response = await axios.request(config)
    articleList.value = response.data.data.records || []
    total.value = response.data.data.total || 0
  } catch (error) {
    console.log(error);
  }
}

const concreteArticle = async(article:article) => {
  let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: `/api/knowledge/article/${ article.id }`,
   headers: { 
      token
   }
};

axios.request(config)
.then((response) => {
   console.log(response.data);
})
.catch((error) => {
   console.log(error);
});
}

//  页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

//  每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

//  组件挂载时获取数据
onMounted(() => {
  fetchData()
})

const getTagColor = (category: string) => {
  const map: Record<string, string> = {
    '压力缓解': '#ecf5ff',
    '情绪管理': '#fdf6ec',
    '心理健康基础': '#f0f9eb',
    '人际关系': '#f9f0ff'
  };
  return map[category] || '#f4f4f5';
};
</script>

<style scoped>
/* 全局容器 */
.knowledge-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* ===== 顶部 Banner ===== */
.page-banner {
  height: 140px;
  background: linear-gradient(135deg, #dcb068 0%, #b58fc4 50%, #8c7bb8 100%);
  display: flex;
  align-items: center;
  padding: 0 10%;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: 2px;
}

/* ===== 主体布局 ===== */
.main-layout {
  max-width: 1200px;
  margin: 20px auto 40px;
  display: flex;
  gap: 24px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  align-items: flex-start;
}

/* ===== 通用卡片 ===== */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ===== 左侧边栏 ===== */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

.sidebar-card {
  padding: 20px 24px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebeef5;
}

.recommend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommend-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: all 0.2s;
}

.recommend-item:last-child {
  border-bottom: none;
}

.recommend-item:hover .item-title {
  color: #409eff;
}

.item-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.rank-number {
  font-size: 13px;
  font-weight: 600;
  color: #909399;
  width: 22px;
  flex-shrink: 0;
  text-align: center;
}

.recommend-item:nth-child(1) .rank-number {
  color: #f56c6c;
}
.recommend-item:nth-child(2) .rank-number {
  color: #f56c6c;
}
.recommend-item:nth-child(3) .rank-number {
  color: #f56c6c;
}

.item-title {
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  padding-left: 30px;
}

.item-meta .el-icon {
  font-size: 13px;
}

/* ===== 右侧内容区 ===== */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.article-card {
  display: flex;
  height: 150px;
  transition: box-shadow 0.2s;
}

.article-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 封面图 */
.article-cover {
  width: 200px;
  flex-shrink: 0;
  background: #f0f2f5;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文章信息 */
.article-info {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.article-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

:deep(.el-tag) {
  border: none;
  font-weight: 500;
  flex-shrink: 0;
}

.info-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.detail-row .el-icon {
  font-size: 14px;
}

.detail-row.highlight {
  color: #606266;
  font-weight: 500;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .article-card {
    height: auto;
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
    height: 160px;
  }

  .article-title {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .banner-content h1 {
    font-size: 20px;
  }

  .page-banner {
    padding: 0 5%;
    height: 100px;
  }

  .main-layout {
    padding: 0 12px;
  }

  .article-info {
    padding: 12px 16px;
  }

  .info-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-details {
    gap: 8px;
  }
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 8px 0;
  background: transparent;
}

@media (max-width: 480px) {
  .pagination-wrapper {
    justify-content: center;
  }
  .pagination-wrapper :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>