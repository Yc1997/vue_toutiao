<template>
  <div class="home-container">
    <!-- navbar导航栏 -->
    <van-nav-bar class="home" :border="false">
      <div slot="title">
        <van-button
          round
          size="small"
          icon="search"
          class="search-btn"
          to="/search"
          >搜索</van-button
        >
      </div>
    </van-nav-bar>
    <!-- 标签栏 -->
    <van-tabs v-model="active">
      <div slot="nav-right" class="icon-none"></div>
      <div slot="nav-right" @click="isPopUpShow = true">
        <van-icon name="apps-o" class="icon-more"></van-icon>
      </div>
      <van-tab :title="item.name" v-for="item in channelsList" :key="item.id">
        <ArticleList :channles="item" class="article-list" />
      </van-tab>
    </van-tabs>
    <!-- 弹出层最好写在body下比较好 -->
    <van-popup
      v-model="isPopUpShow"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
      ><ArticleEdit
        :articleList="channelsList"
        @to-article="toActive"
        @updata-active="active = $event"
        :active="active"
    /></van-popup>
  </div>
</template>
<script>
import { getChannels } from "@/api/news";
import ArticleList from "@/components/article-list";
import ArticleEdit from "@/components/article-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/Storage";
export default {
  components: {
    ArticleList,
    ArticleEdit,
  },
  data() {
    return {
      active: 0, //控制tab标签页默认展示哪一个标题
      channelsList: [],
      isPopUpShow: false, //控制弹出层的显示和隐藏
    };
  },
  created() {
    this.getChannelsData();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async getChannelsData() {
      //在首页正确得展示数据
      let results = [];
      //1.如果用户登录了
      if (this.user) {
        const { data } = await getChannels();
        results = data.data.channels;
      } else {
        //没登录，判断用户本地是否有数据
        const users = getItem("user-article");
        if (users) {
          results = users;
        } else {
          const { data } = await getChannels();
          results = data.data.channels;
        }
      }

      this.channelsList = results;
    },
    toActive(index) {
      this.isPopUpShow = false;
      this.active = index;
    },
  },
};
</script>

<style lang='less' scoped>
.home-container {
  position: relative;
  .home {
    width: 100%;
    height: 1.2rem;
    background-color: #3196fa;
    .search-btn {
      position: absolute;
      top: 50%;
      right: 0.3rem;
      width: 95%;
      transform: translateY(-50%);
      background-color: #5babfb;
      color: #fff;
      border: none;
    }
  }
  /deep/ .van-tabs__line {
    background-color: #5babfb;
  }
  .article-list {
    position: fixed;
    top: 90px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .icon-more {
    position: fixed;
    right: 0;
    height: 43px;
    line-height: 43px;
    font-size: 22px;
    opacity: 0.8;
    background-color: #fff;
  }
  .icon-none {
    flex-shrink: 0;
    padding-left: 15px;
  }
}
</style>