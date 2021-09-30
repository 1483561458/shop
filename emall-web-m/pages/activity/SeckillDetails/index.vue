<template>
  <view :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']" v-show="domStatus">
    <product-con-swiper :imgUrls="imgUrls"></product-con-swiper>
    <view class="nav acea-row row-between-wrapper">
      <view class="money">
        ￥
        <text class="num" v-text="storeInfo.price"></text>
        <text class="y-money" v-text="'￥' + storeInfo.price"></text>
      </view>
      <view class="acea-row row-middle">
        <view class="times">
          <view>距秒杀结束仅剩</view>
          <count-down :isDay="false" :tipText="false" :dayText="false" :hourText="' : '" :minuteText="' : '"
            :secondText="false" :datatime="datatime"></count-down>
        </view>
        <view class="iconfont icon-jiantou"></view>
      </view>
    </view>
    <view class="wrapperRush">
      <view class="introduce acea-row row-between">
        <view class="infor" v-text="storeInfo.title"></view>
        <!-- <view class="iconfont icon-fenxiang" @click="setPosterImageStatus"></view> -->
      </view>
      <view class="label acea-row row-middle">
        <view class="stock" v-text="'库存:' + storeInfo.stock + '件'"></view>
        <view v-text="'销量:' + storeInfo.sales + '件'"></view>
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
    <view class="product-intro">
      <view class="title">产品介绍</view>
      <view class="conter" v-html="storeInfo.description"></view>
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
      <view class="bnt acea-row" v-if="
          seckillStatus == 1 &&
            storeInfo.num > 0 &&
            storeInfo.stock > 0
        ">
        <view class="joinCart" @click="openAlone">
          <text>单独购买</text>
        </view>
        <view class="buy" @click="tapBuy">
          <text>立即购买</text>
        </view>
      </view>

      <div class="bnt acea-row" v-if="
          seckillStatus == 1 &&
            storeInfo.num <= 0 &&
            storeInfo.stock <= 0
        ">
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">已售罄</div>
      </div>
      <div class="bnt acea-row" v-if="seckillStatus == 2">
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">即将开始</div>
      </div>
      <div class="bnt acea-row" v-if="seckillStatus == 0">
        <div class="joinCart" @click="openAlone">原价购买</div>
        <div class="buy bg-color-hui">已结束</div>
      </div>

    </view>

    <ProductWindow v-on:changeFun="changeFun" :attr="attr" :cartNum="cartNum"></ProductWindow>
    <StorePoster v-on:setPosterImageStatus="setPosterImageStatus" :posterImageStatus="posterImageStatus"
      :posterData="posterData"></StorePoster>
  </view>
</template>
<style scoped lang="less">
  .noscroll {
    height: 100%;
    overflow: hidden;
  }
</style>
<script>
  import ProductConSwiper from "@/components/ProductConSwiper";
  import CountDown from "@/components/CountDown";
  import ProductWindow from "@/components/ProductWindow";
  import StorePoster from "@/components/StorePoster";
  import {
    getSeckillDetail
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
  const NAME = "SeckillDetails";

  export default {
    name: "SeckillDetails",
    components: {
      ProductConSwiper,
      CountDown,
      ProductWindow,
      StorePoster
    },
    props: {},
    data: function () {
      return {
        seckillStatus: '',
        domStatus: false,
        posterData: {
          image: "",
          title: "",
          price: "",
          code: ""
        },
        posterImageStatus: false,
        action: "",
        imgUrls: [],
        storeInfo: [],
        replyCount: 0,
        reply: [],
        cartNum: 1,
        attrTxt: "请选择",
        productValue: [],
        attrValue: "",
        attr: {
          cartAttr: false,
          productAttr: [],
          productSelect: {},
        },
        datatime: 0,
        userCollect: false
      };
    },
    onShow: function () {
      this.mountedStart();
    },
    methods: {
      onShareAppMessage: function () {
        return {
          title: this.storeInfo.title,
          imageUrl: this.storeInfo.image,
          path: "pages/activity/GoodsSeckill/index?id=" + this.storeInfo.id + "&spread=" + uni.getStorageSync("uid") +
            "&pageType=good&codeType=routine",
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
      routerGo(item) {
        this.$yrouter.push({
          path: '/pages/user/CustomerList/index'
        })
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
        console.log(this)
        let id = that.$yroute.query.id;
        this.seckillStatus = that.$yroute.query.status;
        that.datatime = parseInt(that.$yroute.query.time);
        getSeckillDetail(id).then(res => {
          that.userCollect = res.data.userCollect;
          res.data.storeInfo.description = res.data.storeInfo.description.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto;"'
          );
          that.$set(that.attr, "productAttr", res.data.productAttr);
          that.$set(that, "productValue", res.data.productValue);
          that.$set(that, "storeInfo", res.data.storeInfo);
          that.$set(that, "imgUrls", res.data.storeInfo.sliderImageArr);
          that.$set(that, "replyCount", res.data.replyCount);
          that.$set(that, "reply", res.data.reply);
          that.posterData.image = that.storeInfo.image_base;
          that.updateTitle();
          if (that.storeInfo.title.length > 30) {
            that.posterData.title = that.storeInfo.title.substring(0, 30) + "...";
          } else {
            that.posterData.title = that.storeInfo.title;
          }
          that.posterData.price = that.storeInfo.price;
          that.posterData.code = that.storeInfo.code_base;
          // that.setProductSelect();
          that.domStatus = true;
          that.DefaultSelect();

        });
      },
      updateTitle() {
        // document.title = this.storeInfo.title || this.$yroute.meta.title;
      },
      setPosterImageStatus: function () {
        // var sTop = document.body || document.documentElement;
        // sTop.scrollTop = 0;
        this.posterImageStatus = !this.posterImageStatus;
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
          this.$set(this.attr.productSelect, "price", productSelect.seckillPrice);
          this.$set(this.attr.productSelect, "stock", productSelect.seckillStock);
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
          this.$set(this.attr.productSelect, "price", this.storeInfo.seckillPrice);
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
          this.$set(this.attr.productSelect, "price", this.storeInfo.seckillPrice);
          this.$set(this.attr.productSelect, "stock", this.storeInfo.seckillStock);
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
        if (res) {
          if (that.attr.productSelect.cart_num < that.storeInfo.seckillStock) {
            that.attr.productSelect.cart_num++;
            this.cartNum++;
          }
        } else {
          if (that.attr.productSelect.cart_num > 1) {
            that.attr.productSelect.cart_num--;
            this.cartNum--;
          }
        }
      },
      //选择属性；
      ChangeAttr: function (res) {
        // 修改了规格
        let productSelect = this.productValue[res.value];
        if (productSelect) {
          this.attr.productAttr[res.indexw].index = res.indexn;
          this.$set(this.attr.productSelect, "image", productSelect.image);
          this.$set(this.attr.productSelect, "price", productSelect.seckillPrice);
          this.$set(this.attr.productSelect, "stock", productSelect.seckillStock);
          this.$set(this.attr.productSelect, "unique", productSelect.unique);
          this.$set(this.attr.productSelect, "cart_num", 1);
          this.$set(this, "attrValue", res.value);
          this.$set(this, "attrTxt", "已选择");
        } else {
          this.$set(this.attr.productSelect, "image", this.storeInfo.image);
          this.$set(this.attr.productSelect, "price", this.storeInfo.seckillPrice);
          this.$set(this.attr.productSelect, "stock", 0);
          this.$set(this.attr.productSelect, "unique", "");
          this.$set(this.attr.productSelect, "cart_num", 0);
          this.$set(this, "attrValue", "");
          this.$set(this, "attrTxt", "请选择");
        }
      },
      selecAttrTap: function () {
        this.attr.cartAttr = true;
        this.isOpen = true;
      },
      tapBuy: function () {
        var that = this;
        if (that.attr.cartAttr == false) {
          that.attr.cartAttr = !this.attr.attrcartAttr;
        } else {
          var data = {};
          data.productId = that.storeInfo.productId;
          data.cartNum = that.attr.productSelect.cart_num;
          data.uniqueId = that.attr.productSelect.unique;
          data.secKillId = that.storeInfo.id;
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
                icon: 'none',
                duration: 2000
              });
            });
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .product-con .nav {
    padding: 0 0.2*100rpx;
  }

  .product-con .footer .bnt .buy.bg-color-hui {
    background: #ccc;
    
  }
</style>
