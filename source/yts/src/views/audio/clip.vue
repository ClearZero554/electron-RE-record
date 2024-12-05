<template>
  <el-dialog
    :title="NewTitle"
    :visible.sync="isShowClip"
    :destroy-on-close="true"
    width="80%"
    class="dialog"
    :before-close="close"
    @open="open"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div class="audioTime">
      <div v-if="wavesurfer">音效总长度{{ wavesurfer.getDuration() }}秒</div>
      <div>裁剪后音频时间:{{ audioTime }}s</div>

      <div class="init" @click="init">恢复默认</div>
    </div>

    <div id="wave-timeline" ref="wave-timeline"></div>
    <div id="canvas"></div>
    <el-slider
      v-model="croppingMaxTime"
      ref="slider"
      @input="dialogChange"
      :min="0"
      range
      :step="0.01"
      :show-tooltip="false"
    ></el-slider>
    <div class="setUp"></div>
    <div class="volume">
      <div class="label">音量：</div>
      <el-slider
        v-model="volume"
        :max="100"
        :step="1"
        :show-tooltip="false"
      ></el-slider>
      <div class="label">{{ volume }}%</div>
    </div>

    <div slot="footer" class="dialog-footer">
      <div class="footerLeft">
        <div @click="playAll">试听全部</div>
        <div @click="audition">试听</div>
        <div @click="shop(false)" v-show="isBf">暂停</div>
        <div @click="shop(true)" v-show="!isBf">播放</div>
      </div>
      <div class="footerRi">
        <div @click="$emit('update:isShowClip', false)">取消</div>
        <div @click="save">保存设置</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Wavesurfer from "wavesurfer.js";
import Regions from "wavesurfer.js/plugins/regions";
import Timeline from "wavesurfer.js/plugins/timeline";
import Hover from "wavesurfer.js/plugins/hover";
import axios from "axios";
import ipcUtil from "@/ipc";
import { bufferToWave } from "@/utils/index";
import { updateList } from "@/api/audio";
export default {
  props: ["isShowClip", "clickItem"],
  data() {
    return {
      croppingMaxTime: [], //最长时间
      audioTime: "", //裁剪时间
      loading: true,
      wsRegions: null, //区域
      wavesurfer: null, //音频
      setting: {},
      isBf: false,
      volume: 80,
    };
  },
  computed: {
    NewTitle() {
      return `剪辑音效 「${this.clickItem.name || "无"}」`;
    },
  },
  watch: {
    volume(val) {
      this.wavesurfer.setVolume((val / 100).toFixed(1));
    },
  },
  methods: {
    open() {
      this.clip();
    },
    // 弹框内的滑块改变
    dialogChange(e) {
      let sliderButton = document.getElementsByClassName(
        "el-slider__button-wrapper"
      ); //滑块
      sliderButton[3].setAttribute("data-progress", e[0]);
      sliderButton[4].setAttribute("data-progress", e[1]);
      this.audioTime = Math.floor((e[1] - e[0]) * 100) / 100;
      if (this.wsRegions != null) {
        // 清除
        this.wsRegions.clearRegions();
        this.wsRegions.addRegion({
          id: 1,
          start: e[0],
          end: e[1],
          content: "裁剪区域",
          color: `rgba(64, 158, 255, 0.5)`,
          drag: false,
          resize: false,
        });
      }
    },
    // 关闭弹框
    close() {
      this.$emit("update:isShowClip", false);
    },
    // 剪辑
    clip() {
      this.$nextTick(() => {
        const wavesurfer = Wavesurfer.create({
          container: "#canvas", // 指定波形图的容器元素
          waveColor: "#66D896", // 波形图的颜色
          progressColor: "#C5E8B4", // 播放进度条的颜色
          backgroundColor: "#fff",
          height: 100, // 波形图的高度
          barHeight: 0.8,
          url: this.$root.url + this.clickItem.src,
          plugins: [
            Timeline.create({
              container: "#wave-timeline",
              fontSize: 16,
              PrimaryFontColor: "#000",
              secondaryFontColor: "#000",
              primaryColor: "#000",
              secondaryColor: "#000",
            }),
            Hover.create({
              lineColor: "#000",
              lineWidth: 2,
              labelBackground: "#555",
              labelColor: "#fff",
              labelSize: "11px",
            }),
          ],
        });

        const wsRegions = wavesurfer.registerPlugin(Regions.create());
        wavesurfer.on("decode", () => {
          wsRegions.addRegion({
            id: 1,
            start: 0,
            end: wavesurfer.getDuration(),
            content: "裁剪区域",
            color: `rgba(64, 158, 255, 0.5)`,
            drag: false,
            resize: false,
          });
          // 获取音频时间

          this.audioTime = Math.floor(wavesurfer.getDuration() * 100) / 100;
          // console.log(this.$refs.slider, "slider");
          this.$refs.slider.max = this.audioTime;
          let sliderButton = document.getElementsByClassName(
            "el-slider__button-wrapper"
          ); //滑块
          // 初始化滑块进度
          sliderButton[3].setAttribute(
            "data-progress",
            this.croppingMaxTime[0]
          );
          sliderButton[4].setAttribute(
            "data-progress",
            this.croppingMaxTime[1]
          );
          // 赋值剪辑区域
          if (
            this.clickItem.startTime != null &&
            this.clickItem.endTime != null
          ) {
            this.croppingMaxTime = [
              this.clickItem.startTime,
              this.clickItem.endTime,
            ];
          } else {
            this.croppingMaxTime = [
              0,
              Number(Math.floor(wavesurfer.getDuration() * 100) / 100),
            ];
          }
        });

        this.wavesurfer = wavesurfer;
        this.wsRegions = wsRegions;
        this.wavesurfer.setVolume((this.volume / 100).toFixed(1));
        // 绑定播放完毕的事件
        this.wavesurfer.on("finish", () => {
          this.isBf = false;
        });
        // 关闭加载
        this.loading = false;
      });
    },
    // 初始化
    async init() {
      console.log(this.clickItem,'this.clickItem');
      const data = {
        ...this.clickItem,
        isEdited: 0,
        endTime:Number(Math.floor(this.wavesurfer.getDuration() * 100) / 100),
        startTime:0
      };
      const res = await updateList(data);
      if (res.data.code == 200) {
        // this.wavesurfer.load(this.$root.url + this.clickItem.originalSrc);
        this.croppingMaxTime = [
          0,
          Number(Math.floor(this.wavesurfer.getDuration() * 100) / 100),
        ];
        this.$emit("getList");
        this.$emit('update:isShowClip', false)
      }
    },
    // 试听
    audition() {
      this.isBf = true;
      this.wsRegions.getRegions()[0].play();
      this.wsRegions.on("region-out", (region) => {
        if (region.end == this.croppingMaxTime[1]) {
          this.wavesurfer.pause();
        }
      });
    },
    //暂停
    shop(type) {
      this.isBf = type;
      this.wavesurfer.playPause();
    },
    // 播放全部
    playAll() {
      this.isBf = true;
      this.wsRegions.un("region-out");
      this.wavesurfer.seekTo(0);
      this.wavesurfer.play();
    },

    // 保存
    async save1() {
      // 声道数量和采样率
      const channels = this.wavesurfer.decodedData.numberOfChannels;
      const rate = this.wavesurfer.decodedData.sampleRate;
      // 创建AudioContext对象
      const audioContext = new AudioContext();
      // 计算起始位置和结束位置的样本索引
      const startTimeSample = this.croppingMaxTime[0] * rate;
      const endTimeSample = this.croppingMaxTime[1] * rate;
      const frameCount = endTimeSample - startTimeSample;
      //  创建同样采用率、同样声道数量，空的AudioBuffer
      const croppedAudioBuffer = audioContext.createBuffer(
        channels,
        frameCount,
        rate
      );
      // 遍历声道
      for (let index = 0; index < channels; index++) {
        // 裁剪音频数据
        const croppedChannelData = this.wavesurfer.decodedData
          .getChannelData(index)
          .subarray(startTimeSample, endTimeSample);
        croppedAudioBuffer.getChannelData(index).set(croppedChannelData);
      }
      // 转wav格式
      let blob = bufferToWave(croppedAudioBuffer, frameCount);
      let file = new File([blob], this.clickItem.name + ".wav");
      const formData = new FormData();
      formData.append("file", file);
      const upload = await axios.post(
        "https://yts.yuantiaoshi.com:8880/api/upload/music",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (upload.data.code != 200) {
        return;
      }
      const data = {
        ...this.clickItem,
        isEdited: 1,
        src: upload.data.msg,
      };
      const res = await updateList(data);
      if (res.data.code == 200) {
        this.$emit("getList");
        this.close();
      }
    },
    // 保存时间
    async save() {
      const data = {
        ...this.clickItem,
        isEdited: 1,
        startTime: this.croppingMaxTime[0],
        endTime: this.croppingMaxTime[1],
      };
      const res = await updateList(data);
      if (res.data.code == 200) {
        this.$emit("getList");
        this.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.volume {
  display: flex;

  .label {
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: right;
  }
  /deep/ .el-input {
    border-radius: 12px;
    overflow: hidden;
    width: 220px;
    border: 2px solid #000;
    box-sizing: border-box;
    .el-input__inner {
      height: 28px;
      border: none;
      // width: 120px;
    }
  }
  /deep/ .el-slider {
    width: 210px;
  }
}
.dialog {
  /deep/ .el-slider__button-wrapper::before {
    content: attr(data-progress);
    position: absolute;
    width: 40px;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    text-align: center;
    top: -20px;
    left: 0px;
    font-size: 12px;
    color: rgb(64, 148, 255);
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  .footerLeft {
    display: flex;
    div {
      width: 80px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 16px;
      font-weight: 500;
      border: 3px solid #b3b1ad;
      cursor: pointer;
      margin-right: 14px;
      font-size: 14px;
      &:nth-child(1) {
        background: #f2b5b4;
      }
      &:nth-child(2) {
        background: #f2b5b4;
      }
      &:nth-child(3) {
        background: #fdfeba;
      }
      &:nth-child(4) {
        background: #f2b5b4;
      }
    }
  }
  .footerRi {
    display: flex;
    div {
      width: 80px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 16px;
      font-weight: 500;
      border: 3px solid #b3b1ad;
      cursor: pointer;
      margin-right: 14px;
      font-size: 14px;
      &:nth-child(1) {
        background: #fff;
        border: 3px solid #000;
      }
      &:nth-child(2) {
        background: #c3fbba;
      }
    }
  }
}
.audioTime {
  width: 100%;
  display: flex;
  align-items: center;
  div {
    // width: 33%;
    &:nth-child(1) {
      font-size: 17px;
      color: #000;
      font-weight: 500;
      width: 300px;
    }
    &:nth-child(2) {
      color: #7dc2fa;
      font-size: 22px;
      width: 300px;
    }
    &:nth-child(3) {
      width: 150px;
    }
  }
}
.setUp {
  width: 100%;
  height: 20px;
}
#canvas {
  width: 100%;
  margin-bottom: 30px;
}
.init {
  width: 80px !important;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 16px;
  border: 3px solid #509ae8;
  margin-left: 120px;
  cursor: pointer;
}
</style>