<template>
  <div class="tabs">
    <div class="tabsTop">
      <!--  <div class="labs">
      
      </div> -->
      <div class="plugins">
        <div class="searchTitle">为您搜索到“{{ search }}”的内容</div>
        <div class="pluginsInput">
          <span class="icon" @click="handleGoBack"
            ><i class="el-icon-arrow-left"></i
          ></span>
          <span
            class="icon"
            @click="handleGoBefore"
            :class="virtualization ? 'virtualization' : ''"
            ><i class="el-icon-arrow-right"></i
          ></span>

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
        </div>

        <!--   <el-popover
          placement="top"
          popper-class="collect-popover"
          v-model="visible"
        >
          <el-button
            slot="reference"
            size="mini"
            class="collect"
            :style="{ zIndex: zindex }"
            >收藏箱</el-button
          >
          <collect></collect>
        </el-popover> -->
      </div>
    </div>
    <el-scrollbar class="items search-scrollbar">
      <!--  <div class="imgList">
        <div
          v-for="tabList in searchPageChange"
          :key="tabList.id"
          @click="handleClickItems(tabList.id)"
          class="imgItem"
        >
          <span class="title">{{ tabList.title }}</span>
          <el-image
            fit="cover"
            :src="tabList.image"
            :draggable="false"
          ></el-image>
        </div>
      </div> -->
      <div class="imgList">
        <div
          v-for="tabList in searchPageChange"
          :key="tabList.id"
          @click="handleClickItems(tabList.id)"
          class="imgItem"
        >
          <div class="svipImg" v-if="tabList.fees == 1"></div>
          <div v-else-if="tabList.fees == 2 || tabList.fees == 3" class="money">
            <span style="color: #fdc4b3">{{ tabList.price }}</span>
            <img src="@/assets/金币.png" alt="" />
          </div>
          <el-image
            fit="cover"
            :src="tabList.image"
            :draggable="false"
          ></el-image>
          <div class="title">{{ tabList.title }}</div>
        </div>
      </div>
    </el-scrollbar>
    <!-- <div class="bottom"></div> v-if="count > 12"-->
    <el-pagination
      v-if="count > 12"
      layout="prev, pager, next"
      class="text-center"
      :total="count"
      :page-size="pageSize"
      :current-page.sync="pageNo"
    ></el-pagination>
    <login ref="login"></login>
  </div>
</template>

<script>
import {
  category,
  list,
  delHistory,
  searchList,
  searchHistory,
} from "@/api/article";
import Collect from "@/views/home/Collect.vue";
import Login from "@/views/dialog/Login.vue";

export default {
  name: "tabs",
  components: { Collect, Login },
  props: ["keyWord", "virtualization"],
  data() {
    return {
      tab: null,
      tabs: [],
      tabLists: [],
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
    };
  },
  mounted() {
    this.search = this.keyWord;
    this.getTabs();
  },
  activated() {
    this.search = this.keyWord;
    this.getTabs();
  },
  computed: {
    // 计算属性对数据进行处理
    searchPageChange() {
      let start = (this.pageNo - 1) * this.pageSize;
      if (start >= this.tabLists.length) start = 0;
      let end = this.pageNo * this.pageSize;
      if (end >= this.tabLists.length) end = this.tabLists.length;
      return this.tabLists.slice(start, end);
    },
  },
  methods: {
    getTabs() {
      list({ keyword: this.search }).then((res) => {
        if (res.data.code == 200) {
          this.searching = false;
          this.count = res.data.data.count;
          this.tabLists = res.data.data.lists;
          this.hotSearchList = res.data.data.extend.history;
        }
      });
    },
    // 搜索热门
    async getSearchList() {
      const res = await searchList();
      console.log("[ res.data ] >", res.data);
      if (res.data.code == 200) {
        this.hotSearchList = res.data.data;
      }
      const rel = await searchHistory();
      console.log(rel.data, "rel.data");

      if (rel.data.code == 200) {
        this.searchResultList = rel.data.data;
      }
    },
    async getList(page) {
      this.pageNo = page;
      const rel = await list({
        cid: "9",
        pageNo: this.pageNo,
        pageSize: 999,
        sort: "sort",
      });
      if (rel.data.code == 200) {
        this.hotSearchList = rel.data.data.extend.history;
        return rel.data.data.lists;
      } else {
        return [];
      }
    },
    handleClickHotSearch(index) {
      this.search = this.hotSearchList[index];
      this.searchVisible = false;
      this.handleSearch();
    },
    // v2 tab点击
    handleClick(tab, index) {
      this.actionIndex = index;
      this.tab = tab.id.toString();
      this.pageNo = 1;
      this.getList();
    },
    async handleClickItems(e) {
      const rel = await this.getList();
      if (rel.length > 0) {
        const flag = rel.findIndex((item) => item.id == e);
        // flag 有值就是字体
        if (flag != -1) {
          this.$router.push(`/details/${e}?isFont=1`);
        } else {
          this.$router.push(`/details/${e}`);
        }
      }
    },
    // 切换热门与历史 1-热门 0-历史
    switchType(type) {
      this.type = type;
    },
    handleSearch() {
      this.getTabs();
    },
    handleGoBack() {
      // 回退
      this.$root.handleGoBack();
    },
    handleGoBefore() {
      // 前进
      this.$root.handleGoBefore();
    },
    // 删除历史
    async cancelCollection(item) {
      const res = await delHistory({ id: item.id });
      if (res.data.code == 200) {
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.search-popover {
  width: 372px;
  border: 2px solid #333;
  border-radius: 9px;
  height: 146px;
  .items {
    height: 100px;
    width: 372px;
    .switch {
      display: flex;
      width: 372px;
      height: 20px;
      border-bottom: 3px solid #ccc;
      margin-bottom: 8px;
      background: var(--bgc);
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
      overflow-y: scroll;
      align-content: flex-start;
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
.bottom {
  width: 100%;
  height: 32px !important;
}
.tabs {
  position: relative;
  margin-top: 80px;
  min-height: 610px;
  display: flex;
  flex-direction: column;
  .tabsTop {
    display: flex;
    .searchTitle {
      flex: 1;
      line-height: 28px;
      font-weight: 600;
      font-size: 14px;
    }
    .plugins {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 33px;
      background-color: var(--bg);
      color: var(--fz) !important;
      .pluginsInput {
        display: flex;
      }
      .search {
        width: 244px;
        border-radius: 30px;
        z-index: 1;
        margin-right: 6px;
        height: 30px;
        box-sizing: border-box;
        /deep/ .el-input__inner {
          border-top-left-radius: 9px;
          border-bottom-left-radius: 9px;
        }
        /deep/ input {
          background-color: var(--bgc);
          color: var(--fc);
          height: 30px;
        }

        /deep/ .el-input-group__append {
          background-color: var(--bgc);
          font-size: 16px !important;
          border-top-right-radius: 9px;
          border-bottom-right-radius: 9px;
          .el-icon-search {
            color: var(--fc);
          }
        }
      }
      .collect {
        font-size: 18px;
        z-index: 1;
        padding: 5px 9px;
        border: 2px solid #a0cfff;
        border-radius: 8px;
      }
    }
  }
  .imgList {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr; /* 定义四列，其中第一列和第三列宽度是第二列和第四列的两倍 */
    grid-gap: 8px; /* 在网格单元格之间添加间距 */
    grid-auto-flow: row dense; /* 自动填充行，并尽量填满每一行 */
    align-content: flex-start;
    margin-top: 4px;
    height: 540px;
    width: 100%;
    .imgItem {
      // margin-bottom: 4px;
      box-sizing: border-box;
      position: relative;
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
      .el-image {
        border: 1px solid #000;
        border-radius: 16px;
        width: 209px;
        height: 154px;
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
  .imgList :nth-child(4n) {
    margin-right: 0px;
  }
}
::v-deep .imgItem {
  .el-image {
    height: 172px;
    width: 206px;
  }
  &:hover .el-image img {
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
.virtualization {
  color: #e3e3e3;
  cursor: initial;
}
.icon {
  display: inline-block;
  position: relative;
  top: 0px;
  padding: 3px;
  border-radius: 3px;

  i {
    font-size: 24px;
    font-weight: 700;
  }

  &:hover {
    background-color: #f3f3f3;
  }
}
</style>

