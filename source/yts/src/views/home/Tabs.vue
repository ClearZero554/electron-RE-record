<template>
  <div class="tabs" v-loading="fullscreenLoading">
    <div class="tabsTop">
      <div class="labs" id="tabs">
        <div
          v-for="(item, index) in tabs"
          :key="item.id"
          @click="handleClick(item, index)"
          class="tabsLab"
          :class="actionIndex == index ? 'action' : ''"
        >
          <div v-if="item.isNew" class="isNew"></div>
          {{ item.name }}
        </div>
      </div>

      <div class="plugins">
        <el-popover
          trigger="focus"
          popper-class="search-popover"
          v-model="searchVisible"
          @show="getSearchList"
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
              @click="handleSearch"
            ></el-button>
          </el-input>
          <div class="items search-scrollbar">
            <!-- 切换栏 -->
            <div class="switch">
              <div @click="switchType(1)" :class="type == 1 ? 'active' : ''">
                热门
              </div>
              <div @click="switchType(0)" :class="type == 0 ? 'active' : ''">
                历史
              </div>
            </div>
            <div class="history">
              <template v-if="type == 1">
                <div
                  class="item"
                  v-for="item in hotSearchList"
                  @click="handleClickHotSearch(item.name)"
                  :key="item.id"
                >
                  {{ item.name }}
                </div>
              </template>
              <template v-else>
                <div
                  class="item"
                  v-for="item in searchResultList"
                  @click="handleClickHotSearch(item.search)"
                  :key="item.id"
                >
                  <!-- <div class="closeItem" @click.stop="cancelCollection(item)">
                        <i class="el-icon-close"></i>
                      </div> -->
                  {{ item.search }}
                </div>
                <div v-if="!searchResultList" class="noList">
                  目前没有历史搜索
                </div>
              </template>
            </div>
          </div>
        </el-popover>

        <el-button
          size="mini"
          :class="this.tab == 8 ? 'collect action' : 'collect'"
          icon="el-icon-upload"
          @click="uploadPlugins"
          >上传</el-button
        >
        <div class="tip" v-if="remindCount"></div>
        <el-button
          size="mini"
          icon="el-icon-user"
          id="userInfo"
          :class="this.tab == null ? 'collect action' : 'collect'"
          @click="personalCenter"
          >个人中心</el-button
        >
      </div>
    </div>
    <!-- 二级分类 -->
    <div class="secondLevel" v-if="!isShowPersonalCenter">
      <div class="tabsLabs">
        <div
          class="tabsLab"
          @click="
            clickSon(
              {
                id: tabSon[0].pid,
                name: '全部',
              },
              99
            )
          "
          :class="tabSonIndex == 99 ? 'action' : ''"
        >
          全部
        </div>
        <div
          class="tabsLab"
          @click="clickSon(tabSon[tabSon.length - 1], null)"
          :class="tabSonIndex == null ? 'action' : ''"
        >
          热门
        </div>
      </div>
      <div style="display: flex">
        <div
          class="tabsLab"
          v-for="(item, index) in tabSon"
          :key="item.id"
          @click="clickSon(item, index)"
          :class="tabSonIndex == index ? 'action' : ''"
          v-show="index !== tabSon.length - 1"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 推荐 -->
    <UserInfo v-if="tab == null"></UserInfo>
    <!-- 上传 -->
    <Upload v-else-if="tab == 8"></Upload>
    <template>
      <div v-for="(value, key) in tabLists" :key="key" v-show="key == tab">
        <div class="imgList">
          <div
            v-for="tabList in value.tabs"
            :key="tabList.id"
            :style="{ opacity: tabList.id ? '1' : '0' }"
            @click="handleClickItems(tabList)"
            class="imgBox"
          >
            <div class="imgItem" v-if="tabList.cid != 5">
              <div class="new" v-if="tabList.isNew">NEW</div>
              <div class="svipImg" v-if="tabList.fees == 1"></div>
              <div
                v-else-if="tabList.fees == 2 || tabList.fees == 3"
                class="money"
              >
                <span style="color: #fdc4b3">{{ tabList.price }}</span>
                <img src="@/assets/金币.png" alt="" />
              </div>
              <!-- <el-image
                
                :src="tabList.image"
                :draggable="false"
              ></el-image> -->
              <div class="image">
                <img :src="tabList.image" alt="" />
              </div>
              <div class="title">{{ tabList.title }}</div>
            </div>
            <div
              class="allocationItem"
              @click="handleClickItems(tabList)"
              v-else
            >
              <div class="backgroundImg">
                <img :src="tabList.authorAvatar" alt="" />
              </div>

              <div class="allocationImgItem">
                <div class="image">
                  <img :src="tabList.image" alt="" />
                </div>
              </div>
              <div style="flex: 1;z-index:999">
                <div class="allocationInfo">
                  <div class="avatar">
                    <el-image
                      :src="tabList.authorAvatar"
                      :draggable="false"
                    ></el-image>
                  </div>
                  <div class="details">
                    <div class="nicknameBox">
                      <span class="nickname">{{ tabList.author }}</span>
                    </div>
                    <div class="id">ID:{{ tabList.authorId }}</div>
                  </div>
                </div>
                <div class="typeItem">
                  <el-popover
                    placement="bottom"
                    width="50"
                    trigger="hover"
                    popper-class="shortcutKeys-popover"
                    content="直播类型"
                  >
                    <div slot="reference" class="Frame"></div>
                  </el-popover>

                  {{ tabList.liveRemark }}
                </div>
                <div class="typeItem">
                  <el-popover
                    placement="bottom"
                    width="50"
                    trigger="hover"
                    popper-class="shortcutKeys-popover"
                    content="游戏设备"
                  >
                    <!-- <img src="@/assets/Frame-1.png" alt="" slot="reference"/> -->
                    <div slot="reference" class="Frame-1"></div>
                  </el-popover>
                  {{ tabList.deviceRemark }}
                </div>
                <div class="typeItem">
                  <el-popover
                    placement="bottom"
                    width="50"
                    trigger="hover"
                    popper-class="shortcutKeys-popover"
                    content="直播设备"
                  >
                    <!-- <img src="@/assets/Frame-2.png" alt="" slot="reference"/> -->
                    <div slot="reference" class="Frame-2"></div>
                  </el-popover>
                  <span class="typeItemText">{{ tabList.collectRemark }}</span>
                </div>
              </div>

              <div class="title">
                {{ tabList.author + "的配置:" + tabList.title }}
              </div>
            </div>
          </div>
        </div>

        <el-pagination
          v-if="value.count > 12"
          layout="prev, pager, next"
          class="text-center"
          :total="value.count"
          :page-size="value.pageSize"
          @current-change="(e) => currentChange(e, key)"
        ></el-pagination>
        <div class="pageOccupancy" v-else></div>
      </div>
    </template>

    <login ref="login"></login>
  </div>
</template>

<script>
import {
  category,
  list,
  delHistory,
  remindUnreadCount,
  searchList,
  searchHistory,
} from "@/api/article";
import Collect from "@/views/home/Collect.vue";
import Login from "@/views/dialog/Login.vue";
import feedback from "@/utils/feedback";
import UserInfo from "@/components/UserInfo/index.vue";
import moment from "moment";
import Upload from "@/components/Upload/index.vue";
export default {
  name: "tabs",
  components: { Collect, Login, UserInfo, Upload },
  data() {
    return {
      tab: null,
      tabSonIndex: null,
      tabs: [],
      tabSon: [], //子分类
      tabLists: {},
      pageNo: 1,
      pageSize: 12,
      count: 0,
      affix: null,
      affixTop: 500,
      offset: 84,
      searchVisible: false,
      visible: false,
      search: "",
      searching: false,
      zindex: 10,
      hotSearchList: [],
      searchResultList: [],
      actionIndex: 0, //高亮的lab
      type: 1,
      isShowPersonalCenter: false,
      fullscreenLoading: true,
      remindCount: 0,
      img: "theme",
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    this.pageNo = sessionStorage.getItem("pageNo") || 1;
    this.tab = Number(sessionStorage.getItem("tab"));
    this.actionIndex = Number(sessionStorage.getItem("actionIndex"));
    this.getTabs();
    this.remindUnreadCount();
    this.$bus.$on("remindUnreadCount", this.remindUnreadCount);
    this.$bus.$on("changeImg", this.changeImg);
  },
  methods: {
    getTabs() {
      category().then((res) => {
        if (res.data.code == 200) {
          this.tabs = res.data.data;
          // 处理列表数据
          this.tabs.forEach((item) => {
            if (item.children.length > 0) {
              item.children.forEach((e) => {
                this.$set(this.tabLists, e.id, {
                  tabs: [],
                  lists: {},
                  count: 0,
                  pageNo: 1,
                  pageSize: 12,
                });
              });
            }
            this.$set(this.tabLists, item.id, {
              tabs: [],
              lists: {},
              count: 0,
              pageNo: 1,
              pageSize: 12,
            });
          });
          if (this.actionIndex) {
            this.tabSon = JSON.parse(
              JSON.stringify(this.tabs[this.actionIndex].children)
            );
            this.tab = this.tabs[this.actionIndex].id.toString();
          } else {
            this.tab = this.tabs[0].id.toString();
            this.tabSon = JSON.parse(JSON.stringify(this.tabs[0].children));
          }

          this.tabSonIndex = 99;
          this.getList();
        }
      });
    },
    // 请求总数据
    async getList() {
      console.log("[ this.tab ] >", this.tab);
      for (const key in this.tabLists) {
        if (key == this.tab) {
          const res = await list({
            cid: this.tab,
            sort: this.tabSonIndex == null ? "hot" : "sort",
            pageNo: this.tabLists[key].pageNo,
            pageSize: 12,
          });
          if (res.data.code == 200) {
            this.tabLists[key].count = res.data.data.count;
            if (this.tab != 19 && this.tab != 5) {
              let length = res.data.data.lists.length;
              res.data.data.lists.forEach((item) => {
                if (item.cid == 5) length++;
              });
              for (let index = 0; index < 12 - length; index++) {
                res.data.data.lists.push({});
              }
            }
            this.$set(
              this.tabLists[key].lists,
              this.tabLists[key].pageNo,
              res.data.data.lists.map((item) => {
                return {
                  ...item,
                  isNew: moment(item.createTime).add(3, "d").isAfter(moment()),
                };
              })
            );
            // 处理分页
            this.currentChange(this.tabLists[key].pageNo, key);
            this.fullscreenLoading = false;
          }
        }
      }
    },
    // 搜索热门
    async getSearchList() {
      const res = await searchList();
      if (res.data.code == 200) {
        this.hotSearchList = res.data.data;
      }
      const rel = await searchHistory();
      if (rel.data.code == 200) {
        this.searchResultList = rel.data.data;
      }
    },
    // 处理分页
    currentChange(page, tab) {
      for (const key in this.tabLists) {
        if (key == tab) {
          console.log(this.tabLists[key].lists[page]);
          this.tabLists[key].pageNo = page;
          if (this.tabLists[key].lists[page]) {
            this.tabLists[key].tabs = this.tabLists[key].lists[page];
          } else {
            this.getList();
          }
        }
      }
    },
    // v2 tab点击
    async handleClick(tab, index) {
      console.log(tab);
      this.tabSon = JSON.parse(JSON.stringify(tab.children));
      /* if (this.tabSon.length == 1) {
        this.tabSon.unshift({
          id: this.tabSon[0].pid,
          name: "全部",
        });
      } */
      this.actionIndex = index;
      this.tabSonIndex = 99;
      sessionStorage.setItem("actionIndex", this.actionIndex);
      this.tab = tab.id.toString();
      /* if (tab.children.length > 1) {
        this.tab = tab.children[0].id.toString();
      } else {
      } */
      sessionStorage.setItem("tab", this.tab);
      this.isShowPersonalCenter = false;
      for (const key in this.tabLists) {
        if (key == this.tab && this.tabLists[key].count == 0) {
          await this.getList();
        }
      }
    },
    handleClickItems(item) {
      if (!item.id) {
        return;
      }
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用");
        return;
      }
      sessionStorage.setItem("actionIndex", this.actionIndex);
      sessionStorage.setItem("tab", this.tab);
      sessionStorage.setItem("pageNo", this.pageNo);
      if (item.cid == 9) {
        this.$router.push(`/details/${item.id}?isFont=1`);
      } else {
        this.$router.push(`/details/${item.id}`);
      }
    },
    handleSearch() {
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用");
        return;
      }
      // this.$emit("change", this.search);
      this.$router.push({
        name: "home",
        query: {
          keyword: this.search,
        },
      });
    },
    handleClickHotSearch(search) {
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用");
        return;
      }
      this.search = search;
      this.handleSearch();
    },
    // 切换热门与历史 1-热门 0-历史
    switchType(type) {
      this.type = type;
    },
    // 删除历史
    async cancelCollection(item) {
      const res = await delHistory({ id: item.id });
      if (res.data.code == 200) {
        this.getList();
      }
    },
    // 点击子分类
    clickSon(item, index) {
      this.tabSonIndex = index;
      this.tab = item.id;
      for (const key in this.tabLists) {
        if (
          (key == this.tab && this.tabLists[key].count == 0) ||
          this.tab == -1
        ) {
          this.getList();
        }
      }
    },
    // 个人中心
    personalCenter() {
      this.tab = null;
      this.actionIndex = null;
      this.isShowPersonalCenter = true;
    },
    uploadPlugins() {
      this.tab = 8;
      this.actionIndex = null;
      // 隐藏二级分类
      this.isShowPersonalCenter = true;
    },
    async remindUnreadCount() {
      const res = await remindUnreadCount();
      if (res.data.code == 200) {
        this.remindCount = res.data.data;
      }
    },
    // 切换图标
    changeImg(type) {
      this.img = type;
    },
  },
};
</script>

<style scoped lang="scss">
.pageOccupancy {
  width: 100%;
  height: 30px;
}
.allocationItem {
  width: 432px;
  height: 154px;
  cursor: pointer;
  margin-bottom: 16px;
  // background: var(--tgLeft);
  
  border-radius: 9px;
  display: flex;
  position: relative;
  padding: 8px;
  box-sizing: border-box;
  
  .backgroundImg {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    // backdrop-filter: blur(10px);
    // -webkit-backdrop-filter: blur(10px);
    border: 1px solid #D9D9D9;
    border-radius: 9px;
    top: 0;
    left: 0px;
    width: 432px;
    height: 154px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
    overflow: hidden;
    
    img {
      width: 100%;
      filter: blur(15px);
    }
  }
  .allocationImgItem {
    z-index: 1;
    // margin: 10px;
    &:hover /deep/ .image img {
      transform: scale(1.2);
      transition: all 200ms linear;
    }
    /deep/ .image {
      border: 1px solid #ccc;
      border-radius: 9px;
      width: 198px;
      height: 138px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      img {
        width: 198px;
      }
    }
  }
  .typeItem {
    z-index: 1;
    font-size: 12px;
    height: 21px;
    color: var(--fc);
    margin-left: 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .Frame {
      z-index: 999;
      background-image: var(--camera);
      background-size: 100% 100%;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
    .Frame-1 {
      background-image: var(--handle);
      background-size: 100% 100%;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
    .Frame-2 {
      background-image: var(--resolvingPower);
      background-size: 100% 100%;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
    .typeItemText {
      z-index: 1;
      display: inline-block;
      width: 180px;
    }
    img {
      z-index: 1;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
  }
  .allocationInfo {
     z-index: 1;
    flex: 1;
    width: 100%;
    height: 60px;
    // background-color: var(--virtualization);
    border-radius: 16px;
    display: flex;
    .avatar {
      width: 42px;
      height: 42px;
      margin: 5px 15px;
      border-radius: 50%;
      overflow: hidden;
      /deep/ .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .details {
       z-index: 1;
      padding: 5px 0;
      color: var(--fc);
      .nicknameBox {
        .nickname {
          font-size: 14px;
          vertical-align: bottom;
          width: 100px;
          font-weight: 700;
          /* 隐藏超出容器的部分 */
          overflow: hidden;
          /* 强制文本在一行内显示 */
          white-space: nowrap;
          /* 超出部分用省略号表示 */
          text-overflow: ellipsis;
        }
      }
      .id {
        font-size: 10px;
        margin-top: 2px;
        width: 100%;
      }
    }
  }
  .title {
    position: absolute;
    bottom: -15px;
    max-width: calc(100% - 50px);
    color: var(--fc);
    font-size: 10px;
    font-weight: 600;
    padding: 0 12px;
  }
}

.tabs {
  position: relative;
  margin-top: 22px;
  height: 637px;
  display: flex;
  flex-direction: column;

  .tabsTop {
    display: flex;
    justify-content: space-between;
    margin-top: 38px;
    width: 100%;
    .labs {
      display: flex;
      align-items: center;
      background: var(--secondLevel);
      border-radius: 8px;
      padding: 0 4px;
      .tabsLab {
        position: relative;
        font-size: 14px;
        font-family: Adobe Heiti Std;
        font-weight: normal;
        color: var(--fc);
        font-weight: 600;
        width: 47px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        .isNew {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: red;
          top: 1px;
          left: 3px;
        }
        &:hover {
          border-radius: 7px;
          cursor: pointer;
        }
      }
      .action {
        background-color: #409eff !important;
        color: #fff;
        border-radius: 7px;
      }
    }
    .plugins {
      display: flex;
      height: 30px;
      background-color: var(--bgc);
      position: relative;
      .tip {
        position: absolute;
        right: -3px;
        top: -3px;
        text-align: center;
        line-height: 20px;
        width: 12px;
        height: 12px;
        background: red;
        color: #fff;
        border-radius: 50%;
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
      .collect {
        font-size: 16px;
        padding: 3px 9px;
        border: 2px solid #a0cfff;
        border-radius: 8px;
        background: var(--tgb);
        color: var(--fc);
        margin-left: 4px;
        box-sizing: border-box;
        height: 30px;
      }
      .action {
        background: #409eff;
        color: #fff;
        border-radius: 7px;
      }
    }
  }
  .imgList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    margin-top: 6px;
    height: 530px;
    width: 100%;
    .imgBox {
      margin-bottom: 8px;
    }
    .imgItem {
      box-sizing: border-box;
      position: relative;
      margin: 2px;
      .new {
        position: absolute;
        color: #fdc4b3;
        z-index: 999;
        top: 8px;
        left: 8px;
        font-size: 14px;
      }
      .svipImg {
        width: 20px;
        height: 20px;
        background-image: url("@/assets/svip.png");
        background-size: 100% 100%;
        position: absolute;
        z-index: 2;
        right: 15px;
        top: 10px;
      }
      .money {
        position: absolute;
        z-index: 2;
        right: 15px;
        top: 10px;
        background: rgba(0, 0, 0, 0.3);

        font-size: 12px;
        width: 40px;
        height: 18px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        line-height: 18px;
        padding: 0 4px;
        img {
          height: 15px;
        }
      }
      .image {
        border: 1px solid #ccc;
        border-radius: 16px;
        width: 210px;
        height: 154px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 210px;
        }
      }
      .title {
        max-width: calc(100% - 50px);
        color: var(--fc);
        font-size: 10px;
        font-weight: 600;
        padding: 0 12px;
      }
    }
    .bottom {
      width: 100%;
      height: 18px;
    }
  }
  .secondLevel {
    height: 24px;
    width: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-left: 2px;
    // padding: 0 12px;
    box-sizing: border-box;
    .tabsLabs {
      // width: 77px;
      display: flex;
    }
    .action {
      color: #409eff !important;
      border-radius: 7px;
      &:hover {
        // color: #000;
        border-radius: 7px;
        cursor: pointer;
      }
    }
    .tabsLab {
      font-size: 13px;
      font-weight: normal;
      color: var(--fc);
      font-weight: 600;
      text-align: center;
      padding: 0 4px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 4px;
      &:hover {
        border-radius: 7px;
        cursor: pointer;
      }
    }
  }
}
::v-deep .imgItem {
  &:hover .image img {
    transform: scale(1.2);
    transition: all 200ms linear;
  }
}

::v-deep .text-center {
  height: 18px;
  line-height: 18px;
  text-align: center;
  display: block;
  width: 100%;

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

.search-popover {
  width: 372px;
  border-radius: 9px;
  background: var(--tgRight);
  .items {
    height: 100px;
    width: 372px;
    background: var(--tgRight);
    .switch {
      display: flex;
      width: 372px;
      height: 20px;
      color: var(--fc);
      border-bottom: 3px solid #ccc;
      margin-bottom: 8px;
      background: var(--tgRight);
      .active {
        border-bottom: 3px solid #a0cfff;
      }
      div {
        margin-left: 31px;
        cursor: pointer;
      }
    }
    .history {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow-y: scroll;
      width: 372px;
      height: 126px;
      &::-webkit-scrollbar {
        display: none;
      }
      /* 滚动条轨道样式 */
      &::-webkit-scrollbar-track {
        background: #f1f1f1; /* 滚动条轨道的背景色 */
      }
      /* 滚动条滑块样式 */
      &::-webkit-scrollbar-thumb {
        background: #888; /* 滚动条滑块的颜色 */
        border-radius: 10px; /* 滑块的圆角 */
      }
      /* 当滑块悬停时 */
      &::-webkit-scrollbar-thumb:hover {
        background: #555; /* 悬停时的颜色 */
      }
      .noList {
        width: 372px;
        text-align: center;
      }
    }
  }

  .item {
    background: #d9d9d9;
    color: #333;
    height: 20px;
    text-align: center;
    border-radius: 3px;
    font-size: 10px;
    line-height: 20px;
    cursor: pointer;
    position: relative;
    padding: 3px 8px;
    margin-left: 8px;
    margin-bottom: 8px;
    &:hover {
      background-color: #ccc;
    }
    // .closeItem {
    //   position: absolute;
    //   width: 16px;
    //   height: 16px;
    //   right: 2px;
    //   font-size: 12px;
    //   line-height: 16px;
    //   text-align: center;
    //   cursor: pointer;
    //   z-index: 20;
    //   background-color: #eee;
    //   border-radius: 16px;
    // }
  }

  .empty {
    display: block;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 18px;
  }

  .result {
    width: 160px;
    color: #5254e2;
  }

  .popper__arrow {
    border-bottom-color: #333 !important;

    &::after {
      border-bottom-color: #333 !important;
    }
  }
}
</style>


