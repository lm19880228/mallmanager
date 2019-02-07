<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4" class="left">
          <div class="grid-content bg-purple"></div>
          <img src="../../assets/logo.png" alt="无法显示图片">
        </el-col>
        <el-col :span="18" class="middle">
          <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="2" class="exit">
          <div class="grid-content bg-purple">
            <a class="loginout" @click.prevent="handleSignout()" href>退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航el-mene -->
        <!-- 此处虽然本实例内没有 unique-opened属性 但是Vue.js里面有 -->
        <!-- 开启路由模式 -->
        <el-menu
        :unique-opened="true"
        :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 此处相当于router-link -->
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户量列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-star-off"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3  -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-tickets"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // newVue之前自动触发 验证是否是正常登陆(防止跳墙登陆)
  beforeCreate () {
    // 1.获取token
    const token = localStorage.getItem('token')

    if (!token) {
      // token 没有 -> 登陆
      this.$router.push({ name: 'login' })
    }
    // token 有 -> 继续渲染组件(继续执行钩子函数)
  },
  methods: {
    handleSignout () {
      // 1. 清除token
      localStorage.clear()
      // 2. 提示
      this.$message.success('退出成功')
      // 3. 来到login组件
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.left img {
  margin-top: 1px;
}
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  padding: 0px;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
/* 头部样式 */
.middle {
  text-align: center;
  line-height: 61px;
}
.loginout {
  text-decoration: none;
  color: blueviolet;
}
.exit {
  line-height: 62px;
  text-align: left;
}
.loginout:hover {
  text-decoration: underline;
  color: blue;
}
</style>
