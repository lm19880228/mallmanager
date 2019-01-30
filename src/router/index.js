import Vue from 'vue'
import Router from 'vue-router'
// import login from '../components/login/login.vue'
// 在路径中 @ -> 会自动找到src文件夹
import login from '@/components/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    }
  ]
})
