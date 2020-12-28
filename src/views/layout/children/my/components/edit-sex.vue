<template>
  <div>
    <van-picker
      title="选择性别"
      show-toolbar
      :default-index="defaultIndex"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>
<script>
import { changeUserName } from "@/api/user";
export default {
  //不能在子组件里面修改父组件传过来的双向绑定的值
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value,
    };
  },
  created() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });
      await changeUserName({ gender: this.defaultIndex });
      this.$emit("input", this.defaultIndex);
      this.$emit("close");

      this.$toast.success("修改成功");
    },
    // 选项改变时触发	单列：Picker 实例，选中值，选中值对应的索引
    // 多列：Picker 实例，所有列选中值，当前列对应的索引
    onChange(picker, value, index) {
      this.defaultIndex = index;
      // console.log(picker, value, index);
    },
  },
};
</script>

<style lang='less' scoped>
</style>