<template>
  <view class="evaluate-list" ref="container">
    <view class="header">
      <view class="generalComment acea-row row-between-wrapper">
        <view class="acea-row row-middle font-color-red">
          <text class="evaluate">评分</text>
          <view class="start" :class="'star' + replyData.replyStar"></view>
        </view>
        <view>
          <text class="font-color-red">{{ replyData.replyChance || 0 }}%</text>
		  <text>好评率</text>
        </view>
      </view>
      <view class="nav acea-row row-middle">
        <view
          class="acea-row row-center-wrapper"
          v-for="(item, navListIndex) in navList"
          :key="navListIndex"
          @click="changeType(navListIndex)"
        >
          <view
            class="item"
            :class="currentActive === navListIndex ? 'bg-color-red' : ''"
            v-if="item.num"
          >
		  <text>{{ item.evaluate }}({{ item.num }})</text>
          </view>
        </view>
      </view>
    </view>
    <UserEvaluation :reply="reply"></UserEvaluation>
    <Loading :loaded="loadend" :loading="loading"></Loading>
  </view>
</template>
<script>
import UserEvaluation from "@/components/UserEvaluation";
import { getReplyConfig, getReplyList } from "@/api/store";
import Loading from "@/components/Loading";

export default {
  name: "EvaluateList",
  components: {
    UserEvaluation,
    Loading
  },
  props: {},
  data: function() {
    return {
      product_id: 0,
      replyData: {},
      navList: [
        { evaluate: "全部", num: 0 },
        { evaluate: "好评", num: 0 },
        { evaluate: "中评", num: 0 },
        { evaluate: "差评", num: 0 }
      ],
      currentActive: 0,
      page: 1,
      limit: 8,
      reply: [],
      loadTitle: "",
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.product_id = this.$yroute.query.id;
    this.getProductReplyCount();
    this.getProductReplyList();
  },
  onReachBottom() {
    !this.loading && this.getProductReplyList();
  },
  methods: {
    getProductReplyCount: function() {
      let that = this;
      getReplyConfig(that.product_id).then(res => {
        that.$set(that, "replyData", res.data);
        that.navList[0].num = res.data.sumCount;
        that.navList[1].num = res.data.goodCount;
        that.navList[2].num = res.data.inCount;
        that.navList[3].num = res.data.poorCount;
      });
    },
    getProductReplyList: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = { page: that.page, limit: that.limit, type: that.currentActive };
      getReplyList(that.product_id, q).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.reply.push.apply(that.reply, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    },
    changeType: function(index) {
      let that = this;
      that.currentActive = index;
      that.page = 1;
      that.loadend = false;
      that.$set(that, "reply", []);
      that.getProductReplyList();
    }
  }
};
</script>
<style scoped lang="less">
.noCommodity {
  height: 8*100rpx;
  background-color: #fff;
}
</style>
