<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div><el-icon :size="50"><MoonNight /></el-icon></div>
        <h2>心理健康AI助手</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名/邮箱"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
          登录
        </el-button>

        <div class="login-footer">
          <span>还没有账号？</span>
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

defineOptions({
  name: 'Login'
})

const emit = defineEmits(['login-success', 'switch-to-register'])

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 记住密码
const rememberMe = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ]
}

const loginFormRef = ref<FormInstance>()

// 登录提交
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  const valid = await loginFormRef.value.validate()
    if(valid){
        let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: '/api/user/login',
              headers: { 
                  'Content-Type': 'application/json'
              },
              data : loginForm
            };

        const response = await axios.request(config)
        console.log(response.data)

        if(response.data.code === 'BUSINESS_ERROR') {
          ElMessage.error(response.data.message)
        }else{
          localStorage.setItem('token',response.data.data.token)
          localStorage.setItem('username',response.data.data.userInfo.displayName)
          emit('login-success',loginForm)
        }
    }else{
        ElMessage.error('请填写正确的信息')
    }
   }

// 跳转到注册
const goToRegister = () => {
  emit('switch-to-register')
}

// 检查是否有记住的用户名
const checkRememberUser = () => {
  const rememberUser = localStorage.getItem('rememberUser')
  if (rememberUser) {
    loginForm.username = rememberUser
    rememberMe.value = true
  }
}

checkRememberUser()
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.login-header p {
  font-size: 14px;
  color: #8b9090;
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 24px 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #8b9090;
}

.login-footer span {
  margin-right: 8px;
}
</style>