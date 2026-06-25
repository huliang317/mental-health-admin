<template>
  <div class="main">
    <!-- 左侧内容 -->
    <div class="content">
    <h2 class="subtitle">一次温暖的对话</h2>
    <h1 class="title">化孤独为慰藉</h1>
    <p class="desc">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
    <div class="btn-group">
        <button class="btn-primary" @click="isconsult">开始倾诉，获得陪伴</button>
        <button class="btn-outline" @click="isdiary">记录心情，释放情感</button>
    </div>
    </div>

    <!-- 右侧图标 -->
    <div class="icon-wrapper">
    <el-icon :size="260"><MoonNight /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router/index.ts';

defineOptions({
  name: 'Page'
})


function isconsult(){
    router.push('/home/consult')
}
function isdiary(){
    router.push('/home/diary')
}
</script>

<style scoped>
/* #region 内容 */
.main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 8%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08)),
                    linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  padding-left: 12%;
  padding-right: 12%;
  min-height: 0;
}

.content {
  flex: 1;
  max-width: 55%;
}

.subtitle {
  font-size: 25px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 4px;
  margin-bottom: 16px;
}

.title {
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 20px 0;
  line-height: 1.2;
  color: #FFE670;
}

.desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  max-width: 480px;
  margin-bottom: 32px;
}

.btn-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 14px 36px;
  border: none;
  border-radius: 50px;
  background: #fff;
  color: #4a9e6f;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  padding: 14px 36px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50px;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}

.icon-wrapper {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* #endregion  */

/* 移动端适配 */
@media (max-width: 768px) {
  .main {
    flex-direction: column;
    padding: 10% 5% 0;
    text-align: center;
  }
  .content {
    max-width: 100%;
  }
  .title {
    font-size: 36px;
  }
  .subtitle {
    font-size: 18px;
  }
  .desc {
    font-size: 14px;
    max-width: 100%;
  }
  .btn-group {
    justify-content: center;
  }
  .btn-primary, .btn-outline {
    padding: 12px 24px;
    font-size: 14px;
  }
  .icon-wrapper {
    margin-top: 20px;
  }
  .icon-wrapper .el-icon {
    font-size: 160px !important;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }
  .subtitle {
    font-size: 16px;
  }
  .desc {
    font-size: 13px;
    line-height: 1.6;
  }
  .btn-group {
    flex-direction: column;
    align-items: center;
  }
  .icon-wrapper .el-icon {
    font-size: 120px !important;
  }
}
</style>