// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// 引入组件
import Data from './Data.vue'
import Article from './Article.vue'
import Log from './Log.vue'
import Record from './Record.vue'
import Container from '@/component/page/Container.vue'
import Diary from '@/client/router/Diary.vue'
import Consult from '@/client/router/Consult.vue'
import Knowledge from '@/client/router/Knowledge.vue'
import Home from '@/client/Home.vue'
import Page from '@/client/router/Page.vue'
import Login from '@/component/page/Login.vue'
import Register from '@/component/page/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/admin',
      component: Container,
      redirect: '/admin/data',
      children: [
        { path: 'data', component: Data },
        { path: 'article', component: Article },
        { path: 'record', component: Record },
        { path: 'log', component: Log }
      ]
     },
     {
      path: '/home',
      component: Home,
      redirect: '/home/page',
      children: [
        { path: 'page', component: Page },
        { path: 'consult', component: Consult },
        { path: 'diary', component: Diary },
        { path: 'knowledge', component: Knowledge }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (!token && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else {
    next()
  }
})

export default router