<template>
  <view :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']" v-show="domStatus">
    <!-- 商品轮播 -->
    <product-con-swiper :imgUrls="imgUrls"></product-con-swiper>

    <!-- 商品信息描述 -->
    <view class="wrapper">
      <view class="share acea-row row-between row-bottom">
        <view class="money font-color-red">
          ￥
          <text class="num" v-text="storeInfo.price"></text>
          <!-- <text class="y-money" v-text="'￥' + storeInfo.productPrice"></text> -->
        </view>
      </view>
      <view class="introduce" v-text="storeInfo.title"></view>
      <view class="label acea-row row-between-wrapper">
        <view v-text="'类型:' + storeInfo.people + '人团'"></view>
        <view v-text="'库存:' + storeInfo.stock + storeInfo.unitName"></view>
        <view v-text="'已拼:' + storeInfo.sales + storeInfo.unitName"></view>
      </view>
    </view>

    <!-- 规格 -->
    <view class="attribute acea-row row-between-wrapper" @click="selecAttrTap">
      <view>
        <text>{{ attrTxt }}：</text>
        <text class="atterTxt">{{ attrValue }}</text>
      </view>
      <view class="iconfont icon-jiantou"></view>
    </view>


    <!-- 拼团信息 -->
    <view class="notice acea-row row-middle">
      <view class="num font-color-red">
        <text class="iconfont icon-laba"></text>
        已拼{{ storeInfo.sales }}{{ storeInfo.unitName }}
        <text class="line">|</text>
      </view>
      <view class="swiper-no-swiping swiper">
        <swiper class="swiper-wrapper" :options="swiperTip" :autoplay="true" :interval="3000">
          <block v-for="(item, itemNewIndex) in itemNew" :key="itemNewIndex">
            <swiper-item>
              <view class="line1">{{ item }}</view>
            </swiper-item>
          </block>
        </swiper>
      </view>
    </view>

    <!-- 拼团人数，头像 -->
    <view class="assemble">
      <view v-for="(item, groupListindex) in groupList" :key="groupListindex">
        <view class="item acea-row row-between-wrapper" v-if="groupListindex < groupListCount">
          <view class="pictxt acea-row row-between-wrapper">
            <view class="pictrue">
              <image :src="item.avatar" class="image" />
            </view>
            <view class="text line1" v-text="item.nickname"></view>
          </view>
          <view class="right acea-row row-middle">
            <view>
              <view class="lack">
                <text>还差</text>
                <text class="font-color-red" v-text="item.count"></text>
                <text>人成团</text>
              </view>
              <count-down :isDay="false" :tipText="'剩余 '" :dayText="false" :hourText="':'" :minuteText="':'"
                :secondText="false" :datatime="item.stopTime/1000"></count-down>
            </view>
            <view class="spellBnt" @click="groupRule(item.id)">
              去拼单
              <text class="iconfont icon-jiantou"></text>
            </view>
          </view>
        </view>
      </view>
      <view class="more" v-if="groupList.length > groupListCount" @click="setGroupListCount">
        查看更多
        <text class="iconfont icon-xiangxia"></text>
      </view>
    </view>

    <!-- 拼团规则 -->
    <view class="playWay">
      <view class="title acea-row row-between-wrapper">
        <view>拼团玩法</view>
      </view>
      <view class="way acea-row row-middle">
        <view class="item">
          <text class="num">①</text>开团/参团
        </view>
        <view class="iconfont icon-arrow"></view>
        <view class="item">
          <text class="num">②</text>邀请好友
        </view>
        <view class="iconfont icon-arrow"></view>
        <view class="item">
          <view>
            <text class="num">③</text>满员发货
          </view>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="userEvaluation">
      <view class="title acea-row row-between-wrapper">
        <view v-text="'用户评价(' + replyCount + ')'"></view>
        <view class="praise" @click="goReply">
          <text class="font-color-red" v-text="replyChance + '%'"></text>好评率
          <text class="iconfont icon-jiantou"></text>
        </view>
      </view>
      <UserEvaluation :reply="reply"></UserEvaluation>
    </view>

    <!-- 产品介绍 -->
    <view class="product-intro">
      <view class="title">产品介绍</view>
      <view class="conter" v-html="storeInfo.description"></view>
      <!-- <view class="conter" v-html=""></view> -->
    </view>

    <!-- 操作栏 -->
    <view style="height:100rpx;"></view>
    <view class="footer acea-row row-between-wrapper">
      <!-- #ifdef MP-WEIXIN -->
      <view class="item">
        <button open-type="contact" class='contacButton'>
          <view style="padding-bottom: 8rpx;" class="item">
            <view class="iconfont icon-kefu"></view>
            <text>客服</text>
          </view>
        </button>
      </view>
      <!-- #endif -->

      <view class="item" @click="setCollect" v-if="userCollect">
        <view class="iconfont icon-shoucang1"></view>
        <text>收藏</text>
      </view>
      <view class="item" @click="setCollect" v-if="!userCollect">
        <view class="iconfont icon-shoucang"></view>
        <text>收藏</text>
      </view>
      <view class="bnt acea-row">
        <view class="joinCart" @click="openAlone">
          <text>单独购买</text>
        </view>
        <view class="buy" @click="openTeam">
          <text>立即开团</text>
        </view>
      </view>
    </view>
    <!-- 商品信息弹窗 -->
    <ProductWindow v-if="cartNum" v-on:changeFun="changeFun" :attr="attr" :cartNum="cartNum"></ProductWindow>
    <StorePoster v-on:setPosterImageStatus="setPosterImageStatus" :posterImageStatus="posterImageStatus"
      :posterData="posterData"></StorePoster>
  </view>
</template>

<script>
  // import { swiper, swiperSlide } from "vue-awesome-swiper";

  import ProductConSwiper from "@/components/ProductConSwiper";
  import CountDown from "@/components/CountDown";
  import UserEvaluation from "@/components/UserEvaluation";
  import ProductWindow from "@/components/ProductWindow";
  import StorePoster from "@/components/StorePoster";
  import {
    getCombinationDetail
  } from "@/api/activity";
  import {
    postCartAdd
  } from "@/api/store";
  import {
    imageBase64
  } from "@/api/public";
  import {
    getCoupon,
    getCollectAdd,
    getCollectDel,
    getUserInfo
  } from "@/api/user";
  const NAME = "GroupDetails";

  export default {
    name: "GroupDetails",
    components: {
      ProductConSwiper,
      CountDown,
      UserEvaluation,
      // swiper,
      // swiperSlide,
      ProductWindow,
      StorePoster
    },
    props: {},
    data: function () {
      return {
        domStatus: false,
        posterData: {
          image: "",
          title: "",
          price: "",
          code: ""
        },
        posterImageStatus: false,
        reply: [],
        replyCount: 0,
        replyChance: 0,
        imgUrls: [],
        storeInfo: {},
        itemNew: {},
        groupListCount: 2,
        groupList: {},
        attrTxt: "请选择",
        productValue: [],
        attrValue: "",
        swiperTip: {
          direction: "vertical",
          autoplay: {
            disableOnInteraction: false,
            delay: 2000
          },
          loop: true,
          speed: 1000,
          observer: true,
          observeParents: true
        },
        attr: {
          cartAttr: false,
          productAttr: [],
          productSelect: {},
        },
        cartNum: 1,
        userCollect: false
      };
    },
    watch: {
      $yroute: function (n) {
        var that = this;
        if (n.name === NAME) {
          that.mountedStart();
        }
      }
    },
    onShow: function () {
      this.mountedStart();
    },
    methods: {
      onShareAppMessage: function() {
        return {
          title: this.storeInfo.title,
          imageUrl: this.storeInfo.image,
          path: "pages/activity/GroupDetails/index?id="+this.storeInfo.id+"&spread=" + uni.getStorageSync("uid")+"&pageType=good&codeType=routine",
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
      openAlone: function () {
        this.$yrouter.push({
          path: "/pages/shop/GoodsCon/index",
          query: {
            id: this.storeInfo.productId
          }
        });
        // this.$yrouter.replace({ path: "/detail/" + this.storeInfo.productId });
      },
      //收藏商品
      setCollect: function () {
        let that = this,
          id = that.storeInfo.id,
          category = "product";
        if (that.userCollect) {
          getCollectDel(id, category).then(function () {
            that.userCollect = !that.userCollect;
          });
        } else {
          getCollectAdd(id, category).then(function () {
            that.userCollect = !that.userCollect;
          });
        }
      },
      mountedStart: function () {
        var that = this;
        let id = that.$yroute.query.id;
        getCombinationDetail(id).then(res => {
          that.userCollect = res.data.userCollect;
          res.data.storeInfo.description = res.data.storeInfo.description.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto;"'
          );
          that.$set(that.attr, "productAttr", res.data.productAttr);
          that.$set(that, "productValue", res.data.productValue);
          that.$set(that, "storeInfo", res.data.storeInfo);
          that.$set(that, "imgUrls", res.data.storeInfo.sliderImageArr);
          that.$set(that, "itemNew", res.data.pinkOkList);
          that.$set(that, "groupList", res.data.pink);
          that.$set(that, "reply", [res.data.reply]);
          that.$set(that, "replyCount", res.data.replyCount);
          that.$set(that, "replyChance", res.data.replyChance);
          that.posterData.image = that.storeInfo.image;
          if (that.storeInfo.title.length > 30) {
            that.posterData.title = that.storeInfo.title.substring(0, 30) + "...";
          } else {
            that.posterData.title = that.storeInfo.title;
          }
          that.posterData.price = that.storeInfo.pinkPrice;
          that.posterData.code = that.storeInfo.code_base;
          that.domStatus = true;
          console.log(this.storeInfo)
          that.DefaultSelect();
        });
      },
      DefaultSelect: function () {
        let productAttr = this.attr.productAttr;
        let value = [];
        for (let i = 0; i < productAttr.length; i++) {
          this.$set(productAttr[i], "index", 0);
          value.push(productAttr[i].attrValueArr[0]);
        }
        //sort();排序函数:数字-英文-汉字；
        let productSelect = this.productValue[value.sort().join(",")];
        console.log(productSelect)
        if (productSelect && productAttr.length) {
          this.$set(
            this.attr.productSelect,
            "store_name",
            this.storeInfo.title
          );
          this.$set(this.attr.productSelect, "image", productSelect.image);
          this.$set(this.attr.productSelect, "price", productSelect.pinkPrice);
          this.$set(this.attr.productSelect, "stock", productSelect.pinkStock);
          this.$set(this.attr.productSelect, "unique", productSelect.unique);
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "attrValue", value.sort().join(","));
          this.$set(this, "attrTxt", "已选择");
        } else if (!productSelect && productAttr.length) {
          this.$set(
            this.attr.productSelect,
            "store_name",
            this.storeInfo.title
          );
          this.$set(this.attr.productSelect, "image", this.storeInfo.image);
          this.$set(this.attr.productSelect, "price", this.storeInfo.pinkPrice);
          this.$set(this.attr.productSelect, "stock", 0);
          this.$set(this.attr.productSelect, "unique", "");
          this.$set(this.attr.productSelect, "cart_num", 0);
          this.$set(this, "attrValue", "");
          this.$set(this, "attrTxt", "请选择");
        } else if (!productSelect && !productAttr.length) {
          this.$set(
            this.attr.productSelect,
            "store_name",
            this.storeInfo.title
          );
          this.$set(this.attr.productSelect, "image", this.storeInfo.image);
          this.$set(this.attr.productSelect, "price", this.storeInfo.pinkPrice);
          this.$set(this.attr.productSelect, "stock", this.storeInfo.pinkStock);
          this.$set(
            this.attr.productSelect,
            "unique",
            this.storeInfo.unique || ""
          );
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "attrValue", "");
          this.$set(this, "attrTxt", "请选择");
        }
      },
      getImageBase64: function () {
        let that = this;
        imageBase64(this.posterData.image, that.posterData.code).then(res => {
          that.posterData.image = res.data.image;
          that.posterData.code = res.data.code;
        });
      },
      setPosterImageStatus: function () {
        // var sTop = document.body || document.documentElement;
        // sTop.scrollTop = 0;
        this.posterImageStatus = !this.posterImageStatus;
      },
      groupRule: function (id) {
        var that = this;
        that.$yrouter.push({
          path: "/pages/activity/GroupRule/index",
          query: {
            id
          }
        });
      },
      goReply: function () {
        var that = this;
        that.$yrouter.push({
          path: "/pages/shop/EvaluateList/index",
          query: {
            id: that.storeInfo.product_id
          }
        });
      },
      setGroupListCount: function () {
        this.groupListCount = this.groupListCount + 2;
      },
      //将父级向子集多次传送的函数合二为一；
      changeFun: function (opt) {
        if (typeof opt !== "object") opt = {};
        let action = opt.action || "";
        let value = opt.value === undefined ? "" : opt.value;
        this[action] && this[action](value);
      },
      changeattr: function (res) {
        var that = this;
        that.attr.cartAttr = res;
      },
      ChangeCartNum: function (res) {
        var that = this;
        that.attr.productSelect.cart_num = 1;
        that.cartNum = 1;
        uni.showToast({
          title: "每人每次限购1" + that.storeInfo.unitName,
          icon: "none",
          duration: 2000
        });
      },
      //选择属性；
      ChangeAttr: function (res) {
        // 修改了规格
        let productSelect = this.productValue[res.value];
        if (productSelect) {
          this.attr.productAttr[res.indexw].index = res.indexn;
          this.$set(this.attr.productSelect, "image", productSelect.image);
          this.$set(this.attr.productSelect, "price", productSelect.pinkPrice);
          this.$set(this.attr.productSelect, "stock", productSelect.pinkStock);
          this.$set(this.attr.productSelect, "unique", productSelect.unique);
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "attrValue", res.value);
          this.$set(this, "attrTxt", "已选择");
        } else {
          this.$set(this.attr.productSelect, "image", this.storeInfo.image);
          this.$set(this.attr.productSelect, "price", this.storeInfo.pinkPrice);
          this.$set(this.attr.productSelect, "stock", 0);
          this.$set(this.attr.productSelect, "unique", "");
          this.$set(this.attr.productSelect, "cart_num", 0);
          this.$set(this, "attrValue", "");
          this.$set(this, "attrTxt", "请选择");
        }
      },

      openTeam: function () {
        var that = this;
        if (that.attr.cartAttr == false) {
          that.attr.cartAttr = !this.attr.cartAttr;
        } else {
          var data = {};
          data.productId = that.storeInfo.productId;
          data.cartNum = that.attr.productSelect.cart_num;
          data.uniqueId = that.attr.productSelect.unique;
          data.combinationId = that.storeInfo.id;
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
        }
      },
      //打开属性插件；
      selecAttrTap: function () {
        this.attr.cartAttr = true;
        this.isOpen = true;
      },
    }
  };
</script>
<style scoped lang="less">
  .product-con .wrapper {
    padding-bottom: 0.26 * 100rpx;
  }

  .noscroll {
    height: 100%;
    overflow: hidden;
  }

  .product-con .footer-group .bnt {
    // flex:1;
    width: 43%;
  }

  .footer-group {
    button {
      border: 0;
      background: none;
    }
  }

  .product-con .footer-group .bnt.bg-color-violet {
    background-color: #fa8013;
  }
</style>
