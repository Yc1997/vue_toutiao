<template>
  <div>
    <router-view />

    <van-tabbar route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/question" icon="comment-o"> 问答</van-tabbar-item>
      <van-tabbar-item replace to="/video" icon="video-o"> 视频</van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang='less' scoped>
</style>