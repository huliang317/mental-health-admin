<template>
  <div class="consult-page">
    <div class="consult-wrap">
      <!-- 左侧侧边栏 -->
      <div class="consult-left">
        <!-- AI助手卡片 -->
        <div class="ai-card">
          <div class="avatar-circle">
            <span class="robot-icon">🤖</span>
          </div>
          <h3 class="ai-name">宁渡AI助手</h3>
          <div class="status-tag">
            <span class="green-dot"></span>
            <span>在线服务中</span>
          </div>
        </div>

        <!-- 情绪花园模块 -->
        <div class="mood-card">
          <h4 class="card-title">情绪花园</h4>
          <div class="mood-circle">
            <div class="circle-inner">
              <p class="mood-type">中性</p>
              <p class="mood-num">50</p>
            </div>
          </div>
          <p class="mood-desc">今天感觉 很不错</p>
          <div class="mood-dot-group">
            <span class="dot active"></span>
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="tip-box">
            <span class="heart-icon">❤️</span>
            <div class="tip-text">
              <p>给你的小建议</p>
              <p class="tip-desc">情绪状态平稳</p>
            </div>
          </div>
        </div>

        <!-- 会话历史 -->
        <div class="history-card">
          <h4 class="card-title">会话历史</h4>
          <div class="history-item">
            <div class="history-header">
              <span>宁渡AI助手 - 2026/2/11 11:53:40</span>
              <span class="red-mark">📌</span>
            </div>
            <p class="history-time">2026-02-11 11:53:41</p>
            <p class="history-content">哎呀，摔跤受伤了肯定很疼吧? 🥺 …</p>
            <div class="history-footer">
              <span>○ 2</span>
              <span>○ 5930分钟</span>
            </div>
          </div>
          <div class="history-item">
            <div class="history-header">
              <span>宁渡AI助手 - 2026/2/11 11:53:02</span>
              <span class="red-mark">📌</span>
            </div>
            <p class="history-time">2026-02-11 11:53:03</p>
            <p class="history-content">听到这个消息真的为你开心! ✨中…</p>
          </div>
        </div>
      </div>

      <!-- 右侧聊天主窗口 -->
      <div class="consult-right">
        <!-- 顶部橙色标题栏 -->
        <div class="chat-header">
          <div class="header-left">
            <div class="heart-circle">❤️</div>
            <div class="header-text">
              <h3>宁渡AI助手</h3>
              <p>您的贴心AI心理健康助手</p>
            </div>
          </div>
          <div class="add-btn">+</div>
        </div>

        <!-- 聊天内容区域 -->
        <div class="chat-content">
          <div class="ai-msg">
            <div class="msg-avatar">🤖</div>
            <div class="msg-box">
              <p>您好! 我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？</p>
              <span class="msg-time">刚刚</span>
            </div>
          </div>
        </div>

        <!-- 底部输入区域 -->
        <div class="chat-input-area">
          <textarea class="input-box" placeholder="请输入您想要分享的内容..." maxlength="500"></textarea>
          <div class="input-bottom">
            <span class="tip-text">按Enter发送，Shift+Enter换行</span>
            <span class="word-count">0/500</span>
            <button class="send-btn">➤</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Consult'
})
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

/* AI助手头部卡片 */
.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f7b067;
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

/* 情绪花园 */
.card-title {
  margin: 0 0 10px;
  color: #8c5230;
  font-size: 15px;
}
.mood-card {
  background: #fdf6e8;
}
.mood-circle {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.circle-inner {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #f8c8e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.mood-type {
  margin: 0;
  color: #b85c8c;
  font-size: 14px;
}
.mood-num {
  margin: 2px 0 0;
  font-size: 20px;
  font-weight: bold;
  color: #b85c8c;
}
.mood-desc {
  text-align: center;
  color: #666;
  margin: 0 0 8px;
  font-size: 13px;
}
.mood-dot-group {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 14px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e8d2d8;
}
.dot.active {
  background: #f2a8bc;
}
.tip-box {
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.heart-icon {
  font-size: 18px;
}
.tip-text p {
  margin: 0;
  font-size: 13px;
}
.tip-desc {
  font-size: 12px;
  color: #666;
}

/* 会话历史 */
.history-item {
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}
.history-item:last-child {
  border-bottom: none;
}
.history-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}
.red-mark {
  color: #f5222d;
}
.history-time {
  font-size: 12px;
  color: #999;
  margin: 4px 0;
}
.history-content {
  font-size: 14px;
  color: #555;
  margin: 0;
}
.history-footer {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}

/* 顶部橙色标题栏 */
.chat-header {
  background: #f7a847;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.heart-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.header-text h3 {
  margin: 0;
  font-size: 17px;
}
.header-text p {
  margin: 2px 0 0;
  font-size: 12px;
  opacity: 0.9;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  color: #f7a847;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #fffef8;
  min-height: 350px;
  max-height: 500px;
}
.ai-msg {
  display: flex;
  gap: 10px;
}
.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f7a847;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.msg-box {
  max-width: 70%;
  background: #f8f8f8;
  border-radius: 0 12px 12px 12px;
  padding: 12px 16px;
}
.msg-box p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}
.msg-time {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
  display: block;
}

/* 底部输入框区域 */
.chat-input-area {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}
.input-box {
  width: 100%;
  min-height: 60px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 10px;
  resize: none;
  outline: none;
  font-size: 14px;
}
.input-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}
.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f7a847;
  color: #fff;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>