<template>
  <div class="details">
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="details-list">
      <div class="details-title">{{ articles.title }}</div>
      <div class="aut-details">
        <div class="details-info">
          <van-image
            width="40"
            height="40"
            round
            :src="articles.aut_photo"
          ></van-image>
          <div class="details-aut_name">
            <div>{{ articles.aut_name }}</div>
            <div class="details-pubdate">
              {{ articles.pubdate | relativeTime }}
            </div>
          </div>
        </div>
        <van-button
          round
          :type="isFollowed ? 'default' : 'danger'"
          class="follow"
          size="small"
          :loading="isloading"
          :icon="isFollowed ? '' : 'plus'"
          @click="follow"
          >{{ isFollowed ? "已关注" : "关注" }}</van-button
        >
      </div>
    </div>
    <div class="markdown-body" v-html="articles.content" ref="details"></div>
    <van-divider class="divider" :style="{ borderColor: '#333' }"
      >正文结束</van-divider
    >
    <van-cell title="全部评论" :border="false"></van-cell>
    <!-- 全部评论       :articles="articles"-->
    <CommentList
      :source="articleId"
      class="comment-list"
      @reply-count="replyCount = $event"
      :list="list"
      @reply-comment="replyComment"
    />
    <!-- 文章详情页底部 -->
    <ArticleFooter
      :articles="articles"
      :replyCount="replyCount"
      @write-comment="replyCommentArticle = true"
    />
    <!-- 文章详情底部弹出层 -->
    <van-popup v-model="replyCommentArticle" position="bottom">
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

    <!-- 回复用户评论弹出层 -->
    <van-popup v-model="replyCommentUser" position="bottom" style="height: 90%">
      <!-- 这里因为缓存的原因，当点击一个回复评论的数据时，假如有6个回复，后面所有的都将是6个回复。使用v-if进行销毁和重新渲染即可 -->
      <ReplyComment
        :replyCommentContent="replyCommentContent"
        :articleId="articleId"
        v-if="replyCommentUser"
        @close="replyCommentUser = false"
      />
    </van-popup>
  </div>
</template>
<script>
import { getArticlesDetails, Followed, deFollowed } from "@/api/news";
import { addComment } from "@/api/comment";
import { ImagePreview } from "vant";
import ArticleFooter from "./components/article-footer";
import CommentList from "./components/comment-list";
import ReplyComment from "./components/reply-comment";
export default {
  // props: {
  //   articleId: {
  //     type: [String, Number], //文章id有可能是两种类型
  //     required: true,
  //   },
  // },
  components: {
    ArticleFooter,
    CommentList,
    ReplyComment,
  },
  data() {
    return {
      articles: {},
      isFollowed: false, //是否关注,
      articleId: this.$route.params.articleId, //文章id
      isloading: false,
      replyCount: 0, //文章评论回复数量
      replyCommentArticle: false, //控制文章详情页底部弹出层的显示和隐藏
      commentValue: "", //文章评论回复的信息,
      list: [], //将文章评论保存在数组中,
      replyCommentUser: false, //回复用户评论,
      replyCommentContent: {}, //从commentitem组件传过来的信息
    };
  },
  created() {
    this.getArticles();
  },
  mounted() {},
  watch: {
    // $route(to, from) {
    //   if (
    //     to.params.articleId != from.params.articleId &&
    //     to.params.articleId != undefined
    //   ) {
    //     //pid不为空才请求数据
    //     this.articleId = to.params.articleId;
    //     this.getArticles(); //调接口，请求数据
    //   }
    // },
    // immediate: true,
  },

  methods: {
    //获取文章详情
    async getArticles() {
      const { data } = await getArticlesDetails(this.articleId);
      // console.log(data);
      this.articles = data.data;
      this.$nextTick(() => {
        this.getPhotoPreview();
      });
    },
    //是否关注
    async follow() {
      this.isloading = true;
      if (!this.isFollowed) {
        await Followed(this.articles.aut_id);
      } else {
        await deFollowed(this.articles.aut_id);
      }
      this.isFollowed = !this.isFollowed;
      this.isloading = false;
      this.$toast.success(`${this.isFollowed ? "关注成功" : "取消关注"}`);
    },
    //点击图片之后展示图片预览
    getPhotoPreview() {
      //1.获取文章列表容器
      let imgsList = this.$refs["details"];
      //2.获取容器中所有的图片
      const imgs = imgsList.querySelectorAll("img");
      //3.给图片依次绑定点击事件
      let imgItem = [];
      imgs.forEach((img, index) => {
        imgItem.push(img.src);
        img.onclick = function () {
          ImagePreview({ images: imgItem, startPosition: index });
          //图片预览判断是第几张图片时只需把index索引的值赋值给startPosition即可
        };
      });
    },
    //添加文章评论
    async onPostComment() {
      if (!this.commentValue.trim()) {
        return this.$toast.fail("请输入内容");
      }
      const { data } = await addComment({
        target: this.articleId,
        content: this.commentValue,
      });
      console.log(data);
      this.list.unshift(data.data.new_obj);
      this.replyCount++;
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true,
      });
      this.replyCommentArticle = false;
      this.commentValue = "";
    },
    replyComment(item) {
      this.replyCommentContent = item;
      this.replyCommentUser = true;
    },
  },
};
</script>

<style lang='less' scoped>
@import url("./githup-markdown.css");
.details {
  background-color: #fff;
  /deep/ .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .details-list {
    margin-top: 45px;
    padding: 20px;
    .details-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 30px;
    }
    .aut-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .details-info {
        display: flex;
        .details-aut_name {
          padding-left: 10px;
          font-size: 14px;
          .details-pubdate {
            color: #999;
          }
        }
      }
      /deep/.van-button {
        width: 85px;
        height: 30px;
      }
    }
  }
  .markdown-body {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 44px;
  }
  .divider {
    padding: 0 20px;
  }
  .comment-list {
    margin-bottom: 50px;
  }
  .comment-field {
    display: flex;
    align-items: center;
  }
}
</style>