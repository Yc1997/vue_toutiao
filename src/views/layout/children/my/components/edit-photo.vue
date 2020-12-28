<template>
  <div>
    <div class="nav-bar">
      <span @click="$emit('close')">取消</span>
      <span @click="onConfirm">确定</span>
    </div>
    <img :src="images" alt="" class="user-image" ref="image" />
  </div>
</template>
<script>
import { changeUserPhoto } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  props: {
    image: {
      required: true,
      cropper: null,
    },
  },
  data() {
    return {
      images: window.URL.createObjectURL(this.image),
    };
  },
  created() {},
  mounted() {
    //因为裁切需要获取dom，所以写在mounted
    const cropperImage = this.$refs.image;
    this.cropper = new Cropper(cropperImage, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
  methods: {
    getPhoto() {
      return new Promise((res) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          res(blob);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      });
      //编辑头像的请求头参数是multipart/form-data，上传文件必须使用这个参数类型
      const file = await this.getPhoto();
      const fd = new FormData();
      fd.append("photo", file);
      await changeUserPhoto(fd);
      this.$toast.success("修改成功");
      this.$emit("update-photo", window.URL.createObjectURL(file));
      this.$emit("close");
    },
  },
};
</script>

<style lang='less' scoped>
.user-image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
.nav-bar {
  height: 44px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 0 20px;
  z-index: 22;
}
</style>