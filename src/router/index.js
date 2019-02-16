// 引入组件 配置路由

import Vue from 'vue'
import Router from 'vue-router'
// import login from '../components/login/login.vue'
// 在路径中 @ -> 会自动找到src文件夹
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      // 路由嵌套
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'right',
          path: '/rights',
          component: Right
        },
        {
          name: 'role',
          path: '/role',
          component: Role
        }
      ]
    }
  ]
})
