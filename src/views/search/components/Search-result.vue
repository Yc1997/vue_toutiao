<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in resultlist"
        :key="item.art_id"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearchResults } from "@/api/search";
export default {
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      resultlist: [],
      finished: false,
      page: 1,
      per_page: 10,
    };
  },
  created() {},
  methods: {
    async onLoad() {
      // 异步更新数据
      const { data } = await getSearchResults({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText,
      });
      let results = data.data.results;
      this.resultlist.push(...results);

      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
      if (results.length) {
        this.page++;
      } else {
        this.finished = true;
      }
    },
  },
};
</script>

<style lang='less' scoped>
/deep/ .van-list {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>