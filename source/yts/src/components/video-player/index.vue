<template>
  <div style="position: relative">
    <video-player
      ref="playerRef"
      :options="playerOptions"
      :key="videoKey"
      v-show="sourceMaterialType !== 2"
      muted
    ></video-player>
    <!--  <div class="collect" @click="handleCollect" v-if="!isHide && sourceMaterialType !== 2">
      {{ collect ? '取消收藏' : '收藏' }}
    </div> -->
    <div class="info" v-if="sourceMaterialType === 2">
      <div
        class="el-carousel__arrow el-carousel__arrow--left"
        @click="changCarousel(0)"
        v-if="!isFont"
      >
        <i class="el-icon-arrow-left"></i>
      </div>
      <el-carousel
        class="carousel"
        ref="cardShow"
        :autoplay="false"
        trigger="never"
        arrow="never"
        @change="handleChangeArticleIndex"
      >
        <el-carousel-item
          v-for="(item, index) in info.articleImage"
          :key="index"
        >
          <el-image
            :src="item"
            :fit="isFont ? 'contain' : 'cover'"
            :draggable="false"
            :preview-src-list="info.articleImage"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
      <div
        class="el-carousel__arrow el-carousel__arrow--right"
        @click="changCarousel(1)"
      >
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import "video.js/dist/lang/zh-CN.js";

export default {
  props: ["info", "collect", "isHide", "isFont", "sourceMaterialType"],
  components: {
    videoPlayer,
  },
  data() {
    return {
      playerOptions: {
        inactivityTimeout: 0,
        controls: true,
        language: "zh-CN",
        sources: [],
        preload: true, //预加载
        controlBar: {
          children: [
            { name: "playToggle" },
            { name: "volumePanel" },
            { name: "currentTimeDisplay" },
            { name: "timeDivider" },
            { name: "durationDisplay" },
            { name: "progressControl" },
            { name: "FullscreenToggle" },
          ],
        },
      },
      videoKey: 0,
      volume: 100,
      isShow: false,
      timer: null,
      url: null,
      articleIndex: 0,
    };
  },
  watch: {
    info: {
      handler() {
        this.setUrl();
      },
      deep: true,
    },
    sourceMaterialType: {
      handler(val) {
        this.setUrl();
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setUrl();
    });

    document.addEventListener("keyup", this.keyup);
    // 解绑
    this.$bus.$on("unbind", () => {
      console.log("解绑");
      document.removeEventListener("keyup", this.keyup);
    });
    // 绑定
    this.$bus.$on("binding", () => {
      console.log("绑定");
      document.addEventListener("keyup", this.keyup);
    });
  },
  methods: {
    setUrl() {
      if (this.isHide) {
        this.url = "https://resource.yuantiaoshi.com/" + this.info;
      } else {
        if (this.sourceMaterialType == 0) {
          this.url = this.info.video;
        } else {
          this.url = this.info.teachingVideoUrl;
        }
      }
      if (this.url) {
        this.$refs.playerRef.options.sources[0] = {
          type: "video/mp4",
          src: this.url,
        };
        this.videoKey = this.videoKey + 1;
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("vjs-volume-bar")[0];
          let cDom = document.createElement("span");
          cDom.id = "volumeNum";
          dom.appendChild(cDom);
          try {
            this.timer = setInterval(() => {
              cDom.innerHTML = dom.ariaValueText;
            }, 1000);
          } catch (error) {}
        });
      }
    },
    /* change(type) {
      this.type = type;
      clearInterval(this.timer);
      if (type != 2) {
        this.setUrl();
      }
    }, */
    handleCollect() { 
      this.$emit("collect");
    },
    // 键盘抬起
    keyup(e) {
      if (e.code === "Space") {
        this.$nextTick(() => {
          try {
            if (this.$refs.playerRef && this.$refs.playerRef.player.paused()) {
              this.$refs.playerRef.player.play();
            } else {
              this.$refs.playerRef.player.pause();
            }
          } catch (error) {}
        });
      }
    },
    close() {
      clearInterval(this.timer);
    },
    changCarousel(type) {
      if (type == 0) {
        // 向左
        this.$refs.cardShow.prev();
      } else {
        this.$refs.cardShow.next();
      }
    },
    handleChangeArticleIndex(index) {
      if (this.info.articleType == 1) {
        this.articleIndex = index;
        this.$emit("changeArticleIndex", index);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    // document.removeEventListener("keyup", this.keyup);
  },
};
</script>
<style>
.el-image-viewer__canvas {
  max-width: 80%; /* 最大宽度限制为屏幕宽度的80% */
  max-height: 80%; /* 最大高度限制为屏幕高度的80% */
  margin: 10% auto; /* 自动外边距居中 */
}
.el-image-viewer__mask{
  border-radius: 20px;
  width: 961px;
}
</style>
<style lang="scss" scoped>
.info {
  width: 572px;
  height: 400px;
  background-color: var(--carousel);
  border-radius: 24px;
  // padding-top: 48px;

  box-sizing: border-box;
  font-size: 16px;
  color: var(--fc);
  .configurationOption {
    width: 120px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 2px solid #000;
    margin-bottom: 2px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
  }
  .action {
    background: #409eff;
  }
  span {
    vertical-align: middle;
  }

  .name {
    margin-left: 10px;
  }

  .divider {
    width: calc(100% - 8px);
    height: 3px;
    background-color: #bbb;
    margin: 10px 4px;
  }

  .title {
    font-size: 18px;
    margin-left: 4px;
    margin-bottom: 2px;
  }

  /*   .left {
    position: absolute;
    z-index: 999;
    width: 50px;
    height: 70px;
    top: 160px;
    left: 20px;
    background-image: url("@/assets/img/left.png");
    background-size: 100% 100%;
  }

  .right {
    position: absolute;
    z-index: 999;

    width: 50px;
    height: 70px;
    top: 160px;
    right: 40px;
    background-image: url("@/assets/img/ri.png");
    background-size: 100% 100%;
  } */
  .el-carousel__arrow {
    position: absolute;
    width: 26px;
    height: 26px;
    z-index: 999;
    line-height: 26px;
    color: #fff;
    font-size: 20px;
    border: 1px solid #fff;
    background: rgba($color: #ccc, $alpha: 0.4);
  }
  .el-carousel__arrow--left {
    top: 50%;
    left: 20px;
  }
  .carousel {
    height: 100%;
    width: 100%;
    border: 2px solid #000;
    border-radius: 18px;
   
    // margin-left: 48px;

    /deep/ .el-carousel__container {
      height: 100%;
      width: 100%;
      i {
        font-size: 18px;
      }
    }
    .el-image {
      height: 100%;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    /deep/ .el-carousel__indicators {
      width: 100px;
      text-align: center;
      li {
        .el-carousel__button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #409eff;
        }
      }
    }
  }

  .label {
    display: inline-block;
    width: 100%;
    font-size: 14px;
    word-break: break-all;
    white-space: normal;
  }
}

.vi {
  position: absolute;
  bottom: 8px;
  left: 50px;
  img {
    width: 20px;
    height: 20px;
  }
}
.viSlider {
  position: absolute;
  bottom: 48px;
  left: 40px;
  /deep/ .el-slider__button {
    // height: 8px;
    // width: 8px;
    background: #fff;
  }
  /deep/ .el-slider__bar {
    background: #409eff;
  }
}
/deep/ {
  .video-player,
  .video-js {
    height: 100%;
    width: 100%;
  }
  #volumeNum {
    position: absolute;
    /* bottom: -20px;
    left: -15px;
    font-size: 14px;
    color: #fff; */
    display: none;
  }
  .vjs-volume-level {
    background: #409eff;
    color: #fff;
  }
  .vjs-volume-vertical {
    background: #554b4d;
    border-radius: 8px;
  }

  .video-js {
    overflow: hidden;
    border-radius: 24px;
    // border: 1px solid #000;
  }

  .vjs-control-bar {
    display: flex;
    visibility: visible;
    height: 40px;
    background-color: rgba($color: #fff, $alpha: 0.6);
    border-radius: 0 0 24px 24px;
  }

  .vjs-control,
  .vjs-volume-panel.vjs-volume-panel-vertical {
    width: 3em;
  }

  .vjs-play-control,
  .vjs-volume-panel,
  .vjs-fullscreen-control {
    font-size: 14px;
    color: #000;
    // margin-right: 40px;
  }

  .vjs-current-time,
  .vjs-time-divider,
  .vjs-duration {
    display: inline-block;
    font-size: 14px;
  }

  .vjs-mute-control {
    padding-left: 1em;
    padding-right: 1em;
  }

  .vjs-time-divider {
    padding: 0;
    text-align: center;
  }

  /* .vjs-progress-control {
    flex: none;
    width: calc(100% - 250px);
  } */

  .vjs-slider {
    background-color: #fff;
    border-radius: 4px;
  }
  .vjs-progress-holder {
  }
  .vjs-play-progress {
    border-radius: 3px;
  }

  .vjs-play-progress {
    background-color: #409eff;
  }

  .vjs-big-play-button {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    border: none;
    background-color: transparent;
    text-align: center;

    span {
      display: inline-block;
      height: 60px;
      width: 60px;
      background-image: url("@/assets/play.png");
      background-size: 100%;
    }

    span::before {
      content: "" !important;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.collect {
  position: absolute;
  width: 52px;
  height: 20px;
  line-height: 20px;
  right: 16px;
  bottom: 10px;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    background-color: #ececec;
  }
}
</style>
