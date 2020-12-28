<template>
  <div>
    <div class="nav-bar">
      <div><van-icon name="cross" @click="$emit('close')"></van-icon></div>
      <div>{{ replyCommentContent.reply_count }}条回复评论</div>
      <div></div>
    </div>
    <!-- 当前评论项 -->
    <CommentItem :item="replyCommentContent" />
    <!-- 全部的回复评论 -->
    <van-cell title="全部评论"> </van-cell>
    <CommentList
      :source="replyCommentContent.com_id"
      type="c"
      :list="commentLists"
    />
    <!-- 文章详情评论回复底部弹出层 -->
    <div class="btn">
      <van-button round size="normal" @click="replyCommentEnd = true"
        >回复评论</van-button
      >
    </div>
    <van-popup v-model="replyCommentEnd" position="bottom">
      <van-field
        v-model="commentValue"
        rows="2"
        type="textarea"
        maxlength="50"
        placeholder="请输入评论信息"
        show-word-limit
        class="comment-field"
      >
        <div slot="extra" style="padding-left: 8px" @click="onPostComment">
          发布
        </div>
      </van-field>
    </van-popup>
  </div>
</template>
<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import { addComment } from "@/api/comment";
export default {
  props: {
    replyCommentContent: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  components: {
    CommentItem,
    CommentList,
  },
  data() {
    return {
      replyCommentEnd: false,
      commentValue: "",
      commentLists: [],
    };
  },
  created() {},
  methods: {
    onClickLeft() {},
    async onPostComment() {
      if (!this.commentValue.trim()) {
        return this.$toast.fail("请输入内容");
      }
      const { data } = await addComment({
        target: this.articleId,
        content: this.commentValue,
        art_id: this.articleId ? this.articleId.toString() : null,
      });
      console.log(data);
      this.commentLists.unshift(data.data.new_obj);
      this.replyCommentContent.reply_count++;
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
      });
      this.replyCommentEnd = false;
      this.commentValue = "";
    },
  },
};
</script>

<style lang='less' scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 10px;
}
.btn {
  height: 50px;
  background-color: #eee;
  border-top: 1px solid #999;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/.van-button {
    width: 300px;
    height: 35px;
  }
}
// /deep/.van-button {
//
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   z-index: 9;
//   display: 1;
//   justify-content: center;
//   align-items: center;
// }
</style>