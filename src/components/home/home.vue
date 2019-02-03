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
            <a class="loginout" href>退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
*{
    margin: 0;
    padding: 0;
}
.left img{
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
.middle{
  text-align: center;
  line-height: 61px;
}
.loginout{
 text-decoration: none;
 color: black;
}
.exit{
    line-height: 62px;
    text-align: center;
}
.loginout:hover{
    text-decoration: underline;
    color: blue;
}
</style>
