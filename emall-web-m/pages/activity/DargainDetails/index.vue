<template>
  <view class="bargain on">
    <!-- 在header上加 on 为请求支援 -->
    <view :class="[bargainPartake != userInfo.uid ? 'wrapper bargain-box on user' : 'wrapper bargain-box user']" v-if="bargainPartake != userInfo.uid">
      <!-- <view class="people">{{ lookCount }}人查看 丨 {{ shareCount }}人分享 丨 {{ userCount }}人参与</view> -->
      <!-- 帮助砍价、帮砍成功：-->
      <view class="pictxt acea-row row-center-wrapper " >
        <div class="bargain-header">
          <view class="pictrue">
            <image :src="bargainUserInfo.avatar" />
          </view>
          <view class="text">
            {{ bargainUserInfo.nickname }}
            <text>邀请您帮忙砍价</text>
          </view>
        </div>
      </view>
    </view>
    <view class="wrapper bargain-box time on">
      <div class="pictxt ">
        <count-down :isDay="true" :tipText="'倒计时 '" :dayText="' 天 '" :hourText="' 时 '" :minuteText="' 分 '"
          :secondText="' 秒'" :datatime="datatime"></count-down>
      </div>
    </view>
    <view class="wrapper bargain-box bargain-product">
      <view class="pictxt acea-row row-between-wrapper" @click="openAlone">
        <view class="pictrue">
          <image :src="bargain.image" />
          <view class="bargain_view">
            查看商品
            <view class="iconfont icon-jiantou iconfonts"></view>
          </view>
        </view>
        <view class="text acea-row row-column-around">
          <view class="line2" v-text="bargain.title"></view>
          <view class="money font-color-red">
            已砍至: ￥
            <text class="num" v-text="price"></text>
          </view>
          <view class="acea-row row-middle">
            <view class="successNum" v-text="'原价' + bargain.price"></view>
            <view class="successNum" v-text="'已有' + bargainSumCount + '人砍价成功'"></view>
          </view>
        </view>
      </view>
      <view class="cu-progress acea-row row-middle round margin-top">
        <view class="acea-row row-middle bg-red" :style="{ width: loading ? pricePercent + '%' : '' }"></view>
      </view>
      <view class="balance acea-row row-between-wrapper">
        <view v-text="'已砍' + alreadyPrice + '元'"></view>
        <view v-if="surplusPrice === 0">砍价成功</view>
        <view v-else v-text="'还剩' + surplusPrice + '元'"></view>
      </view>
      <!-- 帮助砍价、帮砍成功：-->
      <!-- <view class="bargainSuccess" v-if="bargainPartake != userInfo.uid && !statusUser && !helpListLoading">
        <span class="iconfont icon-xiaolian"></span>已成功帮助好友砍价
      </view> -->
      <!-- 砍价成功：-->
      <view class="bargainSuccess" v-if="
          surplusPrice === 0 &&
            bargainPartake === userInfo.uid &&
            userBargainStatus === 1 &&
            !helpListLoading
        ">
        <span class="iconfont icon-xiaolian"></span>恭喜您砍价成功，快去支付吧~
      </view>

      <view v-if="userBargainStatus == 0 && bargainPartake === userInfo.uid" class="bargainBnt" @click="goParticipate">
        立即参与砍价</view>
      <view class="bargainBnt" @click="goPoster" v-if="
          surplusPrice > 0 &&
            bargainPartake === userInfo.uid &&
            userBargainStatus === 1 &&
            !helpListLoading
        ">邀请好友帮砍价</view>
      <view class="bargainBnt" @click="getBargainHelp" v-else-if="
          bargainPartake != userInfo.uid &&
            userBargainStatus == 1 &&
            statusUser &&
            !helpListLoading
        ">帮好友砍一刀</view>
      <view class="bargainBnt" @click="getBargainStart"
        v-if="bargainPartake != userInfo.uid && !statusUser && !helpListLoading">我也要参与</view>
      <view class="bargainBnt" @click="goPay" v-if="
          surplusPrice === 0 &&
            bargainPartake === userInfo.uid &&
            userBargainStatus === 1
        ">立即支付</view>
      <view class="bargainBnt on" @click="goList">抢更多商品</view>
      <view class="tip">
        已有
        <span class="font-color-red" v-text="helpCount"></span>
        位好友成功帮您砍价
      </view>
      <view class="lock"></view>
    </view>
    <view class="bargainGang bargain-box">
      <view class="title font-color-red acea-row row-center-wrapper">
        <view class="pictrue">
          <image src="@/static/images/left.png" />
        </view>
        <view class="titleCon">砍价帮</view>
        <view class="pictrue on">
          <image src="@/static/images/left.png" />
        </view>
      </view>
      <view class="list">
        <view class="item acea-row row-between-wrapper" v-for="(item, bargainHelpListIndex) in bargainHelpList"
          :key="bargainHelpListIndex">
          <view class="pictxt acea-row row-between-wrapper">
            <view class="pictrue">
              <image :src="item.avatar" />
            </view>
            <view class="text">
              <view class="name line1" v-text="item.nickname"></view>
              <view class="line1" v-text="item.add_time"></view>
            </view>
          </view>
          <view class="money font-color-red">
            <text class="iconfont icon-kanjia"></text>
            砍掉{{ item.price }}元
          </view>
        </view>
      </view>
      <view class="load font-color-red" v-if="!helpListStatus && !helpListLoading" @click="getBargainHelpList">点击加载更多
      </view>
      <view class="lock"></view>
    </view>
    <view class="goodsDetails bargain-box">
      <view class="title font-color-red acea-row row-center-wrapper">
        <view class="pictrue">
          <image src="@/static/images/left.png" />
        </view>
        <view class="titleCon">商品详情</view>
        <view class="pictrue on">
          <image src="@/static/images/left.png" />
        </view>
      </view>
      <view class="conter" v-html="bargain.description"></view>
      <view class="lock"></view>
    </view>
    <view class="goodsDetails bargain-box">
      <view class="title font-color-red acea-row row-center-wrapper">
        <view class="pictrue">
          <image src="@/static/images/left.png" />
        </view>
        <view class="titleCon">活动规则</view>
        <view class="pictrue on">
          <image src="@/static/images/left.png" />
        </view>
      </view>
      <view class="conter" v-html="bargain.rule"></view>
    </view>
    <view class="bargainTip" :class="active === true ? 'on' : ''">
      <!-- <view class="pictrue">
        <image src="@/static/images/bargainBg.jpg" />
        <view class="iconfont icon-guanbi" @click="close"></view>
      </view>-->
      <view class="cutOff" v-if="bargainPartake === userInfo.uid">
        您已砍掉
        <text class="font-color-red" v-text="bargainHelpPrice"></text>元，听说分享次数越多砍价成功的机会越大哦！
      </view>
      <view class="cutOff on" v-else>
        <view class="help font-color-red" v-text="'成功帮砍' + bargainHelpPrice + '元'"></view>，您也可以砍价低价拿哦，快去挑选心仪的商品吧~
      </view>
      <view class="tipBnt" @click="goPoster" v-if="bargainPartake === userInfo.uid">邀请好友帮砍价</view>
      <view class="tipBnt" @click="getBargainStart" v-else>我也要参与</view>
    </view>
    <view class="mask" @touchmove.prevent :hidden="active === false" @click="close"></view>
  </view>
</template>
<script>
  import CountDown from "@/components/CountDown";
  import {
    getBargainDetail,
    getBargainShare,
    getBargainStart,
    getBargainHelp,
    getBargainHelpPrice,
    getBargainHelpList,
    getBargainHelpCount,
    getBargainStartUser
  } from "@/api/activity";
  import {
    postCartAdd
  } from "@/api/store";
  import {
    mapGetters
  } from "vuex";
  import {} from "@/libs/wechat";
  import {
    isWeixin,
    parseQuery,
    handleQrCode
  } from "@/utils/index";

  const NAME = "DargainDetails";

  export default {
    name: "DargainDetails",
    components: {
      CountDown
    },
    props: {},
    data: function () {
      return {
        price: 0,
        bargainId: 0, //砍价编号
        bargainPartake: 0, //参与砍价
        bargain: [], //砍价产品信息
        partake: null,
        bargainSumCount: 0, //砍价成功人数
        activeMsg: "",
        // ssssss
        active: false,
        loading: false,
        datatime: 0,
        lookCount: 0, //查看人数
        shareCount: 0, //分享人数
        userCount: 0, //参与人数
        bargainHelpPrice: 0, //砍掉金额
        bargainHelpList: [],
        helpListStatus: false, //砍价列表是否获取完成 false 未完成 true 完成
        helpListLoading: false, //当前接口是否请求完成 false 完成 true 未完成
        page: 1, //页码
        limit: 2, //数量
        helpCount: 0, //砍价帮总人数
        surplusPrice: 0, //剩余金额
        alreadyPrice: 0, //已砍掉价格
        pricePercent: 0, //砍价进度条
        bargainUserInfo: [], //砍价 开启砍价用户信息
        userBargainStatus: 2, //砍价状态
        statusUser: false // 是否帮别人砍,没砍是true，砍了false
      };
    },
    computed: mapGetters(["userInfo", "isLogin"]),
    // watch: {
    //   $yroute: function(n) {
    //     var that = this;
    //     if (n.name === NAME) {
    //       that.mountedStart();
    //     }
    //   }
    // },
    mounted: function () {
      var that = this;
      that.mountedStart();
      setTimeout(function () {
        that.loading = true;
      }, 500);
    },
    methods: {
      onShareAppMessage: function () {
        return {
          title: this.storeInfo.title,
          imageUrl: this.storeInfo.image,
          path: "pages/activity/DargainDetails/index?id=" + this.storeInfo.id + "&spread=" + uni.getStorageSync(
            "uid"),
          success(res) {
            uni.showToast({
              title: '分享成功'
            })
          },
          fail(res) {
            uni.showToast({
              title: '分享失败',
              icon: 'none'
            })
          }
        }
      },
      //参与砍价
      goParticipate() {
        if (this.bargainPartake === this.userInfo.uid) this.getBargainStart();
        else this.getBargainStartUser();
        this.getBargainHelpCount();
      },
      openAlone: function () {
        this.$yrouter.push({
          path: "/detail/" + this.bargain.productId
        });
      },
      mountedStart: function () {
        var that = this;
        console.log(this)
        let url = handleQrCode();
        console.log(url)
        if (url) {
          that.bargainId = url.bargainId;
          that.partake = url.uid;
        } else {
          that.bargainId = that.$yroute.query.id;
          that.partake = parseInt(that.$yroute.query.partake);
        }
        if (
          this.partake === undefined ||
          this.partake <= 0 ||
          isNaN(this.partake)
        ) {
          that.bargainPartake = that.userInfo.uid;
          // that.$yrouter.push({
          //   path: "/pages/activity/DargainDetails/index",
          //   query: { id: that.bargainId, partake: that.bargainPartake }
          // });
        } else {
          that.bargainPartake = parseInt(this.partake);
        }
        
        that.getBargainHelpCountStart();
        that.getBargainDetail();
        that.getBargainShare(0);
        // if (that.bargainPartake !== that.userInfo.uid) that.getBargainStartUser();
        if (that.bargainPartake === that.userInfo.uid) {
          // that.getBargainStart();
        } else {
          that.getBargainStartUser();
        }
      },
      goPay: function () {
        var data = {};
        var that = this;
        data.productId = that.bargain.productId;
        data.cartNum = that.bargain.num;
        data.uniqueId = "";
        data.bargainId = that.bargainId;
        data.new = 1;
        postCartAdd(data)
          .then(res => {
            that.$yrouter.push({
              path: "/pages/order/OrderSubmission/index",
              query: {
                id: res.data.cartId
              }
            });
          })
          .catch(err => {
            uni.showToast({
              title: err.msg || err.response.data.msg || err.response.data.message,
              icon: "none",
              duration: 2000
            });
          });
      },
      goPoster: function () {
        var that = this;
        that.getBargainShare(that.bargainId);
        this.$yrouter.push({
          path: "/pages/activity/Poster/index",
          query: {
            id: that.bargainId,
            type: 2
          }
        });
      },
      goList: function () {
        this.$yrouter.push({
          path: "/pages/activity/GoodsBargain/index"
        });
      },
      //砍价分享
      //bargainId 0  获取 查看人数 分享人数 参与人数
      //bargainId 砍价产品编号 添加分享次数  获取 查看人数 分享人数 参与人数
      getBargainShare: function (bargainId) {
        var that = this;
        getBargainShare({
          bargainId: bargainId
        }).then(res => {
          that.lookCount = res.data.lookCount;
          that.shareCount = res.data.shareCount;
          that.userCount = res.data.userCount;
        });
      },
      // 获取产品详情
      getBargainDetail: function () {
        var that = this;
        getBargainDetail(that.bargainId)
          .then(res => {
            that.bargain = res.data.bargain;
            that.bargain.description = that.bargain.description.replace(
              /\<img/gi,
              '<img style="max-width:100%;height:auto;"'
            );
            that.bargain.rule = that.bargain.rule.replace(
              /\<img/gi,
              '<img style="max-width:100%;height:auto;"'
            );
            that.datatime = that.bargain.stopTime / 1000;
            that.getBargainHelpCount();
            // that.setOpenShare();
            that.getBargainHelpList();
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      //开启砍价
      getBargainStart: function () {
        var that = this;
        getBargainStart({
            bargainId: that.bargainId
          })
          .then(() => {
            that.bargainPartake = that.userInfo.uid;
            that.getBargainHelp();
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      //参与砍价
      getBargainHelp: function () {
        var that = this;
        if (
          that.surplusPrice === 0 &&
          that.bargainPartake !== that.userInfo.uid
        ) {
          return uni.showToast({
            title: "好友已经砍价成功",
            icon: "success",
            duration: 2000
          });
        }
        var data = {
          bargainId: that.bargainId,
          bargainUserUid: that.bargainPartake
        };
        getBargainHelp(data)
          .then(res => {
            that.activeMsg = res.data.status;
            if (
              res.data.status === "SUCCESSFUL" &&
              that.bargainPartake !== that.userInfo.uid
            ) {
              uni.showToast({
                title: "您已经砍过了",
                icon: "none",
                duration: 2000
              });
              return;
            }
            that.helpListStatus = false;
            that.page = 1;
            that.bargainHelpList = [];
            that.getBargainHelpPrice();
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      //获取砍掉的金额
      getBargainHelpPrice: function () {
        var that = this;
        that.helpListLoading = true;

        getBargainHelpPrice({
            bargainId: that.bargainId,
            bargainUserUid: that.bargainPartake
          })
          .then(res => {
            that.bargainHelpPrice = res.data.price;
            that.helpListLoading = false;
            that.getBargainHelpCount();
            that.getBargainHelpList();
            switch (that.activeMsg) {
              case "SUCCESSFUL":
                break;
              case "SUCCESS":
                that.active = true;
                break;
            }
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      //砍价帮
      getBargainHelpList: function () {
        var that = this;
        if (that.helpListLoading === true) return;
        if (that.helpListStatus === true) return;
        that.helpListLoading = true;
        getBargainHelpList({
            bargainId: that.bargainId,
            bargainUserUid: that.bargainPartake,
            page: that.page,
            limit: that.limit
          })
          .then(res => {
            that.helpListStatus = res.data.length < that.limit;
            that.helpListLoading = false;
            that.page++;
            that.bargainHelpList.push.apply(that.bargainHelpList, res.data);
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      getBargainHelpCountStart: function () {
        var that = this;
        getBargainHelpCount({
            bargainId: that.bargainId,
            bargainUserUid: that.bargainPartake
          })
          .then(() => {

          })
          .catch(() => {
            // this.$yrouter.push({
            //   path: "/pages/activity/DargainDetails/index",
            //   query: {
            //     id: that.bargainId,
            //     partake: that.userInfo.uid
            //   }
            // });
          });
      },
      getBargainHelpCount: function () {
        var that = this;
        getBargainHelpCount({
            bargainId: that.bargainId,
            bargainUserUid: that.bargainPartake
          })
          .then(res => {
            that.userBargainStatus = res.data.status;
            that.helpCount = res.data.count;
            that.surplusPrice = res.data.price;
            that.alreadyPrice = res.data.alreadyPrice;
            that.pricePercent = res.data.pricePercent;
            that.price = (that.bargain.price - that.alreadyPrice).toFixed(2);
            console.log(that);
          })
          .catch(() => {
            that.bargainPartake = that.userInfo.uid;
            // that.$yrouter.push({
            //   path: "/pages/activity/DargainDetails/index",
            //   query: { id: that.bargainId, partake: that.userInfo.uid }
            // });
          });
      },
      getBargainStartUser: function () {
        var that = this;
        getBargainStartUser({
            bargainId: that.bargainId,
            bargainUserUid: that.bargainPartake
          })
          .then(res => {
            that.bargainUserInfo = res.data;
            that.getBargainHelpList();
          })
          .catch(res => {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          });
      },
      close: function () {
        this.active = false;
      }
    },
    onShareAppMessage() {
      return {
        path: `/pages/activity/DargainDetails/index/?id=${this.$yroute.query.id}&partake=${this.userInfo.uid}`
      };
    }
  };
</script>

<style lang="less">
  .bargain {
    &.on {
      .bargain-box {
        background: #fff;
        width: auto;
        margin: 0 20rpx;
        border: 0;

      }

      .header {
        height: auto;
        text-align: left;

        .time {
          text-align: left;
          font-size: 24rpx;

          margin: 0;
          padding: 0;
          padding: 20rpx;
          width: auto;
          height: auto;
        }
      }
    }

  }

  page {
    background-color: #f5f5f5 !important;
  }

  .bargainBnt_hui {
    font-size: 0.3 * 100rpx;
    font-weight: bold;
    color: #fff;
    width: 6 * 100rpx;
    height: 0.8 * 100rpx;
    border-radius: 0.4 * 100rpx;
    background: #bbb;
    text-align: center;
    line-height: 0.8 * 100rpx;
    margin-top: 0.32 * 100rpx;
  }

  .bargain_view {
    left: 0;
    right: 0;
    height: 0.48 * 100rpx;
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
    border-radius: 0 0 0.06 * 100rpx 0.06 * 100rpx;
    position: absolute;
    bottom: 0;
    font-size: 0.22 * 100rpx;
    color: #fff;
    text-align: center;
    line-height: 0.48 * 100rpx;
  }

  .iconfonts {
    font-size: 0.22 * 100rpx;
  }
</style>
