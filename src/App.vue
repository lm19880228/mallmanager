<template>
  <div id="app">
     <!-- 其他组件展示的容器要写在1根组件中 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
 height: 100%;
}
</style>
