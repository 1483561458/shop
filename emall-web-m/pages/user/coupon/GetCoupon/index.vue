<template>
  <view ref="container">
    <div class="coupon-list" v-if="couponsList.length > 0">
      <div
        class="item acea-row row-center-wrapper"
        v-for="(item, index) in couponsList"
        :key="index"
      >
        <div class="money" :class="item.isUse ? 'moneyGray' : ''">
          <div>
            ￥
            <span class="num">{{ item.couponPrice }}</span>
          </div>
          <div class="pic-num">满{{ item.useMinPrice }}元可用</div>
        </div>
        <div class="text">
          <div class="condition line1">
            <span class="line-title bg-color-check" v-if="item.ctype === 0">通用劵</span>
            <span class="line-title bg-color-check" v-else-if="item.ctype === 1">商品券</span>
            <span class="line-title bg-color-check" v-else>未知</span>
            <span>{{ item.cname }}</span>
          </div>
          <div class="data acea-row row-between-wrapper">
            <div v-if="item.endTime !== 0">{{ item.startTime }}-{{ item.endTime }}</div>
            <div v-else>不限时</div>
            <div class="bnt gray" v-if="item.isUse === true">已领取</div>
            <div class="bnt gray" v-else-if="item.isUse === 2">已领完</div>
            <div class="bnt bg-color-red" v-else @click="getCoupon(item.id, index)">立即领取</div>
          </div>
        </div>
      </div>
    </div>

    <Loading :loaded="loadend" :loading="loading"></Loading>
    <!--暂无优惠券-->
    <view class="noCommodity" v-if="couponsList.length === 0 && page > 1">
      <view class="noPictrue">
        <image src="@/static/images/noCoupon.png" class="image" />
      </view>
    </view>
  </view>
</template>
<script>
import { getCoupon, getCouponReceive } from "@/api/user";
import Loading from "@/components/Loading";
import DataFormatT from "@/components/DataFormatT";
export default {
  name: "getCoupon",
  components: {
    Loading,
    DataFormatT
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 10,
      couponsList: [],
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.getUseCoupons();
  },
  onReachBottom() {
    !this.loading && this.getUseCoupons();
  },
  methods: {
    getCoupon: function(id, index) {
      let that = this;
      let list = that.couponsList;
      getCouponReceive(id)
        .then(function(res) {
          list[index].isUse = true;
          uni.showToast({
            title: "领取成功",
            icon: "success",
            duration: 2000
          });
        })
        .catch(function(err) {
          uni.showToast({
            title:
              err.msg || err.response.data.msg || err.response.data.message,
            icon: "none",
            duration: 2000
          });
        });
    },
    getUseCoupons: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
	  that.storeId = this._route.query.storeId; 
      let q = {storeId:that.storeId, page: that.page, limit: that.limit };
      getCoupon(q).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.couponsList.push.apply(that.couponsList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
