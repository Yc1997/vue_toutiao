<template>
  <div>
    <van-cell
      icon="search"
      v-for="(item, index) in SuggsionsData"
      :key="index"
      @click="search(item)"
    >
      <!-- @click="$emit('search', item)"点击联想建议进入搜索结果页 其实就相当于点击回车键进入搜索结果页 -->
      <!-- 只需要发送一个自定义事件给父组件 然后父组件执行onSearch搜索方法再实时的把联想建议每一项的值item绑定给父组件的searchText -->
      <div slot="title" v-html="highLight(item, searchText)"></div
    ></van-cell>
  </div>
</template>
<script>
import { getSearchSuggsions } from "@/api/search";
import { debounce } from "lodash";
export default {
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      SuggsionsData: [],
    };
  },
  created() {
    // this.getSuggsionsData();
  },
  watch: {
    //需要监听输入框的输入事件触发联想建议的方法，但是这个是子组件，所以可以在watch中监听searchText的变化
    //如果不监听输入框的变化的话那么只会请求第一次输入框的变化的值，再改变输入框的值就不再请求数据了。
    //使用watch时会有一个bug，监听不到第一次的回调方法
    // 因为监听输入框变化的同时会一直发送网络请求，为了性能使用防抖功能
    searchText: {
      handler: debounce(async function () {
        if (!this.searchText.trim()) {
          return this.$toast("请输入内容");
        }
        const { data } = await getSearchSuggsions({ q: this.searchText });
        this.SuggsionsData = data.data.options;
      }, 400),
      //这个功能就是开启watch时第一次也直接触发回调
      immediate: true,
    },
  },
  methods: {
    highLight(str, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, "gi");
      return str.replace(reg, `<span style="color: red">${keyword}</span>`);
    },
    search(item) {
      this.$emit("toSearch", item);
    },
  },
};
</script>

<style lang='less' scoped>
</style>