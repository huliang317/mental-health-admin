<template>
  <!-- 未登录：显示登录/注册 -->
  <div v-if="!isLoggedIn">
    <Login 
      v-if="showLogin" 
      @switch-to-register="showLogin = false"
      @login-success="toContainer"
    />
    <Register 
      v-else 
      @to-login="showLogin = true"
    />
  </div>
  
  <!-- 已登录：显示主页面 -->
  <div v-else>
    <Container />
  </div>
</template>

<script setup lang="ts">
import Container from '@/component/Container.vue'
import Login from './component/Login.vue';
import Register from './component/Register.vue';
import {ref} from 'vue'
import router from './router/index.ts';

const showLogin = ref(true) 
const isLoggedIn = ref(false) 

function toContainer(){
  isLoggedIn.value = true
  router.push('/data')
}
</script>

<style scoped></style>
  