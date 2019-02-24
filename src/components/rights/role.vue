<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrolebtn">
      <!-- 添加按钮 -->
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!--for循环嵌套 数据嵌套关系获取 -->
          <!-- 第1次循环(外层) 输出N行 每行2列 后端返回数据-->
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <!-- 传角色id 和 权限id -->
              <el-tag @close="deleRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 第2次循环(中层) 在第1次循环的第2列内 循环输出N行 每行2列 第1次循环内拿数据-->
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(scope.row,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <!-- 错误写法 这样会输出很多列 -->
                <!-- <el-col :span="4" v-for="(item3,i) in item2.children" :key="i"> -->
                <el-col :span="20">
                  <!-- 第3次循环(内层) 在第2次循环的第2列内 循环输出标签 第2次循环内拿数据 -->
                  <el-tag
                    @close="deleRight(scope.row,item3.id)"
                    closable
                    type="warning"
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length==0">未分配权限</span>
        </template>
      </el-table-column>
      <!-- type="index" 在单元格中显示每行索引 -->
      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="220"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="220"></el-table-column>

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
          <!-- scope.row 当前角色 -->
          <el-button
            @click="showSetRightDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 
           树形结构
           data 数据源 [] 
           show-checkbox 选择框
           node-key	每个节点唯一标识 通常是data数据中key名 id
           efault-expanded-keys	默认展开 [要展开的节点的id]
           default-checked-keys	默认勾选 [要勾选的节点的id] 
           props	配置选 {label,children}
           label节点的文字标题 和 children节点的子节点 
           值都来源于data绑定的数据源中的该数据的key名 'label'和'children'
           :default-expanded-keys="arrexpand"
           :default-checked-keys="[3]"
      -->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      treelist: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      //树形展开
      arrexpand: [],
      //树形选中
      arrcheck: [],
      // 当前角色Id值
      currRoleId:-1,
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    // 修改权限 发送请求
    async setRoleRight(){
       // roles/:roleId/rights
       // roleId 当前要修改权限的角色id
       // rids 树形节点中 所有全选和半选1的label的id []
       // 获取树形结构中全选的id的数组arr1 getCheckedKeys()
       let arr1 = this.$refs.tree.getCheckedKeys()
      console.log(arr1)
       // el-tree标签的js方法
       // div -> js方法/属性innerText
       // 1. 获取div -> dom元素
       // 2. DOM.innerText
       // var div = document.getElementById('div')
       // div.innerText

       // 获取半选的id的数组arr2 getHalfCheckedKeys()
       let arr2 = this.$refs.tree.getHalfCheckedKeys()
       console.log(arr2)
       // arr1.concat(arr2)
       // arr = arr1+arr2
       // ES6 自动展开运算符 ...数组/对象 
       // [...arr1] == [1,2,3]
       const arr = [...arr1,...arr2]
       console.log(arr)
      //  var str = arr.join('')
      //  console.log(str)
       // el-tree -> js方法 getCheckedKeys
       // 
       // 1. 在Vue中操作的dom元素 给要操作的元素设置ref属性值 input ref="txt"
       // 2. this.$refs.ref属性值.js方法名() this.$ref.txt.foucs()
       //this.$refs.tree.getCheckedKeys()

       const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids:arr.join(',')})
       console.log(res)
       // 更新视图
      this.getRolelist()
       this.dialogFormVisibleRight=false

    },
    // 修改/分配 权限 - 打开对话框
    async showSetRightDia(role) {
      console.log(role);
      // 给currRoleId赋值
      this.currRoleId = role.id
      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      console.log(res);
      this.treelist = res.data.data;
      //三层for循环嵌套 遍历数组展开树形结构
      // var arrtemp1 = []
      // this.treelist.forEach(item1 => {
      //   //一级权限 item1数组的每个单元
      //   arrtemp1.push(item1.id);
      //   //二级权限
      //   item1.children.forEach(item2 => {
      //     arrtemp1.push(item2.id);
      //     //三级权限
      //     item2.children.forEach(item3 => {
      //       arrtemp1.push(item3.id);
      //     })
      //   })
      // })
      // console.log(arrtemp1)
      // this.arrexpand = arrtemp1

      // 获取当前角色role 的权限id(树形结构默认勾选)
      // 每次循环先把父节点id循环添加 在每个父节点被循环的时候
      // 在内部二层子孙节点的id循环添加
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        arrtemp2.push(item1.id);
        item1.children.forEach(item2 => {
          arrtemp2.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrcheck = arrtemp2
      this.dialogFormVisibleRight = true;
    },
    // 取消权限
    async deleRight(role, rightId) {
      // 请求路径：roles/:roleId/rights/:rightId
      // :roleId  当前角色 ID 不能为空携带在url中
      // :rightId 要深处的权限 ID 不能为空携带在url中
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res);
      // 删除成功 返回了200和该角色的剩余权限
      // 当前角色的权限 = 该角色的剩余权限 数据双向绑定 :data="rolelist" 数据改变 视图自动更改
      role.children = res.data.data;

      //this.getRolelist()
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      //console.log(res);
      this.rolelist = res.data.data;
      //console.log(this.rolelist)
    }
  }
};
</script>

<style>
.addrolebtn {
  margin-top: 15px;
}
p {
  padding-left: 355px;
  color: red;
}
</style>
