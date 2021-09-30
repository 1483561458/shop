<template>
  <view class="bargain-record" ref="container">
    <view class="item" v-for="(item, bargainrecordIndex) in bargain" :key="bargainrecordIndex">
      <view class="picTxt acea-row row-between-wrapper">
        <view class="pictrue">
          <image :src="item.image" />
        </view>
        <view class="text acea-row row-column-around">
          <view class="line1">{{ item.title }}</view>
          <count-down
            :isDay="true"
            :tipText="'倒计时 '"
            :dayText="' 天 '"
            :hourText="' 时 '"
            :minuteText="' 分 '"
            :secondText="' 秒'"
            :datatime="item.datatime"
          ></count-down>
          <view class="money font-color-red">
            已砍至
            <text class="symbol">￥</text>
            <text class="num">{{ item.residuePrice }}</text>
          </view>
        </view>
      </view>
      <view class="bottom acea-row row-between-wrapper">
        <view class="purple" v-if="item.status === 1">活动进行中</view>
        <view class="success" v-else-if="item.status === 3">砍价成功</view>
        <view class="end" v-else>活动已结束</view>
        <view class="acea-row row-middle row-right">
          <view
            class="bnt cancel"
            v-if="item.status === 1"
            @click="getBargainUserCancel(item.bargainId)"
          >取消活动</view>
          <view
            class="bnt bg-color-red"
            v-if="item.status === 1"
            @click="goDetail(item.bargainId)"
          >继续砍价</view>
          <view class="bnt bg-color-red" v-else @click="goList">重开一个</view>
        </view>
      </view>
    </view>
    <Loading :loaded="status" :loading="loadingList"></Loading>
  </view>
</template>
<script>
import CountDown from "@/components/CountDown";
import { getBargainUserList, getBargainUserCancel } from "@/api/activity";
import Loading from "@/components/Loading";

export default {
  name: "BargainRecord",
  components: {
    CountDown,
    Loading
  },
  props: {},
  data: function() {
    return {
      bargain: [],
      status: false, //砍价列表是否获取完成 false 未完成 true 完成
      loadingList: false, //当前接口是否请求完成 false 完成 true 未完成
      page: 1, //页码
      limit: 20 //数量
    };
  },
  mounted: function() {
    this.getBargainUserList();
  },
  onReachBottom() {
    !this.loadingList && this.getBargainUserList();
  },
  methods: {
    goDetail: function(id) {
      this.$yrouter.push({
        path: "/pages/activity/DargainDetails/index",
        query: { id, partake: 0 }
      });
    },
    goList: function() {
      this.$yrouter.push({
        path: "/pages/activity/GoodsBargain/index"
      });
    },
    getBargainUserList: function() {
      var that = this;
      if (that.loadingList) return;
      if (that.status) return;
      getBargainUserList({ page: that.page, limit: that.limit })
        .then(res => {
          that.status = res.data.length < that.limit;
          that.bargain.push.apply(that.bargain, res.data);
          that.page++;
          that.loadingList = false;
        })
        .catch(res => {
           uni.showToast({
                          title: res.msg,
                          icon: "none",
                          duration: 2000
                        });
        });
    },
    getBargainUserCancel: function(bargainId) {
      var that = this;
      getBargainUserCancel({ bargainId: bargainId })
        .then(res => {
          uni.showToast({
            title: res.msg,
            icon: "success",
            duration: 2000
          });
          that.status = false;
          that.loadingList = false;
          that.page = 1;
          that.bargain = [];
          that.getBargainUserList();
        })
        .catch(res => {
           uni.showToast({
                          title: res.msg,
                          icon: "none",
                          duration: 2000
                        });
        });
    }
  }
};
</script>
