// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import moment from 'moment'
// 回顾axios
// import axios from 'axios'
// Vue.prototype.$http = axios

// 把一个不是第三方插件的Vue库变成第Vue插件
import MyserverHttp from '@/plugins/http.js'

// 不要忘记引入样式文件
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import router from './router'
// 使用Vue插件 只有Vue插件可以使用use方法
Vue.use(ElementUI)
Vue.use(MyserverHttp)
// 项目上线阶段 生产环境Vue提示不输出
Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 给实例注册组件(把根组件放在模板中 把模板再放在el所管理的视图中) render:(h)=>h(App)
  components: { App },
  // 在当前new Vue实例的template模板中 使用注册完的根组件
  // 完整写法template: '<App><App/>' 此处去掉了一个开始标签 只写一个关闭标签
  template: '<App/>'
})
