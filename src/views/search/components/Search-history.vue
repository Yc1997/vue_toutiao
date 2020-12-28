<template>
  <div>
    <van-cell title="历史记录">
      <div v-if="isIconShow">
        <span @click="$emit('delete')" style="padding-right: 5px"
          >全部删除</span
        >
        <span @click="isIconShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isIconShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in search_histories"
      :key="index"
      @click="deleteHistories(index)"
    >
      <div slot="right-icon" v-if="isIconShow">
        <van-icon name="close"></van-icon>
      </div>
    </van-cell>
  </div>
</template>
<script>
import { setItem } from "@/utils/Storage";
export default {
  props: {
    searchText: {
      type: String,
      required: true,
    },
    search_histories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isIconShow: false,
    };
  },
  created() {},
  methods: {
    deleteHistories(index) {
      this.search_histories.splice(index, 1);
      setItem("search-histories", this.search_histories);
    },
  },
};
</script>

<style lang='less' scoped>
</style>