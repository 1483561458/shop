<template>
  <view class="productList" ref="container">
    <form @submit.prevent="submitForm">
      <view class="search bg-color-red acea-row row-between-wrapper">
        <view class="input acea-row row-between-wrapper">
          <text class="iconfont icon-sousuo"></text>
          <input placeholder="搜索商品信息" v-model="where.keyword" />
        </view>
        <view
          class="iconfont"
          :class="Switch === true ? 'icon-pailie' : 'icon-tupianpailie'"
          @click="switchTap"
        ></view>
      </view>
    </form>
    <view class="nav acea-row row-middle">
      <view
        class="item"
        :class="title ? 'font-color-red' : ''"
        @click="set_where(0)"
      >{{ title ? title : "默认" }}</view>
      <view class="item" @click="set_where(1)">
        价格
        <image src="@/static/images/horn.png" v-if="price === 0" />
        <image src="@/static/images/up.png" v-if="price === 1" />
        <image src="@/static/images/down.png" v-if="price === 2" />
      </view>
      <view class="item" @click="set_where(2)">
        销量
        <image src="@/static/images/horn.png" v-if="stock === 0" />
        <image src="@/static/images/up.png" v-if="stock === 1" />
        <image src="@/static/images/down.png" v-if="stock === 2" />
      </view>
      <!-- down -->
      <view class="item" :class="nows ? 'font-color-red' : ''" @click="set_where(3)">新品</view>
    </view>
    <view
      class="list acea-row row-between-wrapper"
      :class="Switch === true ? '' : 'on'"
      ref="container"
    >
      <view
        @click="goGoodsCon(item)"
        class="item"
        :class="Switch === true ? '' : 'on'"
        v-for="(item, productListIndex) in productList"
        :key="productListIndex"
        :title="item.storeName"
      >
        <view class="pictrue" :class="Switch === true ? '' : 'on'">
          <image :src="item.image" :class="Switch === true ? '' : 'on'" />
        </view>
        <view class="text" :class="Switch === true ? '' : 'on'">
          <view class="name line1">{{ item.storeName }}</view>
          <view class="money font-color-red" :class="Switch === true ? '' : 'on'">
            ￥
            <text class="num">{{ item.price }}</text>
          </view>
          <view class="vip acea-row row-between-wrapper" :class="Switch === true ? '' : 'on'">
            <view class="vip-money">￥{{ item.otPrice }}</view>
            <view>已售{{ item.sales }}件</view>
          </view>
        </view>
      </view>
    </view>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <view
      class="noCommodity"
      style="background-color: #fff;"
      v-if="productList.length === 0 && where.page > 1"
    >
      <view class="noPictrue">
        <image src="@/static/images/noGood.png" class="image" />
      </view>
    </view>
    <Recommend v-if="productList.length === 0 && where.page > 1"></Recommend>
  </view>
</template>
<script>
import Recommend from "@/components/Recommend";
import { getProducts } from "@/api/store";
import Loading from "@/components/Loading";

export default {
  name: "GoodsList",
  components: {
    Recommend,
    Loading
  },
  props: {},
  data: function() {
    // const { s = "", id = 0, title = "" } = this.$yroute.query;
    const s = "",
      id = 0,
      title = "";

    return {
      hostProduct: [],
      productList: [],
      Switch: true,
      where: {
        page: 1,
        limit: 8,
        keyword: s,
        sid: id, //二级分类id
        news: 0,
        priceOrder: "",
        salesOrder: ""
      },
      title: title && id ? title : "",
      loadTitle: "",
      loading: false,
      loadend: false,
      price: 0,
      stock: 0,
      nows: false
    };
  },
  watch: {
    title() {
      this.updateTitle();
    },
    $yroute(to) {
      // if (to.name !== "GoodsList") return;
      // const { s = "", id = 0, title = "" } = to.query;
      // if (s !== this.where.keyword || id !== this.where.sid) {
      //   this.where.keyword = s;
      //   this.loadend = false;
      //   this.loading = false;
      //   this.where.page = 1;
      //   this.where.sid = id;
      //   this.title = title && id ? title : "";
      //   this.nows = false;
      //   this.$set(this, "productList", []);
      //   this.price = 0;
      //   this.stock = 0;
      //   this.get_product_list();
      // }
    }
  },
  mounted: function() {
    const { s = "", id = 0, title = "" } = this.$yroute.query;
    this.updateTitle();
    this.get_product_list();
  },
  onReachBottom() {
    !this.loading && this.get_product_list();
  },
  onHide() {
    // this.hostProduct = [];
    // this.productList = [];
    // this.Switch = true;
    // this.where = {
    //   page: 1,
    //   limit: 8,
    //   keyword: s,
    //   sid: id, //二级分类id
    //   news: 0,
    //   priceOrder: "",
    //   salesOrder: ""
    // };
    // this.loadTitle = "";
    // this.loading = false;
    // this.loadend = false;
    // this.price = 0;
    // this.stock = 0;
    // this.nows = fals;
  },
  methods: {
    goGoodsCon(item) {
      this.$yrouter.push({
        path: "/pages/shop/GoodsCon/index",
        query: { id: item.id }
      });
    },
    updateTitle() {
      // document.title = this.title || this.$yroute.meta.title;
    },
    get_product_list() {
      var that = this;
      this.setWhere();
      // if (to.name !== "GoodsList") return;
      const { s = "", id = 0, title = "" } = this.$yroute.query;
      if (s !== this.where.keyword || id !== this.where.sid) {
        this.where.keyword = s;
        this.loadend = false;
        this.loading = false;
        this.where.page = 1;
        this.where.sid = id;
        this.title = title && id ? title : "";
        this.nows = false;
        this.$set(this, "productList", []);
        this.price = 0;
        this.stock = 0;
        // this.get_product_list();
      }
      let q = that.where;
      getProducts(q).then(res => {
        that.loading = false;
        that.productList.push.apply(that.productList, res.data);
        that.loadend = res.data.length < that.where.limit; //判断所有数据是否加载完成；
        that.where.page = that.where.page + 1;
      });
    },
    submitForm: function() {
      this.$set(this, "productList", []);
      this.where.page = 1;
      this.loadend = false;
      this.loading = false;
      this.get_product_list();
    },
    //点击事件处理
    set_where: function(index) {
      let that = this;
      switch (index) {
        case 0:
          return that.$yrouter.push({ path: "/pages/shop/GoodsClass/index" });
        case 1:
          if (that.price === 0) that.price = 1;
          else if (that.price === 1) that.price = 2;
          else if (that.price === 2) that.price = 0;
          that.stock = 0;
          break;
        case 2:
          if (that.stock === 0) that.stock = 1;
          else if (that.stock === 1) that.stock = 2;
          else if (that.stock === 2) that.stock = 0;
          that.price = 0;
          break;
        case 3:
          that.nows = !that.nows;
          break;
        default:
          break;
      }
      that.$set(that, "productList", []);
      that.where.page = 1;
      that.loadend = false;
      that.get_product_list();
    },
    //设置where条件
    setWhere: function() {
      let that = this;
      if (that.price === 0) {
        that.where.priceOrder = "";
      } else if (that.price === 1) {
        that.where.priceOrder = "asc";
      } else if (that.price === 2) {
        that.where.priceOrder = "desc";
      }
      if (that.stock === 0) {
        that.where.salesOrder = "";
      } else if (that.stock === 1) {
        that.where.salesOrder = "asc";
      } else if (that.stock === 2) {
        that.where.salesOrder = "desc";
      }
      that.where.news = that.nows ? "1" : "0";
    },
    switchTap: function() {
      let that = this;
      that.Switch = !that.Switch;
    }
  }
};
</script>
<style scoped lang="less">
.noCommodity {
  border-top: 3px solid #f5f5f5;
  padding-bottom: 1px;
}
</style>
