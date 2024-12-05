<template>
  <div class="userInfo">
    <div class="top">
      <!-- 头像 -->
      <div class="avatar">
        <el-image :src="userInfo.avatar" :draggable="false"></el-image>
      </div>
      <div class="details">
        <div class="nicknameBox">
          <span class="nickname">{{ userInfo.nickname }}</span>
          <div class="vipBox">
            <VipBox :time="false"></VipBox>
          </div>
        </div>
        <div class="id">
          <span>ID:{{ userInfo.id }}</span>
          <span class="phone"
            >手机号:{{ userInfo.mobile || "未绑定手机号" }}</span
          >
          <span class="phone" style="color: #0d99ff" @click="changePhone">{{
            userInfo.mobile ? "更换手机" : "绑定手机"
          }}</span>
        </div>
        <div class="id">
          <span>签名:{{ userInfo.signature || "啥也没有写~" }}</span>
          <iconpark-icon
            name="edit-two"
            class="icon"
            @click="openSetUp"
          ></iconpark-icon>
          <iconpark-icon
            name="protect"
            class="icon"
            @click="openSafe"
          ></iconpark-icon>
        </div>
        <div class="id">
          <span style="color: #0d99ff"
            >会员到期时间：{{ userInfo.memberExpirationTime }}</span
          >
        </div>
        <div class="id">
          <span style="color: #fec700">现有金币：{{ userInfo.money }}</span>
        </div>
      </div>
      <div class="buttons">
        <div class="recharge charge" @click="openRecharge">充值</div>
        <div class="charge" @click="openConsumptionRecords">消费记录</div>

        <div class="charge" @click="myMessage">我的消息</div>
        
        <div
          class="charge"
          @click="sharingCode"
          v-if="userInfo.isVisibleMembershipCode == 1"
        >
          分享码列表
        </div>
        <div class="charge" style="opacity: 0;"></div>
        <div class="charge" @click="myEarnings">我的收益</div>
      </div>
    </div>
    <div class="actionBar">
      <div :class="level.one == 0 ? 'action' : ''" @click="changeLevel1(0)">
        下载的素材
      </div>
      <div :class="level.one == 1 ? 'action' : ''" @click="changeLevel1(1)">
        我的购买
      </div>
      <div :class="level.one == 2 ? 'action' : ''" @click="changeLevel1(2)">
        我的收藏
      </div>
      <div :class="level.one == 3 ? 'action' : ''" @click="changeLevel1(3)">
        我的上传
      </div>
    </div>
    <div class="level2">
      <div :class="level.two == 1 ? 'action' : ''" @click="changeLevel2(1)">
        全部
      </div>
    </div>
    <div class="imgList" v-if="list.length > 0">
      <div
        v-for="tabList in tabLists"
        :key="tabList.id"
        @click="handleClickItems(tabList)"
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
        <div class="open" v-if="level.one ==0">
          <div class="openFile" @click.stop="openVideo">打开目录</div>
        </div>
        <div class="title">{{ tabList.title }}</div>
      </div>
    </div>
    <div v-else class="imgEmpty">
      <img src="@/assets/空状态.png" alt="">
      <div class="text" v-if="level.one == 0">暂无下载，快去下载吧~</div>
      <div class="text" v-if="level.one == 1">暂无购买~</div>
      <div class="text" v-if="level.one == 2">暂无收藏~</div>
      <div class="text" v-if="level.one == 3">暂无上传，快去上传吧~</div>
    </div>
    <el-pagination
      v-if="list.length > 8"
      layout="prev, pager, next"
      class="text-center"
      :page-size="8"
      :total="list.length"
      @current-change="(e) => currentChange(e, key)"
    ></el-pagination>
    <div class="bottom" v-else></div>
    <!-- 充值  -->
    <!-- <Recharge ref="recharge" @init="init"></Recharge> -->
    <Vip ref="Vip"></Vip>
    <!-- 消费记录 -->
    <ConsumptionRecords ref="consumptionRecords"></ConsumptionRecords>
    <SharingCode ref="sharingCode"></SharingCode>
    <!-- 我的消息 -->
    <MyMessage
      ref="myMessage"
      @remindUnreadCount="remindUnreadCount"
    ></MyMessage>
    <MyEarnings ref="myEarnings"></MyEarnings>

    <detail ref="detail"></detail>
    <safe ref="safe"></safe>
    <sms ref="sms"></sms>
  </div>
</template>

<script>
import Detail from "@/views/dialog/Detail.vue";
import Safe from "@/views/dialog/Safe.vue";
import Sms from "@/views/dialog/Sms.vue";
import ConsumptionRecords from "@/components/ConsumptionRecords/index.vue";
import ChoiceUser from "@/components/ChoiceUser/index.vue";
import { collectList, list, articleRecord,userUploadList } from "@/api/article";
import ipcUtil from "@/ipc";
import { cloneDeep } from "lodash";
import MyMessage from "@/components/MyMessage/index.vue";
import MyEarnings from "@/components/MyEarnings/index.vue";
import { remindUnreadCount } from "@/api/article";
import SharingCode from "@/components/sharingCode/index.vue";
import VipBox from "@/components/VipBox";
import Vip from "@/views/dialog/Vip.vue";

export default {
  name: "userInfo", //个人中心
  components: {
    MyMessage,
    MyEarnings,
    Detail,
    Safe,
    Sms,
    ConsumptionRecords,
    ChoiceUser,
    SharingCode,
    VipBox,
    Vip,
  },
  data() {
    return {
      level: {
        one: 0,
        two: 1,
      },
      list: [],
      localList: [],
      tabLists: [], //渲染的数据
      remindCount: 0,
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    this.init();
    this.remindUnreadCount();
  },
  methods: {
    openRecharge() {
      this.$refs.Vip.visible = true;
    },
    openConsumptionRecords() {
      this.$refs.consumptionRecords.visible = true;
    },
    openSetUp() {
      this.$refs.detail.visible = true;
    },
    openSafe() {
      this.$refs.safe.visible = true;
    },
    // 我的收益
    myEarnings(){
      this.$refs.myEarnings.dialogVisible = true;

    },
    changePhone() {
      this.$refs.sms.smscode = null;
      this.$refs.sms.mobile = null;
      this.$refs.sms.count = 60;
      this.$refs.sms.smscodeLabel = "获取验证码";
      this.$refs.sms.visible = true;
    },
    async remindUnreadCount() {
      const res = await remindUnreadCount();
      if (res.data.code == 200) {
        this.remindCount = res.data.data;
      }
    },
    async changeLevel1(e) {
      this.level.one = e;
      if (this.level.one === 2) {
        // 收藏
        const res = await collectList({ pageSize: 1000 });
        if (res.data.code == 200) {
          this.list = cloneDeep(res.data.data.lists);
          this.currentChange(1);
        }
      } else if (this.level.one === 0) {
        this.list = cloneDeep(this.localList);
        this.currentChange(1);
      } else if (this.level.one === 1) {
        const res = await articleRecord();
        if (res.data.code == 200) {
          this.list = cloneDeep(res.data.data.lists);
          this.currentChange(1);
        }
      }else if (this.level.one === 3) {
        const res = await userUploadList();
        console.log('[ res ] >', res)
        if (res.data.code == 200) {
          this.list = cloneDeep(res.data.data.lists);
          this.currentChange(1);
        }
      }
    },
    changeLevel2(e) {
      this.level.two = e;
    },
    // 识别下载的素材
    async init() {
      const videoPath = ipcUtil.getStore("setting").videoPath;
      // 获取素材本地列表
      const fileList = await ipcUtil.readDir(videoPath);
      // 获取素材服务列表
      const res = await list({ cid: 4, sort: "sort" });
      if (res.data.code == 200) {
        res.data.data.lists.forEach((item) => {
          fileList.forEach((e) => {
            if (item.resourceName === e.name) {
              this.localList.push({
                ...item,
                localPath: e.path,
              });
            }
          });
        });
      }
      this.list = cloneDeep(this.localList);
      this.currentChange(1);
    },
    handleClickItems(item) {
      if (this.level.one == 2) {
        if (item.cid == 9) {
          this.$router.push(`/details/${item.articleId}?isFont=1`);
        } else {
          this.$router.push(`/details/${item.articleId}`);
        }
      } else {
        if (item.cid == 9) {
          this.$router.push(`/details/${item.id}?isFont=1`);
        } else {
          this.$router.push(`/details/${item.id}`);
        }
      }
    },
    openVideo() {
      const videoPath = ipcUtil.getStore("setting").videoPath;
      ipcUtil.openDir(videoPath);
    },
    // 分页切换
    currentChange(page) {
      this.tabLists = this.list.slice((page - 1) * 8, page * 8);
    },
    // 打开我的消息
    myMessage() {
      this.$refs.myMessage.dialogVisible = true;
    },
    sharingCode() {
      this.$refs.sharingCode.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.imgEmpty{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 350px;
  position: relative;
  img{
    width: 400px;
    height: 300px;
  }
  .text{
    position: absolute;
    top: 250px;
    font-size: 12px;
    color: #999;
  }
}
.userInfo {
  width: 100%;
  color: var(--fc);

  .top {
    margin-top: 8px;
    width: 872px;
    height: 130px;
    background: var(--userInfoTop);
    border-radius: 16px;
    display: flex;
    .avatar {
      width: 78px;
      height: 78px;
      margin: 16px;

      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #fff;
      /deep/ .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .details {
      width: 242px;
      padding: 14px 0;

      .nicknameBox {
        display: flex;
        align-items: center;
        .vipBox {
          margin-left: 8px;
        }
        .nickname {
          font-size: 14px;
          font-weight: 700;
        }
      }
      .id {
        font-size: 12px;
        margin-top: 6px;
        width: 100%;
        display: flex;
        align-items: center;
        .phone {
          margin-left: 8px;
          cursor: pointer;
        }
        .icon {
          font-size: 12px;
          margin-left: 8px;
          background: #d9d9d9;
          font-weight: 700;
          color: #000;
          cursor: pointer;
          border-radius: 3px;
          &:hover {
            background: #0d99ff;
            color: #fff;
          }
        }
      }
    }

    .wallet {
      // margin-left: 200px;
      padding: 10px 0;
      font-size: 15px;
      width: 290px;
      .jzs {
        align-items: center;
        margin-bottom: 4px;
      }

      .introduce {
        font-size: 14px;
        color: var(--fc);
      }
      .recharge {
        width: 100px;
        height: 30px;
        border-radius: 8px;
        background: #409eff;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }
  }
  .buttons {
    display: flex;
    position: relative;
    width: 160px;
    height: 68px;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 330px;
    margin-top: 8px;
    .charge {
      width: 72px;
      height: 30px;
      border-radius: 8px;
      background: var(--button);
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #d9d9d9;
      margin-bottom: 8px;
      &:hover {
        background: #0d99ff;
      }
    }
    .tip {
      position: absolute;
      right: -8px;
      top: -8px;
      text-align: center;
      line-height: 20px;
      width: 20px;
      height: 20px;
      background: red;
      color: #fff;
      border-radius: 50%;
    }
  }
}
.actionBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--secondLevel);
  border-radius: 9px;
  margin-top: 12px;
  width: 320px;
  height: 30px;
  
  div {
    position: relative;
    font-size: 12px;
    padding: 1px 6px;
    font-weight: 700;
    color: var(--fc);
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    cursor: pointer;
  }
  .action {
    background-color: #409eff !important;
    border-radius: 9px;
    color: #fff;
  }
}

.level2 {
  display: flex;
  font-size: 14px;
  div {
    font-size: 12px;
    font-weight: normal;
    color: var(--fc);
    font-weight: 700;
    text-align: center;
    padding: 5px 0px;
    box-sizing: border-box;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 4px;
    &:hover {
      border-radius: 7px;
      cursor: pointer;
    }
  }
  .action {
    // background: ;
    color: #409eff;
  }
}
.imgList {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 定义四列，其中第一列和第三列宽度是第二列和第四列的两倍 */
  grid-gap: 8px; /* 在网格单元格之间添加间距 */
  grid-auto-flow: row dense; /* 自动填充行，并尽量填满每一行 */
  align-content: flex-start;
  margin-top: 2px;
  height: 350px;
  .imgItem {
    width: 209px;
    height: 154px;
    margin-bottom: 24px;
    box-sizing: border-box;
    position: relative;

    .open {
      position: absolute;
      bottom: -1px;
      width: 210px;
      background: #1a1a1a;
      height: 30px;
      line-height: 30px;
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
      display: flex;
      justify-content: end;
      display: none;
      .openFile {
        font-size: 12px;
        width: 70px;
        text-align: center;
        height: 20px;
        background: #409eff;
        line-height: 20px;
        border-radius: 6px;
        cursor: pointer;
        margin: 5px 0 0 120px;
        color: #fff;
      }
    }
    &:hover {
      .open {
        display: block;
      }
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
      font-size: 12px;
      font-weight: 600;
      padding: 0 12px;
    }
  }
}

.bottom {
  height: 30px;
  width: 100%;
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
</style>
