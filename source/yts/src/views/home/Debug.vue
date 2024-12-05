<template>
  <div class="debug">
    <div :class="'setting ' + mode" id="debug">
      <div class="panel" v-if="panel">
        <i class="el-icon-close close" @click="handlePanelClose"></i>
        <div class="list1">
          <span class="title">电脑设备</span>
          <span class="info">CPU：{{ deviceInfo.cpu }}</span>
          <div class="info">
            GPU：
            <div
              v-for="(item, index) in deviceInfo.gpu"
              :key="item"
              v-show="index !== 0"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="list2">
          <span class="title">直播方式</span>
          <div class="items">
            <div
              class="item"
              :class="item.id == selectedList[0] ? 'submit' : ''"
              v-for="(item, index) in panelList1"
              :key="index"
              @click="handleClickPropsItem(item.id, 2)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="list2">
          <span class="title">具体设备</span>
          <div class="items">
            <div
              class="item"
              :class="item.id == selectedList[1] ? 'submit' : ''"
              v-for="(item, index) in panelList2"
              :key="index"
              @click="handleClickPropsItem(item.id, 3)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="list2">
          <span class="title">采集方式</span>
          <div class="items">
            <div
              class="item"
              :class="item.id == selectedList[2] ? 'submit' : ''"
              v-for="(item, index) in panelList3"
              :key="index"
              @click="handleClickPropsItem(item.id, 4)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="buttons">
          <div class="button" @click="handlePanelClose">取消</div>
          <div class="button submit" @click="handlePanelSubmit">确定</div>
        </div>
      </div>
      <div class="hearder">
        <el-tooltip
          class="item"
          effect="light"
          content="一键调试前选择好参数，可以查看电脑配置"
          placement="bottom"
        >
          <div class="props" @click="handleSetProps">参数设置</div>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="light"
          content="保存当前obs所有设置，大于1GB会保存在电脑本地"
          placement="bottom"
        >
          <div class="upload" @click="handleUpload">
            <div>保存OBS</div>
            <div>所有数据</div>
          </div>
        </el-tooltip>
      </div>
      <el-tooltip
        class="item"
        effect="light"
        content="参数设置后在右下方选择配置调试"
        placement="bottom"
      >
        <div class="control" @click="handleClick" id="#step2">
          <div style="font-weight: 600">{{ label }}</div>
          <div v-if="loadedSize" class="loadedSize">
            大小:{{ loadedSize }}MB
          </div>
          <div class="config">PS:参数设置后一键调试</div>
        </div>
      </el-tooltip>

      <div class="set">
        <div class="mine">
          <el-tooltip
            class="item"
            effect="light"
            content="保存过obs配置后选择一个再一键调试"
            placement="top"
          >
            <span style="font-weight: 600">我的配置</span>
          </el-tooltip>

          <el-select
            v-model="locate"
            size="mini"
            placeholder="请选择"
            :class="disabledA ? 'selected' : ''"
            clearable
            :key="key"
            @focus="handleClickSelect('a')"
            :disabled="disabled"
            popper-class="mine-select-dropdown"
          >
            <template v-if="locateProfiles.length > 0">
              <el-option
                :value="index"
                :label="item.name"
                v-for="(item, index) in locateProfiles"
                :key="index"
              >
                <div
                  class="span-item"
                  @contextmenu.prevent.stop="handleClickItem(index)"
                >
                  <span class="set" @click.stop="handleClickItem(index)"
                    >设置</span
                  >
                  <span v-if="item.isFirst == 1" style="color: #fcf03f"
                    >置</span
                  >
                  <span style="color: red">{{ item.time }}</span>
                  <span>{{ item.name }}</span>
                </div>
              </el-option>
              <el-option
                :value="-1"
                label="导入配置"
                :key="-1"
                class="importConfiguration"
              >
                <div class="upload" @click="handleClickDebug('导入配置')">
                  <i class="el-icon-upload"></i>
                  导入配置
                  <div class="progress">
                    <el-progress
                      :percentage="percentage"
                      :show-text="false"
                    ></el-progress>
                  </div>
                  <div class="limit">{{ allSize }}GB/2GB</div>
                </div>
              </el-option>
            </template>
            <template v-if="locateProfiles.length == 0">
              <el-option
                v-for="(item, index) in [
                  { name: '无数据' },
                  { name: '导入配置' },
                ]"
                :value="null"
                :name="item.name"
                :key="index"
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  content="选择配置上传到电脑本地的文件可自动调试"
                  placement="bottom"
                  :disabled="item.name != '导入配置'"
                >
                  <div
                    :class="item.name == '导入配置' ? 'upload' : 'span-item'"
                    @click="handleClickDebug(item.name)"
                    @contextmenu.prevent.stop="handleClickItem(index)"
                  >
                    <i
                      class="el-icon-upload"
                      v-if="item.name == '导入配置'"
                    ></i>
                    {{ item.name }}

                    <div class="progress">
                      <el-progress
                        :percentage="percentage"
                        :show-text="false"
                      ></el-progress>
                    </div>
                    <div class="limit">{{ allSize }}GB/2GB</div>
                  </div>
                </el-tooltip>
              </el-option>
            </template>
          </el-select>
        </div>
        <div class="choose">
          <span style="font-weight: 600">选择系统默认配置</span>
          <el-select
            v-model="remote"
            size="mini"
            placeholder="请选择"
            :class="disabledB ? 'selected' : ''"
            clearable
            :key="key"
            @focus="handleClickSelect('b')"
            :disabled="disabled"
            popper-class="select-dropdown"
          >
            <el-option
              :value="index"
              :label="item.name"
              v-for="(item, index) in remoteProfiles"
              :key="index"
            >
              <span style="font-size: 12px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-tooltip
      class="item"
      effect="light"
      content="推流成功后可以打开音效软件辅助直播"
      placement="bottom"
    >
      <div class="course" @click="handleAudio" id="course">
        <span>打开音效软件</span>
      </div>
    </el-tooltip>
    <edit-setting ref="editSetting"></edit-setting>
  </div>
</template>

<script>
import ipcUtil from "@/ipc";
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
import feedback from "@/utils/feedback";
import EditSetting from "@/views/dialog/EditSetting.vue";
import { list } from "@/api/article";
import { getDay } from "@/utils/index";
export default {
  components: { EditSetting },
  data() {
    return {
      locateProfiles: [],
      locate: "",
      remoteProfiles: [],
      remote: "",
      label: "OBS 一键调试",
      count: 0,
      mode: "start0",
      disabledA: true,
      disabledB: false,
      // 禁用所有select
      disabled: false,
      key: 0,
      panel: false,
      // panelList: props,
      panelList1: [], //参数配置的树形结构
      panelList2: [], //第二级
      panelList3: [], //第三级
      selectedList: [], //被选中的
      propsList: [],
      deviceInfo: {},
      allSize: 0,
      loadedSize: 0,
    };
  },
  async mounted() {
    this.propsList = ipcUtil.getStore("propsList") || [];
    this.getLocalProfiles();
    this.getRemoteProfiles();
  },
  computed: {
    percentage() {
      return (this.allSize / 2) * 100;
    },
  },
  methods: {
    handleClickDebug(name = "") {
      if (!this.$root.authority()) {
        this.$bus.$emit("isShowVip");
        feedback.msgWarning("需要充值会员,才可以使用", {
          customClass: "topRi",
        });
        return;
      }
      if (name == "导入配置") {
        ipcUtil.selectFile((res) => {
          if (res.data) {
            let name = res.name.split("###");
            this.label = "调试中...";
            this.mode = "start1";
            ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
              this.$root.obs.pid = pid;
              ipcUtil.stopObs(pid);
            });
            // 等待关闭OBS
            let loopCount = 0;
            let loop1 = setInterval(() => {
              ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
                this.$root.obs.pid = pid;
                if (pid.length == 0) {
                  clearInterval(loop1);
                  // 开始调试
                  ipcUtil.debug(
                    res.data,
                    this.$root.obs.config,
                    name[0],
                    this.$root.obs.path,
                    "utf-8",
                    async (res2) => {
                      if (res2 && res2.status == "success") {
                        ipcUtil.startObs(this.$root.obs.path);
                        this.$root.websocket.connect = false;
                        this.$root.obs.pid = -1;
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
                                if (
                                  message.currentProfileName != name[0] &&
                                  message.profiles.indexOf(name[0]) != -1
                                ) {
                                  this.$root.obsHandle.call(
                                    "SetCurrentProfile",
                                    {
                                      profileName: name[0],
                                    }
                                  );
                                }
                              });
                            const sceneName = name[1] ?? name[0];
                            this.$root.obsHandle
                              .call("GetSceneCollectionList")
                              .then((message) => {
                                console.log(message);
                                if (
                                  message.currentSceneCollectionName !=
                                    sceneName &&
                                  message.sceneCollections.indexOf(sceneName) !=
                                    -1
                                ) {
                                  this.$root.obsHandle.call(
                                    "SetCurrentSceneCollection",
                                    { sceneCollectionName: sceneName }
                                  );
                                }
                              });
                            this.stop();
                            clearInterval(loop);
                          }
                          if (this.count > 50) {
                            this.stop();
                            clearInterval(loop);
                          }
                        }, 500);
                      } else if (res2 && res2.status == "notCompliant") {
                        feedback.msgWarning("此配置暂不支持从这里导入~");
                        this.stop();
                      } else {
                        this.stop();
                      }
                    }
                  );
                }
                if (loopCount > 10) clearInterval(loop1);
                loopCount++;
              });
            }, 500);
          }
        });
      }
    },
    async getLocalProfiles() {
      getList().then((res) => {
        if (res?.data.code == 200) {
          console.log(res.data);
          this.allSize = (res.data.data.allSize / 1024).toFixed(1);
          this.locateProfiles = res.data.data.userSettingList;
          this.itemShow = [];
          this.locateProfiles.forEach((item) => {
            item.time = getDay(item.createTime * 1000, "MM/dd");
            item.createTime = getDay(item.createTime * 1000);
            this.itemShow.push(false);
          });
          // console.log("[ res.data ] >", this.locateProfiles);
        }
      });
    },
    async getRemoteProfiles() {
      const list = await getSystemSettingList();
      const rel = await getUserClassification();
      let tag = null;
      if (rel.status == 200) {
        tag = rel.data.data.id;
      }
      let newList = [];
      if (list.status == 200) {
        list.data.data.forEach((item) => {
          if (item.tagid == tag) {
            newList.push(item);
          }
        });
      }
      this.remoteProfiles = newList;
    },
    stop() {
      this.label = "OBS 一键调试";
      this.count = 0;
      this.mode = "start0";
      // console.log("error");
    },
    // 点击一键调试
    async handleClick() {
      if (!this.$root.authority()) {
        this.$bus.$emit("isShowVip");
        feedback.msgWarning("需要充值会员,才可以使用", {
          customClass: "topRi",
        });
        return;
      }
      await useDebug();
      if (this.locate !== "" && this.disabledB) {
        this.handleLocateClick(this.locateProfiles[this.locate]);
      } else if (this.remote !== "" && this.disabledA) {
        this.handleRemoteClick(this.remoteProfiles[this.remote]);
      } else {
        feedback.msgWarning("选择配置后再点一键调试", {
          customClass: "topLeft",
        });
      }
    },
    async handleLocateClick(info) {
      // 1. 下载配置文件
      // 3. 移动到OBS配置目录
      // 4. websocket修改配置
      this.label = "下载中...";
      this.mode = "start1";
      // 新方案
      if (this.$root.websocket.connect) {
        let flag = await this.CreateProfile(info);
        console.log("[ flag ] >", flag);
        if (!flag) {
          feedback.msgWarning(
            "OBS中已包含要导入的配置文件或场景列表,请到OBS重命名名后重试"
          );
          return;
        }
      }
      // 下载压缩包
      ipcUtil.downloadFile(
        info.setting,
        (file) => {
          // 下载进度条
          this.$bus.$emit("progress", file);
        },
        (res1) => {
          this.$bus.$emit("success", res1);
          // 开始调试
          ipcUtil.debug(
            res1.path,
            this.$root.obs.config,
            info.name,
            this.$root.obs.path,
            "utf-8",
            async (res2) => {
              if (res2 && res2.status == "success") {
                // 查看服务器字体列表
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
                    info.scene,
                    (res) => {
                      ipcUtil.log("字体安装成功");
                    }
                  );
                }
                // 新方案
                if (this.$root.websocket.connect) {
                  this.newDebugging(info);
                  return;
                }
                ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
                  this.$root.obs.pid = pid;
                  ipcUtil.stopObs(pid);
                });
                let count = 0;
                let loop1 = setInterval(() => {
                  ipcUtil
                    .getObsStatus(this.$root.obs.path)
                    .then(async (pid) => {
                      this.$root.obs.pid = pid;
                      if (pid.length == 0) {
                        if (count > 0) {
                          return;
                        }
                        count++;
                        clearInterval(loop1);
                        // 启动OBS
                        ipcUtil.startObs(this.$root.obs.path);
                        this.$root.websocket.connect = false;
                        this.$root.obs.pid = -1;
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
                                if (
                                  message.currentProfileName != info.name &&
                                  message.profiles.indexOf(info.name) != -1
                                ) {
                                  this.$root.obsHandle.call(
                                    "SetCurrentProfile",
                                    {
                                      profileName: info.name,
                                    }
                                  );
                                }
                              });
                            this.$root.obsHandle
                              .call("GetSceneCollectionList")
                              .then((message) => {
                                if (
                                  message.currentSceneCollectionName !=
                                    info.name &&
                                  message.sceneCollections.indexOf(info.name) !=
                                    -1
                                ) {
                                  this.$root.obsHandle.call(
                                    "SetCurrentSceneCollection",
                                    { sceneCollectionName: info.name }
                                  );
                                }
                              });
                            this.stop();
                            clearInterval(loop);
                          }
                          if (this.count > 50) {
                            this.stop();
                            clearInterval(loop);
                          }
                        }, 500);
                      }
                    });
                }, 500);
              } else {
                this.stop();
              }
            }
          );
        }
      );
    },
    async handleRemoteClick(info) {
      // 1. 下载配置文件
      // 3. 移动到OBS配置目录
      // 4. websocket修改配置
      this.label = "调试中...";
      this.mode = "start1";
      // 新方案
      if (this.$root.websocket.connect) {
        let flag = await this.CreateProfile(info);
        if (!flag) {
          feedback.msgWarning(
            "OBS中已包含要导入的配置文件或场景列表,请到OBS重命名名后重试"
          );
          return;
        }
      }
      ipcUtil.downloadFile(
        info.url,
        (file) => {
          // 下载进度条
          this.$bus.$emit("progress", file);
        },
        (res1) => {
          if (res1) {
            this.$bus.$emit("success", res1);

            ipcUtil.debug(
              res1.path,
              this.$root.obs.config,
              info.resources,
              this.$root.obs.path,
              "gbk",
              async (res2) => {
                if (res2 && res2.status == "success") {
                  // 开始调试
                  // 查看服务器字体列表
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
                      info.resources,
                      (res) => {
                        ipcUtil.log("字体安装成功");
                      }
                    );
                  }
                  // 新方案
                  if (this.$root.websocket.connect) {
                    this.newDebugging(info);
                    return;
                  }
                  ipcUtil.getObsStatus(this.$root.obs.path).then((pid) => {
                    this.$root.obs.pid = pid;
                    ipcUtil.stopObs(pid);
                  });
                  let count = 0;
                  let loop1 = setInterval(() => {
                    ipcUtil
                      .getObsStatus(this.$root.obs.path)
                      .then(async (pid) => {
                        this.$root.obs.pid = pid;
                        if (pid.length == 0) {
                          if (count > 0) {
                            return;
                          }
                          count++;
                          clearInterval(loop1);

                          ipcUtil.startObs(this.$root.obs.path);
                          this.$root.websocket.connect = false;
                          this.$root.obs.pid = -1;
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
                                    message.currentProfileName !=
                                      info.profile &&
                                    message.profiles.indexOf(info.profile) != -1
                                  ) {
                                    this.$root.obsHandle.call(
                                      "SetCurrentProfile",
                                      {
                                        profileName: info.profile,
                                      }
                                    );
                                  }
                                });
                              this.$root.obsHandle
                                .call("GetSceneCollectionList")
                                .then((message) => {
                                  if (
                                    message.currentSceneCollectionName !=
                                      info.scene &&
                                    message.sceneCollections.indexOf(
                                      info.scene
                                    ) != -1
                                  ) {
                                    this.$root.obsHandle.call(
                                      "SetCurrentSceneCollection",
                                      { sceneCollectionName: info.scene }
                                    );
                                  }
                                });
                              this.stop();
                              clearInterval(loop);
                            }
                            if (this.count > 50) {
                              this.stop();
                              clearInterval(loop);
                            }
                          }, 500);
                        }
                      });
                  }, 500);
                } else {
                  this.stop();
                }
              }
            );
          } else {
            this.stop();
          }
        }
      );
    },
    // 连接obs后一键调试方案
    async newDebugging(info) {
      let count = 0;
      let loop = setInterval(() => {
        if (this.$root.websocket.connect) {
          count++;
          this.$root.obsHandle.call("GetProfileList").then((message) => {
            if (
              message.currentProfileName != info.name &&
              message.profiles.indexOf(info.name) != -1
            ) {
              this.$root.obsHandle.call("SetCurrentProfile", {
                profileName: info.name,
              });
            }
          });
          this.$root.obsHandle
            .call("GetSceneCollectionList")
            .then((message) => {
              if (
                message.currentSceneCollectionName != info.name &&
                message.sceneCollections.indexOf(info.name) != -1
              ) {
                this.$root.obsHandle.call("SetCurrentSceneCollection", {
                  sceneCollectionName: info.name,
                });
              }
            });
          this.stop();
          clearInterval(loop);
        }
        if (count > 10) {
          this.stop();
          clearInterval(loop);
        }
      }, 500);
    },
    // 切换配置与新创建配置
    async CreateProfile(info) {
      const { currentSceneCollectionName, sceneCollections } =
        await this.$root.obsHandle.call("GetSceneCollectionList");
      const { currentProfileName, profiles } = await this.$root.obsHandle.call(
        "GetProfileList"
      );
      // 如果obs中已经有当前名字的
      if (
        profiles.includes(info.name) ||
        sceneCollections.includes(info.name)
      ) {
        this.stop();
        return false;
      } else {
        await this.$root.obsHandle.call("CreateProfile", {
          profileName: info.name,
        });
        await this.$root.obsHandle.call("CreateSceneCollection", {
          sceneCollectionName: info.name,
        });
      }
      // 随机切换一个
      await this.$root.obsHandle.call("SetCurrentProfile", {
        profileName: profiles[0],
      });
      // 随机切换一个
      await this.$root.obsHandle.call("SetCurrentSceneCollection", {
        sceneCollectionName: sceneCollections[0],
      });
      return true;
    },
    async handleUpload() {
      if (!this.$root.authority()) {
        this.$bus.$emit("isShowVip");
        feedback.msgWarning("需要充值会员,才可以使用", {
          customClass: "topRi",
        });
        return;
      }
      if (this.allSize >= 2) {
        feedback.msgWarning("最多只能上传2GB的配置", {
          customClass: "topRi",
        });
        return;
      }
      const rel = await getUserClassification();
      if (rel.status == 200) {
        const id = rel.data.data.id;
        const obsConfig = this.$root.obs.config;
        if (obsConfig && !this.label.startsWith("调试中")) {
          this.disabled = true;
          this.mode = "start1";
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
              console.log("[ pid ] >", pid);
              if (pid.length == 0) {
                clearInterval(loop1);
                if (count > 0) {
                  return;
                }
                count++;

                ipcUtil.upload({ obs: obsConfig }, (res) => {
                  if (res.status == "moved") {
                    this.label = "压缩中...";
                  } else if (res.status == "ziped") {
                    ipcUtil.startObs(this.$root.obs.path);
                    this.label = "上传中...";
                  } else if (res.status == "success") {
                    if (this.allSize + this.loadedSize / 1024 >= 2) {
                      feedback.msgWarning("最多只能上传2GB的配置", {
                        customClass: "topRi",
                      });
                      this.loadedSize = 0;
                      this.label = "OBS 一键调试";
                      this.mode = "start0";
                      this.disabled = false;
                      this.locateProfiles = this.locateProfilesT;
                      return;
                    }
                    this.loadedSize = 0;
                    this.label = "OBS 一键调试";
                    this.mode = "start0";
                    this.disabled = false;
                    this.locateProfiles = this.locateProfilesT;
                    if (res.res.code == 200) {
                      let size = parseInt(res.res.data.size / 1024 / 1024);
                      let setting = res.res.data.url;
                      upload({
                        size,
                        setting,
                        name: res.name,
                        scene: res.scene.replace(".", ""),
                        tag: (ipcUtil.getStore("propsList") || [])
                          .sort()
                          .join(""),
                      }).then((uploadRes) => {
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
                    // ipcUtil.selectDir(null, (dirRes) => {
                    // if (dirRes.data) {
                    const setting = ipcUtil.getStore("setting") || {};
                    console.log("[ setting ] >", setting);
                    ipcUtil.moveDebugFile(
                      res.path,
                      setting.allocationPath,
                      [res.name, res.scene].join("###"),
                      (moveFileRes) => {
                        if (moveFileRes.status == "success") {
                          this.label = "OBS 一键调试";
                          this.mode = "start0";
                          this.disabled = false;
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
                    this.label = "OBS 一键调试";
                    this.mode = "start0";
                    this.disabled = false;
                    ipcUtil.log("error", res);
                  }
                });
              }
              if (loopCount > 20) {
                clearInterval(loop1);
                this.label = "OBS 一键调试";
                this.mode = "start0";
                this.disabled = false;
              }
              loopCount++;
            });
          }, 500);
        }
      }
    },
    async handleAudio() {
      if (!this.$root.store.isTourist) {
        await userMusic();
        this.$router.push({ name: "audio" });
      } else {
        feedback.msgWarning("游客不能使用", { customClass: "topRi" });
      }
    },
    async handleSetProps() {
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用", { customClass: "topRi" });
        return;
      }
      this.panel = true;
      this.$parent.isChatShow = false;
      this.deviceInfo = await ipcUtil.getDeviceInfo();
      const res = await getClassification();
      if (res.status == 200) {
        this.panelList1 = res.data.data;
      }
      //   获取用户的参数配置
      const rel = await getUserClassification();
      if (rel.status == 200) {
        const id = rel.data.data.id ?? 25;
        // 扁平化
        const data = this.flatTreeData(this.panelList1);
        // 查找所有父id
        this.selectedList = this.findClass(data, id);
        data.forEach((item) => {
          if (this.selectedList[0] == item.id) {
            this.panelList2 = item.children;
          } else if (this.selectedList[1] == item.id) {
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
            res.unshift(id);
            if (item.parentId) {
              find(list, item.parentId);
            }
          }
        });
      }
      find(list, current);
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
    handlePanelClose() {
      this.panel = false;
    },
    async handlePanelSubmit() {
      if (!this.selectedList[2]) {
        this.$notify({
          message: this.$createElement("i", "请全部选完后提交"),
        });
        return;
      }
      this.locate = "";
      this.remote = "";
      ipcUtil.setStore("propsList", this.propsList);
      const data = {
        id: this.selectedList[2],
      };
      const res = await saveClassification(data);
      if (res.status == 200) {
        this.panel = false;
      }
    },
    // 点击分类
    handleClickPropsItem(id, level) {
      if (level == 2) {
        this.panelList3 = [];
        this.selectedList.splice(1, 2, null, null);
      }
      if (level == 3) {
        this.selectedList.splice(2, 1, null);
      }
      this.selectedList.splice(
        [level - 2],
        1,
        this["panelList" + [level - 1]].find((item) => item.id == id).id
      );
      if (level != 4) {
        this["panelList" + level] = this["panelList" + [level - 1]].find(
          (item) => item.id == id
        ).children;
      }
    },
    handleClickSelect(id) {
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用", { customClass: "topRi" });
        return;
      }
      if (id == "a") {
        this.disabledA = false;
        this.disabledB = true;
        this.getLocalProfiles();
      } else {
        this.disabledA = true;
        this.disabledB = false;
        this.getRemoteProfiles();
      }
    },
    handleClickItem(index) {
      this.$refs.editSetting.visible = true;
      this.$refs.editSetting.id = this.locateProfiles[index].id;
      this.$refs.editSetting.name = this.locateProfiles[index].name;
      this.$refs.editSetting.createTime = this.locateProfiles[index].createTime;
      this.$refs.editSetting.isTop = this.locateProfiles[index].isFirst;
      this.$refs.editSetting.setting = this.locateProfiles[index].setting;
      this.$refs.editSetting.size = this.locateProfiles[index].size;
    },
    format(percentage) {
      return percentage + "/2GB";
    },
  },
  watch: {
    locateProfiles: {
      handler(val) {
        // console.log(val);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input--suffix {
  height: 28px;
  width: 100px;
}
.upload {
  width: 190px;
  display: flex;
  align-items: center;
  position: relative;

  .progress {
    position: absolute;
    left: 100px;
    width: 50px;
    left: 80px;
    top: 14px;
  }
  .limit {
    position: absolute;
    left: 130px;
    font-size: 9px;
    margin-left: 4px;
  }
}
.action {
  border-top: 2px solid #000;
  width: 110px;
  font-size: 20px;
  font-weight: 600;

  font-size: 12px;
}
.start0 {
  background-color: #a0cfff;
}

.start1 {
  background-color: #fcf4b5;
}

.span-item {
  display: inline-block;
  width: 100%;
  .set {
    display: inline-block;
    width: 30px;
    height: 22px;
    border-radius: 4px;
    color: var(--fc);
    background: #a0cfff;
    text-align: center;
    margin-top: 5px;
    line-height: 22px;
  }
}

.debug {
  display: inline-block;
  width: 300px;
  margin-right: 36px;
  vertical-align: top;

  .setting {
    position: relative;
    height: 234px;
    width: 320px;
    margin-bottom: 12px;
    text-align: center;
    border: 1px solid #909399;
    border-radius: 20px;
    box-sizing: border-box;
    .hearder {
      width: 100%;
      display: flex;
      font-weight: 600;
      justify-content: space-between;
      padding: 0 5px;
      margin-top: 5px;
      box-sizing: border-box;
      .upload {
        cursor: pointer;
        top: 3px;
        user-select: none;
        font-size: 13px;
        letter-spacing: 2px;
        border: 1px solid #606266;
        border-radius: 20px;
        height: 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;

        &:hover {
          border: 2px solid #fdc4b3;
        }
        i {
          margin-right: 2px;
          vertical-align: middle;
        }
      }
      .props {
        cursor: pointer;
        user-select: none;
        font-size: 16px;
        letter-spacing: 2px;
        border: 1px solid #606266;
        border-radius: 20px;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 95px;
        &:hover {
          border: 2px solid #fdc4b3;
        }
        i {
          margin-right: 2px;
          vertical-align: middle;
        }
      }
    }
    .panel {
      position: absolute;
      // height: 280px;
      width: 460px;
      background-color: rgba($color: #ffffff, $alpha: 0.9);
      z-index: 10;
      border: 2px solid #333;
      border-radius: 20px;
      font-size: 18px;
      text-align: left;

      .close {
        display: inline-block;
        position: absolute;
        right: 8px;
        top: 8px;
        height: 30px;
        width: 30px;
        font-size: 18px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;

        &:hover {
          background-color: #ccc;
        }
      }

      .list1 {
        padding: 10px 0 5px 20px;

        .info {
          display: flex;
          flex-direction: column;
          margin-left: 8px;
          font-size: 14px;
        }
      }

      .list2 {
        margin-left: 20px;
        margin-right: 5px;
        padding-top: 5px;
        border-bottom: 2px solid #333;
      }

      .title {
        display: inline-block;
        width: 100px;
        vertical-align: top;
      }

      .items {
        display: inline-flex;
        width: 330px;
        flex-flow: row wrap;
      }

      .item {
        height: 28px;
        min-width: 70px;
        border: 2px solid #333;
        margin-left: 5px;
        margin-bottom: 5px;
        text-align: center;
        border-radius: 10px;
        font-size: 14px;
        line-height: 28px;
        cursor: pointer;
      }

      .buttons {
        bottom: 5px;
        padding: 20px;
        width: 100%;
        text-align: right;
        box-sizing: border-box;

        .button {
          display: inline-block;
          height: 28px;
          width: 70px;
          border: 2px solid #333;
          border-radius: 10px;
          text-align: center;
          font-size: 14px;
          line-height: 28px;
          margin-right: 10px;
        }
      }

      .submit {
        background-color: #7ad0fc;
      }
    }

    .control {
      cursor: pointer;
      position: relative;
      margin-top: 16px;
      display: inline-block;
      height: 80px;
      width: 180px;
      font-size: 22px;
      border: 2px solid #606266;
      border-radius: 20px;
      color: #303133;
      user-select: none;
      padding-top: 18px;
      box-sizing: border-box;
      .loadedSize {
        font-size: 10px;
        font-weight: 600;
      }
      &:hover {
        border: 2px solid #fdc4b3;
      }

      .config {
        font-size: 12px;
        // margin-top: 5px;
        color: #666;
      }
    }

    .set {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      box-sizing: border-box;
      margin-top: 8px;
      text-align: left;

      span {
        display: inline-block;
        font-size: 16px;
        margin-left: 2px;
        margin-bottom: 4px;
      }

      .mine {
        width: 120px;
        // height: 47px;
      }

      .choose {
        width: 140px;
        // height: 47px;
      }
      /deep/ .el-input--suffix {
        height: 48px;
      }
      /deep/ .selected .el-input__inner {
        background-color: #969696;
        cursor: not-allowed;
      }

      /deep/ .el-input__inner {
        height: 48px;
        width: 135px;
        border: 1.5px solid #333;
        border-radius: 16px;
        overflow: hidden;
        background-color: #fff;
        color: #333;
        &:hover {
          border: 2px solid #fdc4b3;
        }
        &::-webkit-input-placeholder {
          color: #333;
        }
      }

      /deep/ .el-input__suffix {
        right: -25px;
        top: 0px;
        .el-input__icon {
          color: #333;
        }
      }
    }
  }

  .course {
    height: 50px;
    width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background-image: var(--soundEffects);
    background-color: var(--soundEffects);
    cursor: pointer;
    border: 1px solid #909399;
    border-radius: 9px;
    box-sizing: border-box;
    &:hover {
      border: 2px solid #fdc4b3;
    }
    span {
      display: inline-block;
      font-size: 20px;
      color: #303133;
      line-height: 60px;
      user-select: none;
    }
  }
}
</style>

<style lang="scss">
.select-dropdown {
  width: 200px;
  border-radius: 20px;
  overflow: hidden;
}
.mine-select-dropdown {
  width: 200px;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  padding-bottom: 40px;
  .el-select-dropdown__item {
    padding: 0 14px !important;

    span {
      font-size: 12px !important;
    }
  }
  .el-select-dropdown {
    border: 2px solid #000 !important;
  }

  .el-scrollbar {
    overflow: visible;
    .el-select-dropdown__list {
      height: 165px;
      width: 195px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
      }
    }
    // width: 0px ;
    .el-select-dropdown__wrap {
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-select-dropdown__item {
      width: 195px;
    }
  }
  .importConfiguration {
    position: absolute;
    bottom: -40px;
    z-index: 9999;
  }
  .el-select-dropdown__list {
    border: none;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100px;
    width: 220px;
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom right, #b2b2b2 0%, #b2b2b2 100%);
      border-radius: 8px;
    }
  }

  .el-select-dropdown__item:last-child.hover {
    // background-color: var(--tgb);
    width: 100%;

    .action {
      background-color: var(--bgc);
    }
  }

  /* .el-select-dropdown__item:last-child {
      position: absolute;
      bottom: 0;
      background-color: var(--bgc);
    } */
}

.popper__arrow::after {
  border-bottom-color: #000 !important;
  top: -1px !important;
}
</style>
