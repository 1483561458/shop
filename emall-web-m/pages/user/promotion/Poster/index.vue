<template>
  <view class="distribution-posters">
    <view class="slider-banner banner">
      <swiper indicatorDots="true">
        <block v-for="(item, infoIndex) in info" :key="infoIndex">
          <swiper-item>
            <image class="slide-image" :src="item.wap_poster" mode="widthFix" show-menu-by-longpress />
          </swiper-item>
        </block>
      </swiper>
    </view>
    <view class="keep bg-color-red" @click="saveImg">保存海报</view>
  </view>
</template>
<script>
  // import { swiper, swiperSlide } from "vue-awesome-swiper";
  import {
    getSpreadImg
  } from "@/api/user";

  export default {
    name: "Poster",
    components: {
      // swiper,
      // swiperSlide
    },
    props: {},
    data: function () {
      return {
        swiperPosters: {
          speed: 1000,
          effect: "coverflow",
          slidesPerView: "auto",
          centeredSlides: true,
          coverflowEffect: {
            rotate: 0, // 旋转的角度
            stretch: -20, // 拉伸   图片间左右的间距和密集度
            depth: 100, // 深度   切换图片间上下的间距和密集度
            modifier: 3, // 修正值 该值越大前面的效果越明显
            slideShadows: false // 页面阴影效果
          },
          observer: true,
          observeParents: true
        },
        info: [],
        activeIndex: 0
      };
    },
    mounted: function () {
      this.getIndex();
      let that = this;
      // this.swiper.on("slideChange", function() {
      //   that.activeIndex = that.swiper.activeIndex;
      // });
    },
    computed: {
      swiper() {
        // return this.$refs.mySwiper.swiper;
      }
    },
    methods: {
      getIndex: function () {
        let that = this;
        getSpreadImg({
          from: this.$deviceType == 'weixin' || this.$deviceType == 'weixinh5' ? 'uniappH5' : this.$deviceType
        }).then(
          res => {
            that.info = res.data;
          },
          err => {
            uni.showToast({
              title: err.msg || err.response.data.msg || err.response.data.message,
              icon: "none",
              duration: 2000
            });
          }
        );
      },
      downloadIamge: function (imgsrc, name) {
        var that = this;
        this.isDown = true;
        var downloadUrl = imgsrc;

        if (!wx.saveImageToPhotosAlbum) {
          uni.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
          });
          that.openDialogVisible = true;

          return;
        }

        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope
        wx.getSetting({
          success(res) {
            if (!res.authSetting["scope.writePhotosAlbum"]) {
              that.openDialogVisible = true;

              // 接口调用询问
              wx.authorize({
                scope: "scope.writePhotosAlbum",
                success() {
                  that.downloadImage(downloadUrl);
                },
                fail() {
                  // 用户拒绝了授权
                  // 打开设置页面
                  wx.openSetting({
                    success: function (data) {},
                    fail: function (data) {}
                  });
                }
              });
            } else {
              that.downloadImage(downloadUrl);
            }
          },
          fail(res) {
            that.openDialogVisible = true;
          }
        });
      },
      saveImg: function () {
        this.downloadIamge(
          this.info[this.activeIndex].wap_poster,
          "poster" + this.activeIndex
        );
      }
    }
  };
</script>

<style lang="less">
  page {
    height: 100%;
  }

  .distribution-posters {
    height: 100%;
  }

  .banenr {
    height: 100%;
  }

  .banner swiper {
    height: 100%;
  }

  .banner .slide-image {
    width: 100%;
    height: auto;
  }
</style>
