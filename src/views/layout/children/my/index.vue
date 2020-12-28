<template>
  <div class="my-container">
    <van-cell-group class="my-info" v-if="user">
      <!-- 个人资料 -->
      <van-cell center class="my-base" :border="false">
        <!-- cell表格插槽icon表示的是左侧的图标  title代表的是左侧的文字内容 right-icon代表的右侧的内容 -->
        <div slot="icon">
          <van-image
            class="user-img"
            width="60"
            height="60"
            round
            :src="userInfo.photo"
            fit="cover"
          />
        </div>
        <div slot="title" class="dName">{{ userInfo.name }}</div>
        <div slot="right-icon">
          <van-button size="mini" round @click="$router.push('user-details')"
            >编辑资料</van-button
          >
        </div>
      </van-cell>
      <!-- 个人功能 -->
      <van-grid :border="false">
        <van-grid-item class="grid-item">
          <!-- grid表格插槽icon代表的是表格竖列的图标  text代表的是竖列文字-->
          <div slot="text">
            <div class="my-nums">{{ userInfo.art_count }}</div>
            <div class="my-items">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <div slot="text">
            <div class="my-nums">{{ userInfo.follow_count }}</div>
            <div class="my-items">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <div slot="text">
            <div class="my-nums">{{ userInfo.fans_count }}</div>
            <div class="my-items">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <div slot="text">
            <div class="my-nums">{{ userInfo.like_count }}</div>
            <div class="my-items">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录的布局 -->
    <van-cell-group class="my-info" v-else>
      <!-- 个人资料 -->
      <van-cell center class="my-base" :border="false">
        <!-- cell表格插槽icon表示的是左侧的图标  title代表的是左侧的文字内容 right-icon代表的右侧的内容 -->
        <div slot="icon" class="unLogin" @click="$router.push('/login')">
          <van-image
            class="userOut-img"
            width="70"
            height="70"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            fit="cover"
          />
          <div class="click-login">点击登录</div>
        </div>
      </van-cell>
    </van-cell-group>
    <!-- 收藏和喜欢 -->
    <!-- icon-prefix可以自定义图标 -->
    <van-grid :column-num="2" class="fav-like">
      <van-grid-item
        icon-prefix="toutiao"
        icon="shoucang"
        text=" 收藏"
        class="fav"
      />
      <van-grid-item
        icon-prefix="toutiao"
        icon="lishi"
        text="喜欢"
        class="like"
      ></van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link class="xinxi" />
    <van-cell title="小智同学" is-link class="sz-student" />
    <van-button
      round
      type="info"
      size="large"
      class="outLogin"
      v-if="user"
      @click="outLogin"
      >{{ user ? "退出登录" : "" }}</van-button
    >
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { getUsers } from "@/api/login";
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    ...mapMutations(["setUser"]),
    // 退出登录  清除当前本地存储的状态即可
    outLogin() {
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "您确定要退出登录吗?",
        })
        .then(() => {
          this.setUser(null);
        })
        .catch((err) => {
          return err;
        });
    },
    async getUserInfo() {
      const { data } = await getUsers();
      this.userInfo = data.data;
    },
  },
};
</script>

<style lang='less' scoped>
.my-container {
  .my-info {
    background: url("../../../../assets/banner.png") no-repeat;
    background-size: cover;
    width: 100%;
    .my-base {
      background: none;
      padding: 0.9rem 0.7rem 0;
      box-sizing: border-box;
      .user-img {
        height: 3rem;
        border: 1px solid #fff;
      }
      .dName {
        color: #eee;
        padding-left: 0.3rem;
      }
    }
  }
  .grid-item {
    text-align: center;
    color: #fff;
    font-size: 0.4rem;
  }
  /deep/ .van-grid-item__content {
    background: none;
  }
  .fav-like {
    background-color: #fff;
    /deep/ .toutiao-shoucang {
      color: red;
      font-size: 0.7rem;
    }
    /deep/ .toutiao-lishi {
      color: rgb(255, 160, 35);
      font-size: 0.7rem;
    }
    /deep/ .van-grid-item__text {
      font-size: 0.35rem;
      color: #333;
    }
  }
  .xinxi {
    margin-top: 0.3rem;
  }
  .outLogin {
    margin-top: 0.3rem;
  }
  //未登录时
  .unLogin {
    margin: 0.4rem 0 1rem 3.4rem;
    text-align: center;
    color: #fff;
  }
}
</style>