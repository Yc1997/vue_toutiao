<template>
  <div>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="cancel"
      @confirm="onConfirm"
    ></van-datetime-picker>
  </div>
</template>
<script>
import dayjs from "dayjs";
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
      minDate: new Date(1970, 0, 1), //最起点的时间
      maxDate: new Date(2030, 10, 1), //未来最大的时间
      currentDate: this.getcurrentDate(), //当前时间
    };
  },
  created() {},
  computed: {},
  methods: {
    getcurrentDate() {
      return new Date(this.value);
    },
    cancel() {
      this.$emit("close");
    },
   async onConfirm(value) {
        this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
      });
      const date = dayjs(value).format("YYYY-MM-DD"); //将时间格式化成：1992-09-04这种
      await changeUserName({birthday:date})
      this.$emit('input',date)
      this.$emit('close')
       this.$toast.success("修改成功");
    },
  },
};
</script>

<style lang='less' scoped>
</style>