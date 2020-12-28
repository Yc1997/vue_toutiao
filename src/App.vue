<template>
  <div id="app">
    <!-- 因为在做项目得时候只有第一次点击详情页才会渲染，然后就被缓存住了，后面无论你点哪个详情都还是第一次点击得详情页 -->
    <!--App.vue里面缓存得都是一级路由，详情页也是一级， 只需要让详情页不缓存就行了 -->
    <keep-alive :include="['Layout']">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="less">
</style>
