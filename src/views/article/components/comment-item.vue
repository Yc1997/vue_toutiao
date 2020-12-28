<template>
  <div class="comment-list">
    <van-cell>
      <div slot="icon" class="comment-icon">
        <van-image
          round
          width="35"
          height="35"
          fit="cover"
          :src="item.aut_photo"
        />
      </div>
      <div slot="title">
        <div class="comment-title">
          <div>{{ item.aut_name }}</div>
          <div class="comment-zan" @click="likeCount">
            <van-icon
              :name="item.is_liking ? 'good-job' : 'good-job-o'"
              :color="item.is_liking ? 'red' : ''"
            />
            <span>{{ item.like_count }}</span>
          </div>
        </div>
        <div class="comment-item-text">{{ item.content }}</div>
        <div class="comment-item-time">
          <span class="comment-time">{{ item.pubdate | relativeTime }}</span>
          <van-button size="mini" @click="$emit('reply-comment', item)"
            >回复{{ item.reply_count }}</van-button
          >
        </div>
      </div>
    </van-cell>
  </div>
</template>
<script>
import {
  getComment,
  commentLikings,
  deleteCommentLikings,
} from "@/api/comment";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      is_liking: false,
    };
  },
  created() {},
  methods: {
    //对文章评论点赞
    async likeCount() {
      if (!this.item.is_liking) {
        await commentLikings(this.item.com_id.toString());
        this.item.like_count++;
      } else {
        await deleteCommentLikings(this.item.com_id.toString());
        this.item.like_count--;
      }
      this.item.is_liking = !this.item.is_liking;
    },
  },
};
</script>

<style lang='less' scoped>
.comment-list {
  .comment-icon {
    padding-right: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .comment-zan {
      display: flex;
      align-items: center;
    }
  }
  .comment-item-time {
    display: flex;
    align-items: center;
    .comment-time {
      padding-right: 10px;
    }
  }
  .comment-item-text {
    margin: 5px 0;
  }
}
</style>