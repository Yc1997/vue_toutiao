<template>
  <div>
    <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleListItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
          @click.native="$router.push('/article/' + article.art_id)"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/news";
import ArticleListItem from "./article-list-item";
export default {
  components: {
    ArticleListItem,
  },
  props: {
    channles: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      articles: [], //文章列表数据
      pre_timestamp: null, //重新获取到的时间戳,
      isRefreshLoading: false, //下拉刷新属性
    };
  },
  methods: {
    /**List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      • load 事件：
      • List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
      • 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
      • loading 属性：控制加载中的 loading 状态
      • 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
      • 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
      • finished 属性：控制加载结束的状态
      • 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
      • 所有数据加载结束，finished 为 true，此时不会触发 load 事件 */
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channles.id,
        timestamp: this.pre_timestamp || Date.now(), //这里传的时间戳参数不能是固定的，否则获取到的数据都是一样的
        with_top: 1,
      });
      //这里的文章列表必须要Push到数组中去
      const results = data.data.results;
      this.articles.push(...results);
      // 2. 把数据放到 list 数组中
      // 加载状态结束
      this.loading = false;
      // 如果加载的数据还有 则继续请求数据
      if (results.length) {
        // 更新获取下一页数据的页码
        this.pre_timestamp = data.data.pre_timestamp;
      } else {
        this.finished = true;
      }
    },
    // 下拉刷新
    async onRefresh() {
      const { data } = await getArticles({
        channel_id: this.channles.id,
        timestamp: Date.now(),
        with_top: 1,
      });
      const results = data.data.results;
      this.articles.unshift(...results);
      this.$toast("刷新成功");
      this.isRefreshLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>