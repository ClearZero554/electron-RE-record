<template>
  <div class="upload">
    <!-- 选择上传类型 -->
    <div class="typeList">
      <div class="typeItem" @click="uploadType(4)">
        <Icon fontName="icon-shipin"></Icon>
        <div>上传素材</div>
      </div>
      <div class="typeItem" @click="uploadType(10)">
        <Icon fontName="icon-tupian"></Icon>
        <div>上传图片</div>
      </div>
      <div class="typeItem" @click="uploadType(5)">
        <Icon fontName="icon-peizhiguanli"></Icon>
        <div>上传配置</div>
      </div>
    </div>
    <div class="seizeASeat">
      <div class="left">
        <div :class="type == 1 ? 'action' : ''" @click="changeType(1)">
          视频转换
        </div>
        <div :class="type == 2 ? 'action' : ''" @click="changeType(2)">
          保存OBS数据
        </div>
        <div :class="type == 3 ? 'action' : ''" @click="changeType(3)">
          上传须知
        </div>
      </div>
      <div class="video" v-show="type == 1">
        <div class="right" v-if="!videoFile">
          <img src="@/assets/add.png" alt="" class="add" @click="addFile" />
          <div class="addText">点击添加文件</div>
          <img src="@/assets/step.png" alt="" class="step" />
        </div>
        <div class="right" v-else>
          <div class="fileItem">
            <img src="@/assets/tp.png" alt="" class="tp" />
            <div>
              <div class="title">{{ form.name }}</div>
              <div class="text">
                <div>
                  <div>
                    <span>格式:webm</span>
                    <span>分辨率:{{ form.dpi }}</span>
                  </div>
                  <div>
                    <span>时长:{{ form.time }}s</span>
                    <span>大小:{{ form.size }}Mb</span>
                  </div>
                </div>
                <img
                  src="@/assets/transformation.png"
                  alt=""
                  class="transformation"
                />
                <div>
                  <div>
                    <span>格式:{{ form.format }}</span>
                    <span>分辨率:{{ form.dpi }}</span>
                  </div>
                  <div>
                    <span>时长:{{ form.time }}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 参数 -->
          <div class="config">
            <div class="toConfigure">
              <div>
                <span>输出格式:</span>
                <el-radio-group v-model="form.format">
                  <el-radio label="webm">webm</el-radio>
                  <el-radio label="mp4">mp4</el-radio>
                </el-radio-group>
              </div>
              <div class="videoBitrate">
                <span>视频码率:</span>
                <el-radio-group v-model="form.bitrate">
                  <el-radio :label="6000">6000</el-radio>
                  <el-radio :label="8000">8000</el-radio>
                </el-radio-group>
                <el-input v-model="form.bitrate" class="input"></el-input>
              </div>
              <div class="outputPath">
                <span class="lab">输出路径:</span>
                <el-input
                  v-model="form.path"
                  disabled
                  class="disabled"
                ></el-input>
                <div class="button" @click="changeFile">更换目录</div>
                <div class="button" @click="openFile">打开文件夹</div>
              </div>
            </div>
            <div
              class="transformation"
              ref="transformation"
              @click="transformation"
            >
              <span>{{ form.speedOfProgress == 0 ? "转换" : "" }}</span>
              <div class="allocationItem" ref="allocation" v-show="isRun">
                {{ form.speedOfProgress + "%" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="obs" v-show="type == 2">
        <div class="obsButton" @click="saveObs">{{ label }}</div>
        <div class="obsList" v-if="objList.length>0">
          <div class="obsItem" v-for="item in objList" :key="item.id">
            <div class="obsItemLeft">
              <div class="set" @click="set(item)">设置</div>
              <div style="color: red">{{ item.createTime }}</div>
              <div>{{ item.name }}</div>
            </div>
            <div class="obsItemLeft">
              <div class="download" @click="download(item)">下载</div>
              <div class="del" @click="handleDel(item)">删除</div>
            </div>
          </div>
        </div>
         <el-pagination
          v-if="userSettingList.length > 5"
          layout="prev, pager, next"
          class="text-center"
          :total="userSettingList.length"
          :page-size="5"
          @current-change="(e) => currentChange(e)"
        ></el-pagination>
        <div class="currentlyUnavailable" v-if="userSettingList.length==0">
          <img src="@/assets/zwsj.png" alt="">
        </div>
      </div>
    </div>
    <EditSetting ref="editSetting"></EditSetting>
  </div>
</template>

<script>
import ipcUtil from "@/ipc";
import feedback from "@/utils/feedback";
import {
  upload,
  getList,
  getClassification,
  saveClassification,
  getUserClassification,
  getSystemSettingList,
  useDebug,
  userMusic,
} from "@/api/user";
import { del } from "@/api/user";
import EditSetting from "@/views/dialog/EditSetting.vue";
import { getDay } from "@/utils/index";
export default {
  name: "upload", //上传
  components: { EditSetting },
  data() {
    return {
      form: {
        input: "",
        name: "",
        path: "",
        time: "",
        size: "",
        dpi: "",
        format: "webm",
        bitrate: 6000,
        speedOfProgress: 0,
      },
      videoFile: false,
      isRun: false,
      type: 1,
      label: "保存当前OBS数据",
      isObsUpload: false, //是否正在上传
      objList: [],
      userSettingList: [],
    };
  },
  mounted() {
    window.ipc.on("speedOfProgress", this.speedOfProgress);
    this.getLocalProfiles();
  },
  methods: {
    speedOfProgress(e, data) {
      if (data.code == 202) {
        this.form.speedOfProgress = Number(data.progress);
        this.$refs.allocation.style.width = Math.round(data.progress) + "%";
      } else if (data.code == 201) {
        feedback.msgWarning("码率不匹配,请重新设置码率");
        this.isRun = false;
      } else {
        this.$refs.transformation.style.background = "#0d99ff";
        this.form.speedOfProgress = 0;
        feedback.msgSuccess("转换成功");
        this.isRun = false;
      }
    },
    uploadType(type) {
      this.$router.push({ name: "uploadFrom", query: { cid: type } });
    },
    async addFile() {
      // 查询插件是否存在
      const setting = ipcUtil.getStore("setting");
      let ffmpeg = setting.resourcesPath + "\\" + "ffmpeg.exe";
      let flag = await ipcUtil.isAccess(ffmpeg);
      if (!flag) {
        feedback.msgWarning("第一次转换视频需要下载插件,请稍等~");
        const rel = await ipcUtil.uploadChineseFile(
          "https://resource.yuantiaoshi.com/pluginResources/ffmpeg.exe",
          ffmpeg
        );
        if (rel.percentage == 100) {
          feedback.msgSuccess("下载完成,请选择需要转换的视频~");
          // 配置ffmpeg
          window.ipc.send("setFfmpeg", { ffmpeg });
        } else {
          feedback.msgWarning("下载失败~");
        }
      } else {
        // 配置ffmpeg
        window.ipc.send("setFfmpeg", { ffmpeg });
      }
      ipcUtil.selectFile(async (res) => {
        this.form.input = res.data;
        const { path, fileName } = this.getPathAndFilename(res.data);
        this.form.name = fileName;
        this.form.path = path;
        const videoElement = document.createElement("video");
        videoElement.src = this.form.input;
        videoElement.addEventListener("loadedmetadata", () => {
          this.form.time = Math.ceil(videoElement.duration);
          this.form.dpi =
            videoElement.videoWidth + "*" + videoElement.videoHeight;
        });
        const rel = await window.ipc.invoke("getVideoInfo", {
          input: this.form.input,
        });
        if (rel) {
          this.form.size = Math.ceil(rel / 1024 / 1024);
        }
        this.videoFile = true;
      });
    },
    // 拆分文件名
    getPathAndFilename(fullPath) {
      let pos = fullPath.lastIndexOf("\\");
      let fileName = fullPath.substr(pos + 1);
      let filePath = fullPath.substr(0, pos);
      return { fileName, path: filePath };
    },
    // 打开文件夹
    openFile() {
      ipcUtil.openDir(this.form.path);
    },
    changeFile() {
      ipcUtil.selectDir(this.form.path, (res) => {
        this.form.path = res.data;
      });
    },
    transformation() {
      if (this.isRun) {
        feedback.msgSuccess("真正转换,请稍等");
        return;
      }
      this.$refs.transformation.style.background = "#fff";
      this.isRun = true;
      window.ipc.send("conversion", this.form);
    },
    changeType(type) {
      this.type = type;
    },
    async saveObs() {
      if (!this.$root.authority()) {
        this.$bus.$emit("isShowVip");
        feedback.msgWarning("需要充值会员,才可以使用", {
          customClass: "topRi",
        });
        return;
      }
      const obsConfig = this.$root.obs.config;
      if (obsConfig) {
        this.isObsUpload = true;
        this.label = "整理配置...";
        ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
          this.$root.obs.pid = pid;
          ipcUtil.stopObs(pid);
        });
        // 等待关闭OBS
        let loopCount = 0;
        let count = 0;
        let loop1 = setInterval(() => {
          ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
            this.$root.obs.pid = pid;
            if (pid.length == 0) {
              clearInterval(loop1);
              if (count > 0) {
                return;
              }
              count++;

              ipcUtil.upload(
                { obs: obsConfig },
                (res) => {
                  if (res.status == "moved") {
                    this.label = "压缩中...";
                  } else if (res.status == "ziped") {
                    ipcUtil.startObs(this.$root.obs.path);
                    this.label = "上传中...";
                  } else if (res.status == "success") {
                    this.label = "保存当前OBS数据";
                    this.isObsUpload = false;
                    if (res.res.code == 200) {
                      let size = parseInt(res.res.data.size / 1024 / 1024);
                      let setting = res.res.data.url;
                      upload({
                        size,
                        setting,
                        type: 1,
                        name: res.name,
                        scene: res.scene.replace(".", ""),
                        tag: (ipcUtil.getStore("propsList") || [])
                          .sort()
                          .join(""),
                      }).then((uploadRes) => {
                        console.log(uploadRes,'uploadRes');
                        if (uploadRes.data.code == 200) {
                          ipcUtil.setStore(
                            "upload",
                            parseInt(Date.now() / 1000)
                          );
                          this.getLocalProfiles();
                          feedback.msgSuccess("上传成功");
                        }
                      });
                    }
                  } else if (res.status == "oversized") {
                    const setting = ipcUtil.getStore("setting") || {};
                    console.log("[ setting ] >", setting);
                    ipcUtil.moveDebugFile(
                      res.path,
                      setting.allocationPath,
                      [res.name, res.scene].join("###"),
                      (moveFileRes) => {
                        if (moveFileRes.status == "success") {
                          this.label = "保存当前OBS数据";
                          this.isObsUpload = false;
                          feedback.msgSuccess("导出成功");
                          // 打开目录
                          ipcUtil.openDir(setting.allocationPath);
                        } else if (moveFileRes.status == "progress") {
                          if (this.label.startsWith("上传中")) {
                            this.label = `上传中... ${moveFileRes.data}%`;
                          }
                        }
                      }
                    );
                    // }
                    // });
                  } else if (res.status == "progress") {
                    if (this.label.startsWith("压缩中")) {
                      this.label = `压缩中... ${res.data}%`;
                    }
                  } else if (res.status == "handlePercentage") {
                    this.label = "上传中..." + res.progress + "%";
                    this.loadedSize = (res.loadedSize / 1024 / 1024).toFixed(1);
                  } else {
                    this.label = "保存当前OBS数据";
                    this.isObsUpload = false;
                    ipcUtil.log("error", res);
                  }
                },
                1
              );
            }
            if (loopCount > 20) {
              clearInterval(loop1);
              this.label = "保存当前OBS数据";
              this.isObsUpload = false;
            }
            loopCount++;
          });
        }, 500);
      }
    },
    async getLocalProfiles() {
      const res = await getList({ type: 1 });
      console.log(res);
      if (res.data.code == 200) {
        this.userSettingList = res.data.data.userSettingList;
        this.userSettingList.forEach((item) => {
          item.time = getDay(item.createTime * 1000, "MM/dd");
          item.createTime = getDay(item.createTime * 1000);
        });
        this.currentChange(1);
      }
    },
    currentChange(pageNo) {
      this.objList = this.userSettingList.slice((pageNo-1) * 5, pageNo * 5);
    },
    set(obj) {
      this.$refs.editSetting.visible = true;
      this.$refs.editSetting.id = obj.id;
      this.$refs.editSetting.name = obj.name;
      this.$refs.editSetting.createTime = obj.createTime;
      this.$refs.editSetting.isTop = obj.isFirst;
      this.$refs.editSetting.setting = obj.setting;
      this.$refs.editSetting.size = obj.size;
    },
    // 下载
    async download(item) {
      let { allocationPath } = ipcUtil.getStore("setting");
      let basePath = allocationPath + "\\" + item.name + ".zip";
      const res = await ipcUtil.uploadChineseFile(item.setting, basePath);
    },
    // 删除
    handleDel(item) {
      del({ id: item.id }).then((res) => {
        if (res.data.code == 200) {
          this.getLocalProfiles();
          feedback.msgSuccess("删除成功~");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  color: var(--fc);
  .typeList {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .typeItem {
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 16px;
      cursor: pointer;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 700;
      /deep/ .iconfont {
        font-size: 45px;
        font-weight: 400;
      }
      &:hover {
        background: #409eff;
        color: #000;
      }
    }
  }
  .seizeASeat {
    width: 100%;
    height: 340px;
    margin-bottom: 46px;
    background: var(--secondLevel);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    .left {
      width: 126px;
      height: 100%;
      background: var(--a);
      padding: 20px 0;
      box-sizing: border-box;

      div {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
      }
      .action {
        background: #409eff;
        color: #fff;
      }
    }
    .video,
    .obs {
      width: calc(100% - 126px);
      height: 100%;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      &:hover{
        .addText{
          color: #409eff;
        }
      }
      .add {
        width: 120px;
        height: 120px;
        margin-top: 62px;
        margin-bottom: 16px;
        cursor: pointer;
      }
      .step {
        width: 438px;
        height: 26px;
        margin-top: 54px;
      }
      .fileItem {
        width: 700px;
        height: 100px;
        margin: 20px;
        background: var(--a);
        border-radius: 9px;
        display: flex;
        
        overflow: hidden;
        .tp {
          height: 100%;
        }
        .transformation {
          width: 24px;
          height: 24px;
          margin: 0 20px;
        }
        .title {
          margin-top: 17px;
          margin-left: 8px;
        }
        .text {
          margin-left: 8px;
          margin-top: 8px;
          display: flex;
          font-size: 12px;
          align-items: center;
          // width: 400px;
          // justify-content: space-between;
          span {
            display: inline-block;
            width: 110px;
            margin-bottom: 8px;
          }
        }
      }
      .config {
        width: 100%;
        padding: 0 22px;
        margin-top: 100px;
        box-sizing: border-box;
        display: flex;
        .transformation {
          width: 108px;
          height: 40px;
          background: #0d99ff;
          color: #fff;
          text-align: center;
          line-height: 40px;
          border-radius: 6px;
          margin-top: 46px;
          margin-left: 42px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          .allocationItem {
            position: absolute;
            top: 0;
            left: 0;
            background: #409eff;
            height: 40px;
            width: 0%;
            z-index: 99;
            color: #fff;
          }
        }
        .toConfigure {
          .output {
            margin-left: 16px;
            display: inline-block;
          }
          /deep/ .el-radio {
            font-weight: 700;
            color: #000;
            .el-radio__label {
              width: 30px;
              display: inline-block;
            }
          }
        }
        .videoBitrate {
          position: relative;
          margin-top: 8px;
          .input {
            width: 88px;
            height: 24px;
            margin-left: 12px;
          }
          /deep/ .el-input__inner {
            width: 88px;
            height: 24px;
          }
        }
        .outputPath {
          display: flex;
          margin-top: 8px;
          .lab {
            width: 70px;
          }
          /deep/ .el-input__inner {
            width: 320px;
            height: 24px;
          }
          /deep/ .disabled {
            width: 320px;
            height: 24px;
          }
          .button {
            font-size: 10px;
            border: 1px solid #000;
            text-align: center;
            line-height: 24px;
            padding: 0 8px;
            margin: 0 8px;
            border-radius: 3px;
            cursor: pointer;
          }
        }
      }
    }
    .obsButton {
      width: 122px;
      height: 30px;
      font-size: 12px;
      margin-top: 20px;
      margin-left: 32px;
      background: #0d99ff;
      color: #fff;
      text-align: center;
      line-height: 30px;
      border-radius: 9px;
      cursor: pointer;
    }
    .currentlyUnavailable{
      width: 100%;
      height: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 188px;
        height: 108px;
      }
    }
    .obsList {
      height: 235px;
      width: 692px;
      margin-left: 32px;
      margin-top: 12px;
      overflow: hidden;
      .obsItem {
        // width: 100%;
        height: 40px;
        background: var(--a);
        border-radius: 9px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        padding: 0 8px;
        .obsItemLeft {
          display: flex;
          font-size: 12px;
          align-items: center;
          font-weight: 700;
          .set {
            width: 44px;
            height: 24px;
            background: #eaf5ff;
            color: #0d99ff;
            line-height: 24px;
            text-align: center;
            cursor: pointer;
            border-radius: 3px;
            margin-right: 8px;
          }
        }
        .download {
          width: 52px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #eaf5ff;
          border-radius: 3px;
          margin-right: 12px;
          cursor: pointer;
          color: #000;
        }
        .del {
          width: 52px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          color: #fff;
          background: #0d99ff;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>