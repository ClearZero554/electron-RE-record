<template>
  <div class="audio">
    <div style="display: flex">
      <div>
        <el-scrollbar ref="scrollbar" :noresize="false">
          <div class="sidebar">
            <div class="title">
              <!--  <iconpark-icon
                name="folder-music"
                class="folder-music"
              ></iconpark-icon> -->
              <Icon
                fontName="icon-lianmaiyinleermai"
                class="folder-music"
              ></Icon>
              <div>音效库</div>
            </div>
            <div
              v-for="item in seClassList"
              :key="item.id"
              class="classification"
              :class="from.id == item.id ? 'action' : ''"
              @click="clickClass(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div>
        <div class="headerAudio">
          <div class="title">
            已搜到{{ from.search }}的{{ page.count }}种音效
          </div>

          <el-input
            slot="reference"
            size="mini"
            class="search"
            v-model="from.search"
            @change="seGetList()"
            placeholder="搜索问题解决方法"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="seGetList"
            ></el-button>
          </el-input>
          <div>
            <el-select
              v-model="choiceClass"
              placeholder=""
              size="small"
              popper-class="sound-select"
              popper-append-to-body
              :class="classIndex"
              @visible-change="getClassList()"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="audioMain">
          <div class="audioBox">
            <div class="audioList">
              <div>
                <div
                  class="audioItem"
                  :class="clickItem.id == item.id ? 'audioAction' : ''"
                  v-for="(item, index) in leftList"
                  :key="item.id"
                  @click="showContextMenu(item)"
                  v-on:dblclick="handleClick(item)"
                >
                  <div class="name">{{ index + 1 }}.{{ item.name }}</div>
                  <div class="audioItemRi">
                    <!--  <img
                      src="@/assets/svg/bf.svg"
                      alt=""
                      v-if="!item.isBf"
                      @click.stop="handleClick(item, index)"
                    />
                    <img
                      src="@/assets/svg/ks.svg"
                      alt=""
                      v-else
                      @click.stop="shop()"
                    /> -->
                    <!-- <iconpark-icon
                      name="play-one"
                      class="icon"
                      v-if="!item.isBf"
                      @click.stop="handleClick(item, index)"
                    ></iconpark-icon>
                    <iconpark-icon
                      name="pause"
                      class="icon"
                      v-else
                      @click.stop="shop()"
                    ></iconpark-icon> -->
                    <iconpark-icon
                      name="plus"
                      class="icon"
                      @click.stop="addCollection(item)"
                    ></iconpark-icon>
                    <div
                      :class="src == item.isBf ? 'static' : 'loaderRectangle'"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="verticalBar"></div>
              <div>
                <div
                  class="audioItem"
                  :class="clickItem.id == item.id ? 'audioAction' : ''"
                  v-for="(item, index) in riList"
                  :key="item.id"
                  @click="showContextMenu(item)"
                  v-on:dblclick="handleClick(item)"
                >
                  <div class="name">{{ index + 10 }}.{{ item.name }}</div>
                  <div class="audioItemRi">
                    <!-- <iconpark-icon
                      name="play-one"
                      class="icon"
                      v-if="!item.isBf"
                      @click.stop="handleClick(item, index)"
                    ></iconpark-icon>
                    <iconpark-icon
                      name="pause"
                      class="icon"
                      v-else
                      @click.stop="shop()"
                    ></iconpark-icon> -->
                    <iconpark-icon
                      name="plus"
                      class="icon"
                      @click.stop="addCollection(item)"
                    ></iconpark-icon>
                      <div
                      :class="src == item.isBf ? 'static' : 'loaderRectangle'"
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-pagination
              layout="prev, pager, next"
              :page-size="page.pageSize"
              :current-page.sync="page.pageNo"
              class="text-center"
              :total="page.count"
              @current-change="seGetList"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="audioFoot">
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
      </div>
      <div class="paly" v-if="!isBf" @click="play">
        <iconpark-icon name="play" class="playIcon"></iconpark-icon>
        <div>播放</div>
      </div>
      <div class="paly" v-else @click="shop">
        <iconpark-icon name="pause-one" class="playIcon"></iconpark-icon>
        <div>暂停</div>
      </div>
    </div>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import ipcUtil from "@/ipc";
import EditName from "@/views/audio/editName.vue";
import {
  categoryList,
  addCategory,
  deleteCategory,
  sortCategory,
  addList,
  updateList,
  delList,
  sortList,
  seCategoryList,
  seGetList,
} from "@/api/audio";
import lodash from "lodash";
import feedback from "@/utils/feedback";
export default {
  components: { vuedraggable, EditName },
  data() {
    return {
      choiceList: -1,
      audio: new Audio(),
      dialogVisible: false,
      shortcutKeys: [],
      outputList: [],
      src: "",
      progress: 0,
      maxTime: 0,
      volume: 50,
      isShowPopup: false,
      isShowClip: false, //剪辑音频的弹框

      wavesurfer: {},
      showType: "",
      isShowEditName: false, //重命名的弹框显示
      fileList: [], //上传列表
      copyItem: {}, //被复制的列表

      choiceClass: -1, //选择分类
      classList: [], //分类选择框
      seClassList: [], //音效分类选择框
      seList: [], //音效列表数据
      clickItem: {}, //被选中的item
      from: {
        search: "", //搜索关键词
        id: -1, //被选择的音效分类
      },
      page: {
        count: 0, //总条数
        pageNo: 1,
        pageSize: 18,
      },
      // 操作台状态
      console: {
        deviceId: "default", //输出设备
        volume: 50, //音量
        isBf: false,
      },
      isLoading: true, //加载页
    };
  },
  async mounted() {
    // 数据同步
    window.ipc.on("getConsole", (e, data) => {
      try {
        this.console.deviceId = JSON.parse(data).deviceId;
        this.console.volume = JSON.parse(data).volume;
        this.setOutputDevice(this.console.deviceId);
      } catch (error) {}
    });
    this.console.deviceId = localStorage.getItem("deviceId") || "default";
    // 获取音频输出设备
    this.getAudioFrequency();
    // 初始化
    await this.getClassList(1);
    await this.getList(1);

    let sliderButton = document.getElementsByClassName(
      "el-slider__button-wrapper"
    ); //滑块
    sliderButton[1].setAttribute("data-progress", this.progress);
  },
  watch: {
    volume: {
      handler(val) {
        this.audio.volume = (val / 100).toFixed(1);
      },
      immediate: true,
    },
  },
  computed: {
    leftList() {
      if (this.seList.length >= 9) {
        return this.seList.slice(0, 9);
      } else {
        return this.seList;
      }
    },
    riList() {
      if (this.seList.length >= 9) {
        return this.seList.slice(9, this.seList.length);
        // return this.seList.slice(0,11)
      } else {
        return [];
      }
    },
    classIndex() {
      let index = this.classList.findIndex(
        (item) => item.id == this.choiceClass
      );
      return "index" + index;
    },
  },
  methods: {
    handleClick(music) {
      if (music && !music.src) return;
      // 先暂停
      this.clickItem = lodash.cloneDeep(music);
      this.audio.pause();
      this.choiceList = music.id;
      this.console.isBf = true;
      this.progress = 0;
      this.audio.pause();
      this.audio.src = this.$root.url + music.src;
      // 调节声音
      this.audio.volume = this.volume / 100;
      this.audio.onloadeddata = () => {
        this.maxTime = Math.floor(this.audio.duration * 100) / 100;
        this.audio.play();
        this.audio.addEventListener("timeupdate", this.timeChang);
        this.seList.forEach((item) => {
          if (item.id == music.id) {
            item.isBf = true;
          } else {
            item.isBf = false;
          }
        });
      };
    },
    timeChang() {
      this.progress = this.audio.currentTime;
      let sliderButton = document.getElementsByClassName(
        "el-slider__button-wrapper"
      ); //滑块
      sliderButton[1].setAttribute(
        "data-progress",
        Math.floor(this.progress * 100) / 100
      );
      if (Math.floor(this.progress * 100) == Math.floor(this.maxTime * 100)) {
        this.console.isBf = false;
        this.seList.forEach((item) => {
          item.isBf = false;
        });
      }
    },
    // 音乐进度条改变
    progressBarChange(e) {
      if (this.audio.src) {
        this.audio.currentTime = e;
        this.play();
      }
    },
    // 根据id播放
    idPlay(id) {
      let obj = this.list.find((item) => item.id == id);
      if (obj) {
        this.handleClick(obj);
      }
    },
    // 播放
    play() {
      if (this.audio.src) {
        this.seList.forEach((item) => {
          if (this.clickItem.id == item.id) {
            item.isBf = true;
          } else {
            item.isBf = false;
          }
        });
        this.console.isBf = true;
        this.audio.play();
      } else {
        this.handleClick(this.clickItem);
      }
    },
    // 暂停
    shop() {
      // 让全部显示暂停
      this.seList.forEach((item) => (item.isBf = false));
      this.console.isBf = false;
      this.audio.pause();
    },
    // 获取音频输出设备
    getAudioFrequency() {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "audiooutput") {
              if (device.label.includes("Default")) {
                this.outputList.push({
                  label: "默认",
                  deviceId: device.deviceId,
                });
                if (device.deviceId == this.console.deviceId) {
                  this.setOutputDevice(this.console.deviceId);
                }
                return;
              }
              if (!device.label.includes("Communications")) {
                this.outputList.push(device);
                // 如果识别上了设备，就修改默认播放设备
                if (device.deviceId == this.console.deviceId) {
                  this.setOutputDevice(this.console.deviceId);
                }
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error enumerating output devices:", error);
        });
    },
    // 设置音频播放设备
    setOutputDevice(deviceId) {
      this.audio.setSinkId(deviceId);
    },
    // 输出设备发生改变
    outputChange(e) {
      this.setOutputDevice(e);
    },
    // 获取分类列表
    async getClassList(e) {
      // 获取分类列表
      const getCategoryList = await categoryList();
      if (getCategoryList.data.code == 200) {
        this.classList = getCategoryList.data.data;
        if (e == 1) {
          this.choiceClass = this.classList[0].id;
        }
      }
    },
    // 获取音频分类列表
    async getList(e) {
      const rel = await seCategoryList();
      if (rel.data.code == 200) {
        this.seClassList = rel.data.data;
        if (e == 1) {
          this.from.id = this.seClassList[0].id;
          this.seGetList();
        }
      }
    },
    // 获取音效库列表
    async seGetList() {
      const rel = await seGetList({
        ...this.from,
        ...this.page,
      });
      if (rel.data.code == 200) {
        this.seList = rel.data.data.lists.map((item) => {
          return {
            isBf: false,
            ...item,
          };
        });
        console.log(this.seList,'this.seList');
        this.page.count = rel.data.data.count;
        this.isLoading = false;
      }
    },
    // 点击item
    showContextMenu(item) {
      this.clickItem = lodash.cloneDeep(item);
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
    // 点击分类
    async clickClass(item) {
      if (item.name) {
        this.from.id = item.id;
        this.page = this.$options.data().page;
        await this.seGetList();
        this.progress = 0;
        // 初始化
        this.audio.pause();
        this.audio = new Audio();
        this.console.isBf = false;
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
      const data = this.list.map((item, index) => {
        return {
          ...item,
          sortNo: index,
        };
      });
      await sortList(data);
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
    shortcutKeyCallback(e, id) {
      this.idPlay(id);
    },
    // 设置置顶
    async setTop() {
      if (this.clickItem.isFirst == "0") {
        this.clickItem.isFirst = "1";
        if (this.showType == "item") {
          // 置顶列表
          let inx = -1;
          this.list.forEach((item, index) => {
            item.isFirst = "0";
            if (item.id == this.clickItem.id) {
              inx = index;
            }
          });
          // 剪切
          this.list.splice(inx, 1);
          // 添加元素
          this.list.unshift(this.clickItem);
          await this.complete();
          await this.getList();
        } else {
          // 置顶列表
          let inx = -1;
          this.classList.forEach((item, index) => {
            item.isFirst = "0";
            if (item.id == this.clickItem.id) {
              inx = index;
            }
          });
          // 剪切
          this.classList.splice(inx, 1);
          // 添加元素
          this.classList.unshift(this.clickItem);
          await this.classSortEnd();
          await this.getClassList();
        }
      } else {
        if (this.showType == "item") {
          this.list[0].isFirst = "0";
          await this.complete();
          await this.getList();
        } else {
          this.classList[0].isFirst = "0";
          await this.classSortEnd();
          await this.getClassList();
        }
      }
    },
    // 复制
    copy() {
      this.copyItem = lodash.cloneDeep(this.clickItem);
    },
    // 粘贴
    paste() {
      let index = this.list.findIndex((item) => item.id == this.clickItem.id);
      this.copyItem.id = this.clickItem.id;
      // 删除快捷键
      this.copyItem.shortcutKey = "";
      this.copyItem.isFirst = "0";
      this.list.splice(index, 1, this.copyItem);
      this.complete();
    },
    // 添加收藏
    async addCollection(item) {
      const data = {
        categoryId: this.choiceClass,
        name: item.name,
        src: item.src,
        originalSrc: item.src,
      };
      const res = await addList(data);
      if (res.data.code == 200) {
        let obj = this.classList.find((item) => item.id == this.choiceClass);
        ipcUtil.refreshAudio(obj.name);
        feedback.msgSuccess(`成功添加到${obj.name}分类`);
      } else {
        this.$message({
          message: res.data.msg,
          type: "msgWarning",
          offset: 50,
        });
        this.getClassList(1);
      }
    },
  },
};
</script>
<style>
.sound-select{
  width: 60px;
  border-radius: 20px;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>

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
.verticalBar {
  height: 100%;
  width: 1px;
  background: #aaa;
}
.audio {
  height: 624px;
  color: var(--fc);

  .sidebar {
    width: 160px;
    height: 560px;
    display: flex;
    // background: #f6f7f8;
    border-right: 1px solid #aaaaaa;
    flex-direction: column;
    .title {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 15px;
      .folder-music {
        margin-right: 10px;
        font-size: 20px;
      }
    }
    .classification {
      font-size: 16px;
      width: 132px;
      height: 40px;
      border-radius: 9px;
      margin-left: 14px;
      margin-bottom: 20px;
      text-align: center;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 2px solid var(--buttonBor);
    }
    .action {
      border: 2px solid #409eff;
    }
  }
  .popup {
    position: fixed;
    z-index: 9999;
    width: 130px;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 16px;
    border: 2px solid #000;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    background: #fff;
    div {
      height: 30px;
      text-align: center;
      cursor: pointer;
      line-height: 30px;
      &:hover {
        background: #bde2f6;
        border-radius: 16px;
      }
    }
  }
  .headerAudio {
    background: var(--b);
    display: flex;
    align-items: center;
    height: 54px;
    box-sizing: border-box;
    padding: 18px;
    .title {
      font-size: 12px;
      width: 420px;
      // color: #666;
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
        border: 1px solid var(--fc);
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
        border: 1px solid var(--fc);
        border-left: none;
        .el-icon-search {
          color: var(--fc);
        }
      }
    }
    .label {
      margin-left: 40px;
      font-size: 18px;
    }
    /deep/ .el-input--suffix {
      margin-left: 12px;
      width: 76px;
      margin-top: 2px;
      border-radius: 9px;
      overflow: hidden;
      background: #f2b5b3;
      color: #000;
      .el-input__inner {
        height: 30px;
        border: none;
        background: #f2b5b3;
        color: #000 !important;
      }
    }
    /deep/ .el-select .el-input .el-select__caret {
      color: #000 !important;
    }
  }
  .audioMain {
    display: flex;
    // height: 100%;
    width: 800px;
    background: var(--b);
    /deep/ .el-scrollbar__view {
      border-right: 2px solid #aaa;
    }
  }
  .audioBox {
    width: 800px;
    height: 507px;
    display: flex;
    flex-direction: column;

    .audioList {
      display: flex;
      flex-wrap: wrap;
      height: 475px;
      width: 800px;
      align-content: flex-start;
    }
    .audioItem {
      width: 350px;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      margin: 0 9px;
      margin-bottom: 12px;
      padding: 0px 12px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      border-radius: 9px;
      background: var(--bgc);
      &:hover {
        background: #aad4ff;
      }
      .name {
        width: 220px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
      .audioItemRi {
        display: flex;
        justify-content: space-around;
        align-items: center;
        // display: none;
        /*  img {
          cursor: pointer;
          width: 24px;
          height: 24px;
        } */
        i {
          cursor: pointer;
          font-weight: 800;
          font-size: 22px;
          margin-left: 10px;
        }
        .icon {
          cursor: pointer;
          font-weight: 800;
          font-size: 28px;
          margin-left: 10px;
        }
      }
      &:hover {
        .audioItemRi {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
    .audioAction {
      background: #aad4ff;
      border-radius: 9px;
      .audioItemRi {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

    .unmover {
      border: 2px solid #fee53b;
    }
  }
  .audioFoot {
    display: flex;
    height: 65px;
    align-items: center;
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
      // margin-left: 24px;
      cursor: pointer;
      .playIcon {
        margin-right: 4px;
      }
      div {
        font-size: 12px;
        font-weight: 700;
      }
    }
    .progressBar {
      display: flex;
      align-items: center;
      margin-left: 12px;
      width: 850px;
      /deep/ .el-slider {
        width: 730px;
        margin-right: 22px;
        margin-left: 22px;
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
      /deep/ .el-slider__button {
        width: 10px;
        height: 10px;
        border: 4px solid #409eff;
      }
    }

    .put {
      display: flex;
      .label {
        width: 80px;
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
      .notSet {
        font-size: 12px;
        color: #aaa;
        text-align: center;
      }
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
    margin-left: 16px;
  }
  .topping {
    color: red;
    margin-right: 16px;
  }
}
.ghostClass {
  opacity: 0 !important;
}
::v-deep .text-center {
  height: 18px;
  line-height: 18px;
  text-align: center;
  display: block;
  width: 97%;

  .number {
    font-size: 14px;
    color: #666666;
    background: rgba(0, 0, 0, 0);
  }
  .active {
    color: #409eff !important;
  }
  .btn-prev,
  .el-pager li,
  .btn-next {
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0);
    .number {
      font-weight: 700;
    }
    i {
      &::before {
        font-size: 16px;
      }
    }
  }
  .el-pager li {
    color: var(--fc);
  }
}

.index0 {
  /deep/ .el-input--suffix {
    background: #f6cece !important;
    .el-input__inner {
      background: #f6cece !important;
    }
  }
}
.index1 {
  /deep/ .el-input--suffix {
    background: #f9e3ce !important;
    .el-input__inner {
      background: #f9e3ce !important;
    }
  }
}
.index2 {
  /deep/ .el-input--suffix {
    background: #fffed2 !important;
    .el-input__inner {
      background: #fffed2 !important;
    }
  }
}
.index3 {
  /deep/ .el-input--suffix {
    background: #d7fcd0 !important;
    .el-input__inner {
      background: #d7fcd0 !important;
    }
  }
}
.index4 {
  /deep/ .el-input--suffix {
    background: #d6fffb !important;
    .el-input__inner {
      background: #d6fffb !important;
    }
  }
}
.index5 {
  /deep/ .el-input--suffix {
    background: #d2ecfb !important;
    .el-input__inner {
      background: #d2ecfb !important;
    }
  }
}
.index6 {
  /deep/ .el-input--suffix {
    background: #e6cef0 !important;
    .el-input__inner {
      background: #e6cef0 !important;
    }
  }
}
</style>