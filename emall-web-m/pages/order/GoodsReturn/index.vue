<template>
	<view class="apply-return">
		<view class="goodsStyle acea-row row-between" v-for="cart in orderInfo.cartInfo" :key="cart.id">
			<view class="pictrue">
				<image :src="cart.productInfo.image" class="image" />
			</view>
			<view class="text acea-row row-between">
				<view class="name line2">{{ cart.productInfo.storeName }}</view>
				<view class="money">
					<view>
						￥{{
            cart.productInfo.attrInfo
            ? cart.productInfo.attrInfo.price
            : cart.productInfo.price
            }}
					</view>
					<view class="num">x{{ cart.cartNum }}</view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="item acea-row row-between-wrapper">
				<view>退货件数</view>
				<view class="num">{{ orderInfo.totalNum }}</view>
			</view>
			<view class="item acea-row row-between-wrapper">
				<view>退款金额</view>
				<view class="num">￥{{ orderInfo.payPrice }}</view>
			</view>
			<picker :value="reason" :range="reasonList" @change="changeReason">
				<view class="item acea-row row-between-wrapper">
					<view>退款原因</view>
					<view class="num">{{reason}}</view>
					<text class="iconfont icon-jiantou"></text>
				</view>
			</picker>
			<view class="item textarea acea-row row-between">
				<view>备注说明</view>
				<textarea placeholder="填写备注信息，100字以内" class="num" v-model="refund_reason_wap_explain"></textarea>
			</view>
		</view>
		<view class="returnBnt bg-color-red" @click="submit">申请退款</view>
	</view>
</template>

<script>
	import {
		orderDetail,
		getRefundReason,
		postOrderRefund
	} from "@/api/order";
	import {
		trim
	} from "@/utils";
	import {
		VUE_APP_API_URL
	} from "@/config";

	export default {
		name: "goodsReturn",
		components: {
			// VueCoreImageUpload
		},
		data() {
			return {
				url: `${VUE_APP_API_URL}/upload/image`,
				headers: {
					Authorization: "Bearer " + this.$store.state.token
				},
				id: 0,
				orderInfo: {},
				reasonList: [],
				reason: "",
				refund_reason_wap_explain: "",
				refund_reason_wap_img: []
			};
		},
		methods: {
			changeReason(e) {
				this.reason = this.reasonList[e.mp.detail.value];
			},
			imageuploaded(res) {
				if (res.status !== 200) {
					uni.showToast({
						title: err.msg || err.response.data.msg|| err.response.data.message,
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.refund_reason_wap_img.push(res.data.url);
			},
			getOrderDetail() {
				orderDetail(this.id)
					.then(res => {
						this.orderInfo = res.data;
					})
					.catch(err => {
						uni.showToast({
							title: err.msg || err.response.data.msg|| err.response.data.message,
							icon: 'none',
							duration: 2000
						});
					});
			},
			getRefundReason() {
				getRefundReason().then(res => {
					this.reasonList = res.data;
				});
			},
			submit() {
				const refund_reason_wap_explain = trim(this.refund_reason_wap_explain),
					text = this.reason;
				if (!text) {
					uni.showToast({
						title: "请选择退款原因",
						icon: 'none',
						duration: 2000
					});
					return
				}
				postOrderRefund({
						text,
						uni: this.orderInfo.orderId,
						refund_reason_wap_img: this.refund_reason_wap_img.join(","),
						refund_reason_wap_explain
					})
					.then(res => {
						uni.showToast({
							title: res.msg,
							icon: "success",
							duration: 2000
						});
						setTimeout(() => {
							this.$yrouter.back();
						}, 1500);
					})
					.catch(err => {
						uni.showToast({
							title: err.msg || err.response.data.msg|| err.response.data.message,
							icon: 'none',
							duration: 2000
						});
					});
			}
		},
		mounted() {
			this.id = this.$yroute.query.id || 0;
			this.getOrderDetail();
			this.getRefundReason();
		}
	};
</script>
