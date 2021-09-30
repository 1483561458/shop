<template>
  <view class="return-list" ref="container">
    <view class="goodWrapper" v-for="(order,orderListIndex) in orderList" :key="orderListIndex">
      <view class="iconfont icon-tuikuanzhong powder" v-if="order._status._type === -1"></view>
      <view class="iconfont icon-yituikuan" v-if="order._status._type === -2"></view>
      <view class="orderNum">订单号：{{ order.orderId }}</view>
      <view
        class="item acea-row row-between-wrapper"
        v-for="(cart,cartInfoIndex) in order.cartInfo"
        :key="cartInfoIndex"
        @click="goOrderDetails(order)"
      >
        <view class="pictrue">
          <image :src="cart.productInfo.image" class="image" @click.stop="goGoodsCon(cart)" />
        </view>
        <view class="text">
          <view class="acea-row row-between-wrapper">
            <view class="name line1">{{ cart.productInfo.storeName }}</view>
            <view class="num">x {{ cart.cartNum }}</view>
          </view>
          <view
            class="attr line1"
            v-if="cart.productInfo.attrInfo"
          >{{ cart.productInfo.attrInfo.sku }}</view>
          <view class="attr line1" v-else>{{ cart.productInfo.storeName }}</view>
          <view class="money">￥{{ cart.productInfo.price }}</view>
        </view>
      </view>
      <view class="totalSum">
        共{{ order.cartInfo.length || 0 }}件商品，总金额
        <text
          class="font-color-red price"
        >￥{{ order.payPrice }}</text>
      </view>
    </view>
    <view class="noCart" v-if="orderList.length === 0 && page > 1">
      <view class="pictrue">
        <image src="@/static/images/noOrder.png" />
      </view>
    </view>
    <Loading :loaded="loaded" :loading="loading"></Loading>
  </view>
</template>

<script>
import { getOrderList } from "@/api/order";
import Loading from "@/components/Loading";

export default {
  name: "ReturnList",
  components: {
    Loading
  },
  data() {
    return {
      orderList: [],
      page: 1,
      limit: 20,
      loading: false,
      loaded: false
    };
  },
  methods: {
    goGoodsCon(cart) {
      this.$yrouter.push({
        path: "/pages/shop/GoodsCon/index",
        query: { id: cart.productInfo.id }
      });
    },
    goOrderDetails(order) {
      this.$yrouter.push({
        path: "/pages/order/OrderDetails/index",
        query: { id: order.orderId }
      });
    },
    getOrderList() {
      const { page, limit } = this;
      if (this.loading || this.loaded) return;
      this.loading = true;
      getOrderList({
        page,
        limit,
        type: -3
      }).then(res => {
        this.orderList = this.orderList.concat(res.data);
        this.loading = false;
        this.loaded = res.data.length < limit;
        this.page++;
      });
    }
  },
  mounted() {
    this.getOrderList();
  },
  onReachBottom() {
    !this.loading && this.getOrderList();
  }
};
</script>
