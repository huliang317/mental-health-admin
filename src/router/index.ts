// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// 引入组件
import Data from './Data.vue'
import Article from './Article.vue'
import Log from './Log.vue'
import Record from './Record.vue'
import Container from '@/component/page/Container.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/data',
      component: Data
    },
    {
      path: '/article',
      component: Article
    },
    {
      path: '/log',
      component: Log
    },
    {
      path: '/record',
      component: Record
    },
    {
      path: '/container',
      component: Container
    }
  ]
})

export default router