<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索 -->
    <!-- 行 -->
    <el-row class="searchRow">
      <!-- 列 -->
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <!-- type="index" 在单元格中显示每行索引 -->
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="邮箱"></el-table-column>
      <el-table-column prop label="电话"></el-table-column>
      <el-table-column prop="date" label="创建日期"></el-table-column>
      <el-table-column prop label="用户状态"></el-table-column>
      <el-table-column prop label="操作"></el-table-column>
    </el-table>
    <!-- 4.分页 -->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum:1,
      pagesize:2,
      //表格绑定的数据
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        }
      ]
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表的请求
    async getUserList() {
      // query查询参数 可以为空 (搜索框)
      // pagenum当前页码 不能为空
      // pagesize每页显示条数 不能为空
      // `内部可以用${ } 可以输出js数据`

      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      // 获取token
      const AUTH_TOKEN = localStorage.getItem('token')
      // 设置请求头 发送token令牌(除了登录之外的所有情况都需要授权)
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(res);
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 333px;
}
.searchRow {
  margin-top: 15px;
}
</style>
