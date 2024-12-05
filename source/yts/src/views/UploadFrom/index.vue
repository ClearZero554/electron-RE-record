<template>
  <div class="uploadFrom">
    <div class="top">
      <div class="content">
        <div class="tab">
          <div :class="type === 0 ? 'action' : ''" @click="change(0)">素材</div>
          <div :class="type === 1 ? 'action' : ''" @click="change(1)">教学</div>
          <div :class="type === 2 ? 'action' : ''" @click="change(2)">图文</div>
        </div>
        <el-upload
          action="https://yts.yuantiaoshi.com:8880/api/upload/userSetting"
          class="uploadVideo"
          ref="uploadZip"
          :on-progress="handleProgress"
          :on-success="allocationSuccess"
          :before-upload="allocationBefore"
          :show-file-list="false"
          :data="uploadData"
          v-show="from.cid === 5 && allocationText == '上传配置'"
        >
          <div class="allocation">
            <!-- <div class="allocationItem" ref="allocationItem"></div> -->
            <div class="allocationText">{{ allocationText }}</div>
          </div>
        </el-upload>
        <div
          class="allocation"
          v-show="from.cid === 5 && allocationText != '上传配置'"
        >
          <div class="allocationItem" ref="allocationItem"></div>
          <div class="allocationText">{{ allocationText }}</div>
          <div class="close" @click.stop="close">x</div>
        </div>
        <el-input
          size="small"
          v-model="from.title"
          placeholder="请输入标题,必填"
          @focus="focus"
          @blur="blur"
        ></el-input>
      </div>
      <div class="backButton" @click="handleBack">
        <img src="@/assets/home.png" />
        <span>返回主页</span>
      </div>
    </div>
    <div class="main" id="main">
      <div class="info" v-if="from.cid == 5">
        <div>{{ deviceInfo.cpu }}</div>
        <div>
          <div
            v-for="(item, index) in deviceInfo.gpu"
            :key="index"
            v-show="index !== 0"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="submit">
        <el-button @click="selectConfiguration" v-if="from.cid == 5"
          >选择配置</el-button
        >
        <el-button type="primary" @click="submit">提交审核</el-button>
      </div>

      <div class="uploadBox">
        <!-- 视频上传 -->
        <div class="upload" v-show="type === 0">
          <el-upload
            action="https://yts.yuantiaoshi.com:8880/api/upload/resource"
            class="uploadVideo"
            v-show="!isShowVideo"
            :on-success="(response, file) => videoSuccessful(response, file, 0)"
            :on-progress="(event, file) => videoProgress(event, file, 0)"
            :before-upload="videoBefore"
            multiple
          >
            <div v-if="!videoProgressList[0].uid">
              <i class="el-icon-plus"></i>
              <div>请上传素材视频-webm、mp4</div>
            </div>
            <div class="waitFor" v-else>
              <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
              </div>
              <div>
                正在上传{{
                  videoProgressList[0].downloadSize +
                  "/" +
                  videoProgressList[0].totalSize
                }}Mb
              </div>
            </div>
          </el-upload>
          <VideoPlayer
            ref="videoPlayer"
            v-if="isShowVideo"
            :info="from.video"
            :isHide="true"
            class="uploadVideo"
          ></VideoPlayer>

          <el-button
            type="danger"
            v-if="isShowVideo"
            icon="el-icon-close"
            circle
            class="del"
            size="mini"
            @click="del('video')"
          ></el-button>
        </div>
        <!-- 教学上传 -->
        <div class="upload" v-show="type === 1">
          <!-- <el-tooltip
            effect="light"
            content="请上传视频文件-webm、mp4"
            placement="bottom"
            v-show="!isShowTeachingVideoUrl"
          > -->
          <el-upload
            action="https://yts.yuantiaoshi.com:8880/api/upload/resource"
            class="uploadVideo"
            v-show="!isShowTeachingVideoUrl"
            :on-success="(response, file) => videoSuccessful(response, file, 1)"
            :on-progress="(event, file) => videoProgress(event, file, 1)"
            :before-upload="videoBefore"
            multiple
          >
            <div v-if="!videoProgressList[1].uid">
              <i class="el-icon-plus"></i>
              <div>请上传教程视频-webm、mp4</div>
            </div>
            <div class="waitFor" v-else>
              <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
              </div>
              <div>
                正在上传{{
                  videoProgressList[1].downloadSize +
                  "/" +
                  videoProgressList[1].totalSize
                }}Mb
              </div>
            </div>
          </el-upload>
          <!-- </el-tooltip> -->

          <VideoPlayer
            ref="videoPlayer"
            v-if="isShowTeachingVideoUrl"
            :info="from.teachingVideoUrl"
            :isHide="true"
            class="uploadVideo"
          ></VideoPlayer>

          <el-button
            type="danger"
            v-if="isShowTeachingVideoUrl"
            icon="el-icon-close"
            circle
            class="del"
            size="mini"
            @click="del('teachingVideoUrl')"
          ></el-button>
        </div>
        <!-- 图片上传 -->
        <div class="upload" v-if="type === 2">
          <div class="carouselBox">
            <div
              class="el-carousel__arrow el-carousel__arrow--left"
              @click="changCarousel(0)"
            >
              <i class="el-icon-arrow-left"></i>
            </div>
            <el-carousel
              trigger="click"
              class="carousel"
              :autoplay="false"
              arrow="never"
              ref="cardShow"
              @change="changeCarousel"
            >
              <el-carousel-item
                v-for="(item, index) in from.articleList"
                :key="index"
              >
                <div class="imgBox" v-if="index < from.articleList.length - 1">
                  <el-image
                    :src="'https://resource.yuantiaoshi.com/' + item.msg"
                    :draggable="false"
                    fit="cover"
                  >
                  </el-image>
                  <div class="imgAction">
                    <i
                      class="el-icon-zoom-in"
                      @click="handlePictureCardPreview(item)"
                    ></i>
                    <i class="el-icon-delete-solid" @click="delCarousel"></i>
                  </div>
                </div>
                <div v-else>
                  <el-upload
                    action="https://yts.yuantiaoshi.com:8880/api/upload/resource"
                    list-type="picture-card"
                    :show-file-list="false"
                    class="uploadVideo"
                    multiple
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="articleSuccessful"
                  >
                    <i class="el-icon-plus"></i>
                    <div>教程图片-jpg、png</div>
                  </el-upload>
                </div>
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
        <!-- 教程 -->
        <div class="tutorial">
          <el-upload
            action="https://yts.yuantiaoshi.com:8880/api/upload/resource"
            list-type="picture-card"
            :multiple="false"
            :file-list="from.coverList"
            :before-upload="beforeUpload"
            :on-success="coverSuccessful"
            :on-preview="handlePictureCardPreview"
            :on-remove="removeCardPreview"
            :class="{ hide: hideUploadEdit }"
          >
            <i class="el-icon-plus"></i>
            <div>封面-png、jpg</div>
          </el-upload>
          <el-dialog
            :visible.sync="dialogVisible"
            append-to-body
            width="50%"
            :show-close="false"
          >
            <div class="header">
              <div>图片预览</div>
              <iconpark-icon
                name="close-small"
                class="close-small"
                @click="dialogVisible = false"
              ></iconpark-icon>
            </div>
            <div class="preview">
              <el-image :src="dialogImageUrl" :draggable="false" fit="cover">
              </el-image>
            </div>
          </el-dialog>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="置顶评论,选填"
            v-model="from.comment"
            maxlength="50"
            @focus="focus"
            @blur="blur"
          >
          </el-input>
          <div class="tips" v-if="from.cid == 4">
            <div>视频上传格式要求</div>
            <div>视频尺寸:1920*1342</div>
            <div>视频格式:webm/mp4</div>
            <div>推荐视频码率6000左右</div>
          </div>
          <div class="tips" v-if="from.cid == 10">
            <div>图片上传格式要求</div>
            <div>图片尺寸:不限(1920*1342优先)</div>
            <div>图片格式:jpg/png</div>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="foot">
        <div class="left">
          <div class="footTop">
            <div class="userInfo">
              <img :src="userInfo.avatar" alt="" />
              <span>{{ userInfo.nickname }}</span>
            </div>
            <div
              class="changButton"
              v-if="!isMultiple"
              @click="isMultiple = !isMultiple"
            >
              文字对应图片
            </div>
            <div class="changButton" v-else @click="isMultiple = !isMultiple">
              只有一段文字
            </div>
          </div>
          <div class="footInput">
            <el-input
              type="textarea"
              v-if="!isMultiple"
              :rows="3"
              placeholder="请输入教程说明,必填"
              v-model="from.articleText[0]"
              maxlength="50"
              show-word-limit
              @focus="focus"
              @blur="blur"
            >
            </el-input>
            <template v-for="(item, index) in from.articleList" v-else>
              <el-input
                v-show="item.msg && carouselIndex == index"
                type="textarea"
                :key="item.msg"
                :rows="3"
                placeholder="请输入教程说明,必填"
                v-model="from.articleText[index]"
                maxlength="50"
                show-word-limit
                @focus="focus"
                @blur="blur"
              >
              </el-input>
            </template>
          </div>
          <div class="videoDetails" v-if="from.size">
            <div class="videoDetailsItem" v-if="from.size">
              <Icon fontName="icon-cunchu"></Icon>
              <div>{{ from.size }}M</div>
            </div>
            <div class="videoDetailsItem" v-if="from.dpi">
              <Icon fontName="icon-fenbianshuai"></Icon>
              <div>{{ from.dpi }}</div>
            </div>
            <div class="videoDetailsItem" v-if="from.time">
              <Icon fontName="icon-shijian"></Icon>
              <div>{{ from.time }}s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    选择配置弹框-->
    <el-dialog
      :append-to-body="true"
      width="50%"
      title="选择自己配置"
      @open="open"
      :visible.sync="visible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="header">
        <div>选择自己配置</div>
        <iconpark-icon
          name="close-small"
          class="close-small"
          @click="visible = false"
        ></iconpark-icon>
      </div>
      <div class="dialogList" v-if="selectedList.length">
        <div>直播类型:</div>
        <div>
          <el-input
            size="mini"
            v-model="from.liveRemark"
            placeholder="手游(和平精英)"
            @focus="focus"
            @blur="blur"
          ></el-input>
        </div>
      </div>
      <div class="dialogList">
        <div>游戏设备:</div>

        <div>
          <el-input
            size="mini"
            v-model="from.deviceRemark"
            placeholder="ipadpro 11寸"
            @focus="focus"
            @blur="blur"
          ></el-input>
        </div>
      </div>
      <div class="dialogList">
        <div>直播设备:</div>

        <div>
          <el-input
            size="mini"
            v-model="from.collectRemark"
            placeholder="2k采集卡"
            @focus="focus"
            @blur="blur"
          ></el-input>
        </div>
      </div>
      <div  class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!--  <UploadDialog
      ref="uploadDialog"
    ></UploadDialog> -->
  </div>
</template>

<script>
import { userUpload } from "@/api/article";
import { getClassification } from "@/api/user";
import VideoPlayer from "@/components/video-player/index.vue";
import feedback from "@/utils/feedback";
import ipcUtil from "@/ipc";
export default {
  name: "uploadFrom", //上传素材 图片
  components: { VideoPlayer },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      isShowVideo: false, //是否显示视频播放
      isShowTeachingVideoUrl: false, //是否显示教学视频播放
      isMultiple: false, //是否多开
      carouselIndex: 0, //轮播图的索引
      type: 0,
      allocationText: "上传配置",
      uploadData: {},
      visible: false, //选择配置弹框
      panelList1: [], //参数配置的树形结构
      panelList2: [], //第二级
      panelList3: [], //第三级
      selectedList: [], //被选中的
      deviceInfo: {},
      hideUploadEdit: false,
      from: {
        cid: null,
        title: "",
        resourceName: "", //素材名称
        coverList: [], //封面
        articleList: [{}], //教程
        articleText: [""], //教程文字
        video: "", //视频字段
        image: "", //封面字段
        comment: "", //评论
        articleType: "", //多开
        liveRemark: "", //直播方式为其他时使用
        liveWay: "", //直播方式
        deviceRemark: "", //设备为其他时使用
        deviceType: "", //设备
        collectRemark: "", //采集方式为其他时使用
        collectWay: "", //采集方式
        time: "", //时长
        dpi: "", //分辨率
        size: "", //大小
      },
      videoProgressList: { 0: {}, 1: {} },
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    this.from.cid = this.$route.query.cid;
    this.open();
    this.init();
  },
  methods: {
    async init() {
      this.deviceInfo = await ipcUtil.getDeviceInfo();
    },
    // 配置上传前
    allocationBefore(file) {
      this.uploadData.fileName = file.name.split(".")[0];
    },
    // 配置上传中
    handleProgress(event, file) {
      this.allocationText = Math.round(file.percentage) + "%";
      setTimeout(() => {
        this.$refs.allocationItem.style.width =
          Math.round(file.percentage) + "%";
      }, 0);
    },
    // 配置上传完成
    allocationSuccess(response) {
      this.$refs.allocationItem.style.width = "100%";
      this.from.resourceName = response.data.name;
      this.from.resourceUrl = response.data.url;
      this.allocationText = response.data.name;
      feedback.msgSuccess("上传完成");
    },
    // 确认
    confirm() {
      if (this.selectedList.length < 3) {
        feedback.msgWarning("请全部选择再确认");
      }
      let flag = false;
      this.selectedList.forEach((item, index) => {
        if (!this.from.liveRemark && index === 0) {
          feedback.msgWarning("请全部选择再确认");
          flag = true;
        }
        if (!this.from.deviceRemark && index === 1) {
          feedback.msgWarning("请全部选择再确认");
          flag = true;
        }
        if (!this.from.collectRemark && index === 2) {
          feedback.msgWarning("请全部选择再确认");
          flag = true;
        }
      });
      // 如果没填完
      if (flag) return;
      this.from.liveWay = this.selectedList[0].id;
      this.from.deviceType = this.selectedList[1].id;
      this.from.collectWay = this.selectedList[2].id;
      this.visible = false;
    },
    // 配置弹框开启
    async open() {
      const res = await getClassification();
      console.log(res);
      if (res.status === 200) {
        this.panelList1 = res.data.data;
        // 扁平化
        const data = this.flatTreeData(this.panelList1);
        // 查找所有父id
        this.selectedList = this.findClass(data, 25);
        console.log(this.selectedList);
        data.forEach((item) => {
          if (this.selectedList[0].id === item.id) {
            this.panelList2 = item.children;
          } else if (this.selectedList[1].id === item.id) {
            this.panelList3 = item.children;
          }
        });
      }
    },
    // 查找分类
    findClass(list, current) {
      const res = [];

      function find(list, id) {
        list.forEach((item) => {
          if (item.id === id) {
            res.unshift(item);
            if (item.parentId) {
              find(list, item.parentId);
            }
          }
        });
      }

      find(list, current);
      console.log(res, "res");
      return res;
    },
    // 扁平化
    flatTreeData(list) {
      const res = [];

      function getData(list) {
        list.forEach((item) => {
          res.push(item);
          if (item.children) {
            getData(item.children);
          }
        });
      }

      getData(list);
      return res;
    },
    // 点击分类
    handleClickPropsItem(id, level) {
      if (level === 2) {
        this.panelList3 = [];
        this.selectedList.splice(1, 2, null, null);
      }
      if (level === 3) {
        this.selectedList.splice(2, 1, null);
      }
      this.selectedList.splice(
        level - 2,
        1,
        this["panelList" + [level - 1]].find((item) => item.id === id)
      );
      if (level !== 4) {
        this["panelList" + level] = this["panelList" + [level - 1]].find(
          (item) => item.id === id
        ).children;
      }
    },
    handleBack() {
      this.$router.push({ name: "home" });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览
    handlePictureCardPreview(file) {
      console.log(file, "file");
      this.dialogImageUrl = file.url
        ? file.url
        : "https://resource.yuantiaoshi.com/" + file.msg;
      this.dialogVisible = true;
    },
    // 上传封面成功
    coverSuccessful(response, file, fileList) {
      this.from.coverList = [file];
    },
    beforeUpload(file) {
      let arr = ["image/png", "image/jpeg", "image/jpg"];
      if (arr.includes(file.type)) {
        this.hideUploadEdit = true;
      } else {
        feedback.msgWarning("请上传png或jpg格式");
        return false;
      }
    },
    // 移除封面
    removeCardPreview() {
      this.from.coverList = [];
      setTimeout(() => {
        this.hideUploadEdit = false;
      }, 1000);
    },
    // 上传教程成功
    articleSuccessful(response, file, fileList) {
      this.from.articleList.splice(
        this.from.articleList.length - 1,
        0,
        response
      );
      // 如果是多开
      if (this.isMultiple) {
        this.from.articleText.push("");
      }
      this.$nextTick(() => {
        this.$refs.cardShow.setActiveItem(this.from.articleList.length - 2);
      });
    },
    getVideoPlayerInfo(file) {
      const videoElement = document.createElement("video");
      videoElement.src = window.URL.createObjectURL(file);
      videoElement.addEventListener("loadedmetadata", () => {
        this.from.time = Math.ceil(videoElement.duration);
        this.from.size = Math.ceil(file.size / 1024 / 1024);
        this.from.dpi =
          videoElement.videoWidth + "*" + videoElement.videoHeight;
      });
    },
    // 上传视频成功
    videoSuccessful(response, file, type) {
      // this.$bus.$emit("success", file);
      window.ipc.send("finishDownload", {
        name: file.name,
        uid: file.uid,
        filePath: "",
        totalSize: (file.size / 1024 / 1024).toFixed(1),
        downloadSize: (file.size / 1024 / 1024).toFixed(1),
      });
      if (type === 0) {
        this.getVideoPlayerInfo(file.raw);
        this.from.video = response.msg;
        this.isShowVideo = true;
      } else {
        this.from.teachingVideoUrl = response.msg;
        this.isShowTeachingVideoUrl = true;
      }
    },
    // 上传图片成功
    imgSuccessful(response, file, fileList) {
      this.from.image = response.msg;
      this.isShowVideo = true;
    },
    // 删除视频
    del(type) {
      console.log(type, "type");
      this.from[type] = null;
      if (type == "video") {
        this.videoProgressList[0] = {};
        this.isShowVideo = false;
      } else {
        this.videoProgressList[1] = {};
        this.isShowTeachingVideoUrl = false;
      }
    },
    // 轮播图操作
    changCarousel(type) {
      if (type == 0) {
        // 向左
        this.$refs.cardShow.prev();
      } else {
        this.$refs.cardShow.next();
      }
    },
    // 轮播图改变
    changeCarousel(index, oldIndex) {
      this.carouselIndex = index;
    },
    // 轮播图删除
    delCarousel() {
      this.from.articleList.splice(this.carouselIndex, 1);
      // 如果是多开
      if (this.isMultiple) {
        this.from.articleText.splice(this.carouselIndex, 1);
      }
      this.$refs.cardShow.setActiveItem(this.carouselIndex);
    },
    // 修改视频切换
    change(type) {
      this.type = type;
    },
    // 修改是否多开
    changeArticle(type) {
      this.isMultiple = type;
      if (type) {
        // 多开
        this.from.articleText = [];
        for (let index = 0; index < this.from.articleList.length - 1; index++) {
          this.from.articleText.push("");
        }
        console.log(this.from.articleText, "this.from.articleText");
      } else {
        this.from.articleText = [""];
      }
    },
    // 选择配置
    selectConfiguration() {
      this.visible = true;
    },
    // 视频上传中
    videoProgress(event, file, type) {
      const data = {
        percentage: file.percentage.toFixed(1),
        name: file.name,
        uid: file.uid,
        filePath: "",
        totalSize: (file.size / 1024 / 1024).toFixed(1),
        downloadSize: (
          (file.size * file.percentage) /
          100 /
          1024 /
          1024
        ).toFixed(1),
      };
      // 素材视频上传
      if (type == 0) {
        this.videoProgressList[0] = data;
      } else {
        // 教学视频上传
        this.videoProgressList[1] = data;
      }
      // this.$bus.$emit("progress", file);
      /* window.ipc.send("downloadProgress", {
        percentage: file.percentage.toFixed(1),
        name: file.name,
        uid: file.uid,
        filePath: "",
        totalSize: (file.size / 1024 / 1024).toFixed(1),
        downloadSize: (
          (file.size * file.percentage) /
          100 /
          1024 /
          1024
        ).toFixed(1),
      }); */
    },
    // 视频上传前
    videoBefore(file) {
      // 进度条上传前方法
      // this.$bus.$emit("before", file);
    },
    // 提交
    async submit() {
      // 公共校验
      if (!this.from.title) {
        feedback.msgWarning("请填写标题");
        return;
      }
      if (this.from.articleList.length === 1) {
        feedback.msgWarning("请上传教程图片");
        return;
      }
      if (!this.from.articleText) {
        feedback.msgWarning("请填写教程说明");
        return;
      }

      // 素材需要校验的
      if (this.from.cid === 4) {
        // 封面
        if (this.from.coverList.length === 0) {
          feedback.msgWarning("请上传封面");
          return;
        }
        if (!this.from.video) {
          feedback.msgWarning("请上传素材视频");
          return;
        }

        this.from.image = this.from.coverList[0].response.msg;
        // 获取视频格式
        let arr = this.from.video.split(".");
        let format = arr[arr.length - 1];
        // 素材名称
        this.from.resourceName = this.from.title + "." + format;
        this.from.resourceUrl = this.from.video;
      }
      // 图片需要检验的
      if (this.from.cid === 10) {
        // 封面
        if (!this.from.image) {
          feedback.msgWarning("请上传封面");
          return;
        }
        // 获取视频格式
        let arr = this.from.image.split(".");
        let format = arr[arr.length - 1];
        // 素材名称
        this.from.resourceName = this.from.title + "." + format;
        this.from.resourceUrl = this.from.image;
      }
      // 配置
      if (this.from.cid === 5) {
        let flag = false;
        this.selectedList.forEach((item, index) => {
          this.selectedList.forEach((item, index) => {
            if (!this.from.liveRemark && index === 0) {
              feedback.msgWarning("请全部选择再确认");
              flag = true;
            }
            if (!this.from.deviceRemark && index === 1) {
              feedback.msgWarning("请全部选择再确认");
              flag = true;
            }
            if (!this.from.collectRemark && index === 2) {
              feedback.msgWarning("请全部选择再确认");
              flag = true;
            }
          });
        });
        // 如果没填完
        if (flag) return;
        if (!this.from.resourceUrl) {
          feedback.msgWarning("请上传配置");
        }
        this.from.cpu = this.deviceInfo.cpu;
        this.from.gpu = this.deviceInfo.gpu.join(",");
        this.from.image = this.from.coverList[0].response.msg;
      }

      // json化教程图片
      this.from.articleList.pop();
      this.from.articleImage = JSON.stringify(
        this.from.articleList.map(
          (item) => "https://resource.yuantiaoshi.com/" + item.msg
        )
      );
      // 处理教程文字
      this.from.articleLabel = JSON.stringify(this.from.articleText);
      this.from.articleType = this.isMultiple ? 1 : 0;
      console.log("[ 处理后 ] >", this.from);
      const res = await userUpload({
        ...this.from,
        video: "https://resource.yuantiaoshi.com/" + this.from.video,
      });
      console.log(res);
      if (res.data.code == 200) {
        feedback.msgSuccess("上传成功,请等待审核");
        this.$router.push({ name: "home" });
      } else {
        feedback.msgWarning(res.data.msg);
        this.from.articleList.push({});
      }
    },
    // 取消空格事件
    focus() {
      this.$bus.$emit("unbind");
    },
    // 绑定空格事件
    blur() {
      this.$bus.$emit("binding");
    },
    close() {
      //
      console.log(111111111);
      this.$refs.uploadZip.abort();
      this.$refs.allocationItem.style.width = "0%";
      this.from.resourceName = "";
      this.from.resourceUrl = "";
      this.allocationText = "上传配置";
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list__item{
  border-radius: 9px;
}
::v-deep .el-upload-list__item-delete{
  margin-left: 24px !important;
}
::v-deep .el-textarea .el-textarea__inner {
  // 然后找到对应的类名，在这里将拉伸去掉即可
  resize: none;
  border-radius: 9px;
  background: var(--upload);
  color: var(--fc);
}
::v-deep .el-input__inner {
  background: var(--upload);
  color: var(--fc);
}
::v-deep .el-input__count {
  background: var(--upload);
  color: var(--fc);
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  height: 250px;
  width: 495px;
  border-radius: 9px;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  .close-small {
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    font-weight: 700;
  }
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 495px;
    height: 380px;
    overflow: hidden;
    /deep/ .el-image {
      width: 495px;
      height: 380px;
      img {
        width: 495px;
        height: 380px;
      }
    }
  }
}
.imgBox {
  position: relative;
  width: 572px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  .imgAction {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9999;
    display: none;

    i {
      margin: 0 18px;
      cursor: pointer;
      color: #fff;
      font-size: 24px;
    }

    // display: ;
  }
  &:hover {
    .imgAction {
      background-color: rgba($color: #000000, $alpha: 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.waitFor {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dot-spinner {
  --uib-size: 2.8rem;
  --uib-speed: 0.9s;
  --uib-color: #183153;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: var(--uib-size);
  width: var(--uib-size);
  margin-bottom: 12px;
}

.dot-spinner__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.dot-spinner__dot::before {
  content: "";
  height: 20%;
  width: 20%;
  border-radius: 50%;
  background-color: var(--uib-color);
  transform: scale(0);
  opacity: 0.5;
  animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
  box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
}

.dot-spinner__dot:nth-child(2) {
  transform: rotate(45deg);
}

.dot-spinner__dot:nth-child(2)::before {
  animation-delay: calc(var(--uib-speed) * -0.875);
}

.dot-spinner__dot:nth-child(3) {
  transform: rotate(90deg);
}

.dot-spinner__dot:nth-child(3)::before {
  animation-delay: calc(var(--uib-speed) * -0.75);
}

.dot-spinner__dot:nth-child(4) {
  transform: rotate(135deg);
}

.dot-spinner__dot:nth-child(4)::before {
  animation-delay: calc(var(--uib-speed) * -0.625);
}

.dot-spinner__dot:nth-child(5) {
  transform: rotate(180deg);
}

.dot-spinner__dot:nth-child(5)::before {
  animation-delay: calc(var(--uib-speed) * -0.5);
}

.dot-spinner__dot:nth-child(6) {
  transform: rotate(225deg);
}

.dot-spinner__dot:nth-child(6)::before {
  animation-delay: calc(var(--uib-speed) * -0.375);
}

.dot-spinner__dot:nth-child(7) {
  transform: rotate(270deg);
}

.dot-spinner__dot:nth-child(7)::before {
  animation-delay: calc(var(--uib-speed) * -0.25);
}

.dot-spinner__dot:nth-child(8) {
  transform: rotate(315deg);
}

.dot-spinner__dot:nth-child(8)::before {
  animation-delay: calc(var(--uib-speed) * -0.125);
}

@keyframes pulse0112 {
  0%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.el-icon-plus {
  margin-bottom: 16px;
  font-weight: 700;
}
::v-deep .el-carousel__container {
  width: 572px;
  height: 400px;

  i {
    font-size: 18px;
  }
}
.videoDetails {
  display: flex;
  margin-top: 18px;
  color: #409eff;
  .videoDetailsItem {
    display: flex;
    align-items: center;
    margin-right: 33px;
    font-size: 12px;
    /deep/ .icon-fenbianshuai {
      font-size: 18px;
    }
    div {
      margin-left: 8px;
    }
  }
}
/deep/ .el-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--upload);
}
/deep/ .el-upload--picture-card {
  line-height: 10px;
}
.tab {
  background: var(--secondLevel);
  // color: #fff;
  border: 1px solid #303445;
  width: 158px;
  display: flex;
  height: 30px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  margin-right: 12px;

  div {
    width: 33%;
    height: 100%;
    border-radius: 16px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .action {
    background-color: #409eff;
    color: #fff;
  }
}

.uploadFrom {
  color: var(--fc);

  .top {
    width: 96%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0 12px 0 0;
    margin-top: 8px;
    margin-bottom: 8px;

    .content {
      margin-left: 5%;
      width: 570px;
      display: flex;
      /deep/ .el-input {
        flex: 1;
        border-radius: 9px;
        background: var(--upload) !important;
        color: var(--fc);
      }
      .uploadVideo {
        width: 96px;
        /deep/ .el-upload {
          background: var(--bgc);
        }
      }
    }

    .backButton {
      display: inline-block;
      cursor: pointer;
      font-size: 14px;
      background-color: #e3e3e3;
      color: #000;
      padding: 2px 10px;
      margin-left: 100px;
      border-radius: 6px;
      border: 1px solid #000;

      img {
        position: relative;
        top: 1px;
        height: 14px;
        width: 14px;
        margin-right: 3px;
      }
    }
  }

  .main {
    height: 580px;
    overflow: hidden;

    position: relative;
    /* 整个滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }
    .info {
      position: absolute;
      bottom: 110px;
      right: 80px;
      font-size: 12px;
    }
    .submit {
      position: fixed;
      bottom: 35px;
      right: 70px;
    }

    .fromItem {
      width: 80%;
      margin-left: 5%;
      display: flex;
      align-items: center;
      // margin-bottom: 8px;
      .lab {
        width: 80px;
        text-align: right;
        margin-right: 8px;
      }

      .content {
        width: 550px;
        height: 148px;
        position: relative;

        /deep/ .el-textarea__inner {
          position: absolute;
          left: 360px;
          top: -165px;
          width: 485px;
        }

        /deep/ .el-upload {
          background-color: var(--virtualization);
        }

        .upload {
        }
      }
    }

    .uploadBox {
      display: flex;
      margin-left: 5%;
      margin-bottom: 4px;
      width: 100%;
      .upload {
        border-radius: 16px;
        position: relative;
        width: 572px;

        .del {
          position: absolute;
          right: 10px;
          top: 16px;
          background: red;
        }

        .uploadVideo {
          width: 572px;
          height: 400px;
          // line-height: 400px;
          background: var(--virtualization);
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          overflow: hidden;

          /deep/ .el-upload {
            background-color: var(--virtualization);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
              font-size: 40px;
            }
          }
        }
      }

      .tutorial {
        width: 262px;
        height: 400px;
        margin-left: 38px;
        border-radius: 16px;
        padding: 8px;
        box-sizing: border-box;
        background: var(--virtualization);
        .hide {
          /deep/ .el-upload--picture-card {
            display: none;
          }
        }
        /deep/ .el-textarea__inner {
          width: 230px;
          margin: 8px;
        }

        /deep/ .el-upload {
          width: 230px;
          height: 172px;
          margin-left: 8px;
          margin-top: 16px;
        }
        /deep/ .el-upload-list__item-thumbnail {
          width: 230px;
          height: 172px;
        }
        /deep/ .el-upload-list__item {
          width: 230px;
          height: 172px;
          margin-left: 8px;
          margin-top: 16px;
          margin-bottom: 0px;
        }
        .tips {
          font-size: 12px;
          margin-top: 16px;
          margin-left: 8px;
          color: #409eff;
          div {
            &:nth-child(1) {
              color: var(--fc);
            }
          }
        }
        .tutorialTop {
          width: 100%;
          display: flex;
          align-items: center;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 16px;
          }
        }

        .carousel {
          width: 572px;
          height: 400px;
          margin-left: 30px;
          border: 2px solid #000;
          border-radius: 16px;
          background: #28282e;

          /*  /deep/ .el-upload {
            background-color: var(--virtualization);
            width: 572px;
            height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;

            i {
              font-size: 40px;
            }
          } */

          .el-image {
            height: 150px;
            width: 200px;

            img {
              width: 200px;
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
      }
    }
    .foot {
      display: flex;
      margin-left: 44px;
      margin-top: 30px;
      .footTop {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .footInput {
        margin-top: 8px;
      }
      .left {
        width: 572px;

        .userInfo {
          display: flex;
          align-items: center;
          span {
            margin-left: 12px;
          }
        }
        .changButton {
          width: 76px;
          height: 20px;
          line-height: 20px;
          font-size: 10px;
          border: 1px solid var(--fc);
          border-radius: 6px;
          text-align: center;
          font-weight: 700;
          cursor: pointer;
        }
        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
      }
    }
  }
}

.comment {
  width: 550px;
  margin-left: 5%;
}

.carouselBox {
  position: relative;
  // margin: 16px 0;
  height: 400px;

  .el-carousel__arrow {
    text-align: center;
    background: rgba($color: #ccc, $alpha: 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fc);
    width: 26px;
    height: 26px;
    border: 1px solid var(--fc);
    i::before {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .el-carousel__arrow--left {
    position: absolute;
    left: 16px;
  }

  .el-carousel__arrow--right {
    position: absolute;
    right: 16px;
  }
}

.allocation {
  width: 96px;
  border: 1px solid var(--fc);
  border-radius: 50px;
  background: var(--secondLevel);
  font-size: 12px;
  font-weight: 700;
  height: 30px;
  margin-right: 8px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  .close {
    position: absolute;
    right: 5px;
    top: 6px;
    background: red;
    width: 16px;
    height: 16px;
    color: #fff;
    text-align: center;
    line-height: 16px;
    border-radius: 50%;
    font-size: 14px;
  }
  .allocationItem {
    position: absolute;
    top: 0;
    left: 0;
    background: #409eff;
    height: 30px;
    width: 0;
    z-index: 0;
    color: #fff;
    border-radius: 50px;
  }

  .allocationText {
    position: absolute;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
}

.dialogList {
  display: flex;
  align-items: center;
  margin-left: 16px;
  div {
    line-height: 30px;
    height: 30px;
    margin-bottom: 8px;
    /deep/ .el-input__inner {
      width: 300px;
      height: 30px;
    }
  }

  .dialogItem {
    width: 100px;
    text-align: center;
    margin: 2px 4px;
    border-radius: 8px;
    border: 1px solid #000;
    cursor: pointer;
  }

  .submit {
    background: #409eff;
  }
}
.dialog-footer{
  position: absolute;
  right: 10px;
  bottom: 16px;
}
</style>
