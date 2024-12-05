<template>
  <div class="details">
    <div class="buttons">
      <div class="buttonsLeft">
        <div class="tabs">
          <div class="tab">
            <div
              :class="sourceMaterialType === 0 ? 'action' : ''"
              @click="sourceMaterialType = 0"
              v-if="info.video"
            >
              素材
            </div>
            <!-- v-if="info.teachingVideoUrl && !isHide" -->
            <div
              :class="sourceMaterialType === 1 ? 'action' : ''"
              @click="sourceMaterialType = 1"
              v-if="info.teachingVideoUrl && !isHide"
            >
              教学
            </div>
            <div
              :class="sourceMaterialType === 2 ? 'action' : ''"
              @click="sourceMaterialType = 2"
            >
              图文
            </div>
          </div>
        </div>
        <div class="copyright" @click="handleClickCopyright">© 版权声明</div>
        <el-popover
          trigger="focus"
          popper-class="search-popover"
          v-model="searchVisible"
        >
          <el-input
            slot="reference"
            size="mini"
            class="search"
            v-model="search"
            placeholder="搜索问题解决方法"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchClick"
            ></el-button>
          </el-input>
          <el-scrollbar class="items search-scrollbar">
            <div>
              <span
                class="searchItem"
                v-for="(item, index) in hotSearchList"
                @click="handleClickHotSearch(index)"
                :key="index"
                >{{ item.search }}</span
              >
            </div>
          </el-scrollbar>
        </el-popover>
        <span class="icon" @click="handleGoBack"
          ><i class="el-icon-arrow-left"></i
        ></span>
        <span
          class="icon"
          :class="virtualization ? 'virtualization' : ''"
          @click="handleGoBefore"
          ><i class="el-icon-arrow-right"></i
        ></span>
      </div>
      <!-- <div class="contribute">投稿</div> -->
      <div class="backButton" @click="handleBack">
        <img src="@/assets/home.png" />
        <span>返回主页</span>
      </div>
    </div>

    <div class="info">
      <div class="title" @click="handleDownload"><iconpark-icon name="to-bottom"></iconpark-icon>{{ info.visit }}</div>
      <span class="source-code">{{ info.title }}</span>
      <!-- <div class="source-code">源号：{{ info.id }}</div> -->
      <div v-if="info.resourceName == 'dontailogo.zip'" class="copy">
        <el-input
          class="logoPath"
          :value="logoPath"
          disabled
          size="small"
        ></el-input>
        <div class="logoTop" @click="copy(logoPath)">复制</div>
      </div>
      <div class="textStyleFrom1" v-if="info.id == 72">
        <div class="programme">
          <div class="el-form-item__label">预装模板</div>
          <div
            v-for="item in programmeList"
            :key="item.id"
            :class="item.id == type && 'scene'"
            class="programmeItem"
            @click="
              () => {
                type = item.id;
              }
            "
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="textStyleFrom1" v-if="info.id == 474">
        <div class="programme">
          <el-button type="danger" class="submit" size="mini" @click="uninstall"
            >卸载插件</el-button
          >
        </div>
      </div>
    </div>
    <div class="detailsMain" v-loading="fullscreenLoading">
      <div class="main">
        <div class="identification">
          <div v-if="info.fees == 1" class="identificationBox">
            <div class="svipImg"></div>
          </div>
          <div v-if="info.fees == 2" class="identificationBox">
            <div v-if="info.isPaid == 0">{{ info.price }}金币</div>
            <div v-else>已支付</div>
          </div>
          <div v-if="info.fees == 3" class="identificationBox">
            <div class="svipImg"></div>
            <div v-if="info.isPaid == 0">{{ info.price }}金币</div>
            <div v-else>已支付</div>
          </div>
        </div>
        <video-player
          class="video"
          :info="info"
          :collect="info.collect"
          @collect="handleCollect"
          :sourceMaterialType="sourceMaterialType"
          ref="video"
          v-if="!isFont && info.id"
          @changeArticleIndex="changeArticleIndex"
        ></video-player>
        <div class="homeImg" v-else>
          <canvas
            id="myCanvas"
            ref="canvas"
            v-if="canvas.style.fontFamily"
          ></canvas>
          <!--  <div class="collect" @click="handleCollect">
            {{ info.collect ? "取消收藏" : "收藏" }}
          </div> -->
        </div>
        <div class="article">
          <div class="article-info" v-if="id != 47">
            <Comment
              :info="info"
              :id="$route.params.id"
              :firstComment="info.firstComment"
              ref="comment"
              v-if="info.id"
              :isFont="isFont"
              @reply="reply"
            ></Comment>
            <div class="commentBut" @click="comment">评论</div>
          </div>
          <!-- 调整分辨率 -->
          <div class="article-info" v-if="id == 47">
            <div style="margin-bottom: 8px">推流码结尾是third</div>
            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 0"
                :class="configurationOption == 0 ? 'action' : ''"
              >
                手机或者电脑
              </div>
              <span>1280x720</span>
            </div>
            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 1"
                :class="configurationOption == 1 ? 'action' : ''"
              >
                11寸ipadPro
              </div>
              <span>960x720</span>
            </div>
            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 2"
                :class="configurationOption == 2 ? 'action' : ''"
              >
                12.9通用版
              </div>
              <span>920x720</span>
            </div>

            <div style="color: #888" class="tit">
              计算公式: (视频画布长/宽)x720=重新缩放输出的长(取整数)
            </div>
            <div style="margin-bottom: 8px">推流码结尾是thirdgame</div>

            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 3"
                :class="configurationOption == 3 ? 'action' : ''"
              >
                手机或者电脑
              </div>
            </div>
            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 4"
                :class="configurationOption == 4 ? 'action' : ''"
              >
                11寸ipadPro
              </div>
              <span>1440x1080</span>
            </div>

            <div style="display: flex; align-items: center">
              <div
                class="configurationOption"
                @click="configurationOption = 5"
                :class="configurationOption == 5 ? 'action' : ''"
              >
                12.9通用版
              </div>
              <span>1380x1080</span>
            </div>
            <div style="color: #888" class="tit">
              计算公式:(视频画布长/宽)x1080=重新缩放输出的长(取整数)
            </div>
          </div>
          <div class="article-buttons">
            <!-- <el-popover
              placement="top"
              popper-class="collect-popover"
              v-model="visible"
            >
              <el-button class="collect" slot="reference">
                <img src="@/assets/box.png" />
                <span>收藏箱</span>
              </el-button>
              <collect></collect>
            </el-popover> -->
            <!-- <el-button
              type="primary"
              class="download"
              @click="handleDownload"
              icon="el-icon-download"
              >下载({{ info.visit }})</el-button
            > -->
            <div class="collect" @click="handleCollect">
              <iconpark-icon name="like" class="like"></iconpark-icon>
              <div>
                {{ info.collect ? "取消收藏" : "收藏" }}
              </div>
            </div>
            <el-button
              type="primary"
              class="submit"
              @click="handleInstall"
              :disabled="buttonText != null"
              v-if="!isFont && info.articleCategoryName != '图片'"
              >{{
                buttonText || "一键安装" + info.articleCategoryName
              }}</el-button
            >
            <el-button
              type="primary"
              class="submit"
              @click="handleDownload"
              v-else-if="info.articleCategoryName == '图片'"
              >下载{{ info.articleCategoryName }}素材</el-button
            >
            <el-button
              type="primary"
              class="submit"
              @click="installFont"
              v-else
              >{{
                buttonText || "一键安装" + info.articleCategoryName
              }}</el-button
            >
          </div>
        </div>
        <div class="textStyleFrom" v-if="isFont">
          <div class="programme">
            <div class="el-form-item__label">预装模板</div>
            <div
              v-for="item in programme"
              :key="item.id"
              :class="item.id == canvas.defaultScene && 'scene'"
              class="programmeItem"
              @click="clickProgrammeItem(item)"
            >
              {{ item.title }}
            </div>
          </div>

          <el-form ref="form" :model="canvas" :inline="true">
            <el-form-item label="来源名称">
              <el-input
                placeholder="请输入来源名称"
                v-model="canvas.name"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="显示文字">
              <el-input
                placeholder="请输入需要的文字"
                v-model="canvas.text"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="commentItem">
          <div class="commentItemMain">
            <div class="title">
              <el-avatar :src="info.authorAvatar"></el-avatar>
              <div class="nickname">{{ info.author }}</div>
            </div>
            <div class="context" v-if="info.articleType == 1">
              {{ info.articleLabel[articleIndex] }}
            </div>
            <div class="context" v-else>
              {{ info.articleLabel[0] }}
            </div>
          </div>
        </div>
        <div class="videoDetails">
          <div class="videoDetailsItem">
            <div class="c">©</div>
            <div>源号:{{ info.id }}</div>
          </div>
          <div class="videoDetailsItem" v-if="info.size">
            <Icon fontName="icon-cunchu"></Icon>
            <div>{{ info.size }}M</div>
          </div>
          <div class="videoDetailsItem" v-if="info.dpi">
            <Icon fontName="icon-fenbianshuai"></Icon>
            <div>{{ info.dpi }}</div>
          </div>
          <div class="videoDetailsItem" v-if="info.time">
            <Icon fontName="icon-shijian"></Icon>
            <div>{{ info.time }}s</div>
          </div>
        </div>
        <!-- 评论输入框 -->
        <div class="box" v-if="isShowInput">
          <div class="smsSign" v-if="tenantMessageInfo.smsSign">
            @{{ tenantMessageInfo.smsSign }}
          </div>
          <div class="inputBox">
            <div class="input">
              <el-input
                v-model.trim="message"
                ref="messageInput"
                @keyup.enter.native="handleSendMessage"
              ></el-input>
            </div>
            <div class="icons">
              <Icon fontName="icon-jietu" @click="screenshot"></Icon>
              <el-upload
                class="upload"
                action="https://yts.yuantiaoshi.com:8880/api/upload/resource"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
              >
                <Icon fontName="icon-tupian"></Icon>
              </el-upload>
              <Icon fontName="icon-fabu2" @click="handleSendMessage"></Icon>
            </div>
          </div>
          <div v-if="imgInfo.src" class="imgBox">
            <img :src="imgInfo.path" alt="" />
          </div>
        </div>
      </div>
    </div>

    <login ref="login"></login>
    <protocol ref="protocol"></protocol>
    <Loading v-if="isLoading"></Loading>
    <VirtualCurrency
      ref="virtualCurrency"
      :info="info"
      :isDownload="isDownload"
      @getDetail="getDetail"
      @handleInstall="handleInstall"
      @handleDownload="handleDownload"
    ></VirtualCurrency>
    <Prompt ref="prompt"></Prompt>
    <UploadDialog ref="uploadDialog"></UploadDialog>
  </div>
</template>

<script>
import VideoPlayer from "@/components/video-player";
import Login from "@/views/dialog/Login.vue";
import Protocol from "@/views/dialog/Protocol.vue";
// import Collect from "@/views/home/Collect.vue";
import Comment from "@/components/Comment/index.vue";
import UploadDialog from "@/components/UploadDialog";
import {
  detail,
  collectAdd,
  collectCancel,
  collectList,
  list,
  download,
} from "@/api/article";
import ipcUtil from "@/ipc";
import feedback from "@/utils/feedback";
import { getUuid } from "@/utils/index";
import VirtualCurrency from "@/components/VirtualCurrency";
import Prompt from "@/components/Prompt";
import { addComment, listByArticleId, del } from "@/api/comment";

export default {
  components: {
    VideoPlayer,
    Login,
    Protocol,

    Comment,
    VirtualCurrency,
    Prompt,
    UploadDialog,
  },
  data() {
    return {
      info: {
        articleImage: [],
        articleLabel: [],
      },

      routeList: [],
      index: -1,
      key: "detail",
      searchVisible: false,
      visible: false,
      search: "",
      searching: false,
      zindex: 10,
      hotSearchList: [],
      searchResultList: [],
      isFont: false,
      // 画布信息
      canvas: {
        text: "未成年禁止刷礼物",
        name: "未成年",
        isGradient: false,
        defaultScene: 1,
        style: {
          color: "#fff",
          gradient: "#fff",
          fontFamily: "",
          background: "",
        },
      },
      myCanvas: null,
      ctx: null,
      programmeList: [
        {
          id: 1,
          title: "默认",
        },
        {
          id: 0,
          title: "模板1",
        },
      ],
      type: 1,
      programme: [
        {
          id: 1,
          title: "默认",
        },
        {
          id: 2,
          title: "边框",
        },
        {
          id: 3,
          title: "渐变",
        },
      ],
      setting: {},
      isDownload: false, //false- 下载 true-一键安装
      id: null,
      configurationOption: 0, //分辨率当前项
      logoPath: null, //动态logo地址
      isLogoTop: false,
      fullscreenLoading: true,
      mouseEvent: {
        flag: false,
        time: null,
        operationDom: null,
      },
      buttonText: null, //操作按钮显示文字
      virtualization: false, //虚化
      message: "", //评论
      articleIndex: 0, //教程文字索引
      isShowInput: false,
      tenantMessageInfo: {},
      imgInfo: {}, //图片地址
      isLoading: true, //加载页
      sourceMaterialType: 0,
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.getDetail(this.$route.params.id);
      }
    },
    canvas: {
      handler(val) {
        if (this.isFont && this.ctx) {
          this.ctx.fillStyle = val.style.color;
          this.ctx.clearRect(0, 0, 1200, 600);
          if (val.defaultScene == 3) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, 450);
            gradient.addColorStop(0, "#ffff00"); // 渐变开始颜色
            gradient.addColorStop(1, "#fff"); // 渐变结束颜色
            this.ctx.fillStyle = gradient;
          }
          this.ctx.fillText(this.canvas.text, 600, 300);
          if (val.defaultScene == 2) {
            this.ctx.strokeStyle = "#ff5500";
            this.ctx.strokeText(this.canvas.text, 600, 300);
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },

  mounted() {
    // 判断是否为最后一页
    this.virtualization = this.$root.lastPage();
    this.isFont = this.$route.query.isFont == "1" ? true : false;
    this.getDetail(this.$route.params.id);
    this.handleSearch();
    // 处理视频显示
    setTimeout(() => {
      this.processingFunctions();
    }, 500);
    // 10秒后如果没有请求成功就返回首页
    setTimeout(() => {
      if (this.isLoading) {
        this.$router.go(-1);
      }
    }, 10000);
  },
  methods: {
    copy(text) {
      navigator.clipboard.writeText(text);
      this.$message.success("复制成功");
    },
     getVideoPlayerInfo(url) {
      const videoElement = document.createElement("video");
      videoElement.src = url;
      videoElement.addEventListener("loadedmetadata", () => {
        this.info.time = Math.ceil(videoElement.duration);
        this.info.dpi =
          videoElement.videoWidth + "*" + videoElement.videoHeight;
      });
    },
    async getDetail(id, index = -1) {
      if (index != -1) id = this.routeList[index];
      const res = await detail({
        id,
        commentId: this.$route.query.articleCommentId,
      });
      if (res.data.code == 200) {
        this.isLoading = false;
        this.info = res.data.data;
        // 字体
        if (this.info.cid == 16) {
          this.sourceMaterialType = 2;
        }
        if (!this.info.video) {
          this.sourceMaterialType = 2;
        }
        if (this.info.cid==11||this.info.cid==13) {
          this.getVideoPlayerInfo(this.info.video)
        }
        this.fullscreenLoading = false;
        this.id = this.info.id;
        this.canvas.style.fontFamily = this.info.title;
        this.canvas.name = this.info.title;
        this.canvas.text = this.info.title;
        if (index == -1) {
          let tempRoute = [];
          this.index = this.index + 1;
          for (let i = 0; i < this.index; i++) {
            tempRoute.push(this.routeList[i]);
          }
          tempRoute.push(id);
          this.routeList = tempRoute;
        }

        try {
          this.info.articleImage = JSON.parse(this.info.articleImage);
        } catch (e) {
          this.info.articleImage = [];
        }
        try {
          this.info.articleLabel = JSON.parse(this.info.articleLabel);
        } catch (e) {
          this.info.articleLabel = [];
        }
        this.articleIndex = 0;
        if (this.isFont) {
          // 初始化画布
          this.initCanvas();
        }
      }
    },
    handleBack() {
      this.$router.push({
        name: "home",
      });
    },
    handleGoBack() {
      // 回退
      this.$root.handleGoBack();
    },
    handleGoBefore() {
      this.$root.handleGoBefore();
    },
    // 收藏
    handleCollect() {
      let token = ipcUtil.getStore("token");
      if (token) {
        if (this.info.collect) {
          collectCancel({ articleId: this.info.id }).then((res) => {
            if (res.data.code == 200) {
              this.info.collect = false;
              feedback.msgSuccess("取消收藏成功");
            } else {
              feedback.msgWarning("取消收藏失败");
            }
          });
        } else {
          collectAdd({ articleId: this.info.id }).then((res) => {
            if (res.data.code == 200) {
              this.info.collect = true;
              feedback.msgSuccess("收藏成功");
            } else {
              feedback.msgWarning("收藏失败");
            }
          });
        }
      } else {
        this.$refs.login.visible = true;
      }
    },

    handleClickCopyright() {
      this.$refs.protocol.visible = true;
    },
    handleSearchInput() {
      if (this.search != "") this.searchVisible = true;
    },
    handleClickHotSearch(index) {
      this.search = this.hotSearchList[index].search;
      // this.handleSearch();
      this.searchClick();
    },
    handleSearch() {
      list().then((res) => {
        if (res.data.code == 200) {
          this.hotSearchList = res.data.data.extend.history;
        }
      });
    },
    // 下载素材
    async handleDownload() {
      if (this.info.id == 47) {
        feedback.msgSuccess("暂无下载内容", { customClass: "topLeft" });
        return;
      }
      // 走权限函数
      const authority = await this.whetherYouHavePermission(false);
      if (!authority) {
        return;
      }
      const res = await download({ id: this.info.id });
      if (res.data.code != 200) {
        return;
      }
      ipcUtil.selectDir("C:\\Users\\Public\\Downloads", async (res) => {
        if (res.status) {
          /* ipcUtil.uploadFont(
            this.info.resourceUrl,
            this.info.resourceName,
            res.data,
            (rel) => {
              if (rel == 200) {
                feedback.msgSuccess("下载成功");
                this.fullscreenLoading = false;
              }
            }
          ); */
          let basePath = res.data + "\\" + this.info.resourceName;
          const rel = await ipcUtil.uploadChineseFile(
            this.info.resourceUrl,
            basePath
          );
          console.log(rel);
        }
      });
    },
    // 安装插件
    async handleInstall() {
      // 走权限函数
      const authority = await this.whetherYouHavePermission(true);
      if (!authority) {
        return;
      }
      const res = await download({ id: this.info.id });
      console.log("[ res ] >", res);
      if (res.data.code != 200) {
        return;
      }
      // 动态logo
      if (this.info.resourceName == "dontailogo.zip") {
        this.uploadLogo();
        return;
      }
      // 新纯净录屏
      if (this.info.id == 481) {
        this.uploadNewCJ();
        return;
      }
      if (this.info.cid == 29) {
        this.pureScreenRecording();
        return;
      }
      if (this.info.title == "文字幻灯片") {
        this.uploadSlideshow();
        return;
      }
      if (this.info.resourceName == "指定图层录制插件.exe") {
        this.uploadCJ();
        return;
      }
      if (this.info.resourceName == "obs 3D滤镜插件.exe") {
        this.uploadHz();
        return;
      }

      let arr = [
        "kawaii.zip",
        "DaVinci Resolve.zip",
        "Cooliguay.zip",
        "Meloncholy.zip",
        "Neon Light.zip",
      ];
      if (arr.includes(this.info.resourceName)) {
        this.uploadZt();
        return;
      }
      if (this.info.resourceName == "AI_remove_bg.zip") {
        this.uploadAiBg();
        return;
      }
      if (this.info.resourceName == "date-and-time.lua") {
        this.uploadDate();
        return;
      }
      // 如果是特效
      if (this.info.articleCategoryName == "素材") {
        this.specialEffects();
        return;
      }
      if (this.info.resourceName == "实时渲染插件.zip") {
        this.realTimeRendering();
        return;
      }
      // 修改分辨率
      if (this.info.id == 47) {
        this.modifyResolution();
        return;
      }
      /*  if (this.info.id == 41) {
        this.handleRemoteClick();
        return;
      } */
      // // 安装图片分组
      if (this.info.id == 366) {
        this.groupTp();
        return;
      }
      // // 五号队友
      // if (this.info.id == 518) {
      //   this.teammateNo5();
      //   return;
      // }
      if (this.info.cid == 5) {
        this.teammateNo5();
        return;
      }
      if (this.info.resourceUrl) {
        feedback.msgSuccess("开始安装");
        ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
          this.$root.obs.pid = pid;
          ipcUtil.stopObs(pid);
        });
        let loopCount = 0;
        let loop = setInterval(() => {
          ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
            this.$root.obs.pid = pid;
            if (pid.length == 0) {
              clearInterval(loop);
              ipcUtil.installResource(
                this.info.resourceName,
                this.info.resourceUrl,
                this.$root.obs,
                (res) => {
                  this.info.visit += 1;
                  feedback.msgSuccess("安装成功");
                  ipcUtil.startObs(this.$root.obs.path);
                }
              );
            }
            if (loopCount > 10) clearInterval(loop);
            loopCount++;
          });
        }, 500);
      } else {
        feedback.msgWarning("没有素材");
      }
    },
    // 安装obs-text-slideshow
    uploadSlideshow() {
      this.buttonText = "获取路径中";
      // 字体轮播配置
      const slideConfiguration = {
        balance: 0.5,
        deinterlace_field_order: 0,
        deinterlace_mode: 0,
        enabled: true,
        flags: 0,
        hotkeys: {
          "SlideShow.NextSlide": [],
          "SlideShow.PlayPause": [],
          "SlideShow.PreviousSlide": [],
          "SlideShow.Restart": [],
          "SlideShow.Stop": [],
        },
        id: "text-gdiplus-slideshow",
        mixers: 0,
        monitoring_type: 0,
        muted: false,
        name: "文字幻灯片",
        prev_ver: 469762050,
        private_settings: {},
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        settings: {
          color: 4278255615,
          font: {
            face: "仓耳舒圆体 W04",
            flags: 0,
            size: 256,
            style: "Regular",
          },
          gradient: true,
          slide_time: 5000,
          texts: [
            { hidden: false, selected: true, value: "     文字幻灯片" },
            { hidden: false, selected: false, value: "全屏切换画质" },
          ],
          transition: "cut",
        },
        sync: 0,
        versioned_id: "text-gdiplus-slideshow",
        volume: 1.0,
      };
      // 场景
      const scene = {
        align: 5,
        blend_method: "default",
        blend_type: "normal",
        bounds: {
          x: 0.0,
          y: 0.0,
        },
        bounds_align: 0,
        bounds_type: 0,
        crop_bottom: 0,
        crop_left: 0,
        crop_right: 0,
        crop_top: 0,
        group_item_backup: false,
        hide_transition: {
          duration: 0,
        },
        id: 18,
        locked: false,
        name: "文字幻灯片",
        pos: {
          x: 0,
          y: 0,
        },
        private_settings: {},
        rot: 0.0,
        scale: {
          x: 0.5517241358757019,
          y: 0.55078125,
        },
        scale_filter: "disable",
        show_transition: {
          duration: 0,
        },
        visible: true,
      };
      this.buttonText = "准备安装";
      feedback.msgSuccess("开始安装");
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      this.buttonText = "下载插件中";
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            let pathArr = this.$root.obs.path.split("\\");
            let index = pathArr.findIndex(
              (item) => item == "obs-studio" || item == "OBS Studio"
            );
            pathArr.splice(index + 1, 99);
            let path = pathArr.join("\\");
            ipcUtil.uploadSlideshow(
              this.info.resourceUrl,
              path,
              slideConfiguration,
              scene,
              (res) => {
                this.buttonText = "导入OBS中";
                ipcUtil.installFont(
                  null,
                  this.$root.obs,
                  (res) => {
                    feedback.msgSuccess("导入成功");
                    ipcUtil.startObs(this.$root.obs.path);
                    this.fullscreenLoading = false;
                    this.buttonText = null;
                  },
                  slideConfiguration,
                  scene
                );
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },

    // 安装字体
    async installFont() {
      // 走权限函数
      this.buttonText = "获取路径中";
      const authority = await this.whetherYouHavePermission();
      if (!authority) {
        return;
      }
      if (!this.$root.obs.path) {
        return;
      }
      const res = await download({ id: this.info.id });
      if (res.data.code != 200) {
        return;
      }
      let pathArr = this.$root.obs.path.split("\\");
      let index = pathArr.findIndex(
        (item) => item == "obs-studio" || item == "OBS Studio"
      );
      pathArr.splice(index + 1, 99);
      let path = pathArr.join("\\");
      this.buttonText = "下载字体中";
      ipcUtil.getfileByUrl(
        path,
        this.info.resourceUrl,
        this.info.resourceName,
        "C:\\Windows\\Fonts",
        (res) => {
          // 关闭obs
          ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
            this.$root.obs.pid = pid;
            ipcUtil.stopObs(pid);
          });
          let loopCount = 0;
          let count = 0;
          let loop = setInterval(() => {
            ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
              this.$root.obs.pid = pid;
              if (pid.length == 0) {
                if (count > 0) {
                  return;
                }
                count++;
                clearInterval(loop);
                const { slideConfiguration, scene } = this.customization();
                this.buttonText = "修改字体中";
                // 修改字体
                ipcUtil.installFont(
                  this.info.resourceName.split(".")[0],
                  this.$root.obs,
                  (res) => {
                    this.buttonText = "99%";
                    feedback.msgSuccess("导入成功");
                    ipcUtil.startObs(this.$root.obs.path);
                    this.fullscreenLoading = false;
                    this.buttonText = null;
                  },
                  slideConfiguration,
                  scene
                );
              }
              if (loopCount > 10) clearInterval(loop);
              loopCount++;
            });
          }, 500);
        }
      );
    },

    // 初始化画布
    initCanvas() {
      setTimeout(() => {
        const canvas = document.getElementById("myCanvas");
        canvas.width = "1200";
        canvas.height = "600";
        const ctx = canvas.getContext("2d");
        let num = 0;
        ctx.font = `bold 120px ${this.info.title}`;
        ctx.fillStyle = this.canvas.style.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.clearRect(0, 0, 1200, 600);
        ctx.fillText(this.canvas.text, 600, 300);
        this.ctx = ctx;
        /* const callback = () => {
          num++;
          ctx.font = `bold 120px ${this.info.title}`;
          ctx.fillStyle = this.canvas.style.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.clearRect(0, 0, 1200, 600);
          ctx.fillText(this.canvas.text, 600, 300);
          this.ctx = ctx;
          if (num < 1000) {
            requestAnimationFrame(callback);
          }
        // callback();
        }; */
      }, 0);
    },
    clickProgrammeItem(item) {
      this.canvas.defaultScene = item.id;
    },
    // 定制化字体配置
    customization() {
      // 基础字体配置
      let slideConfiguration = {
        prev_ver: 469762050,
        name: "未成年",
        uuid: "de640148-2dd8-4091-bd19-bdf7565250cb",
        id: "text_gdiplus",
        versioned_id: "text_gdiplus_v2",
        settings: {
          text: "未成年禁止刷礼物",
          font: {
            face: this.info.title,
            style: "Regular",
            size: 256,
            flags: 0,
          },
        },
        mixers: 0,
        sync: 0,
        flags: 0,
        volume: 1.0,
        balance: 0.5,
        enabled: true,
        muted: false,
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        hotkeys: {},
        deinterlace_mode: 0,
        deinterlace_field_order: 0,
        monitoring_type: 0,
        private_settings: {},
      };
      // 基础场景
      let scene = {
        name: "未成年",
        source_uuid: "de640148-2dd8-4091-bd19-bdf7565250cb",
        visible: true,
        locked: false,
        rot: 0.0,
        pos: {
          x: 0,
          y: 0,
        },
        scale: {
          x: 0.48827666044235229,
          y: 0.48828125,
        },
        align: 5,
        bounds_type: 0,
        bounds_align: 0,
        bounds: {
          x: 0.0,
          y: 0.0,
        },
        crop_left: 0,
        crop_top: 0,
        crop_right: 0,
        crop_bottom: 0,
        id: 1,
        group_item_backup: false,
        scale_filter: "disable",
        blend_method: "default",
        blend_type: "normal",
        show_transition: {
          duration: 0,
        },
        hide_transition: {
          duration: 0,
        },
        private_settings: {},
      };
      if (this.canvas.defaultScene == 2) {
        // 增加边框
        slideConfiguration.settings.outline = true;
        slideConfiguration.settings.outline_color = 4278212095;
        slideConfiguration.settings.outline_size = 15;
      } else if (this.canvas.defaultScene == 3) {
        slideConfiguration.settings.gradient = true;
        slideConfiguration.settings.color = 4278255615;
        slideConfiguration.settings.gradient_color = 4294967295;
      }
      // 默认更改
      slideConfiguration.name = this.canvas.name;
      slideConfiguration.settings.text = this.canvas.text;
      slideConfiguration.uuid = getUuid();
      scene.name = this.canvas.name;
      scene.source_uuid = getUuid();
      return { slideConfiguration, scene };
    },
    // 搜索
    searchClick() {
      console.log(this.search, "this.search");
      this.$router.push({
        name: "home",
        query: {
          keyword: this.search,
        },
      });
    },
    // 安装特效
    async specialEffects() {
      if (!this.$root.obs.path) {
        return;
      }
      this.buttonText = "下载素材中";
      this.setting = ipcUtil.getStore("setting") || {};
      let basePath = await ipcUtil.getSystemDisk();
      if (this.setting.isLoginStart === undefined) {
        this.setting.isLoginStart = false;
      }
      if (this.setting.videoPath === null) {
        this.setting.videoPath = basePath + "yuantiaoshi-hc\\video";
        if (!(await ipcUtil.isAccess(this.setting.videoPath))) {
          await ipcUtil.mkdir(this.setting.videoPath);
        }
      }
      if (this.$root.websocket.connect) {
        ipcUtil.specialEffects(
          this.info.resourceUrl,
          this.info.resourceName,
          this.setting.videoPath,
          async (res) => {
            this.$bus.$emit("success", res);
            const { currentProgramSceneName } = await this.getScene();
            const rel = await this.addPicture(
              this.info.title,
              currentProgramSceneName,
              res.destPath,
              "ffmpeg_source"
            );
            this.buttonText = null;
          },
          (data) => {
            // 进度条逻辑
            this.$bus.$emit("progress", data);
          }
        );
        return;
      }
      this.buttonText = "关闭OBS";
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        ipcUtil.log("获取到OBS进程号", pid);
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            this.buttonText = "下载素材中";

            ipcUtil.specialEffects(
              this.info.resourceUrl,
              this.info.resourceName,
              this.setting.videoPath,
              (res) => {
                this.$bus.$emit("success", res);
                const { slideConfiguration, scene } =
                  this.specialEffectConfiguration(
                    this.info.title,
                    res.destPath
                  );
                this.buttonText = "导入OBS中";
                ipcUtil.installFont(
                  this.info.title,
                  this.$root.obs,
                  () => {
                    this.buttonText = "98%";
                    feedback.msgSuccess("导入成功");
                    ipcUtil.startObs(this.$root.obs.path);
                    this.buttonText = null;
                  },
                  slideConfiguration,
                  scene
                );
              },
              (data) => {
                // 进度条逻辑
                this.$bus.$emit("progress", data);
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 定制特效配置
    specialEffectConfiguration(name, pathName) {
      let slideConfiguration = {
        balance: 0.5,
        deinterlace_field_order: 0,
        deinterlace_mode: 0,
        enabled: true,
        flags: 0,
        hotkeys: {
          "MediaSource.Pause": [],
          "MediaSource.Play": [],
          "MediaSource.Restart": [],
          "MediaSource.Stop": [],
          "libobs.mute": [],
          "libobs.push-to-mute": [],
          "libobs.push-to-talk": [],
          "libobs.unmute": [],
        },
        id: "ffmpeg_source",
        mixers: 255,
        monitoring_type: 1,
        muted: false,
        name: name,
        prev_ver: 469762050,
        private_settings: {},
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        settings: {
          local_file: pathName,
        },
        sync: 0,
        versioned_id: "ffmpeg_source",
        volume: 1.0,
      };
      let scene = {
        align: 5,
        blend_method: "default",
        blend_type: "normal",
        bounds: {
          x: 0.0,
          y: 0.0,
        },
        bounds_align: 0,
        bounds_type: 0,
        crop_bottom: 0,
        crop_left: 0,
        crop_right: 0,
        crop_top: 0,
        group_item_backup: false,
        hide_transition: {
          duration: 0,
        },
        id: 17246,
        locked: false,
        name: name,
        pos: {
          x: 0.0,
          y: 0.0,
        },
        private_settings: {},
        rot: 0.0,
        scale: {
          x: 1.0,
          y: 1.0,
        },
        scale_filter: "disable",
        show_transition: {
          duration: 0,
        },
        visible: true,
      };
      return { slideConfiguration, scene };
    },
    // 检测是否可以使用
    async whetherYouHavePermission(type) {
      //查看是否是会员 true是会员 false不是
      const res =this.userInfo.isMember == 1 ? true : false;
      if (this.info.fees == 1 && !res) {
        // 如果需要会员,但是用户不是会员
        this.$bus.$emit("isShowVip");
        feedback.msgWarning("需要充值会员,才可以使用", {
          customClass: "topRi",
        });
        return false;
      }
      // if (this.info.fees == 3 && !res) {
      //   // 如果需要会员+收费,但是用户不是会员
      //   this.$bus.$emit("isShowVip");
      //   feedback.msgWarning("需要充值会员,才可以使用", {
      //     customClass: "topRi",
      //   });
      //   return false;
      // }
      // 是否需要收费
      if (this.info.fees == 3 || this.info.fees == 2) {
        // 请求是否为会员
        const rel = await detail({ id: this.$route.params.id });
        this.info.isPaid = rel.data.data.isPaid;
        // 需要收费，但是没买过
        if (rel.data.data.isPaid != 1) {
          // 如果余额不足
          if (this.userInfo.money < this.info.price) {
            this.$refs.prompt.visible = true;
            this.$refs.prompt.num = this.info.price - this.userInfo.money;
            return false;
          }
          this.isDownload = type;
          this.$refs.virtualCurrency.visible = true;
          return false;
        }
      }
      return true;
    },
    // 安装纯净录屏
    async uploadCJ() {
      this.buttonText = "准备路径中";
      feedback.msgSuccess("正在导入纯净录屏");
      let basePath = await ipcUtil.getSystemDisk();
      ipcUtil.mkdir(basePath + "obs纯净录屏");
      let slideConfiguration = {
        balance: 0.5,
        deinterlace_field_order: 0,
        deinterlace_mode: 0,
        enabled: true,
        filters: [
          {
            balance: 0.5,
            deinterlace_field_order: 0,
            deinterlace_mode: 0,
            enabled: true,
            flags: 0,
            hotkeys: {},
            id: "source_record_filter",
            mixers: 0,
            monitoring_type: 0,
            muted: false,
            name: "Source Record",
            prev_ver: 469762050,
            private_settings: {},
            "push-to-mute": false,
            "push-to-mute-delay": 0,
            "push-to-talk": false,
            "push-to-talk-delay": 0,
            settings: {
              audio_track: 2,
              bitrate: 25000,
              different_audio: true,
              encoder: "x264",
              path: basePath + "obs纯净录屏",
              preset: "veryfast",
              profile: "high",
              rate_control: "CBR",
              record_mode: 5,
            },
            sync: 0,
            versioned_id: "source_record_filter",
            volume: 1.0,
          },
        ],
        flags: 0,
        hotkeys: {
          "source_record.disable": [],
          "source_record.enable": [],
        },
        id: "group",
        mixers: 0,
        monitoring_type: 0,
        muted: false,
        name: "纯净录屏",
        prev_ver: 469762050,
        private_settings: {},
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        settings: {
          custom_size: true,
          cx: 0,
          cy: 0,
          id_counter: 0,
          items: [],
        },
        sync: 0,
        versioned_id: "group",
        volume: 1.0,
      };
      let scene = {
        align: 5,
        blend_method: "default",
        blend_type: "normal",
        bounds: {
          x: 0,
          y: 0,
        },
        bounds_align: 0,
        bounds_type: 0,
        crop_bottom: 0,
        crop_left: 0,
        crop_right: 0,
        crop_top: 0,
        group_item_backup: false,
        hide_transition: {
          duration: 0,
        },
        id: 999,
        locked: false,
        name: "纯净录屏",
        pos: {
          x: 0,
          y: 0,
        },
        private_settings: {},
        rot: 0,
        scale: {
          x: 1,
          y: 1,
        },
        scale_filter: "disable",
        show_transition: {
          duration: 0,
        },
        visible: true,
      };
      this.buttonText = "关闭OBS中";
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            this.buttonText = "导入纯净录屏";
            // 导入纯净录屏
            ipcUtil.installGroup(
              this.$root.obs,
              slideConfiguration,
              scene,
              (res) => {
                this.buttonText = "导入完成";
                if (res.status == "success") {
                  feedback.msgSuccess("导入纯净录屏成功");
                  ipcUtil.startObs(this.$root.obs.path);
                } else {
                  feedback.msgSuccess("已有纯净录屏");
                  ipcUtil.startObs(this.$root.obs.path);
                }
                this.fullscreenLoading = false;
                this.buttonText = null;
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 新版纯净录屏
    async uploadNewCJ() {
      let uploadPath = `https://resource.yuantiaoshi.com/pluginResources/source-record-dock28.dll`;
      let uploadZipPath = `https://resource.yuantiaoshi.com/pluginResources/source-record-dock28.zip`;
      let basePath = await ipcUtil.getSystemDisk();
      ipcUtil.mkdir(basePath + "obs纯净录屏");
      const sceneItem = {
        name: "新版纯净录屏",
        source_uuid: "d6b9c6bc-3c4f-4dec-aedf-ea406b088b81",
        visible: true,
        locked: false,
        rot: 0.0,
        pos: {
          x: 0.0,
          y: 0.0,
        },
        scale: {
          x: 1.0,
          y: 1.0,
        },
        align: 5,
        bounds_type: 0,
        bounds_align: 0,
        bounds: {
          x: 0.0,
          y: 0.0,
        },
        crop_left: 0,
        crop_top: 0,
        crop_right: 0,
        crop_bottom: 0,
        id: 9,
        group_item_backup: false,
        scale_filter: "disable",
        blend_method: "default",
        blend_type: "normal",
        show_transition: {
          duration: 0,
        },
        hide_transition: {
          duration: 0,
        },
        private_settings: {
          collapsed: false,
        },
      };
      const groups = {
        prev_ver: 486604803,
        name: "新版纯净录屏",
        uuid: "d6b9c6bc-3c4f-4dec-aedf-ea406b088b81",
        id: "group",
        versioned_id: "group",
        settings: {
          id_counter: 0,
          custom_size: true,
          cx: 0,
          cy: 0,
          items: [],
        },
        mixers: 0,
        sync: 0,
        flags: 0,
        volume: 1.0,
        balance: 0.5,
        enabled: true,
        muted: false,
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        hotkeys: {
          "source_record.enable": [],
          "source_record.disable": [],
        },
        deinterlace_mode: 0,
        deinterlace_field_order: 0,
        monitoring_type: 0,
        private_settings: {},
        filters: [
          {
            prev_ver: 486604803,
            name: "源录制",
            uuid: "937afd4f-e5ee-49f3-88b2-f7d97e0bfcd8",
            id: "source_record_filter_dock",
            versioned_id: "source_record_filter_dock",
            settings: {
              dock_name: "源录制",
              path: basePath + "obs纯净录屏",
              filename_formatting: "%CCYY-%MM-%DD %hh-%mm-%ss-1",
              track_2: true,
              preset: "ultrafast",
              encoder: "nvenc",
              track_1: false,
              bitrate: 25000,
              rate_control: "CBR",
              preset2: "p7",
              multipass: "fullres",
              tune: "hq",
            },
            mixers: 0,
            sync: 0,
            flags: 0,
            volume: 1.0,
            balance: 0.5,
            enabled: true,
            muted: false,
            "push-to-mute": false,
            "push-to-mute-delay": 0,
            "push-to-talk": false,
            "push-to-talk-delay": 0,
            hotkeys: {},
            deinterlace_mode: 0,
            deinterlace_field_order: 0,
            monitoring_type: 0,
            private_settings: {},
          },
        ],
      };
      this.publicCallback(async (basePath) => {
        await window.ipc.invoke("uploadZip", {
          uploadZipPath,
          targetPath: basePath + "\\data\\obs-plugins",
          name: "source-record-dock28.zip",
        });
        await window.ipc.invoke("uploadChineseFile", {
          basePath: basePath + `\\obs-plugins\\64bit\\source-record-dock28.dll`,
          uploadPath,
        });
        await window.ipc.invoke("uploadChineseFile", {
          basePath: basePath + "\\源录制卸载(请先关闭OBS,双击卸载).bat",
          uploadPath:
            "https://resource.yuantiaoshi.com/pluginResources/%E6%BA%90%E5%BD%95%E5%88%B6%E5%8D%B8%E8%BD%BD%28%E5%8F%8C%E5%87%BB%E5%8D%B8%E8%BD%BD%29.bat",
        });
        await window.ipc.invoke("newCjlp", {
          groups,
          sceneItem,
          config: this.$root.obs.config,
        });
        ipcUtil.startObs(this.$root.obs.path);
      });

      //获取当前场景
      // this.publicCallback(async (basePath) => {

      // });
    },
    // 卸载新版纯净录屏
    async uninstall() {
      this.publicCallback(async (basePath) => {
        basePath = basePath + `\\obs-plugins\\64bit`;
        let res = await window.ipc.invoke("uninstallCj", {
          basePath,
        });
        console.log("[ res ] >", res);
        ipcUtil.startObs(this.$root.obs.path);
      });
    },
    // 安装猴子素材
    async uploadHz() {
      // 下载猴子视频
      this.buttonText = "获取路径中";
      feedback.msgSuccess("正在下载猴子玩电脑视频,视频较大请稍后");
      this.setting = ipcUtil.getStore("setting") || {};
      let basePath = await ipcUtil.getSystemDisk();
      if (this.setting.isLoginStart === undefined) {
        this.setting.isLoginStart = false;
      }
      if (this.setting.videoPath === undefined) {
        this.setting.videoPath = basePath + "yuantiaoshi-hc\\video";
        if (!(await ipcUtil.isAccess(this.setting.videoPath))) {
          await ipcUtil.mkdir(this.setting.videoPath);
        }
      }
      this.buttonText = "关闭OBS中";
      let groups = {
        balance: 0.5,
        deinterlace_field_order: 0,
        deinterlace_mode: 0,
        enabled: true,
        flags: 0,
        hotkeys: {
          "libobs.hide_scene_item.猴子": [],
          "libobs.hide_scene_item.猴子素材": [],
          "libobs.show_scene_item.猴子": [],
          "libobs.show_scene_item.猴子素材": [],
        },
        id: "group",
        mixers: 0,
        monitoring_type: 0,
        muted: false,
        name: "猴子（手动拉全屏）",
        prev_ver: 469762050,
        private_settings: {},
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        settings: {
          custom_size: true,
          cx: 1920,
          cy: 1407,
          id_counter: 0,
          items: [
            {
              align: 5,
              blend_method: "default",
              blend_type: "normal",
              bounds: {
                x: 0.0,
                y: 0.0,
              },
              bounds_align: 0,
              bounds_type: 0,
              crop_bottom: 0,
              crop_left: 0,
              crop_right: 0,
              crop_top: 0,
              group_item_backup: false,
              hide_transition: {
                duration: 0,
              },
              id: 10,
              locked: true,
              name: "猴子",
              pos: {
                x: 519.0,
                y: 0.0,
              },
              private_settings: {},
              rot: 0.0,
              scale: {
                x: 0.62083333730697632,
                y: 0.62056738138198853,
              },
              scale_filter: "disable",
              show_transition: {
                duration: 0,
              },
              visible: true,
            },
            {
              align: 5,
              blend_method: "default",
              blend_type: "normal",
              bounds: {
                x: 0.0,
                y: 0.0,
              },
              bounds_align: 0,
              bounds_type: 0,
              crop_bottom: 0,
              crop_left: 0,
              crop_right: 0,
              crop_top: 0,
              group_item_backup: false,
              hide_transition: {
                duration: 0,
              },
              id: 9,
              locked: true,
              name: "猴子素材",
              pos: {
                x: 0.0,
                y: 65.0,
              },
              private_settings: {},
              rot: 0.0,
              scale: {
                x: 1.0,
                y: 1.0,
              },
              scale_filter: "disable",
              show_transition: {
                duration: 0,
              },
              visible: true,
            },
          ],
        },
        sync: 0,
        versioned_id: "group",
        volume: 1.0,
      };
      let sources = [
        {
          balance: 0.5,
          deinterlace_field_order: 0,
          deinterlace_mode: 0,
          enabled: true,
          flags: 0,
          hotkeys: {
            "OBSBasic.SelectScene": [],
            "libobs.hide_scene_item.猴子（手动拉全屏）": [],
            "libobs.show_scene_item.猴子（手动拉全屏）": [],
          },
          id: "scene",
          mixers: 0,
          monitoring_type: 0,
          muted: false,
          name: "猴子玩游戏场景",
          prev_ver: 469762050,
          private_settings: {},
          "push-to-mute": false,
          "push-to-mute-delay": 0,
          "push-to-talk": false,
          "push-to-talk-delay": 0,
          settings: {
            custom_size: false,
            id_counter: 13,
            items: [
              {
                align: 5,
                blend_method: "default",
                blend_type: "normal",
                bounds: {
                  x: 0.0,
                  y: 0.0,
                },
                bounds_align: 0,
                bounds_type: 0,
                crop_bottom: 0,
                crop_left: 0,
                crop_right: 0,
                crop_top: 0,
                group_item_backup: true,
                hide_transition: {
                  duration: 0,
                },
                id: 10,
                locked: true,
                name: "猴子",
                pos: {
                  x: 515.0,
                  y: 0.0,
                },
                private_settings: {},
                rot: 0.0,
                scale: {
                  x: 0.61770832538604736,
                  y: 0.61799997091293335,
                },
                scale_filter: "disable",
                show_transition: {
                  duration: 0,
                },
                visible: true,
              },
              {
                align: 5,
                blend_method: "default",
                blend_type: "normal",
                bounds: {
                  x: 0.0,
                  y: 0.0,
                },
                bounds_align: 0,
                bounds_type: 0,
                crop_bottom: 0,
                crop_left: 0,
                crop_right: 0,
                crop_top: 0,
                group_item_backup: true,
                hide_transition: {
                  duration: 0,
                },
                id: 9,
                locked: true,
                name: "猴子素材",
                pos: {
                  x: 0.0,
                  y: 73.0,
                },
                private_settings: {},
                rot: 0.0,
                scale: {
                  x: 1.0,
                  y: 1.0,
                },
                scale_filter: "disable",
                show_transition: {
                  duration: 0,
                },
                visible: true,
              },
              {
                align: 5,
                blend_method: "default",
                blend_type: "normal",
                bounds: {
                  x: 0.0,
                  y: 0.0,
                },
                bounds_align: 0,
                bounds_type: 0,
                crop_bottom: 0,
                crop_left: 0,
                crop_right: 0,
                crop_top: 93,
                group_item_backup: false,
                hide_transition: {
                  duration: 0,
                },
                id: 8,
                locked: false,
                name: "猴子（手动拉全屏）",
                pos: {
                  x: 0.0,
                  y: 0.0,
                },
                private_settings: {
                  collapsed: false,
                },
                rot: 0.0,
                scale: {
                  x: 1.0,
                  y: 1.0,
                },
                scale_filter: "disable",
                show_transition: {
                  duration: 0,
                },
                visible: true,
              },
            ],
          },
          sync: 0,
          versioned_id: "scene",
          volume: 1.0,
        },
        {
          balance: 0.5,
          deinterlace_field_order: 0,
          deinterlace_mode: 0,
          enabled: true,
          filters: [
            {
              balance: 0.5,
              deinterlace_field_order: 0,
              deinterlace_mode: 0,
              enabled: false,
              flags: 0,
              hotkeys: {},
              id: "scale_filter",
              mixers: 0,
              monitoring_type: 0,
              muted: false,
              name: "缩放比例",
              prev_ver: 469762050,
              private_settings: {},
              "push-to-mute": false,
              "push-to-mute-delay": 0,
              "push-to-talk": false,
              "push-to-talk-delay": 0,
              settings: {
                resolution: "1920x1440",
                sampling: "bilinear",
              },
              sync: 0,
              versioned_id: "scale_filter",
              volume: 1.0,
            },
            {
              balance: 0.5,
              deinterlace_field_order: 0,
              deinterlace_mode: 0,
              enabled: true,
              flags: 0,
              hotkeys: {},
              id: "3d_effect_filter",
              mixers: 0,
              monitoring_type: 0,
              muted: false,
              name: "3D Effect",
              prev_ver: 469762050,
              private_settings: {},
              "push-to-mute": false,
              "push-to-mute-delay": 0,
              "push-to-talk": false,
              "push-to-talk-delay": 0,
              settings: {
                fov: 120,
                pos_x: -12,
                rot_x: -3.3500000000000001,
                rot_y: -8.9399999999999995,
                rot_z: -8.9399999999999995,
                scale_x: 80,
              },
              sync: 0,
              versioned_id: "3d_effect_filter",
              volume: 1.0,
            },
          ],
          flags: 0,
          hotkeys: {
            "OBSBasic.SelectScene": [],
          },
          id: "scene",
          mixers: 0,
          monitoring_type: 0,
          muted: false,
          name: "猴子",
          prev_ver: 469762050,
          private_settings: {},
          "push-to-mute": false,
          "push-to-mute-delay": 0,
          "push-to-talk": false,
          "push-to-talk-delay": 0,
          settings: {
            custom_size: false,
            id_counter: 8,
            items: [],
          },
          sync: 0,
          versioned_id: "scene",
          volume: 1.0,
        },
        {
          balance: 0.5,
          deinterlace_field_order: 0,
          deinterlace_mode: 0,
          enabled: true,
          filters: [
            {
              balance: 0.5,
              deinterlace_field_order: 0,
              deinterlace_mode: 0,
              enabled: true,
              flags: 0,
              hotkeys: {},
              id: "chroma_key_filter",
              mixers: 0,
              monitoring_type: 0,
              muted: false,
              name: "色度键",
              prev_ver: 469762050,
              private_settings: {},
              "push-to-mute": false,
              "push-to-mute-delay": 0,
              "push-to-talk": false,
              "push-to-talk-delay": 0,
              settings: {
                key_color: 4294917889,
                key_color_type: "custom",
                similarity: 180,
              },
              sync: 0,
              versioned_id: "chroma_key_filter_v2",
              volume: 1.0,
            },
          ],
          flags: 0,
          hotkeys: {
            "MediaSource.Pause": [],
            "MediaSource.Play": [],
            "MediaSource.Restart": [],
            "MediaSource.Stop": [],
            "libobs.mute": [],
            "libobs.push-to-mute": [],
            "libobs.push-to-talk": [],
            "libobs.unmute": [],
          },
          id: "ffmpeg_source",
          mixers: 255,
          monitoring_type: 0,
          muted: false,
          name: "猴子素材",
          prev_ver: 469762050,
          private_settings: {},
          "push-to-mute": false,
          "push-to-mute-delay": 0,
          "push-to-talk": false,
          "push-to-talk-delay": 0,
          settings: {
            local_file: this.setting.videoPath + "/猴子玩电脑.mp4",
            looping: true,
          },
          sync: 0,
          versioned_id: "ffmpeg_source",
          volume: 1.0,
        },
      ];

      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            let videoList = await ipcUtil.readDir(this.setting.videoPath);
            let some = videoList.some(
              (item) => item.name == this.info.title + ".mp4"
            );
            if (some) {
              this.buttonText = "已有素材";
              feedback.msgSuccess("猴子玩电脑视频下载完成,正在导入配置");
              ipcUtil.uploadHz(groups, sources, this.$root.obs, (res) => {
                ipcUtil.startObs(this.$root.obs.path);
                this.buttonText = null;
              });
            } else {
              this.buttonText = "下载素材中";
              ipcUtil.specialEffects(
                this.info.video,
                this.info.title + ".mp4",
                this.setting.videoPath,
                (res) => {
                  feedback.msgSuccess("猴子玩电脑视频下载完成,正在导入配置");
                  ipcUtil.uploadHz(groups, sources, this.$root.obs, (res) => {
                    ipcUtil.startObs(this.$root.obs.path);
                    this.fullscreenLoading = false;
                    this.buttonText = null;
                  });
                }
              );
            }
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 修改分辨率
    modifyResolution() {
      this.buttonText = "关闭OBS";
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            this.buttonText = "导入参数";
            let list = [
              "1280x720",
              "960x720",
              "920x720",
              "",
              "1440x1080",
              "1380x1080",
            ];
            ipcUtil.modifyResolution(
              this.$root.obs,
              list[this.configurationOption],
              () => {
                this.buttonText = "导入完毕";
                ipcUtil.startObs(this.$root.obs.path);
                this.fullscreenLoading = false;
                this.buttonText = null;
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 安装主题
    async uploadZt() {
      this.buttonText = "获取路径中";
      feedback.msgSuccess("正在下载Obs主题,请稍后");
      let pathArr = this.$root.obs.path.split("\\");
      let index = pathArr.findIndex(
        (item) => item == "obs-studio" || item == "OBS Studio"
      );
      pathArr.splice(index + 1, 99);
      let path = pathArr.join("\\") + "\\data\\obs-studio\\themes";
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      this.buttonText = "下载主题中";
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            this.buttonText = "替换主题中";
            ipcUtil.setThemes(
              path,
              this.info.resourceUrl,
              this.info.resourceName,
              this.$root.obs.config,
              (res) => {
                this.buttonText = "95%";
                ipcUtil.startObs(this.$root.obs.path);
                this.fullscreenLoading = false;
                this.buttonText = null;
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 按照ai背景
    async uploadAiBg() {
      let pathArr = this.$root.obs.path.split("\\");
      let index = pathArr.findIndex((item) => item == "obs-studio");
      pathArr.splice(index + 1, 99);
      let path = pathArr.join("\\");
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loopCount = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            clearInterval(loop);
            ipcUtil.uploadAiBg(
              path,
              this.info.resourceUrl,
              this.info.resourceName,
              (res) => {
                ipcUtil.startObs(this.$root.obs.path);
              }
            );
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 时间脚本
    async uploadDate() {
      this.buttonText = "下载脚本中";
      this.publicCallback((path) => {
        ipcUtil.uploadDate(
          path,
          this.info.resourceUrl,
          this.info.resourceName,
          this.$root.obs.config,
          (res) => {
            this.buttonText = "导入中";
            feedback.msgSuccess("导入时间插件成功");
            ipcUtil.startObs(this.$root.obs.path);
            /* if (res.status == "success") {
            } else {
              feedback.msgSuccess("已有时间插件");
              ipcUtil.startObs(this.$root.obs.path);
            } */
            this.buttonText = null;
          }
        );
      });
    },
    // 动态logo
    uploadLogo() {
      this.publicCallback((path) => {
        ipcUtil.uploadLogo(
          path,
          this.info.resourceUrl,
          this.info.resourceName,
          this.$root.obs.config,
          (res) => {
            if (res.status == "success") {
              feedback.msgSuccess("导入动态logo成功");
              this.logoPath =
                path + "\\dontailogo\\lower thirds\\control-panel.html";
              ipcUtil.startObs(this.$root.obs.path);
            } else {
              feedback.msgSuccess("已有动态logo");
              this.logoPath =
                path + "\\dontailogo\\lower thirds\\control-panel.html";
              ipcUtil.startObs(this.$root.obs.path);
            }
          }
        );
      });
    },
    // 实时渲染
    realTimeRendering() {
      this.publicCallback((path) => {
        console.log(path, "path");
        ipcUtil.realTimeRendering(
          path,
          this.info.resourceUrl,
          this.info.resourceName,
          this.$root.obs.config,
          this.type,
          (res) => {
            if (res.status == "success") {
              feedback.msgSuccess("导入实时滤镜插件成功");
              ipcUtil.startObs(this.$root.obs.path);
            } else {
              feedback.msgSuccess("已有实时滤镜插件");
              ipcUtil.startObs(this.$root.obs.path);
            }
          }
        );
      });
    },
    // 安装配置
    handleRemoteClick() {
      this.buttonText = "下载压缩包中";
      const name = this.info.resourceName?.split(".")[0];
      ipcUtil.downloadFile(
        this.info.resourceUrl,
        (file) => {
          // 下载进度条
          this.$bus.$emit("progress", file);
        },
        (res1) => {
          console.log(res1, "res1");
          this.$bus.$emit("success", res1);
          if (res1) {
            ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
              this.$root.obs.pid = pid;
              ipcUtil.stopObs(pid);
            });
            // 等待关闭OBS
            let loopCount = 0;
            let loop1 = setInterval(() => {
              this.buttonText = "关闭obs中";
              ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
                this.$root.obs.pid = pid;
                if (pid.length == 0) {
                  if (loopCount > 0) {
                    return;
                  }
                  loopCount++;
                  clearInterval(loop1);
                  // 开始调试
                  this.buttonText = "开始导入obs";
                  ipcUtil.debug(
                    res1.path,
                    this.$root.obs.config,
                    name,
                    this.$root.obs.path,
                    "gbk",
                    async (res2) => {
                      if (res2 && res2.status == "success") {
                        // 查看服务器字体列表
                        this.buttonText = "安装字体中";
                        const res = await list({
                          cid: 9,
                          pageNo: 1,
                          pageSize: 999,
                        });

                        if (res.data.code == 200) {
                          // 对比安装字体
                          feedback.msgSuccess("准备安装字体,请稍等");
                          ipcUtil.installFonts(
                            res.data.data.lists,
                            this.$root.obs,
                            name,
                            (res) => {
                              ipcUtil.startObs(this.$root.obs.path);
                              this.$root.websocket.connect = false;
                              this.$root.obs.pid = [];
                              ipcUtil
                                .getObsStatus(this.$root.obs.path)
                                .then((pid) => {
                                  this.$root.obs.pid = pid;
                                });
                              let loop = setInterval(() => {
                                this.count = this.count + 1;
                                if (this.$root.websocket.connect == true) {
                                  this.$root.obsHandle
                                    .call("GetProfileList")
                                    .then((message) => {
                                      console.log(message);
                                      if (
                                        message.currentProfileName != name &&
                                        message.profiles.indexOf(name) != -1
                                      ) {
                                        this.$root.obsHandle.call(
                                          "SetCurrentProfile",
                                          {
                                            profileName: name,
                                          }
                                        );
                                      }
                                    });
                                  this.$root.obsHandle
                                    .call("GetSceneCollectionList")
                                    .then((message) => {
                                      if (
                                        message.currentSceneCollectionName !=
                                          name &&
                                        message.sceneCollections.indexOf(
                                          name
                                        ) != -1
                                      ) {
                                        this.$root.obsHandle.call(
                                          "SetCurrentSceneCollection",
                                          { sceneCollectionName: name }
                                        );
                                      }
                                    });
                                  this.buttonText = null;
                                  clearInterval(loop);
                                }
                                if (this.count > 50) {
                                  clearInterval(loop);
                                }
                              }, 500);
                            }
                          );
                        }
                      } else {
                      }
                    }
                  );
                }
                if (loopCount > 10) clearInterval(loop1);
                loopCount++;
              });
            }, 500);
          } else {
          }
        }
      );
    },
    // 公共
    publicCallback(callback) {
      this.buttonText = "获取路径中";
      let pathArr = this.$root.obs.path.split("\\");
      let index = pathArr.findIndex(
        (item) => item == "obs-studio" || item == "OBS Studio"
      );
      pathArr.splice(index + 1, 99);
      let path = pathArr.join("\\");
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      this.buttonText = "关闭OBS";
      let loopCount = 0;
      let count = 0;
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            this.buttonText = "下载文件中";
            //  回调
            callback(path);
            this.fullscreenLoading = false;
            this.buttonText = null;
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 视频鼠标事件
    processingFunctions() {
      // 移入事件
      const dom = document.querySelector(".video");
      if (dom) {
        document
          .querySelector(".video")
          .addEventListener("mousemove", this.mouseover);
      }
    },
    mouseover(e) {
      try {
        const dom = document.querySelector(".vjs-control-bar");
        const videoDom = document.querySelector(".video");
        dom.style.opacity = "1";
        videoDom.style.cursor = "pointer";
        clearTimeout(this.mouseEvent.time);
        this.mouseEvent.time = setTimeout(() => {
          dom.style.opacity = "0";
          videoDom.style.cursor = "none";
        }, 1000);
      } catch (error) {}
    },
    // 发送评论
    async handleSendMessage() {
      let type = this.tenantMessageInfo.smsSign ? "1" : "0";
      await this.$refs.comment.submit(type, this.message, this.imgInfo.src);
      this.isShowInput = false;
      this.message = "";
      this.imgInfo = {};
    },
    // 回复
    reply(e) {
      this.message = "";
      this.isShowInput = true;
      this.tenantMessageInfo = e;
    },
    // 截图
    screenshot() {},
    // 上传成功
    handleUploadSuccess(response, file, fileList) {
      console.log(response, file, fileList, "response, file, fileList");
      console.log(file.raw.path, "file.raw.path");
      this.imgInfo = {
        src: response.msg,
        path: file.raw.path,
        name: file.name,
      };
    },
    changeArticleIndex(e) {
      console.log("[ e ] >", e);
      this.articleIndex = e;
    },
    // 评论
    comment() {
      this.tenantMessageInfo = {};
      this.isShowInput = true;
      this.message = "";
    },
    async groupTp() {
      this.setting = ipcUtil.getStore("setting") || {};
      let loopCount = 0;
      let count = 0;
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          ipcUtil.log("pid", pid);
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            const res = await window.ipc.invoke("groupTp", {
              config: this.$root.obs.config,
              imagePath: this.setting.imagePath,
              resourceUrl: this.info.resourceUrl,
              resourceName: this.info.resourceName,
            });
            if (res.code == 200) {
              ipcUtil.startObs(this.$root.obs.path);
            }
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    async teammateNo5() {
      this.setting = ipcUtil.getStore("setting") || {};

      let loopCount = 0;
      let count = 0;
      ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
        this.$root.obs.pid = pid;
        ipcUtil.stopObs(pid);
      });
      let loop = setInterval(() => {
        ipcUtil.getObsStatus(this.$root.obs.path).then(async (pid) => {
          ipcUtil.log("pid", pid);
          this.$root.obs.pid = pid;
          if (pid.length == 0) {
            if (count > 0) {
              return;
            }
            count++;
            clearInterval(loop);
            const res = await window.ipc.invoke("teammateNo5", {
              config: this.$root.obs.config,
              resourcesPath: this.setting.resourcesPath,
              resourceUrl: this.info.resourceUrl,
              resourceName: this.info.resourceName,
            });
            if (res.code == 200) {
              ipcUtil.startObs(this.$root.obs.path);
            }
          }
          if (loopCount > 10) clearInterval(loop);
          loopCount++;
        });
      }, 500);
    },
    // 添加场景
    async createScene(sceneName) {
      try {
        await this.$root.obsHandle.call("CreateScene", { sceneName });
        console.log(`Scene "${sceneName}" created.`);
      } catch (error) {
        console.error("Error creating scene:", error);
      }
    },
    // 获取当前场景
    async getScene() {
      return await this.$root.obsHandle.call("GetCurrentProgramScene");
    },
    // 添加源   视频 ffmpeg_source 图片 image_source 采集 monitor_capture 网页 "browser_source" 窗口采集 window_capture
    async addPicture(sourceName, sceneName, imageUrl, type, inputSettings) {
      console.log("[ imageUrl ] >", imageUrl);
      await this.$root.obsHandle.call("CreateInput", {
        inputName: sourceName,
        inputKind: type,
        sceneName: sceneName,
        inputSettings: {
          local_file: imageUrl,
          looping: false,
        },
      });
      return await this.$root.obsHandle.call("SetInputAudioMonitorType", {
        inputName: sourceName,
        monitorType: "OBS_MONITORING_TYPE_MONITOR_ONLY",
      });
    },
    // 购买兑换码
    buyRedemptionCode() {
      if (this.userInfo.money < this.info.price) {
        this.$refs.prompt.visible = true;
        this.$refs.prompt.num = this.info.price - this.userInfo.money;
      } else {
        this.$confirm(
          `是否花${this.info.price}金币购买${this.info.title}兑换码`,
          "提示",
          {
            confirmButtonText: "购买",
            cancelButtonText: "取消",
            type: "success",
          }
        )
          .then(() => {
            this.$message({
              type: "success",
              message: "购买成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消购买",
            });
          });
      }
    },
    // 兑换码列表
    redemptionCodeList() {},
    // 纯净录屏
    pureScreenRecording() {
      this.publicCallback(async (path) => {
        let obj = {
          487: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/BulgePinch.shader",
            radius: 0.28000000000000003,
            magnitude: 0.69999999999999996,
            center_x: 0.23000000000000001,
            center_y: 0.28000000000000003,
          },
          488: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/BulgePinch.shader",
            radius: 0.28000000000000003,
            magnitude: -0.69999999999999996,
            center_x: 0.23000000000000001,
            center_y: 0.28000000000000003,
          },
          489: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/BulgePinch.shader",
            radius: 0.40000000000000002,
            magnitude: -0.75,
            center_x: 0.22,
            center_y: 0.35999999999999999,
          },
          486: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/color-depth.shader",
            colorDepth: 20,
            pixelSize: 20,
          },
          490: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path + "/data/obs-plugins/obs-shaderfilter/examples/Swirl.shader",
            radius: 0.17000000000000001,
            angle: 192,
            center_x: 0.22,
            center_y: 0.37,
          },
          491: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/cell_shaded.shader",
          },
          492: {
            from_file: true,
            override_entire_effect: true,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/cartoon.effect",
            hue_steps: 4,
          },
          493: {
            from_file: true,
            override_entire_effect: true,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/repeat.effect",
            copies: 25,
          },
          494: {
            alpha_cut_off: 0.55000000000000004,
            border_color: 4286578687,
            border_thickness: 50,
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path + "/data/obs-plugins/obs-shaderfilter/examples/ascii.shader",
            scale: 5,
          },
          495: {
            AngleNum: 25,
            Animation_Speed: 0.10000000000000001,
            Dead_Pixel_X: 0,
            Movement_Direction_Horizontal: -100,
            Movement_Direction_Vertical: -98,
            SampNum: 25,
            alpha_channel: false,
            alpha_percentage: 43,
            amplitude: 8.25,
            blur: 42,
            distortion: 5,
            edge_multiply: false,
            from_file: true,
            glow_percent: 72,
            invert_edge: false,
            non_edge_multiply: false,
            override_entire_effect: false,
            red_base_value: 11.69,
            red_blue_input_value: 8.4399999999999995,
            red_green_input_value: -26.620000000000001,
            red_red_input_value: 31.170000000000002,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/edge_detection.shader",
            shadow_blur_size: 7,
            shadow_offset_x: -100,
            shadow_offset_y: 13,
            speed_percentage: -10,
            sensitivity: 0.10000000000000001,
          },
          496: {
            AngleNum: 25,
            Animation_Speed: 0.10000000000000001,
            Dead_Pixel_X: 0,
            Movement_Direction_Horizontal: -100,
            Movement_Direction_Vertical: -98,
            SampNum: 25,
            alpha_channel: false,
            alpha_percentage: 43,
            amplitude: 8.25,
            blur: 42,
            distortion: 5,
            edge_multiply: false,
            from_file: true,
            glow_percent: 72,
            invert_edge: true,
            non_edge_multiply: false,
            override_entire_effect: false,
            red_base_value: 11.69,
            red_blue_input_value: 8.4399999999999995,
            red_green_input_value: -26.620000000000001,
            red_red_input_value: 31.170000000000002,
            sensitivity: 0.10000000000000001,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/edge_detection.shader",
            shadow_blur_size: 7,
            shadow_offset_x: -100,
            shadow_offset_y: 13,
            speed_percentage: -10,
          },
          497: {
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/emboss.shader",
          },
          498: {
            AMT: 0.02,
            Alpha_Percent: 99.900000000000006,
            Alpha_Percentage: 100,
            Border_Offset: 0.5,
            Flame_Size: 132,
            Movement_Direction_Horizontal: -100,
            Movement_Direction_Vertical: 100,
            Offset_Amount: 10,
            Reflection_Offset: 37,
            SPEED: 0.01,
            Speed: 100,
            blend: 1,
            blur: 14,
            expand_left: 0,
            from_file: true,
            gain: 0.91000000000000003,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/Invert.shader",
            threshold: 0,
            xSize: 100,
            ySize: 1,
          },
          499: {
            Alpha_Percentage: 0,
            Apply_To_Image: true,
            Doodle_Scale_Percent: 0,
            Opacity: 153.80000000000001,
            Position: 18.919,
            Ratio: 35.640000000000001,
            Speed: 12.871,
            animated: false,
            apply_to_channel: true,
            blurSize: 49.829999999999998,
            center_height_percentage: 95,
            center_width_percentage: 95,
            color_depth: 3.7999999999999998,
            from_file: true,
            inner_radius: 0,
            inverted: true,
            lumaMin: 0,
            lumaMinSmooth: 0.66000000000000003,
            min_growth_pixels: 398.60000000000002,
            minimum_alpha_percent: 34,
            multiply: true,
            number_stars: 100,
            override_entire_effect: false,
            part_1: 0,
            pixelation: 49.299999999999997,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/thermal.shader",
            speed: 13.5,
            speed_horizonal: 3.1019999999999999,
            speed_vertical: 2.5409999999999999,
            start_angle: 359.89999999999998,
            transition_time: 0,
          },
          500: {
            Angle_Steps: 16,
            Dead_Pixel_X: 1376,
            Dead_Pixel_Y: 1057,
            Radius_Steps: 0,
            ampFactor: 5.29,
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path + "/data/obs-plugins/obs-shaderfilter/examples/drunk.shader",
            strength: 21.780000000000001,
            glow_percent: 50,
            blur: 50,
            min_brightness: 0,
            pulse_speed_percent: 0,
          },
          501: {
            Gamma_Correction: true,
            Invert_Color: true,
            Invert_Luma: true,
            Test_Ramp: true,
            from_file: true,
            override_entire_effect: false,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/Luminance.shader",
            use_shader_elapsed_time: true,
          },
          502: {
            Angle_Steps: 15,
            Opacity_End_Percent: 94,
            Opacity_Start_Percent: 0,
            Radius_Steps: 0,
            Rotation_Offset: 0,
            Speed: 0.029999999999999999,
            ampFactor: 7.71,
            expand_left: 0,
            from_file: true,
            left_flip_width: 0,
            left_side_size: 1,
            left_side_width: 0.46999999999999997,
            override_entire_effect: false,
            scale: 1,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/box-blur.shader",
            speed: 2,
            Strength: 2,
            Mask_Left: 1.0,
            Mask_Right: 1,
            Mask_Top: 1,
            Mask_Bottom: 1,
          },
          503: {
            from_file: true,
            override_entire_effect: false,
            colorDepth: 20,
            pixelSize: 20,
            shader_file_name:
              path +
              "/data/obs-plugins/obs-shaderfilter/examples/rotating-source.shader",
            spin_speed: 6.0,
          },
        };
        let uid = getUuid();
        const groups = {
          prev_ver: 486604803,
          name: this.info.title + "滤镜",
          uuid: uid,
          id: "group",
          versioned_id: "group",
          settings: {
            id_counter: 0,
            custom_size: true,
            cx: 2560,
            cy: 1440,
            items: [],
          },
          mixers: 0,
          sync: 0,
          flags: 0,
          volume: 1.0,
          balance: 0.5,
          enabled: true,
          muted: false,
          "push-to-mute": false,
          "push-to-mute-delay": 0,
          "push-to-talk": false,
          "push-to-talk-delay": 0,
          hotkeys: {},
          deinterlace_mode: 0,
          deinterlace_field_order: 0,
          monitoring_type: 0,
          private_settings: {},
          filters: [
            {
              prev_ver: 486604803,
              name: this.info.title + "滤镜",
              uuid: getUuid(),
              id: "shader_filter",
              versioned_id: "shader_filter",
              settings: obj[this.info.id],
              mixers: 0,
              sync: 0,
              flags: 0,
              volume: 1.0,
              balance: 0.5,
              enabled: true,
              muted: false,
              "push-to-mute": false,
              "push-to-mute-delay": 0,
              "push-to-talk": false,
              "push-to-talk-delay": 0,
              hotkeys: {},
              deinterlace_mode: 0,
              deinterlace_field_order: 0,
              monitoring_type: 0,
              private_settings: {},
            },
          ],
        };
        const sources = {
          prev_ver: 486604803,
          name: this.info.title,
          uuid: getUuid(),
          id: "scene",
          versioned_id: "scene",
          settings: {
            id_counter: 2,
            custom_size: false,
            items: [
              {
                name: this.info.title,
                source_uuid: uid,
                visible: true,
                locked: false,
                rot: 0.0,
                pos: {
                  x: 0.0,
                  y: 0.0,
                },
                scale: {
                  x: 0.75,
                  y: 0.75,
                },
                align: 5,
                bounds_type: 0,
                bounds_align: 0,
                bounds: {
                  x: 0.0,
                  y: 0.0,
                },
                crop_left: 0,
                crop_top: 0,
                crop_right: 0,
                crop_bottom: 0,
                id: 1,
                group_item_backup: false,
                scale_filter: "disable",
                blend_method: "default",
                blend_type: "normal",
                show_transition: {
                  duration: 0,
                },
                hide_transition: {
                  duration: 0,
                },
                private_settings: {
                  collapsed: false,
                },
              },
            ],
          },
          mixers: 0,
          sync: 0,
          flags: 0,
          volume: 1.0,
          balance: 0.5,
          enabled: true,
          muted: false,
          "push-to-mute": false,
          "push-to-mute-delay": 0,
          "push-to-talk": false,
          "push-to-talk-delay": 0,
          hotkeys: {
            "OBSBasic.SelectScene": [],
          },
          deinterlace_mode: 0,
          deinterlace_field_order: 0,
          monitoring_type: 0,
          private_settings: {},
        };
        const res = await window.ipc.invoke("pureScreenRecording", {
          groups,
          pathName: path,
          resourceUrl: this.info.resourceUrl,
          resourceName: this.info.resourceName,
          sources,
          obs: this.$root.obs,
          name: this.info.title,
        });
        ipcUtil.startObs(this.$root.obs.path);
      });
    },
  },
  beforeDestroy() {
    if (document.querySelector(".video")) {
      document
        .querySelector(".video")
        .removeEventListener("mousemove", this.mouseover);
    }
  },
};
</script>

<style lang="scss" scoped>
.collect {
  width: 106px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #d9d9d9;
  .like {
    margin-right: 8px;
  }
}
.videoDetails {
  display: flex;
  margin-top: 10px;
  color: #409eff;
  .videoDetailsItem {
    display: flex;
    align-items: center;
    margin-right: 33px;
    font-size: 12px;
    .c {
      font-size: 14px;
    }
    /deep/ .icon-fenbianshuai {
      font-size: 18px;
    }
    div {
      margin-left: 8px;
    }
  }
}
.commentItem {
  display: flex;
  width: 556px;
  // height: 62px;
  margin-top: 12px;
  /deep/ .el-avatar {
    // margin-top: 10px;
    width: 24px;
    height: 24px;
  }
  .commentItemMain {
    width: 572px;
    padding-left: 8px;
    // border-bottom: 2px solid #ccc;
    box-sizing: border-box;
    .title {
      display: flex;
      // margin-top: 18px;
      .nickname {
        font-weight: 700;
        font-size: 14px;
        color: #666666;
        margin-left: 8px;
      }
      .createTime {
        font-size: 14px;
        color: #c7d1d9;
      }
    }
    .context {
      margin-top: 8px;
      font-size: 11px;
      color: var(--fc);
      height: 64px;
      width: 572px;
      border: 1px solid #D9D9D9;
      display: flex;
      border-radius: 9px;

      padding: 8px;
      box-sizing: border-box;
    }
    .reply {
      margin-top: 8px;
      font-size: 14px;
      color: #9fafbc;
      cursor: pointer;
      width: 30px;
    }
    .del {
      margin-top: 8px;
      margin-left: 8px;
      font-size: 14px;
      color: #9fafbc;
      cursor: pointer;
      width: 30px;
    }
  }
}
.box {
  position: fixed;
  right: 55px;
  bottom: 35px;

  background: var(--secondLevel);
  margin-top: 16px;
  border-radius: 16px;
  .imgBox {
    padding: 0 20px;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .smsSign {
    font-size: 12px;
    color: #409eff;
    padding: 4px 6px;
  }
}
.inputBox {
  width: 300px;
  margin-left: 2%;
  height: 50px;
  display: flex;

  .input {
    width: 200px;
    height: 100%;
    position: relative;
    &::before {
      color: #fff;
      display: block;
      position: absolute;
      content: attr(data-content);
      top: 5px;
      left: 7px;
      border-radius: 4px;
      padding: 4px;
      white-space: nowrap;
      line-height: normal;
    }
    // background: #fff;
    /deep/ .el-input__inner {
      background: var(--secondLevel);
      height: 50px;
      border: none;
      border-radius: 16px;
      color: var(--fc);
    }
  }
  .icons {
    // flex: 1;
    width: 120px;
    display: flex;
    align-items: center;
    margin-right: 8px;
    justify-content: space-around;
    /deep/ .iconfont,
    .upload {
      font-size: 20px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background: #828289;
        border-radius: 50%;
      }
    }
  }
}
.el-carousel__arrow {
  text-align: center;
  background: rgba($color: #000000, $alpha: 0);
  line-height: 36px;
  width: 80px;
  i::before {
    font-size: 20px;
  }
}
.el-carousel__arrow--left {
  position: absolute;
  left: 10px;
}
.el-carousel__arrow--right {
  position: absolute;
  right: 6px;
}
.detailsMain {
  overflow: hidden;
}

.tit {
  font-size: 12px;
}
.copy {
  display: flex;
  .logoPath {
    width: 200px;
    height: 20px;
    margin-left: 12px;
    line-height: 20px;
    /deep/ .el-input__inner {
      background: #fff !important;
      color: #000;
      border-radius: 3px;
      width: 200px;
      height: 20px;
    }
  }
  .logoTop {
    width: 58px;
    height: 20px;
    background: #d9d9d9;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 12px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
  }
}

.homeImg {
  width: 574px;
  height: 300px;
  border: 2px solid #000;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}
.searchItem {
  padding: 0 16px;
  text-align: center;
  width: auto;
  background: var(--carousel);
  border-radius: 8px;
  margin-left: 8px;
}
.details {
  height: 628px;
  overflow: hidden;
  box-sizing: border-box;
}

.buttons {
  background: var(--bgc);
  top: 12px;
  // width: calc(100% - 40px);
  margin: 10px 44px;
  display: flex;
  align-items: center;
  .buttonsLeft{
    display: flex;
    width: 607px;
  }
  .tabs {
    // width: 180px;
    height: 28px;
    margin-right: 12px;
  }
  .tab {
    max-width: 180px;
    color: var(--fc);
    display: flex;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid var(--fc);
    border-radius: 50px;
    div {
      width: 52px;
      height: 100%;
      border-radius: 50px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
    }
    .action {
      background-color: #409eff;
      color: #fff;
    }
  }
  .source-code {
    display: inline-block;
    width: 115px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background-color: var(--tgb);
    color: var(--fc);
    text-align: center;
    // border: 1px solid #000;
    border-radius: 9px;
    margin-right: 12px;
  }
  .copyright {
    font-size: 12px;
    width: 115px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #409eff;
    background-color: var(--tgb);
    border-radius: 9px;
    margin-right: 12px;
    cursor: pointer;
    border: 1px solid #000;
    box-sizing: border-box;
    font-weight: 700;
  }

  .search {
    width: 244px;
    border-radius: 30px;
    z-index: 1;
    margin-right: 6px;
    height: 30px;
    box-sizing: border-box;
    /deep/ .el-input__inner {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      border: 1px solid #000;
    }
    /deep/ input {
      background-color: var(--bgc);
      color: var(--fc);
      height: 30px;
    }

    /deep/ .el-input-group__append {
      background-color: var(--bgc);
      font-size: 16px !important;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      border: 1px solid #000;
      border-left: none;
      .el-icon-search {
        color: var(--fc);
      }
    }
  }

  .icon {
    position: relative;
    top: 0px;
    padding: 3px;
    border-radius: 3px;
    color: var(--fc);
    cursor: pointer;
    i {
      font-size: 24px;
      font-weight: 700;
    }

    &:hover {
      background-color: var(--tgb);
    }
  }
  .virtualization {
    color: var(--virtualization);
    cursor: initial;
  }

  .contribute {
    display: inline-block;
    font-size: 14px;
    background-color: #fdc4b3;
    padding: 4px 12px;
    border-radius: 6px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .backButton {
    font-size: 14px;
    background-color: #e3e3e3;
    color: #000;
    width: 115px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-left: 145px;
    border-radius: 6px;
    box-sizing: border-box;
    border: 1px solid #000;
    cursor: pointer;

    img {
      position: relative;
      top: 1px;
      height: 14px;
      width: 14px;
      margin-right: 3px;
    }
  }
}

.info {
  margin: 0 44px;
  display: flex;
  color: var(--fc);
  .title,
  .source-code {
    font-size: 10px;
    font-weight: 700;
    display: inline-block;
    padding: 4px 8px;
    color: var(--fc);
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
  }
  .source-code {
    margin-left: 12px;
  }
  .title {
    border: 1px solid var(--fc);
    background:  var(--carousel);
    display: flex;
    width: 58px;
    box-sizing: border-box;
    justify-content: space-around;
    font-weight: 700;
  }
}

.main {
  position: relative;
  margin: 12px 44px 12px 44px;
  .identification {
    position: absolute;
    z-index: 999;
    height: 40px;
    width: 100px;
    border-radius: 16px;
    top: 5px;
    left: 475px;
    // background: #409eff;
    .identificationBox {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fcf03f;
      font-size: 16px;
      div {
        margin: 0 4px;
      }
    }
    .vipImg {
      width: 20px;
      height: 20px;
      background-image: url("@/assets/vip.png");
      background-size: 100% 100%;
    }
    .svipImg {
      width: 20px;
      height: 20px;
      background-image: url("@/assets/svip.png");
      background-size: 100% 100%;
    }
  }
  .video {
    display: inline-block;
    width: 572px;
    height: 402px;
    // /deep/ .vjs-control-bar {
    //   opacity: 0;
    // }
    /deep/ .vjs-big-play-button {
      opacity: 0;
    }
    &:hover {
      /deep/ .vjs-control-bar {
        opacity: 1;
      }
      /deep/ .vjs-big-play-button {
        opacity: 1;
      }
    }
  }

  .article {
    position: absolute;
    display: inline-block;
    width: 262px;
    height: 400px;
    top: 0;
    right: 0;
    margin-left: 20px;

    .article-info {
      width: 262px;
      height: 348px;
      box-sizing: border-box;
      background-color: var(--carousel);
      border-radius: 24px;
      padding: 10px;
      // padding-top: 16px;
      margin-right: 16px;
      font-size: 16px;
      color: var(--fc);
      position: relative;
      .commentBut {
        position: absolute;
        bottom: 10px;
        right: 12px;
        background: #409eff;
        width: 52px;
        height: 20px;
        font-size: 10px;
        line-height: 20px;
        border-radius: 3px;
        text-align: center;
        cursor: pointer;
        font-weight: 700;
      }
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

      .left {
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
      }

      .carousel {
        width: 200px;
        height: 150px;
        margin-left: 30px;
        border: 2px solid #000;
        border-radius: 16px;
        background: #28282e;

        /deep/ .el-carousel__container {
          width: 200px;
          height: 150px;
          i {
            font-size: 18px;
          }
        }
        .el-image {
          height: 150px;
          width: 100%;
          img {
            width: 100%;
            height: 150px;
          }
        }
        /deep/ .el-carousel__indicators {
          width: 100px;
          text-align: center;
          li {
            .el-carousel__button {
              width: 5px;
              height: 5px;
              border-radius: 50%;
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

    .article-buttons {
      margin-top: 12px;
      display: flex;

      .submit,
      .download {
        height: 40px;
        border-radius: 9px;
        font-size: 14px;
      }
      .submit {
        width: 134px;
        margin-left: 12px;
      }
      .download {
        background: #d9d9d9;
        width: 120px;
        padding: 10px;
        color: #333;
        font-weight: 700;
        border: 1px solid #333;
        /deep/ .el-icon-download {
          font-weight: 700;
        }
      }
    }
  }
}
// 画布

::v-deep .textStyleFrom {
  width: 600px;
  .el-color-picker {
    margin-top: 5px;
  }
  .el-form-item__label {
    color: var(--fc);
  }
  .el-input__inner {
    border: 2px solid #000;
    border-radius: 8px;
    background: var(--bgc);
    color: var(--fc);
  }
}
::v-deep .textStyleFrom1 {
  width: 300px;
  height: 20px;
  display: flex;
  align-items: center;
  margin-left: 12px;
  .el-color-picker {
    margin-top: 5px;
  }
  .el-form-item__label {
    color: var(--fc);
  }
  .el-input__inner {
    border: 2px solid #000;
    border-radius: 8px;
    background: var(--bgc);
    color: var(--fc);
  }
}
#myCanvas {
  width: 574px;
  height: 300px;
  background: #000;
}
.programme {
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  // justify-content: flex-end;
  // margin-left: 6px;
  .programmeItem {
    width: 62px;
    height: 20px;
    text-align: center;
    margin-right: 8px;
    border-radius: 3px;
    line-height: 20px;
    font-size: 12px;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid #4d4a4a;
    color: var(--fc);
  }
  .scene {
    border: 2px solid #4d4a4a;
    background: #409eff;
  }
}
</style>
