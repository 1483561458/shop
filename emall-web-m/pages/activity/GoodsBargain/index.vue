<template>
  <view class="bargain-list">
    <!-- <view class="header">
      <image src="@/static/images/cut-bg.png" alt="">
    </view>-->
    <view class="list" v-if="bargainLis.length > 0">
      <view
        class="item acea-row row-between-wrapper"
        v-for="(item, bargainLisIndex) in bargainLis"
        :key="bargainLisIndex"
      >
        <view class="pictrue">
          <image :src="item.image" />
        </view>
        <view class="text acea-row row-column-around">
          <view class="line1" v-text="item.title"></view>
          <view class="num">
            <text class="iconfont icon-pintuan"></text>
            {{ item.people }}人正在参与
          </view>
          <view class="money font-color-red">
            可砍至: ￥
            <text class="price">{{item.minPrice}}</text>
          </view>
        </view>
        <view class="cutBnt bg-color-red" @click="goDetail(item.id)">
          <text class="iconfont icon-kanjia"></text>参与砍价
        </view>
      </view>
      <view class="load font-color-red" v-if="!status" @click="getBargainList">点击加载更多</view>
    </view>
    <!-- <view class="noCommodity" style="background-color: #fff;" v-if="bargainLis.length === 0">
      <view class="noPictrue">
        <image src="@/static/images/noGood.png" class="image" />
      </view>
    </view> -->
  </view>
</template>
<script>
import { getBargainList } from "@/api/activity";
export default {
  name: "GoodsBargain",
  components: {},
  props: {},
  data: function() {
    return {
      bargainLis: [], //砍价列表
      status: false, //砍价列表是否获取完成 false 未完成 true 完成
      loading: false, //当前接口是否请求完成 false 完成 true 未完成
      page: 1, //页码
      limit: 20 //数量
    };
  },
  mounted: function() {
    this.getBargainList();
  },
  methods: {
    getBargainList: function() {
      var that = this;
      if (that.loading) return;
      if (that.status) return;
      that.loading = true;
      getBargainList({ page: that.page, limit: that.limit }).then(res => {
        that.status = res.data.length < that.limit;
        that.bargainLis.push.apply(that.bargainLis, res.data);
        that.page++;
        that.loading = false;
      });
    },
    goDetail: function(id) {
      this.$yrouter.push({
        path: "/pages/activity/DargainDetails/index",
        query: { id, partake: 0 }
      });
    }
  }
};
</script>

<style >
page{
    background-color: rgb(245, 245, 245);
}
</style>
