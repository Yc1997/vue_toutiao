<template>
  <div>
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="cancel"
        @focus="isResultsShow = false"
      />
    </form>
    <!-- 具体思路就是当searchText有值时展示联想建议 -->
    <!-- 搜索结果 -->
    <SearchResults v-if="isResultsShow" :searchText="searchText" />
    <!-- 联想建议 -->
    <SearchSuggsions
      v-else-if="searchText"
      :searchText="searchText"
      @toSearch="onSearch"
    />
    <!-- 搜索记录 -->
    <SearchHistory
      v-else
      :searchText="searchText"
      :search_histories="searchHistories"
      @delete="deletes"
    />
  </div>
</template>
<script>
import SearchSuggsions from "./components/Search-suggsions";
import SearchHistory from "./components/Search-history";
import SearchResults from "./components/Search-result";
import { setItem, getItem } from "@/utils/Storage";
export default {
  data() {
    return {
      searchText: "",
      isResultsShow: false,
      searchHistories: getItem("search-histories") || [],
    };
  },
  components: {
    SearchSuggsions,
    SearchHistory,
    SearchResults,
  },
  created() {},
  methods: {
    //点击移动端搜索或键盘的回车键触发
    onSearch(item) {
      if (!this.searchText.trim()) {
        return;
      }
      //父组件接收联想建议页面的自定义事件，实时的将联想建议出来的数据绑定给searchText
      this.searchText = item;
      this.isResultsShow = true;
      const index = this.searchHistories.indexOf(this.searchText); //检测搜索记录中是否有当前搜索的这一项
      if (index > -1) {
        this.searchHistories.splice(index, 1); //如果有，就把当前这一项在数组中的索引返回再进行删除
      }
      this.searchHistories.unshift(this.searchText);
      setItem("search-histories", this.searchHistories);
    },
    cancel() {
      this.isResultsShow = false;
      this.$router.back();
    },
    deletes() {
      // if (this.searchHistories) {
      //   this.$dialog
      //     .confirm({
      //       title: "提示",
      //       message: "你确定要全部删除吗?",
      //     })
      //     .then(() => {
      //       this.searchHistories = [];
      //       setItem("search-histories", this.searchHistories);
      //     })
      //     .catch((err) => {
      //       return err;
      //     });
      // } else {
      //   this.$toast("请选择你要删除的选项");

      // }
      this.searchHistories = [];
      setItem("search-histories", this.searchHistories);
    },
  },
};
</script>

<style lang='less' scoped>
/deep/ .van-search {
  background-color: rgb(50, 150, 250);
  .van-search__action {
    color: #fff;
  }
}
</style>