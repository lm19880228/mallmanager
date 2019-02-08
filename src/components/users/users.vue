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
    <el-table :data="userlist" style="width: 100%">
      <!-- type="index" 在单元格中显示每行索引 -->
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 如果单元格内显示的内容不是字符串(文本),需要给被显示的内容外层包裹一个template -->
      <el-table-column label="创建日期">
        <!-- 在template里面使用外层数据 设置slot-scope -->
        <!-- 该属性的值是要用的create_time数据的数据源userlist -->
        <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist -->
        <!-- userlist.row -> 数组中的每个对象 -->
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <!-- 单元格内不是字符串就要用tmplate包裹 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      // 表格绑定的数据
      userlist: [],
      // 数据库数据总数
      total: 0,
      // 初始显示页数
      pagenum: 1,
      // 每页显示条数
      pagesize: 2
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 分页相关方法
    // 每页显示条数变化时 触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
      this.pagenum=1
      this.getUserList() 
    },
    // 页码改变时 触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
      this.getUserList() 
    },
    // 获取用户列表的请求
    async getUserList() {
      // query查询参数 可以为空 (搜索框)
      // pagenum当前页码 不能为空
      // pagesize每页显示条数 不能为空
      // `内部可以用${ } 可以输出js数据`

      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      // 获取token
      const AUTH_TOKEN = localStorage.getItem("token");
      // 设置请求头 发送token令牌(除了登录之外的所有情况都需要授权)
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users;
        // 2.给total赋值 数据库数据总数
        this.total = total;
        // 3.提示
        this.$message.success(msg);
      } else {
        // 提示
        this.$message.warning(msg);
      }
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
