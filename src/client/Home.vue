<template>
  <div class="common-layout">
    <el-container class="layout-container">
        <!-- 头部导航 -->
      <el-header class="header">
        <!-- 左侧Logo -->
        <div class="logo">
            <el-icon :size="37" class="logo-icon"><MoonNight /></el-icon>
            <span>心理健康AI助手</span>
        </div>
        <!-- 右侧导航 -->
        <div class="nav">
            <router-link to="/home/page" class="nav-item" active-class="active">
                首页
            </router-link>
            <router-link to="/home/consult" class="nav-item" active-class="active">
                AI咨询
            </router-link>
            <router-link to="/home/diary" class="nav-item" active-class="active">
                情绪日记
            </router-link>
            <router-link to="/home/knowledge" class="nav-item" active-class="active">
                知识库
            </router-link>
        </div>

      </el-header>

      <!-- 内容区 -->
        <RouterView ></RouterView>

      <!-- 页脚 -->
      <el-footer class="footer">
        <h3>@317 心理健康AI助手 版权所有</h3>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>

defineOptions({
  name: 'Home'
})

</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}

.layout-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
/* #region 头部 */
.header{
    background-color: #F5F7FA;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 150px;
}
.logo span{
    font-size: 18px;
    font-weight: 700;
    margin-left: 10px;
}
.logo-icon{
    color:rgb(121, 187, 255);
}

.nav{
    padding-right: 200px;
}
.nav-item{
    margin-left: 35px;
    color: #303133;
    text-decoration: none;
    
}
.nav-item.active {
  color: #409EFF;
}



/* #endregion  */


/* #region 页脚 */
.footer{
    background-color: #606266;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: flex-end;  /* 垂直靠底部 */
    padding-bottom: 5px;   /* 距离底边留一点空隙，不贴死 */
}
.footer h3{
    font-size: 16px;
    color: #EBEDF0;
}
/* #endregion  */
</style>