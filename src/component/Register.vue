<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div ><el-icon :size="50"><MoonNight /></el-icon></div>
        <h2>注册新账号</h2>
        <p>加入心理健康AI助手</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="0"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            :prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="gender">
            <el-radio-group v-model="registerForm.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="2">女</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="registerForm.agree">
            我已阅读并同意
            <el-link type="primary">《用户协议》</el-link>
            和
            <el-link type="primary">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <el-button type="primary" size="large" class="register-btn" @click="handleRegister">
          立即注册
        </el-button>

        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

defineOptions({
  name: 'Register'
})

const emit = defineEmits([ 'to-login'])

// 表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender:0,
  agree: false
})

// 验证确认密码
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证同意协议
const validateAgree = (rule: any, value: boolean, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线或中文', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+$/, message: '密码只能包含大小写字母和数字', trigger: 'blur' }
  ],   
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agree: [
    { validator: validateAgree, trigger: 'change' }
  ]
}

const registerFormRef = ref<FormInstance>()

// 注册提交
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  const valid = await registerFormRef.value.validate()
    if (valid) {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/user/add',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : {
        username:registerForm.username,
        email:registerForm.email,
        password:registerForm.password,
        confirmPassword:registerForm.confirmPassword,
        gender:registerForm.gender,
        userType:1
        }
        };
      
        const response = await axios.request(config)
        console.log(response.data)

        if(response.data.code === 'BUSINESS_ERROR') {
          ElMessage.error(response.data.message)
        }else{
          ElMessage.success('注册成功！即将前往登录')
          setTimeout(()=>{
            emit('to-login')
          },2000)
        }
    } else {
      ElMessage.error('请填写正确的信息')
    }
  }

// 跳转到登录
const goToLogin = () => {
  emit('to-login')
}
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 460px;
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.register-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px 0;
}

.register-header p {
  font-size: 14px;
  color: #8b9090;
  margin: 0;
}

.register-form {
  margin-top: 16px;
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 16px;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  color: #8b9090;
}

.register-footer span {
  margin-right: 8px;
}
</style>