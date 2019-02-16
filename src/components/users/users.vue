<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- 2.搜索 -->
    <!-- Layout 布局 -->
    <!-- 行 -->
    <el-row class="searchRow">
      <!-- 列 -->
      <el-col>
        <el-input
          @clear="loadUserList()"
          placeholder="请输入内容"
          v-model="query"
          clearable
          class="inputSearch"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格  内层template属性slot-scope="scope" scope就是userlist userlist.row是数组当前行的每个单元 -->
    <el-table :data="userlist" style="width: 100%">
      <!-- type="index" 在单元格中显示每行索引 -->
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
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
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            @click="showDeleUserMsgBox(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            @click="showSetUserRoleDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
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

    <!-- 对话框 -->
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{currUsername}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!--
            如果select绑定数据的值 和 option的value一致
            就会显示该option的label值
          -->
          {{currRoleId}}
          <el-select v-model="currRoleId">
            <!-- :可使value值变成数字1 不绑定是字符串1-->
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option
            v-for="(item,i) in roles"
            :key="i"
            :label="item.roleName "
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      // 表格绑定的数据
      userlist: [],
      // 数据库数据总数
      total: 0,
      // 初始显示页数
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      // 添加用户对话框的属性
      dialogFormVisibleAdd: false,
      // 编辑用户对话框的属性
      dialogFormVisibleEdit: false,
      // 分配角色对话框的属性
      dialogFormVisibleRol: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色
      currRoleId: -1, // 此值是哪个option就默认显示那个
      currUserId: -1,
      currUsername: '',
      // 保存所有角色数据
      roles: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 分配角色 - 设置角色
    async setRole () {
      // users/:id/role
      // :id 要修改的用户的id值
      // 请求体中 rid 修改的新值角色id
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      })
      //console.log(res)
      this.$message.success(res.data.meta.msg)
      this.dialogFormVisibleRol = false
    },
    // 分配角色 - 打开对话框
    async showSetUserRoleDia (user) {
      this.currUsername = user.username
      // 给currUserId赋值
      this.currUserId = user.id
      // 获取所有的角色
      const res1 = await this.$http.get(`roles`)
      // console.log(res1);
      this.roles = res1.data.data
      // 获取当前用户的角色id -? rid
      const res = await this.$http.get(`users/${user.id}`)
      // console.log(res)
      // 接口文档的key名 是role_id 其实是rid
      this.currRoleId = res.data.data.rid
      this.dialogFormVisibleRol = true
    },
    // 修改状态
    async changeMgState (user) {
      // 发送请求
      // user/:uId/state/:type
      // 1. mg_state = false
      // 2. 点开关 -> mg_state=true 视图中的数据是双向绑定的 点开关就会改变user.mg_state的值 即可发送请求
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
    },
    // 编辑用户 - 发送请求
    async editUser () {
      // users/:id
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      //  console.log(res)
      // 1. 关闭对话框
      this.dialogFormVisibleEdit = false
      // 2. 更新视图
      this.getUserList()
    },
    // 编辑用户 - 显示对话框
    showEditUserDia (user) {
      this.form = user
      // 获取用户数据
      this.dialogFormVisibleEdit = true
    },
    // 删除用户 - 打开消息盒子(confirm)
    showDeleUserMsgBox (userId) {
      this.$confirm('确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除的请求 :id用户id
          // 1. data中找userId 不行
          // 2. 把userId以参数形式传进来
          const res = await this.$http.delete(`users/${userId}`)
          // console.log(res);
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            // 更新视图
            this.pagenum = 1
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户 -- 发送请求
    async addUser () {
      const res = await this.$http.post(`users`, this.form)
      // console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 201) {
        // 1. 提示成功
        // console.log(msg);
        this.$message.success(msg)
        // 2. 关闭对话框
        this.dialogFormVisibleAdd = false
        // 3. 更新视图
        this.getUserList()
        // 4. 清空文本框
        // this.form ={}
        for (const key in this.form) {
          if (this.form.hasOwnProperty(key)) {
            this.form[key] = ''
          }
        }
      } else {
        // this.$message.warning(msg)
      }
    },
    // 添加用户 -- 显示对话框
    showAddUserDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 请求搜索框 重新获取数据
    loadUserList () {
      this.getUserList()
    },
    // 搜索用户
    searchUser () {
      // 按照input绑定的query参数 发请求
      this.getUserList()
    },
    // 分页相关方法
    // 24条
    // pagenum=3
    // pagesize=2
    // 1,2/3,4/5,6/
    // 数据->
    // 每页显示条数变化时 触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      // 回到第一页
      this.pagenum = 1
      this.getUserList()
    },
    // 页码改变时 触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 获取用户列表的请求
    async getUserList () {
      // query查询参数 可以为空 (搜索框)
      // pagenum当前页码 不能为空
      // pagesize每页显示条数 不能为空
      // `内部可以用${ } 可以输出js数据`

      // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
      // 获取token
      const AUTH_TOKEN = localStorage.getItem("token");
      // 设置请求头 发送token令牌(除了登录之外的所有情况都需要授权)
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users
        // 2.给total赋值 数据库数据总数
        this.total = total
        // 3.提示
        // this.$message.success(msg);
      } else {
        // 提示
        this.$message.warning(msg)
      }
    }
  }
}
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
