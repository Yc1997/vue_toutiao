<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    <input type="file" hidden ref="file" accept="image/*" @change="change" />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <div>
        <van-image
          round
          width="35"
          height="35"
          fit="cover"
          :src="users.photo"
        />
      </div>
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      center
      v-model="users.name"
      @click="isEditName = true"
    >
    </van-cell>
    <van-cell
      title="性别"
      is-link
      center
      :value="users.gender === 0 ? '男' : users.gender === 1 ? '女' : ''"
      @click="isEditSex = true"
    >
    </van-cell>
    <van-cell
      title="生日"
      is-link
      center
      :value="users.birthday"
      @click="isEditTime = true"
    >
    </van-cell>
    <!-- 编辑昵称 -->
    <van-popup
      class="edit-name"
      v-model="isEditName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 当修改昵称点击取消时，再重新修改昵称会显示上一次未完成的昵称，所有使用v-if进行重新渲染和销毁 -->
      <!-- 当我们需要父组件传递的值同时又需要修改父组件传过来的值，那么可以使用v-model简写   v-model会默认传递一个名字叫value的数据  还会默认监听@input事件  v-model的本质还是父子组件通信，它仅仅是简化了父组件的使用。 -->
      <EditName
        v-if="isEditName"
        v-model="users.name"
        @close="isEditName = false"
        @input="users.name = $event"
      />
    </van-popup>
    <!-- 编辑昵称 -->
    <van-popup
      class="edit-name"
      v-model="isEditName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 当修改昵称点击取消时，再重新修改昵称会显示上一次未完成的昵称，所有使用v-if进行重新渲染和销毁 -->
      <!-- 当我们需要父组件传递的值同时又需要修改父组件传过来的值，那么可以使用v-model简写   v-model会默认传递一个名字叫value的数据  还会默认监听@input事件  v-model的本质还是父子组件通信，它仅仅是简化了父组件的使用。 -->
      <EditName
        v-if="isEditName"
        v-model="users.name"
        @close="isEditName = false"
        @input="users.name = $event"
      />
    </van-popup>
    <!-- 编辑性别 -->
    <van-popup v-model="isEditSex" position="bottom" :style="{ height: '40%' }">
      <EditSex
        v-if="isEditSex"
        @close="isEditSex = false"
        v-model="users.gender"
        @input="users.gender = $event"
      />
    </van-popup>
    <!-- 修改出生年月日 -->
    <van-popup
      v-model="isEditTime"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <EditTime
        v-if="isEditTime"
        @close="isEditTime = false"
        v-model="users.birthday"
        @input="users.birthday = $event"
      />
    </van-popup>
    <!-- 修改头像 -->
    <van-popup
      v-model="isEditPhoto"
      position="bottom"
      class="edit-photo"
      :style="{ height: '100%' }"
    >
      <EditPhoto
        v-if="isEditPhoto"
        @close="isEditPhoto = false"
        :image="image"
        @update-photo="users.photo = $event"
      />
    </van-popup>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/user";
import EditName from "./edit-name";
import EditSex from "./edit-sex";
import EditTime from "./edit-time";
import EditPhoto from "./edit-photo";
export default {
  components: {
    EditName,
    EditSex,
    EditTime,
    EditPhoto,
  },
  data() {
    return {
      users: {},
      isEditName: false, //控制编辑昵称弹出层
      isEditSex: false,
      isEditTime: false,
      isEditPhoto: false,
      image: null,
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const { data } = await getUserInfo();
      this.users = data.data;
    },
    change() {
      this.isEditPhoto = true;
      let image = this.$refs.file.files[0];
      this.image = image;
      //为了解决选中相同图片不再触发change事件，需要手动的情况file的value
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang='less' scoped>
.edit-name {
  background-color: #f5f7f9;
}
.edit-photo {
  background-color: #000;
}
</style>