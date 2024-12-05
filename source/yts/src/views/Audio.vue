<template>
  <div class="audio">
    <div class="audioMain">
      <div class="sidebarBox">
        <div class="class" @click="addClass" id="class">
          <i class="el-icon-circle-plus"></i>
          分类{{ classList.length }}
        </div>
        <vuedraggable
          v-model="classList"
          animation="1000"
          @end="classSortEnd"
          ghostClass="ghostClass"
          filter=".unmover"
          :move="onMove"
        >
          <transition-group class="sidebar">
            <div
              v-for="(item, index) in classList"
              :key="item.id"
              @click="clickClass(item)"
              :class="{
                action: choiceClass == item.id,
                unmover: item.isFirst == '1' || choiceClass != item.id,
              }"
              v-on:contextmenu="(e) => showClassMenu(e, item, index)"
            >
              {{ item.name }}
            </div>
          </transition-group>
        </vuedraggable>
      </div>
      <div class="audioBox">
        <div class="headerAudio">
          <div class="action">操作台</div>
          <div class="top" :class="isTop ? 'topAction' : ''" @click="changeTop">
            置顶
          </div>
          <div class="soundEffectAdd" @click="addList">新增</div>
          <div class="selectBox">
            <el-select
              v-model="userMusicMenu"
              size="mini"
              popper-class="audio-select"
              @change="userMusicMenuChange"
            >
              <el-option
                v-for="item in userMusicMenuList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <div class="optionItem">
                  {{ item.name }}
                  <div
                    class="sharingCode"
                    @click.stop="importConfiguration(item)"
                  >
                    分享码
                  </div>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="import" @click="importConfiguration">导入配置</div>
          <div
            class="soundEffect"
            @click="openSoundEffect"
            :class="isShow ? 'soundEffectAction' : ''"
          >
            音效库
          </div>
          <div class="backButton" @click="goHome">
            <img src="@/assets/home.png" />
            <span>返回主页</span>
          </div>
        </div>
        <div>
          <vuedraggable
            v-model="list"
            animation="800"
            @end="complete"
            ghostClass="ghostClass"
            filter=".unmover"
          >
            <transition-group class="audioList">
              <div
                v-for="(item, index) in list"
                :key="index"
                class="audioItem"
                :class="{
                  audioAction: choiceList == item.id,
                  unmover: item.isFirst == '1',
                }"
                @click="handleClick(item)"
                v-on:contextmenu="(e) => showContextMenu(e, item, index)"
              >
                <div class="topOne">
                  <div style="display: flex">
                    <div @click.stop v-if="item.isPublic == 0">
                      <el-upload
                        action="https://yts.yuantiaoshi.com:8880/api/upload/music"
                        :limit="1"
                        ref="upload"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="(response) => onSuccess(response, item)"
                        :file-list="fileList"
                      >
                        <i
                          class="el-icon-circle-plus"
                          :id="index == 0 ? 'plus' : ''"
                        ></i>
                      </el-upload>
                    </div>
                    <div class="topping" v-if="item.isFirst == '1'">置</div>
                    <div class="topp" v-if="item.isEdited == '1'">剪</div>
                  </div>

                  <div>
                    <Icon
                      fontName="icon-shezhi1"
                      alt=""
                      :clickStop="true"
                      @click="(e) => showContextMenu(e, item, index)"
                    />
                  </div>
                  <span></span>
                </div>

                <div class="title">
                  <div class="name">{{ item.name }}</div>
                </div>
                <div class="automaticPushFlow">
                  <div
                    class="notSet"
                    v-on:contextmenu.stop="setKey(item)"
                    :class="item.shortcutKey ? 'red' : ''"
                  >
                    {{ item.shortcutKey ? item.shortcutKey : "未设置快捷键" }}
                  </div>
                  <div
                    v-if="item.src"
                    :class="
                      src == item.src && isBf ? 'loaderRectangle' : 'static'
                    "
                  >
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </transition-group>
          </vuedraggable>
        </div>
      </div>
    </div>
    <div class="audioFoot">
      <div class="open">
        <div class="openTop" id="globalShortcutKey">
          <div>全局快捷键</div>
          <el-switch
            v-model="isOverallSituation"
            :active-value="true"
            :inactive-value="false"
            @change="handleOpenAllChange"
          ></el-switch>
        </div>

        <div class="notSet" v-on:contextmenu="setAll">
          {{
            globalShortcutKey.length > 0
              ? globalShortcutKey.join("+")
              : "暂未设置快捷键"
          }}
        </div>
      </div>
      <div>
        <div class="progressBar">
          <div class="progressBox">
            <el-slider
              v-model="progress"
              @change="progressBarChange"
              :max="maxTime"
              :show-tooltip="false"
              :step="0.02"
            ></el-slider>
          </div>
          <span>{{ maxTime }}</span>
        </div>
        <div class="put">
          <div class="label">输出：</div>
          <el-select
            v-model="output"
            placeholder="请选择"
            size="mini"
            @change="outputChange"
          >
            <el-option
              v-for="item in outputList"
              :key="item.deviceId"
              :label="item.label"
              :value="item.deviceId"
            >
            </el-option>
          </el-select>
          <div class="label">音量：</div>
          <el-slider
            v-model="volume"
            :max="100"
            :step="1"
            :show-tooltip="false"
          ></el-slider>
          <div class="label volume">{{ volume }}%</div>
        </div>
      </div>

      <div class="playBox">
        <div class="paly" v-if="!isBf" @click="play">
          <iconpark-icon name="play" class="playIcon"></iconpark-icon>
          <div>播放</div>
        </div>
        <div class="paly" v-else @click="shop">
          <iconpark-icon name="pause-one" class="playIcon"></iconpark-icon>
          <div>暂停</div>
        </div>
        <div class="notSet" v-on:contextmenu="openPlay">
          {{
            playShortcutKey.length > 0
              ? playShortcutKey.join("+")
              : "未设置快捷键"
          }}
        </div>
      </div>
    </div>
    <!-- 右键弹出层 -->
    <div class="popup" ref="popup" v-show="isShowPopup">
      <div
        @click="isShowClip = true"
        v-if="showType == 'item' && clickItem.src"
      >
        音效剪辑
      </div>
      <div @click="setTop">
        {{ clickItem.isFirst == "1" ? "取消置顶" : "置顶" }}
      </div>
      <div
        @click="(isShowEditName = true), (title = '重命名')"
        v-if="!clickItem.musicCategoryId"
      >
        重命名
      </div>
      <div
        v-if="showType == 'item'"
        @click="(isShowEditName = true), (title = '快捷键')"
      >
        快捷键
      </div>
      <div @click="del" v-if="!clickItem.musicCategoryId">删除</div>
      <div v-if="showType == 'item'" @click="copy">复制</div>
      <div
        v-if="showType == 'item'"
        @click="paste"
        :class="isCopy ? '' : 'isCopy'"
      >
        粘贴
      </div>
    </div>
    <el-dialog
      :title="toConfigureTitle"
      :visible.sync="dialogVisible"
      width="40%"
      top="30vh"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="code"
        placeholder="请输入配置代码"
        v-if="footerShow"
      ></el-input>
      <div v-else>
        配置代码:{{ code }}
        <el-button @click="copy" size="mini">复制</el-button>
      </div>
      <span slot="footer" class="dialog-footer" v-if="footerShow">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">导入</el-button>
      </span>
    </el-dialog>
    <Loading v-if="fullscreenLoading"></Loading>
    <!-- 剪辑弹框 -->
    <Clip
      :isShowClip.sync="isShowClip"
      :clickItem="clickItem"
      @getList="getList"
    ></Clip>
    <EditName
      :dialogVisible.sync="isShowEditName"
      :clickItem="clickItem"
      :title="title"
      :showType="showType"
      :list="list"
      :userMusicMenu="userMusicMenu"
      @init="init"
      @getClassList="getClassList"
      @getList="getList"
      @idPlay="idPlay"
    ></EditName>
  </div>
</template>

<script>
import ipcUtil from "@/ipc";
import vuedraggable from "vuedraggable";
import Clip from "@/views/audio/clip.vue";
import EditName from "@/views/audio/editName.vue";
import { keyboardProcessing } from "@/utils/index";
import Intro from "@/utils/intro";
import {
  categoryList,
  addCategory,
  deleteCategory,
  sortCategory,
  addList,
  updateList,
  list,
  delList,
  sortList,
  getInfo,
  updateInfo,
  userMusicMenu,
  collect,
} from "@/api/audio";
import lodash from "lodash";
import ipc from "@/ipc";

export default {
  name: "Audio",
  components: { vuedraggable, Clip, EditName },
  data() {
    return {
      devices: null,
      list: [],
      classList: [],
      choiceClass: -1,
      choiceList: -1,
      audio: new Audio(),
      dialogVisible: false,
      shortcutKeys: [],
      outputList: [],
      output: "",
      src: "",
      progress: 0,
      maxTime: 0,
      volume: 50,
      isBf: false,
      isShowPopup: false,
      isShowClip: false, //剪辑音频的弹框
      clickItem: {}, //被右键的item
      wavesurfer: {},
      showType: "",
      isShowEditName: false, //重命名的弹框显示
      title: "重命名",
      fileList: [], //上传列表
      copyItem: {}, //被复制的列表
      isOverallSituation: true, //是否是全局快捷键
      input: [], //局部快捷键
      playShortcutKey: [], //播放的快捷键
      globalShortcutKey: [], //全局快捷键的快捷键
      uploadName: "", //上传的文件名
      isShow: false,
      isCopy: false, //是否有复制功能
      playing: {}, //正在播放的音频
      isTop: false, //是否置顶
      fullscreenLoading: true,
      userMusicMenuList: [], //配置
      userMusicMenu: "",
      dialogVisible: false,
      code: "", //配置代码
      footerShow: false,
      toConfigureTitle: "",
    };
  },
  async mounted() {
    // 数据同步
    window.ipc.on("refreshAudio", (event, res) => {
      res = JSON.parse(res);
      // feedback.msgSuccess(`成功添加到${res.name}分类`);
      this.getList();
    });

    window.ipc.on("audioType", () => {
      this.isShow = false;
    });
    await this.init();
    await this.allocation();
    // 获取音频输出设备
    this.output = localStorage.getItem("deviceId") || "default";
    this.volume = localStorage.getItem("volume")
      ? Number(localStorage.getItem("volume"))
      : 50;
    await this.getAudioFrequency();
    // 初始化

    let sliderButton = document.getElementsByClassName(
      "el-slider__button-wrapper"
    ); //滑块
    sliderButton[1].setAttribute("data-progress", this.progress);
    // 新手指引
    this.$bus.$on("newcomerGuidanceAudio", this.newcomerGuidanceAudio);
  },
  watch: {
    input: {
      handler(val) {
        // 当全局快捷键为false时 才监听局部快捷键
        if (!this.isOverallSituation && val.join("+")) {
          // 处理音频的快捷键
          let obj = this.list.find((item) => item.shortcutKey == val.join("+"));
          if (obj) {
            this.idPlay(obj.id);
          }
          // 处理播放的快捷键
          if (val.join("+") == this.playShortcutKey.join("+")) {
            // 改变播放的状态
            if (this.isBf) {
              this.shop();
            } else {
              this.play();
            }
          }
        }
      },
      deep: true,
    },
    isBf(val) {
      // 与子窗口通信
      ipcUtil.setConsole({
        deviceId: this.output, //输出设备
        volume: this.volume, //音量
        isBf: this.isBf,
      });
    },
    volume(val) {
      this.audio.volume = (val / 100).toFixed(1);
      localStorage.setItem("volume", val);
      // 与子窗口通信
      ipcUtil.setConsole({
        deviceId: this.output, //输出设备
        volume: this.volume, //音量
        isBf: this.isBf,
      });
    },
    output(val) {
      // 与子窗口通信
      ipcUtil.setConsole({
        deviceId: this.output, //输出设备
        volume: this.volume, //音量
        isBf: this.isBf,
      });
    },
  },

  methods: {
    async allocation(code) {
      const res = await userMusicMenu();
      if (res.data.code == 200) {
        this.userMusicMenuList = res.data.data;
        // 请求配置
        if (code) {
          let obj = this.userMusicMenuList.find((item) => item.code == code);
          this.userMusicMenu = obj.id;
        } else {
          this.userMusicMenu = this.userMusicMenuList[0]?.id;
        }
        await this.getClassList(1);
      }
      console.log(res, "res");
    },
    async init() {
      const rel = await getInfo();
      if (rel.data.code == 200) {
        if (rel.data.data.globalShortcutKey) {
          // 全局快捷键的快捷键
          this.globalShortcutKey = rel.data.data.globalShortcutKey.split("+");
        }
        this.isOverallSituation = rel.data.data.isOpenGlobalShortcutKey == "1";
        // 播放的快捷键
        this.playShortcutKey =
          rel.data.data.playShortcutKey == ""
            ? []
            : rel.data.data.playShortcutKey.split("+");
        window.audioKeyKeysCall = lodash.throttle(
          this.shortcutKeyCallback,
          200,
          { leading: true, trailing: false }
        );
        this.bindingAllKey();
        if (this.isOverallSituation) {
          this.bindingOther();
        }
      }
    },
    handleClick(music) {
      if (music && !music.src) return;
      // 先暂停
      this.audio.pause();
      this.choiceList = music.id;
      this.isBf = true;
      this.progress = 0;
      this.audio.pause();
      this.audio.src = this.$root.url + music.src;
      this.src = music.src;
      // 调节声音
      this.audio.volume = this.volume / 100;
      // 重新分配输出设备
      this.setOutputDevice(this.output);
      try {
        this.audio.onloadeddata = () => {
          if (music.endTime != null) {
            // 设置最大时间为剪辑后的结束时间-开始时间
            this.maxTime =
              Math.floor((music.endTime - music.startTime) * 100) / 100;
            // 从起始时间开始播放
            this.audio.currentTime = music.startTime;
          } else {
            this.maxTime = Math.floor(this.audio.duration * 100) / 100;
          }
          this.audio.play();
          this.playing = lodash.cloneDeep(music);
          this.audio.addEventListener("timeupdate", this.timeChang);
        };
      } catch (error) {
        this.$notify({
          title: "提示",
          message: error,
          duration: 0,
        });
      }
    },
    timeChang() {
      if (this.playing.endTime != null) {
        this.progress = this.audio.currentTime - this.playing.startTime;
      } else {
        this.progress = this.audio.currentTime;
      }
      let sliderButton = document.getElementsByClassName(
        "el-slider__button-wrapper"
      ); //滑块
      // 结束暂停
      if (this.maxTime <= this.progress) {
        sliderButton[1].setAttribute("data-progress", this.maxTime);
        this.audio.pause();
        this.isBf = false;
        return;
      }
      sliderButton[1].setAttribute(
        "data-progress",
        Math.floor(this.progress * 100) / 100
      );
      if (Math.floor(this.progress * 100) == Math.floor(this.maxTime * 100)) {
        this.isBf = false;
      }
    },
    // 音乐进度条改变
    progressBarChange(e) {
      if (this.audio.src) {
        if (this.playing.endTime != null) {
          this.audio.currentTime = e + this.playing.startTime;
        } else {
          this.audio.currentTime = e;
        }

        this.isBf = true;
        this.audio.play();
      }
    },
    // 根据id播放
    idPlay(id) {
      let obj = this.list.find((item) => item.id == id);
      if (obj) {
        this.handleClick(lodash.cloneDeep(obj));
      }
    },
    // 播放
    play() {
      if (this.audio.src) {
        this.isBf = true;

        if (this.maxTime <= this.progress) {
          this.audio.currentTime = this.playing.startTime;
        }
        this.audio.play();
      }
    },
    // 暂停
    shop() {
      this.isBf = false;
      this.audio.pause();
    },
    // 获取音频输出设备
    async getAudioFrequency() {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            ipcUtil.log(JSON.stringify(device), "设备");
            if (device.kind === "audiooutput") {
              if (device.label.includes("Default")) {
                this.outputList.push({
                  label: "默认",
                  deviceId: device.deviceId,
                });
                if (device.deviceId == this.output) {
                  this.setOutputDevice(this.output);
                }
                return;
              }
              if (!device.label.includes("Communications")) {
                this.outputList.push(device);
                // 如果识别上了设备，就修改默认播放设备
                if (device.deviceId == this.output) {
                  this.setOutputDevice(this.output);
                }
              }
            }
          });
          // this.releaseDevices();
        })
        .catch((error) => {
          console.error("Error enumerating output devices:", error);
        });
    },
    // 设置音频播放设备
    setOutputDevice(deviceId) {
      ipcUtil.log("使用的输出设备", deviceId);
      this.audio.setSinkId(deviceId);
    },
    // 输出设备发生改变
    outputChange(e) {
      this.setOutputDevice(e);
      localStorage.setItem("deviceId", e);
    },
    // 获取分类列表
    async getClassList(e) {
      // 获取分类列表
      const getCategoryList = await categoryList({
        menuId: this.userMusicMenu,
      });
      if (getCategoryList.data.code == 200) {
        this.classList = getCategoryList.data.data;
        if (e == 1) {
          this.choiceClass = this.classList[0].id;
          await this.getList();
        }
      }
    },
    // 获取列表
    async getList() {
      const res = await list({ categoryId: this.choiceClass });
      console.log("[ res ] >", res);
      if (res.data.code == 200) {
        this.list = res.data.data;
        this.binding();
        this.fullscreenLoading = false;
      }
    },
    // 新增
    async addList() {
      let arr = this.list.filter((item) => !item.src);
      if (arr.length < 3) {
        const res = await addList({ categoryId: this.choiceClass });
        if (res.data.code == 200) {
          this.getList();
        }
      } else {
        this.$message({
          message: "只允许添加3个空内容",
          type: "msgWarning",
          offset: 50,
        });
      }
    },
    // 右键点击item
    showContextMenu(e, item, index) {
      console.log(item, index);
      this.showType = "item";
      document.removeEventListener("click", this.click);
      this.isShowPopup = true;
      if ((index + 1) % 4 == 0) {
        // 最右边的一项 菜单从左边打开
        this.$nextTick(() => {
          let popup = document.getElementsByClassName("popup");
          this.$refs.popup.style.left = e.clientX - popup[0].clientWidth + "px";
        });
      } else {
        this.$refs.popup.style.left = e.clientX + "px";
      }
      this.$refs.popup.style.top = e.clientY + "px";
      this.clickItem = lodash.cloneDeep(item);
      document.addEventListener("click", this.click);
    },
    // 右键点击分类
    showClassMenu(e, item, index) {
      this.showType = "class";
      document.removeEventListener("click", this.click);
      if (index == 6) {
        this.$refs.popup.style.top = e.clientY - 109 + "px";
      } else {
        this.$refs.popup.style.top = e.clientY + "px";
      }
      this.$refs.popup.style.left = e.clientX + "px";
      this.clickItem = lodash.cloneDeep(item);
      this.isShowPopup = true;
      document.addEventListener("click", this.click);
    },
    click() {
      this.isShowPopup = false;
    },
    // 点击分类
    async clickClass(item) {
      if (item.name) {
        await this.unBinding();
        this.choiceClass = item.id;
        await this.getList();
        this.progress = 0;
        // 初始化
        this.audio.pause();
        this.audio = new Audio();
        this.isBf = false;
        this.$nextTick(() => {
          this.maxTime = 0;
          let sliderButton = document.getElementsByClassName(
            "el-slider__button-wrapper"
          ); //滑块
          sliderButton[1].setAttribute("data-progress", 0);

          this.choiceList = -1;
        });
      }
    },
    // 拖拽列表
    async complete() {
      // 存储置顶的数据
      const data = [];
      this.list.forEach((item, index) => {
        if (item.isFirst == 1) {
          data.push(item);
        }
      });
      this.list.forEach((item, index) => {
        if (item.isFirst == 0) {
          data.push(item);
        }
      });
      this.list = data.map((item, index) => {
        return {
          ...item,
          sortNo: index,
        };
      });
      await sortList(this.list);
    },
    // 新增分类
    async addClass() {
      if (this.classList.length >= 7) {
        this.$message({
          message: "分类最多7个",
          type: "msgWarning",
          offset: 50,
        });
        return;
      }
      const res = await addCategory({
        name: "默认",
        menuId: this.userMusicMenu,
      });
      if (res.data.code == 200) {
        this.getClassList();
      }
    },
    // 删除分类或item
    async del() {
      if (this.showType == "class") {
        const rel = await deleteCategory({ id: this.clickItem.id });
        if (rel.data.code == 200) {
          this.getClassList();
        }
      } else {
        const rel = await delList({ id: this.clickItem.id });
        if (rel.data.code == 200) {
          this.getList();
        }
      }
    },
    // 分类拖动结束
    async classSortEnd(e) {
      const data = this.classList.map((item, index) => {
        return {
          ...item,
          sortNo: index,
        };
      });
      await sortCategory(data);
    },
    // 上传成功
    async onSuccess(response, item) {
      const data = {
        id: item.id,
        src: response.msg,
        originalSrc: response.msg,
        name: this.uploadName,
      };
      const res = await updateList(data);
      if (res.data.code == 200) {
        this.$message({
          showClose: true,
          message: "上传成功",
          type: "success",
          offset: 50,
        });
        this.getList();
      }
    },
    // 按下全局快捷键的回调
    async shortcutKeyCallback(e, id) {
      if (id == -1) {
        // 改变播放的状态
        if (this.isBf) {
          this.shop();
        } else {
          this.play();
        }
      } else if (id == -2) {
        this.isOverallSituation = !this.isOverallSituation;
        const rel = await updateInfo({
          isOpenGlobalShortcutKey: this.isOverallSituation ? "1" : "0",
        });
        if (rel.data.code == 200) {
          if (this.isOverallSituation) {
            this.binding();
          } else {
            this.unBinding();
          }
        }
      } else {
        this.idPlay(id);
      }
    },
    // 绑定快捷键
    async binding() {
      if (this.isOverallSituation) {
        // 全局快捷键
        this.list.forEach(async (item) => {
          if (item.shortcutKey) {
            const data = {
              shortcutKey: item.shortcutKey,
              id: item.id,
            };
            await ipcUtil.audioKey(data);
            window.audioKeyKeysCall = lodash.throttle(
              this.shortcutKeyCallback,
              200,
              { leading: true, trailing: false }
            );
          }
        });
        this.bindingOther();
      } else {
        // 局部快捷键
        document.addEventListener("keyup", this.handleKeyPress);
      }
    },
    // 绑定播放的快捷
    async bindingOther() {
      const data = {
        shortcutKey: this.playShortcutKey.join("+"),
        id: -1,
      };
      await ipcUtil.audioKey(data);
    },
    // 绑定全局快捷键的快捷
    async bindingAllKey() {
      const data = {
        shortcutKey: this.globalShortcutKey.join("+"),
        id: -2,
      };
      await ipcUtil.audioKey(data);
    },
    // 局部快捷键函数
    handleKeyPress(e) {
      this.input = [];
      // ctrl键
      let ck = e.ctrlKey;
      // Shift键
      let sf = e.shiftKey;
      let key = keyboardProcessing(e);
      if (!this.input.includes(key)) {
        if (key !== "Control" && key !== "Shift" && key !== "Process") {
          if (ck && sf) {
            this.input = ["Control", "Shift", key];
          } else if (ck) {
            this.input = ["Control", key];
          } else if (sf) {
            this.input = ["Shift", key];
          } else {
            this.input = [key];
          }
        } else {
          if (e.code.split("Key")[1]) {
            if (ck && sf) {
              this.input = ["Control", "Shift", e.code.split("Key")[1]];
            } else if (ck) {
              this.input = ["Control", e.code.split("Key")[1]];
            } else if (sf) {
              this.input = ["Shift", e.code.split("Key")[1]];
            } else {
              this.input = [e.code.split("Key")[1]];
            }
          }
        }
      }
    },
    // 解绑全局快捷键
    async unBinding() {
      this.list.forEach(async (item) => {
        if (item.shortcutKey) {
          await ipcUtil.logoutKeys({ keyWord: item.shortcutKey });
        }
      });
      await ipcUtil.logoutKeys({ keyWord: this.playShortcutKey.join("+") });
    },
    // 设置置顶
    async setTop() {
      if (this.showType == "item") {
        // 置顶列表
        let inx = -1;
        this.list.forEach((item, index) => {
          if (item.id == this.clickItem.id) {
            inx = index;
            this.clickItem.isFirst = this.clickItem.isFirst == "1" ? "0" : "1";
          }
        });
        if (this.clickItem.isFirst == "1") {
          // 剪切
          this.list.splice(inx, 1);
          // 添加元素
          this.list.unshift(this.clickItem);
        } else {
          // 剪切
          this.list.splice(inx, 1);
          // 添加元素
          this.list.push(this.clickItem);
        }
        this.list.forEach((item, index) => {
          if (index > 2) {
            item.isFirst = 0;
          }
        });

        await this.complete();
        await this.getList();
      } else {
        // 置顶列表
        let inx = -1;
        this.classList.forEach((item, index) => {
          if (item.id == this.clickItem.id) {
            inx = index;
            this.clickItem.isFirst = this.clickItem.isFirst == "1" ? "0" : "1";
          }
        });
        if (this.clickItem.isFirst == "1") {
          // 剪切
          this.classList.splice(inx, 1);
          // 添加元素
          this.classList.unshift(this.clickItem);
        } else {
          // 剪切
          this.classList.splice(inx, 1);
          // 添加元素
          this.classList.push(this.clickItem);
        }
        this.classList.forEach((item, index) => {
          if (index > 2) {
            item.isFirst = 0;
          }
        });

        await this.classSortEnd();
        await this.getClassList();
      }
    },
    // 复制
    copy() {
      this.isCopy = true;
      this.copyItem = lodash.cloneDeep(this.clickItem);
    },
    // 粘贴
    async paste() {
      if (!this.isCopy) return;
      let listItem = this.list.find((item) => item.id == this.clickItem.id);
      this.copyItem.id = this.clickItem.id;
      // 删除快捷键
      this.copyItem.shortcutKey = "";
      this.copyItem.isFirst = "0";
      let obj = {
        ...this.copyItem,
        categoryId: listItem.categoryId,
        id: listItem.id,
        sortNo: listItem.sortNo,
      };
      const res = await updateList(obj);
      this.getList();
    },

    onMove(e) {
      let evl = e.relatedContext.element.isFirst;
      if (evl == 1) return false;
      return true;
    },
    // 上传前回调
    beforeUpload(file) {
      console.log(file, "file");
      this.uploadName = file.name.split(".")[0];
      // 截取上传文件的后缀名
      let fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      let arr = ["mp3", "wav", "MP3", "WAV", "m4a", "M4A"];
      /*  if (!arr.includes(fileType)) {
        this.uploadName+='.mp3'
      } */
    },
    // 打开音效库
    openSoundEffect() {
      if (this.isShow) {
        window.ipc.send("window-close", { child: 2 });
      } else {
        sessionStorage.setItem("isShow", this.isShow);
        let route = this.$router.resolve({
          path: "/soundEffect",
        });
        let size = Number(localStorage.getItem("audioSize")) || 40;
        const sizeList = [
          {
            value: 40,
            size: "740*503",
          },
          {
            value: 50,
            size: "887*603",
          },
          {
            value: 60,
            size: "986*670",
          },
          {
            value: 70,
            size: "1233*838",
          },
          {
            value: 80,
            size: "1479*1005",
          },
          {
            value: 90,
            size: "1727*1173",
          },
          {
            value: 100,
            size: "1972*1340",
          },
        ];
        let val = sizeList.find((item) => item.value == size);
        const data = {
          w: val.size.split("*")[0],
          h: val.size.split("*")[1],
        };
        ipcUtil.openWindow(route.href, data);
      }
      this.isShow = !this.isShow;
    },
    // 切换全局快捷键
    async handleOpenAllChange(e) {
      const rel = await updateInfo({
        isOpenGlobalShortcutKey: this.isOverallSituation ? "1" : "0",
      });
      if (rel.data.code == 200) {
        this.unBinding();
        this.binding();
      }
    },
    // 设置全局快捷键
    setAll() {
      this.title = "全局快捷键";
      this.clickItem.shortcutKey = this.globalShortcutKey.join("+");
      this.isShowEditName = true;
    },
    // 设置播放快捷键
    openPlay() {
      this.title = "播放快捷键";
      this.clickItem.shortcutKey = this.playShortcutKey.join("+");
      this.isShowEditName = true;
    },
    setKey(item) {
      this.clickItem = lodash.cloneDeep(item);
      this.title = "快捷键";
      this.showType = "item";
      this.isShowPopup = false;
      this.isShowEditName = true;
    },
    // 回到首页
    goHome() {
      // 关闭置顶
      this.isTop = true;
      this.changeTop();
      window.ipc.send("window-close", { child: 2 });
      this.$router.push({ name: "home" });
    },
    // 改变置顶
    changeTop() {
      this.isTop = !this.isTop;
      ipcUtil.changeTop(this.isTop);
    },
    importConfiguration(item) {
      this.dialogVisible = true;
      if (item.code) {
        this.code = item.code;
        this.toConfigureTitle = item.name;
        this.footerShow = false;
      } else {
        this.toConfigureTitle = "配置代码";
        this.code = "";
        this.footerShow = true;
      }
    },
    async save() {
      const res = await collect({ code: this.code });
      console.log("[ res ] >", res);
      if (res.data.code == 200) {
        this.allocation(res.data.data.code);
        this.dialogVisible = false;
      }
    },
    copy() {
      navigator.clipboard.writeText(this.code);
      this.$message.success("复制成功");
    },
    userMusicMenuChange(e) {
      // let obj = this.userMusicMenuList.find((item) => item.id == e);
      this.getClassList(1);
    },
    newcomerGuidanceAudio() {
      Intro.exit();
      Intro.setOptions({
        steps: [
          {
            element: "#class", // 目标元素
            intro: "自定义添加分类", // 提示文本
            position: "right", // 提示位置
          },
          {
            element: "#plus",
            intro: "点击“+”号自定义上传音效",
            position: "top",
          },
          {
            element: "#globalShortcutKey",
            intro: "打开全局快捷键，最小化软件也可以触发音效",
            position: "top",
          },
        ],
      });
      // 配置
      this.$nextTick(() => {
        // 开始
        Intro.start();
      });
    },
  },
  beforeDestroy() {
    this.unBinding();
    this.audio.pause();
  },
};
</script>
<style>
.audio-select {
  width: 140px;
  border-radius: 20px;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.optionItem {
  width: 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  .sharingCode {
    background: #409eff;
    width: 40px;
    height: 20px;
    border-radius: 4px;
    line-height: 20px;
    padding: 0 4px;
  }
}
.open {
  margin: 10px 12px 17px 22px;
  display: flex;
  // align-items: center;
  flex-direction: column;
  .openTop {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    div {
      margin-right: 8px;
    }
  }
  div {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .notSet {
    font-size: 12px;
    font-weight: 700;
    color: #666;
    cursor: pointer;
  }
}
.audio {
  display: flex;
  flex-direction: column;
  height: 625px;
  overflow: hidden;
  color: var(--fc);

  .popup {
    position: fixed;
    z-index: 9999;
    width: 130px;
    padding: 18px 0;
    box-sizing: border-box;
    border-radius: 16px;
    border: 2px solid var(--buttonBor);
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    background: var(--tgb);
    div {
      height: 30px;
      text-align: center;
      cursor: pointer;
      line-height: 30px;
      &:hover {
        background: #bde2f6;
        border-radius: 3px;
        color: #0d99ff;
      }
    }
    .isCopy {
      background: #ccc;
      border-radius: 3px;
    }
  }
  .headerAudio {
    display: flex;
    height: 50px;
    font-size: 14px;
    align-items: center;
    background: var(--b);
    .import {
      width: 78px;
      height: 30px;
      line-height: 30px;
      background: #98d7fa;
      cursor: pointer;
      border-radius: 9px;
      margin-left: 12px;
      border: 1px solid #333;
      color: var(--buttonFc);
    }

    div {
      line-height: 40px;
      text-align: center;
      font-weight: 800;
      font-size: 14px;
    }
    .backButton {
      width: 115px;
      background-color: #e3e3e3;
      color: #000;
      height: 30px;
      margin-left: 82px;
      border-radius: 9px;
      border: 1px solid #333;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
      img {
        position: relative;
        top: 1px;
        height: 12px;
        width: 12px;
        margin-right: 3px;
      }
    }
    .goHome {
      width: 96px;
      height: 27px;
      font-size: 14px;
      margin-left: 95px;
      line-height: 27px;
      background-color: var(--tgb);
      padding: 2px 10px;
      border-radius: 6px;
      border: 2px solid #000;
    }

    .action {
      background: #aad4ff;
      width: 104px;
      height: 40px;
      border-radius: 9px;
      margin-right: 12px;
      margin-left: 18px;
      border: 1px solid #333;
      color: var(--buttonFc);
    }
    .soundEffect {
      cursor: pointer;
      width: 78px;
      height: 30px;
      line-height: 30px;
      margin-left: 12px;
      border: 1px solid var(--buttonBor);
      border-radius: 9px;
    }

    .soundEffectAction {
      background: #aad4ff;
    }
    .top {
      width: 78px;
      height: 30px;
      line-height: 30px;

      border-radius: 9px;

      cursor: pointer;
      margin-right: 12px;
      border: 1px solid var(--buttonBor);
    }
    .topAction {
      background: #aad4ff;
    }
    .soundEffectAdd {
      width: 78px;
      height: 30px;
      line-height: 30px;
      border-radius: 9px;
      cursor: pointer;
      margin-right: 12px;
      border: 1px solid var(--buttonBor);
    }
    .selectBox {
      border: none;
      width: 78px;
      height: 30px;
      margin-top: -8px;
      .mine-select {
        width: 140px !important;
        border-radius: 20px;
        overflow: hidden;
      }
      /deep/ .el-input--mini {
        width: 78px;
        height: 30px;
        border: none !important;
        .el-input__inner {
          width: 78px;
          border: 1px solid #333;
          border-radius: 9px;
          height: 30px !important;
          color: #000;
          background: #f6cece;
        }
      }
    }
  }
  .audioMain {
    display: flex;
    height: 554px;
    .sidebarBox {
      border-right: 1px solid #aaa;
      padding-top: 11px;
      height: 543px;
      width: 160px;
      .class {
        cursor: pointer;
        width: 110px;
        margin-left: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 25px;
        .el-icon-circle-plus {
          margin-right: 9px;
        }
        .add-one {
          width: 14px;
          height: 14px;
          margin-right: 9px;
          color: #333333;
        }
      }
    }

    .sidebar {
      height: 491px;
      display: flex;
      flex-direction: column;
      color: #000;
      div {
        font-size: 16px;
        width: 132px;
        height: 50px;
        border-radius: 9px;
        text-align: center;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 14px;
        margin-bottom: 20px;
        font-weight: 700;
      }
      div:nth-child(1) {
        background: #f6cece;
      }
      div:nth-child(2) {
        background: #f9e3ce;
      }
      div:nth-child(3) {
        background: #fffed2;
      }
      div:nth-child(4) {
        background: #d7fcd0;
      }
      div:nth-child(5) {
        background: #d6fffb;
      }
      div:nth-child(6) {
        background: #d2ecfb;
      }
      div:nth-child(7) {
        background: #e6cef0;
        margin-bottom: 0;
      }
      .action {
        border: 3px solid #409eff;
      }
    }
  }

  .audioBox {
    width: 790px;
    height: 561px;
    display: flex;
    flex-direction: column;

    .audioList {
      background: var(--b);
      display: flex;
      flex-wrap: wrap;
      height: 505px;
      width: 790px;
      padding-left: 18px;
      padding-top: 14px;
      align-content: flex-start;
      box-sizing: border-box;
    }

    .audioItem {
      width: 182px;
      height: 70px;
      margin-right: 12px;
      margin-bottom: 16px;
      border-radius: 9px;
      border: 1px solid #000;
      background: var(--tgb);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 5px;
      .el-icon-circle-plus {
        font-size: 16px;
        cursor: pointer;
      }
      .title {
        font-size: 14px;
        height: 22px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        /deep/ .icon-a-5Jyinboyinpin {
          width: 20px;
          height: 20px;
          margin-right: 3px;
        }
      }
      .name {
        width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
      .notSet {
        font-size: 12px;
        color: #666;
        cursor: pointer;
      }
      .topOne {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          width: 18px;
          height: 18px;
          margin-right: 4px;
          cursor: pointer;
          /deep/ .iconfont {
            margin-left: 65px;
          }
        }
        .topping {
          color: #fee53b;
          margin: 0 4px;
          font-size: 12px;
          font-weight: 700;
        }
        .topp {
          color: red;
          margin: 0 4px;
          font-size: 12px;
          font-weight: 700;
        }
      }
    }
    .unmover {
      border: 2px solid #fee53b;
    }
    .audioAction {
      border: 2px solid #409eff;
    }
  }
  .audioFoot {
    display: flex;
    height: 74px;
    border-top: 1px solid #aaa;
    .progressBox {
      position: relative;
      .tooltip {
        position: absolute;
        left: 0px;
        top: -10px;
        font-size: 16px;
      }
    }
    .progressBar {
      display: flex;
      align-items: center;
      margin-left: 20px;
      width: 680px;

      /deep/ .el-slider {
        width: 622px;
        height: 36px;
        margin-right: 8px;
      }
      /deep/ .el-slider__button {
        width: 10px;
        height: 10px;
        border: 4px solid #409eff;
      }
      /deep/ .el-slider__button-wrapper::before {
        content: attr(data-progress);
        position: absolute;
        width: 20px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        text-align: center;
        top: -20px;
        left: 5.5px;
        font-size: 14px;
        color: var(--fc);
      }
    }

    .put {
      display: flex;
      align-items: center;
      .label {
        width: 40px;
        font-size: 12px;
        display: flex;
        align-items: center;
        text-align: right;
      }
      /deep/ .el-input {
        border-radius: 12px;
        overflow: hidden;
        width: 220px;
        border: 1px solid #000;
        box-sizing: border-box;
        margin-right: 22px;
        .el-input__inner {
          height: 28px;
          border: none;
        }
      }
      /deep/ .el-slider {
        width: 320px;
      }
      /deep/ .el-slider__button {
        width: 10px;
        height: 10px;
        border: 4px solid #409eff;
      }
      .volume {
        line-height: 28px;
        width: 50px;
        margin-left: 8px;
      }
    }
    .play {
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
      img {
        width: 50px;
        height: 50px;
        cursor: pointer;
        margin-left: 12px;
      }
    }
    .notSet {
      font-size: 12px;
      font-weight: 700;
      color: #666666;
      text-align: center;
      width: 85px;
      cursor: pointer;
    }
  }
}

.automaticPushFlow {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  .notSet {
    font-size: 12px;
    cursor: pointer;
    cursor: pointer;
  }
  .red {
    color: red !important;
    font-weight: 600;
  }
}
.ghostClass {
  opacity: 0 !important;
}
.playBox {
  margin-top: 15px;
  .paly {
    width: 76px;
    height: 30px;
    background: #0d99ff;
    border-radius: 9px;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    border: 1px solid #333;

    cursor: pointer;
    .playIcon {
      margin-right: 4px;
      font-size: 14px;
    }
    div {
      font-weight: 800;
      font-size: 12px;
    }
  }
}
.static div {
  width: 2px;
  background: #666;
  // border-radius: 3px;
}
.static div:nth-child(1) {
  height: 5px;
}
.static div:nth-child(2) {
  height: 8px;
}
.static div:nth-child(3) {
  height: 10px;
}
.static div:nth-child(4) {
  height: 8px;
}
.static div:nth-child(5) {
  height: 5px;
}
.loaderRectangle,
.static {
  width: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.loaderRectangle div {
  width: 2px;
  height: 5px;
  background: #666;
  border-radius: 6px;
  animation: 0.9s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
  margin-right: 2px;
}

.loaderRectangle div:nth-child(1) {
  animation-name: rectangleOneAnim;
  animation-delay: 1s;
}

@keyframes rectangleOneAnim {
  0% {
    height: 3px;
  }

  40% {
    height: 5px;
  }

  100% {
    height: 3px;
  }
}

.loaderRectangle div:nth-child(2) {
  animation-name: rectangleTwoAnim;
  animation-delay: 0.1s;
}

@keyframes rectangleTwoAnim {
  0% {
    height: 4px;
  }

  40% {
    height: 8px;
  }

  100% {
    height: 4px;
  }
}

.loaderRectangle div:nth-child(3) {
  animation-name: rectangleThreeAnim;
  animation-delay: 0.2s;
}

@keyframes rectangleThreeAnim {
  0% {
    height: 5px;
  }

  40% {
    height: 10px;
  }

  100% {
    height: 5px;
  }
}

.loaderRectangle div:nth-child(4) {
  animation-name: rectangleFourAnim;
  animation-delay: 0.3s;
}

@keyframes rectangleFourAnim {
  0% {
    height: 4px;
  }

  40% {
    height: 8px;
  }

  100% {
    height: 4px;
  }
}

.loaderRectangle div:nth-child(5) {
  animation-name: rectangleFiveAnim;
  animation-delay: 0.4s;
}

@keyframes rectangleFiveAnim {
  0% {
    height: 3px;
  }

  40% {
    height: 6px;
  }

  100% {
    height: 3px;
  }
}
</style>
