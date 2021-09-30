<template>
  <view class="lottie-bg">
    <view id="lottie">
      <image src="../../static/images/live-logo.gif" rel="preload" mode="widthFix" style="width: 100%;" />
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapActions
  } from "vuex";
  // 组件
  // import request from "@//api/request";
  import {
    wxappAuth,
    getUser
  } from "@/api/user";
  import dayjs from "dayjs";
  import cookie from "@/utils/store/cookie";
  import {
    parseQuery,
    login,
    handleQrCode,
    getCurrentPageUrl,
    handleUrlParam
  } from "@/utils";

  export default {
    name: "Loading",
    data() {
      return {};
    },
    onShow() {

      var url = handleQrCode();
      if (!url) {
        url = handleUrlParam(getCurrentPageUrl())
      }
      // 判断是否是分销
      if (url) {
        var spread = cookie.get("spread");
        let urlSpread = parseInt(url.spread);
        if (!Number.isNaN(urlSpread) && spread !== urlSpread) {
          cookie.set("spread", urlSpread || 0);
        } else if (spread === 0 || typeof spread !== "number") {
          cookie.set("spread", urlSpread || 0);
        }
        if (this.$store.getters.token) {
          this.toLaunch();
          return;
        }
        // cookie.get("spread");
        // if (this.$deviceType == "weixin") {
        //   let path = parseQuery().path
        //   console.log(this)
        //   if (path) {
        //     this.$yrouter.push({
        //       path
        //     });
        //   } else {
        //     this.$yrouter.switchTab({
        //       path: "/pages/home/index"
        //     });
        //   }

        //   return
        // }
        // this.toLaunch();
        if (this.$deviceType == "app" || this.$deviceType == "h5") {
          // this.toLaunch();

          this.$yrouter.switchTab({
            path: "/pages/home/index"
          });
          return;
        }
        login().finally(() => {
          this.$yrouter.switchTab({
            path: "/pages/home/index"
          });
        });
      }
    },
    methods: {
      ...mapActions(["changeAuthorization", "setUserInfo"]),
      toLaunch() {
        console.log("loading home");
        this.changeAuthorization(false);
        this.$yrouter.switchTab({
          path: "/pages/home/index"
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .lottie-bg {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  #lottie {
    width: 35%;
    display: block;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    margin: auto;
  }
</style>
