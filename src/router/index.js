// 引入组件 配置路由

import Vue from "vue";
import Router from "vue-router";
// import login from '../components/login/login.vue'
// 在路径中 @ -> 会自动找到src文件夹
import Login from "@/components/login/login.vue";
import Home from "@/components/home/home.vue";
import Users from "@/components/users/users.vue";
import Right from "@/components/rights/right.vue";
import Roles from "@/components/rights/role.vue";
import Goods from "@/components/goods/goodslist.vue";
import Goodsadd from "@/components/goods/goodsadd.vue";
import Params from "@/components/goods/cateparams.vue";
import Goodscate from "@/components/goods/goodscate.vue";

import { MessageBox } from "element-ui";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: "login",
      path: "/login",
      component: Login
    },
    {
      name: "home",
      path: "/",
      component: Home,
      // 路由嵌套
      children: [
        {
          name: "users",
          path: "/users",
          component: Users
        },
        {
          name: "right",
          path: "/rights",
          component: Right
        },
        {
          name: "roles",
          path: "/roles",
          component: Roles
        },
        {
          name: "goods",
          path: "/goods",
          component: Goods
        },
        {
          name: "goodsadd",
          // 此处路径不是后台返回数据 路径随意填写
          path: "/goodsadd",
          component: Goodsadd
        },
        {
          name: "params",
          // 此处路径不是后台返回数据 路径随意填写
          path: "/params",
          component: Params
        },
        {
          name: "categories",
          path: "/categories",
          component: Goodscate
        }
      ]
    }
  ]
});

// 在路由配置生效之前 统一判断token
// 路由守卫 在路由配置生效之前
// 路由/导航 守卫
// to -> 要去的路由配置
// from -> 当前的路由配置
//  / -> /login   home -> login   to就是login from就是home路由配置

router.beforeEach((to, from, next) => {
  // to from next
  // console.log(to,from)
  // 如果要去的是登录 -> next()
  if (to.path === "/login") {
    next();
  } else {
    // 如果要去的不是登录
    // 判断token
    const token = localStorage.getItem("token");
    if (!token) {
      // 如果token没有 -> login
      // this.$router.push({name:'login})
      //提示 this.$message.warning('回到登录')
      MessageBox.alert("请先登录");
      router.push({ name: "login" });
      // 如果走到这 完成以后 下面next方法还会执行
      // return 直接结束下方代码
      return;
    }
    // 如果有 -> next()
    next();
  }
});

export default router;

// node 中间件
// app.use((req,res,next) => {
//   // req.body
//   // res.render()
//   // next
//   // next()方法 会自动调用 下一个中间件
//   next()
// })

// app.use((req,res,next) => {
//   // req.body
//   // res.render()
//   // next
// })
