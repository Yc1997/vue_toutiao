<template>
  <div>
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="注册/登录"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <!-- 登录 -->
    <!-- 因为form表单默认会提交请求，所以直接写在form表单上就行 -->
    <van-form
      @submit="userLogin"
      :show-error="false"
      :show-error-message="false"
      validate-first
      @failed="formFailed"
      ref="formRef"
    >
      <van-field
        v-model="user.mobile"
        left-icon="user-circle-o"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        name="mobile"
      />
      <van-field
        v-model="user.code"
        left-icon="closed-eye"
        clearable
        type="password"
        :rules="formRules.code"
        placeholder="请输入短信验证码"
        name="code"
      >
        <!-- @finish  倒计时结束时触发的事件函数-->
        <template #button>
          <van-count-down
            :time="time"
            v-if="isFinish"
            format="ss s"
            @finish="isFinish = false"
          />
          <van-button
            v-else
            size="small"
            @click.prevent="codeChange"
            :loading="isLoading"
            >{{ codeMsg }}</van-button
          >
        </template>
      </van-field>
      <van-button type="info" size="large">登录</van-button>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from "@/api/login";
import { Toast } from "vant";
export default {
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //密码
      },
      codeMsg: "发送验证码", //验证码,
      isFinish: false,
      // form表单验证
      formRules: {
        mobile: [
          { required: true, message: "请填写手机号" },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: "请输入正确的手机号" },
        ],
        code: [
          { required: true, message: "请填写验证码" },
          { pattern: /^\d{6}$/, message: "请输入正确的验证码" },
        ],
      },
      time: 1000 * 5,
      isLoading: false,
    };
  },
  created() {},
  methods: {
    //登录
    async userLogin() {
      this.$toast.loading({
        message: "登录中", //背景文本
        forbidClick: true, //禁止触摸背景
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        Toast.success("登录成功");
        this.$store.commit("setUser", data.data);
        this.$router.go(-1);
        console.log(data);
      } catch (err) {
        this.$toast.fail({
          message: "登录失败,手机号或验证码错误",
          forbidClick: true,
          duration: 1000,
        });
      }
    },
    //发送验证码
    async codeChange() {
      try {
        // 在验证表单的时候通常是通过van-field组件的name属性来进行验证的 validate这个方法返回的是一个promise
        await this.$refs["formRef"].validate("mobile");
        this.isLoading = true;
        const res = await sendSms(this.user.mobile);
        this.isFinish = true;
      } catch (err) {
        let message = "";
        if (err && err.response && err.response.status === 429) {
          //当验证码发送的太频繁就返回429的错误信息
          message = "发送太频繁了，请稍后再试";
        } else if (err.name === "mobile") {
          //表单验证失败的错误信息
          message = err.message;
        } else {
          //未知的错误
          message = "发送失败，请稍后重试";
        }
        this.$toast({
          message,
          position: "top",
        });
      }
      this.isLoading = false;
    },
    //表单验证不通过触发的事件，事件就有一个参数event
    formFailed(res) {
      if (res.errors) {
        this.$toast({
          message: res.errors[0].message,
          position: "top",
        });
      }
    },
  },
};
</script>

<style lang='less' scoped>
.van-nav-bar__title {
  color: #666;
}
.van-cell__title {
  margin: 0 0.2rem;
  span {
    color: #ccc;
  }
}
.van-field__body {
  padding: 0 0.4rem;
}
.van-button {
  border-radius: 0.2rem;
}
.van-count-down {
  border: 1px solid #eee;
  padding: 0.15rem 0.4rem;
  text-align: center;
  border-radius: 0.3rem;
}
</style>