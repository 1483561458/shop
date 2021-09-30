<template>
	<view class="index">
		<!-- 导航栏 -->
		<!--		<view class="head_box " :style="{ background: bgcolor }" :class="{ active: bgcolor }">-->
		<!--			<view class="cu-custom" :style="[{height:CustomBar+ 'px',}]">-->
		<!--				<view class="cu-bar fixed" :style="customStyle" :class="[bgcolor]">-->
		<!--					<view class="action">-->
		<!--						<text class="nav-title Shop-selector-rect">{{ '优咖商城' }}</text>-->
		<!--					</view>-->
		<!--					<view class="content" :style="[{top:StatusBar + 'px'}]">-->

		<!--					</view>-->
		<!--				</view>-->
		<!--			</view>-->
		<!--		</view>-->

		<view class="head_box " :style="{ background: bgcolor }" :class="{ active: bgcolor }">
			<cu-custom :isBack="true" :bgColor="bgcolor">
				<block slot="backText">
					<text class="nav-title shopro-selector-rect">{{ '优咖商城' }}</text>
				</block>
			</cu-custom>
		</view>
		<view class="header header-search  acea-row row-center-wrapper" :style="{ background: bgcolor }">
			<view @click="goGoodSearch()" class="search acea-row row-middle">
				<text class="iconfont icon-xiazai5"></text>
				搜索商品
			</view>
			<view class="qr" @click="startQr()">
				<image src="@/static/images/qr.png" />
			</view>
		</view>
		<Banner :detail="banner" v-if="banner.length>0" @getbgcolor="getbgcolor"></Banner>
		<uni-notice-bar scrollable="true" @click="goRoll(singNew)" single="true" :speed="10" showIcon="true" :text="singNew.info"></uni-notice-bar>
		<view class="content_box home_content_box">
			<!-- 菜单 -->
			<Menu :list="menus"></Menu>
			<!-- 滚动新闻 -->
			<!-- 广告 -->
			<Adv />
			<!-- 热门榜单 -->
			<HotCommodity :detail="likeInfo"></HotCommodity>
			<!-- 超值拼团 -->
			<Groupon :detail="combinationList" />
			<!-- 首发新品->秒杀 -->
			<!-- <FirstNewProduct :detail="firstList"></FirstNewProduct> -->
			<!-- 精品推荐 -->
			<!-- <ProductsRecommended :detail="bastList"></ProductsRecommended> -->
			<!-- 促销单品
			<PromoteProduct :detail="benefit"></PromoteProduct> -->
			<!-- 直播 -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- <Live :detail="live"></Live> -->
			<!-- #endif -->

			<!-- 为您推荐 -->
			<PromotionGood :benefit="benefit"></PromotionGood>
		</view>
		<Coupon-window :coupon-list="couponList" v-if="showCoupon" @checked="couponClose" @close="couponClose">
		</Coupon-window>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import GoodList from '@/components/GoodList';
	import PromotionGood from '@/components/PromotionGood';
	import CouponWindow from '@/components/CouponWindow';
	import Menu from '@/components/Menu';
	import UniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar'
	import Adv from '@/components/sh-adv'
	import Groupon from '@/components/sh-groupon.vue'

	import Banner from './components/Banner';
	import HotCommodity from './components/HotCommodity';
	import FirstNewProduct from './components/FirstNewProduct';
	import ProductsRecommended from './components/ProductsRecommended';
	// import Live from './components/Live';

	import {
		getHomeData,
		getShare
	} from '@/api/public';
	import cookie from '@/utils/store/cookie';
	import {
		isWeixin,
		handleUrlParam
	} from '@/utils/index';

	const HAS_COUPON_WINDOW = 'has_coupon_window';

	export default {
		name: 'Index',
		components: {
			// swiper,
			// swiperSlide,
			UniNoticeBar,
			GoodList,
			PromotionGood,
			CouponWindow,
			Menu,
			Adv,
			Groupon,
			Banner,
			HotCommodity,
			FirstNewProduct,
			ProductsRecommended,
			// Live
		},
		props: {},
		data: function() {
			return {
				CustomBar: this.CustomBar,
				StatusBar: this.StatusBar,
				formatMenus: [],
				categoryCurrent: 0,
				menuNum: 4,
				bgcolor: '',
				bgColor: '',
				swiperCurrent: 0, //轮播下标
				webviewId: 0,
				showCoupon: false,
				logoUrl: '',
				banner: [],
				menus: [],
				combinationList: [],
				roll: [],
				activity: [],
				activityOne: {},
				bastList: [],
				firstList: [],
				info: {
					fastList: [],
					bastBanner: [],

					bastList: []
				},
				likeInfo: [],
				live: [],
				lovely: [],
				benefit: [],
				couponList: [],
				swiperOption: {
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperRoll: {
					direction: 'vertical',
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperScroll: {
					freeMode: true,
					freeModeMomentum: false,
					slidesPerView: 'auto',
					observer: true,
					observeParents: true
				},
				swiperBoutique: {
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperProducts: {
					freeMode: true,
					freeModeMomentum: false,
					slidesPerView: 'auto',
					observer: true,
					observeParents: true
				},
				bgImage: ''
			};
		},
		computed: {
			singNew() {
				return this.roll.length > 0 ? this.roll[0] : "你还没添加通知哦！";
			},
			customStyle() {
				var bgImage = this.bgImage;
				// var style = `height:${this.CustomBar}px;padding-top:${0}px;background: ${this.bgcolor}`;
				var style = `height:${this.CustomBar}px;padding-top:${this.StatusBar}px;background: ${this.bgcolor}`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			},

		},
		onShow: function() {
			this.getLocation()
			let that = this;
			uni.showLoading({
				title: '加载中'
			});
			getHomeData().then(res => {
				that.logoUrl = res.data.logoUrl;
				res.data.banner.map(item => item.bgcolor = '')
				that.$set(that, 'banner', res.data.banner);
				that.$set(that, 'menus', res.data.menus);
				that.$set(that, 'roll', res.data.roll);
				that.$set(that, 'info', res.data.info);
				that.$set(that, 'firstList', res.data.firstList);
				that.$set(that, 'bastList', res.data.bastList);
				that.$set(that, 'likeInfo', res.data.likeInfo);
				that.$set(that, 'live', res.data.liveList);
				that.$set(that, 'lovely', res.data.lovely);
				that.$set(that, 'benefit', res.data.benefit);
				that.$set(that, 'couponList', res.data.couponList);
				that.$set(that, 'combinationList', res.data.combinationList);
				uni.hideLoading();
				that.setOpenShare();
				// that.doColorThief()
			});
		},
		methods: {
			...mapActions(["getLocation"]),
			onShareTimeline: function() {
				return {
					title: this.miniHomeRemark,
					imageUrl: this.miniHomeImg,
					path: "pages/home/index?spread=" + uni.getStorageSync("uid")
				}
			},
			onShareAppMessage: function() {
				return {
					title: this.miniHomeRemark,
					imageUrl: this.miniHomeImg,
					path: "pages/home/index?spread=" + uni.getStorageSync("uid")
				}
			},
			goRoll(item) {
				if (item.uniapp_url) {
					this.$yrouter.push(item.uniapp_url)
				}
			},
			goGoodSearch() {
				// this.$yrouter.push('/pages/shop/GoodsEvaluate/index');
				this.$yrouter.push('/pages/shop/GoodSearch/index');
			},
			goWxappUrl(item) {
				this.$yrouter.push(item.uniapp_url);
			},
			goHotNewGoods(type) {
				this.$yrouter.push({
					path: '/pages/shop/HotNewGoods/index',
					query: {
						type
					}
				});
			},
			goGoodsCon(item) {
				this.$yrouter.push({
					path: '/pages/shop/GoodsCon/index',
					query: {
						id: item.id
					}
				});
			},
			goGoodsPromotion() {
				this.$yrouter.push('/pages/shop/GoodsPromotion/index');
			},
			setOpenShare: function() {
				if (this.$deviceType == 'weixin') {
					getShare().then(res => {
						var data = res.data.data;
						var configAppMessage = {
							desc: data.synopsis,
							title: data.title,
							link: location.href,
							imgUrl: data.img
						};
						this.openShareAll(configAppMessage);
					})
				}
			},
			startQr: function() {
				uni.scanCode({
					success: (res) => {
						let option = handleUrlParam(res.result)
						switch (option.pageType) {
							case 'good':
								// 跳转商品详情
								this.$yrouter.push({
									path: '/pages/shop/GoodsCon/index',
									query: {
										q: res.result
									}
								});
								break;
							case 'group':
								// 跳转团购
								this.$yrouter.push({
									path: '/pages/activity/GroupRule/index',
									query: {
										q: res.result
									}
								});
								break;
							case 'dargain':
								// 跳转砍价
								this.$yrouter.push({
									path: '/pages/activity/DargainDetails/index',
									query: {
										q: res.result
									}
								});
								break;
							default:
								// 跳转分销
								this.$yrouter.push({
									path: '/pages/Loading/index',
									query: {

									}
								});
								break;
						}
					}
				});
			},
			getbgcolor(e) {
				this.bgcolor = e;
			},
		},
		created: async function() {
			// await this.doColorThief();
		},
	};
</script>
<style scoped lang="less">
	.content_box {
		background: #f6f6f6;
	}

	.index {
		background-color: #fff;
	}

	.swiper-item {
		height: 100%;
	}

	.fixed-header {
		position: fixed;
		z-index: 99;
		// #ifdef H5
		top: 88rpx;
		// #endif

		// #ifndef H5
		top: 0;
		// #endif
		left: 0;
		right: 0;
		background: #fff;
		box-shadow: 0 0 20rpx -10rpx #aaa;

		&+.fixed-header-box {
			height: 98rpx
		}
	}

	.head_box {
		width: 750rpx;
		// background: #fff;
		transition: all linear 0.3s;

		/deep/.cuIcon-back {
			display: none;
		}

		.nav-title {
			font-size: 38rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
		}
	}

	.cu-bar.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
		// box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
	}

	.cu-bar {
		box-sizing: border-box;

		.index .header {
			height: 64rpx;
			// width: 100%;
			// padding: 0 30rpx;
			// box-sizing: border-box;

		}
	}

	.header-search {
		transition: all linear 0.3s;
	}

	.cu-bar .action {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		align-items: center;
		height: 100%;
		max-height: 100%;

		&:first-child {
			margin-left: 15px;
			font-size: 15px;
		}
	}

	.home_content_box {
		margin-top: -10rpx;
	}

	.head_box {
	}

	.nav-title {
		margin-left: 20rpx;
		line-height: 40px;
	}
</style>
