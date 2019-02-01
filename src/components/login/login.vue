<template>
  <div class="login-wrap">
    <!-- 为了不报错 提供值formdata -->
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名:">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      // 希望让异步操作的代码看起来像同步代码 ES7写法:async+await
      // res就是 .then()方法里面的后端返回值
      const res = await this.$http.post("login", this.formdata)
        // console.log(res.data);
        const {
          // 把等号右侧数据中键名为data的值赋值给data
          data,
          // 去等号右侧数据中找到meta的值
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          // 登陆成功 跳转home
          this.$router.push({ name: "home" });
          this.$message.success(msg);
          // 2. 提示成功
        } else {
          // 不成功 提示信息
          this.$message.warning(msg);
        }



      // 正常写法:
      // this.$http.post("login", this.formdata).then(res => {
      //   console.log(res.data);
      //   const {
      //     // 把等号右侧数据中键名为data的值赋值给data
      //     data,
      //     // 去等号右侧数据中找到meta的值
      //     meta: { msg, status }
      //   } = res.data; // data: {id: 500, rid: 30, username: "admin", mobile: "12345678", email: "adsfad@qq.com", …}
      //                 // meta: {msg: "登录成功", status: 200}
      //   // const {meta:obj} = {meta:{msg:'登陆成功',status:200}}
      //   // const obj = {msg:'登陆成功',status:200}
      //   // 只提取等号右侧数据中一部分的数据
      //   // const {meta:{msg,status}} = {meta:{msg:'登陆成功',status:200}}
      //   // const {msg,status} = {msg:'登陆成功',status:200}
      //   if (status === 200) {
      //     // 登陆成功 跳转home
      //     this.$router.push({name:'home'})
      //     this.$message.success(msg);

      //     // 2. 提示成功
      //    }else{
      //       // 不成功 提示信息
      //    this.$message.warning(msg);
      //    this.formdata = ''
      //   }

      // });

  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  /* 弹性盒布局 水平垂直居中*/
  display: flex;
  /* 对齐方式 */
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-wrap .login-btn {
  width: 100%;
}
</style>
