<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :item="item"
      @reply-comment="reply"
    />
  </van-list>
</template>
<script>
import { getComment } from "@/api/comment";
import CommentItem from "./comment-item";
export default {
  props: {
    // articles: {
    //   type: Object,
    //   required: true,
    // },
    source: {
      type: [Array, String, Object],
      required: true,
    },
    type: {
      type: String,
      default: "a",
    },
    list: {
      type: Array,
      default: () => [], //数组或者对象必须是返回一个函数
    },
  },
  components: {
    CommentItem,
  },
  data() {
    return {
      loading: false,
      finished: false,
      limit: 10, //每页请求的评论数量
      offset: null, //请求下一页的数据
    };
  },
  created() {},
  methods: {
    async onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getComment({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit,
      });
      console.log(data);
      const { results } = data.data;
      this.list.push(...results);

      // 加载状态结束
      this.loading = false;

      // 数据全部加载完成
      if (results.length) {
        this.offset = data.data.last_id;
      } else {
        this.finished = true;
      }
      this.$emit("reply-count", data.data.total_count);
    },
    reply($event) {
      this.$emit("reply-comment", $event);
    },
  },
};
</script>

<style lang='less' scoped>
</style>