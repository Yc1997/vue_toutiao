<template>
  <div>
    <div class="edit-list">编辑频道</div>
    <div class="my-edit">
      <van-cell center :border="false">
        <div slot="icon">我的频道</div>
        <div slot="title" class="to-article">点击进入频道</div>
        <div>
          <van-button
            size="mini"
            plain
            round
            type="danger"
            @click="isEditShow = !isEditShow"
            >{{ isEditShow ? "完成" : "编辑" }}</van-button
          >
        </div>
      </van-cell>
      <van-grid :gutter="10">
        <!--因为父组件栏目的active跟循环渲染的index值一样 所以使用父子传递信息的方法把父组件的active的值传过来跟index做对比 -->
        <van-grid-item
          :class="{ active: active === index }"
          v-for="(value, index) in articleList"
          :key="index"
          :icon="isEditShow && index !== 0 ? 'clear' : ''"
          :text="value.name"
          @click="editClick(value, index)"
        >
        </van-grid-item>
      </van-grid>
    </div>
    <div class="my-edit">
      <van-cell center :border="false">
        <div slot="icon">推荐频道</div>
        <div slot="title" class="to-article">点击添加频道</div>
      </van-cell>
      <van-grid :gutter="10">
        <van-grid-item
          v-for="value in getDiffrentData"
          :key="value.id"
          :text="value.name"
          @click="onAdd(value)"
        >
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>
<script>
import { getChannels, addArticles, deleteArticles } from "@/api/news";
import { mapState } from "vuex";
import { setItem } from "@/utils/Storage";
export default {
  props: {
    articleList: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isEditShow: false,
      channelsData: [],
    };
  },
  created() {
    this.getChannelsData();
  },
  computed: {
    //获取我的频道和推荐频道不同的数据
    //1.若返回值为true，说明元素通过测试，则Array.find()返回的是使返回值为true的数组中的那一项
    //2.否则，它返回undefined，表明没有元素通过测试,表示对比的数据不相同
    //2.1 (正好满足我们需要不同数据的需求，只需将不满足的取反为true返回即可)
    //一旦返回true，则终止继续遍历数组，该项之后的子项不会再传进函数，所以find方法只能返回符合条件的第一个子项
    /*
     * 这里我们要找的是两个数组对象中不同的数据，!arr1.find这样写的意思就是如果返回的结果是true
     * 那么就取反为false就不会把相同的数据返回出去，而返回值是undefined时，表示这两个值不相等
     * 不相等表示的就是两个数组中没有这个数据，正好就是我们想要的，undefined取反为true返回不同数据的那一项
     */
    getDiffrentData() {
      return this.channelsData.filter((v) => {
        return !this.articleList.find((k) => {
          return k.id === v.id;
        });
      });
    },
    ...mapState(["user"]),
  },
  methods: {
    async getChannelsData() {
      const { data } = await getChannels();
      this.channelsData = data.data.channels;
    },
    editClick(value, index) {
      //如果为true表示为编辑状态
      if (this.isEditShow && index !== 0) {
        //这里删除的数据不需要再往推荐数据中添加，因为computed当依赖项发生改变自己会重新计算并添加和我的频道不同的数据
        this.deleteArticle(value, index);
      } else {
        //不是编辑状态就进行跳转频道
        this.switchArticle(index);
      }
    },
    async deleteArticle(value, index) {
      //有个问题：删除当前高亮频道后面的频道没影响，但是删除当前频道之前的话高亮会跳到后面一个频道上去
      /*
       *因为删除前面频道时，active的值并没有及时的更新(假如当前active是3，把它前面一位删除之后当前active变成了2，而父组件的active没有及时更新)
       *父组件的acive仍然为3，所以active就会高亮到当前这一项的后面active为3的那一项上去
       */
      this.articleList.splice(index, 1);
      if (index <= this.active) {
        this.$emit("updata-active", this.active - 1);
      }
      if (this.user) {
        const data = await deleteArticles(value.id);
      } else {
        setItem("user-article", this.articleList);
      }
    },
    //跳转频道
    switchArticle(index) {
      // console.log("跳转频道", index);
      this.$emit("to-article", index);
    },
    //添加数据
    async onAdd(value) {
      this.articleList.push(value);
      if (this.user) {
        await addArticles({
          channels: [{ id: value.id, seq: this.articleList.length }],
        });
      } else {
        setItem("user-article", this.articleList);
      }
    },
  },
};
</script>

<style lang='less' scoped>
.edit-list {
  height: 50px;
  font-size: 16px;
  text-align: center;
  line-height: 50px;
  border-bottom: 1px solid #eee;
}
.my-edit {
  .to-article {
    font-size: 12px;
    color: #999;
    padding-left: 5px;
  }
  /deep/ .van-button {
    padding: 0 8px;
  }
  /deep/ .van-grid-item__content {
    background-color: #f4f5f6;
    /deep/.van-icon {
      position: absolute;
      right: -8px;
      top: -5px;
      color: #ccc;
      opacity: 0.8;
      font-size: 16px;
    }
    .van-grid-item__text {
      margin-top: 0;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>