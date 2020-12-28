<template>
  <div>
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <van-field
      class="field"
      v-model="message"
      rows="2"
      type="textarea"
      maxlength="7"
      placeholder="请输入修改后的昵称"
      show-word-limit
    />
  </div>
</template>
<script>
import { changeUserName } from "@/api/user";
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      message: this.value,
    };
  },
  created() {},
  methods: {
    async onClickRight() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });
      try {
        if (this.message.trim()) {
          await changeUserName({ name: this.message });
        } else {
          this.$toast.fail("请输入正确的昵称");
        }

        this.$emit("input", this.message);
        this.$emit("close");
        this.$toast.success("修改成功");
      } catch (err) {
        if (err && err.response && err.response.status === "409") {
          this.$toast.fail("昵称已存在");
        }
      }
    },
  },
};
</script>

<style lang='less' scoped>
.field {
}
</style>