<template>
  <div class="footer">
    <van-button size="small" round @click="$emit('write-comment')"
      >写评论</van-button
    >
    <div class="footer-icon">
      <van-icon name="comment-o" :badge="replyCount" />
      <van-icon
        :name="is_collected ? 'star' : 'star-o'"
        :color="is_collected ? 'orange' : ''"
        @click="collect"
      />
      <van-icon
        :name="attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="attitude === 1 ? 'red' : ''"
        @click="likeArticles"
      />
      <van-icon name="share" />
    </div>
  </div>
</template>
<script>
import {
  Articlecollections,
  deArticlecollections,
  likeArticle,
  deLikeArticle,
} from "@/api/news";
export default {
  props: {
    articles: {
      type: Object,
      required: true,
    },
    replyCount: {
      type: Number,
      default: 9,
    },
  },
  // art_id
  data() {
    return {
      is_collected: false,
      attitude: -1,
    };
  },
  created() {},
  methods: {
    //收藏/取消收藏文章
    async collect() {
      this.toast();
      if (!this.is_collected) {
        await Articlecollections(this.articles.art_id);
      } else {
        await deArticlecollections(this.articles.art_id);
      }
      this.is_collected = !this.is_collected;
      this.$toast.success(`${this.is_collected ? "收藏成功" : "取消收藏"}`);
    },
    //点赞/取消点赞文章
    async likeArticles() {
      this.toast();
      if (this.attitude === -1) {
        await likeArticle(this.articles.art_id);
        this.attitude = 1;
      } else {
        await deLikeArticle(this.articles.art_id);
        this.attitude = -1;
      }
      this.$toast.success(
        `${
          this.attitude === 1
            ? "点赞成功"
            : this.attitude === -1
            ? "取消点赞"
            : ""
        }`
      );
    },
    toast() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true, //禁止背景点击
      });
    },
  },
};
</script>

<style lang='less' scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 33;
  border-top: 1px solid #ccc;
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  padding: 0 10px;
  background-color: #eee;
  /deep/ .van-button {
    flex: 1;
    width: 153px;
    height: 30px;
  }
  .footer-icon {
    flex: 1;
    display: flex;
    justify-content: space-around;
    font-size: 16px;
  }
  .star {
    color: orange;
  }
}
</style>