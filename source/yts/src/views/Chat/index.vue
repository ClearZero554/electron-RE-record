<template>
  <div class="chat">
    <div class="sidebar">
      <el-badge
        :value="totalNumber[0]"
        class="item"
        :max="20"
        :hidden="totalNumber[0] == 0"
      >
        <div :class="windowType == 0 && 'action'" @click="changeWindow(0)">
          客服
        </div>
      </el-badge>
      <el-badge
        :value="totalNumber[1]"
        class="item"
        :max="20"
        v-if="isBlogger == 0"
        :hidden="totalNumber[1] == 0"
      >
        <div :class="windowType == 1 && 'action'" @click="changeWindow(1)">
          发布订单
        </div>
      </el-badge>
      <el-badge
        class="item"
        :max="20"
        :value="isBlogger == 1 ? totalNumber[1] : totalNumber[2]"
        :hidden="(isBlogger == 1 ? totalNumber[1] : totalNumber[2]) == 0"
      >
        <div :class="windowType == 2 && 'action'" @click="changeWindow(2)">
          待接单
        </div>
      </el-badge>
      <el-badge
        :value="isBlogger == 1 ? totalNumber[2] : totalNumber[3]"
        class="item"
        :max="20"
        :hidden="(isBlogger == 1 ? totalNumber[2] : totalNumber[3]) == 0"
      >
        <div :class="windowType == 3 && 'action'" @click="changeWindow(3)">
          待解决
        </div>
      </el-badge>
      <el-badge
        :value="isBlogger == 1 ? totalNumber[3] : totalNumber[4]"
        class="item"
        :max="20"
        :hidden="(isBlogger == 1 ? totalNumber[3] : totalNumber[4]) == 0"
      >
        <div :class="windowType == 6 && 'action'" @click="changeWindow(6)">
          待确认
        </div>
      </el-badge>
      <el-badge
        :value="isBlogger == 1 ? totalNumber[4] : totalNumber[5]"
        class="item"
        :max="20"
        :hidden="(isBlogger == 1 ? totalNumber[4] : totalNumber[5]) == 0"
      >
        <div :class="windowType == 7 && 'action'" @click="changeWindow(7)">
          已完结
        </div>
      </el-badge>
      <el-badge
        :value="isBlogger == 1 ? totalNumber[5] : totalNumber[6]"
        class="item"
        :max="20"
        :hidden="(isBlogger == 1 ? totalNumber[5] : totalNumber[6]) == 0"
      >
        <div :class="windowType == 5 && 'action'" @click="changeWindow(5)">
          退款中
        </div>
      </el-badge>
      <el-badge v-if="isBlogger == 1 || userInfo.isArticleBlogger == 1"  class="item">
        <div @click="changeWindow(8)" :class="windowType == 8 && 'action'">
          个人中心
        </div>
      </el-badge>
    </div>
    <el-divider direction="vertical"></el-divider>
    <!-- 聊天窗口 -->
    <div class="left" v-show="windowType == 0">
      <el-scrollbar ref="scrollbar" :noresize="false">
        <template v-for="(item, index) in list">
          <div
            class="box"
            v-if="index != 1"
            :key="item.fromUserId"
            @click="selectUser(item)"
            @contextmenu.prevent="(e) => rightClick(e, item)"
            :class="
              selectUserObj.fromUserId == item.fromUserId ? 'selectUser' : ''
            "
          >
            <img :src="item.avatar" alt="" />
            <div class="text">
              <div class="nickname">{{ item.nickname }}</div>
              <div class="onLine" v-if="item.isOnline == 1">· 在线</div>
              <div class="unLine" v-else>· 不在线</div>
            </div>
            <div class="tip" v-if="item.unreadCount > 0">
              {{ item.unreadCount }}
            </div>
            <div
              class="forceTop"
              v-if="item.topStatus == -1 || item.topStatus == 1"
            >
              置
            </div>
            <div class="top" v-if="item.topStatus == 1">置</div>
          </div>
          <div
            v-else
            :key="item.fromUserId"
            class="box release"
            @click="openQuery"
          >
            <div>发布问题预约</div>
            <div>专业客服调试</div>
          </div>
        </template>
      </el-scrollbar>
    </div>
    <el-divider direction="vertical" v-if="windowType == 0"></el-divider>
    <div class="right" v-show="windowType == 0" v-if="selectUserObj">
      <div class="header">
        <div>{{ selectUserObj.nickname }}</div>
        <div>ID:{{ selectUserObj.fromUserId }}</div>
      </div>
      <div class="main" ref="main">
        <template>
          <div v-for="item in messageList" :key="item.key">
            <div
              class="messageBox"
              v-if="item.messageType != -1"
              :class="item.fromUserId == userInfo.id ? 'messageBoxRi' : ''"
            >
              <img
                :src="selectUserObj.avatar"
                alt=""
                v-if="item.fromUserId != userInfo.id"
              />
              <img :src="userInfo.avatar" alt="" v-else />
              <!-- 纯文字 -->
              <div class="message" v-if="item.messageType == 1">
                {{ item.message }}
              </div>
              <div class="message" v-if="item.messageType == 2">
                <el-image
                  :src="item.message"
                  :preview-src-list="srcList"
                  fit="cover"
                ></el-image>
              </div>
              <div class="message" v-if="item.messageType == 0">
                <div>
                  <div>客服暂时不在线,点击选择以下问题</div>
                  <div>如遇解决不了问题,请等客服上线</div>
                  <div
                    v-for="(e, i) in item.message"
                    :key="e.id"
                    class="automaticReply"
                    @click="automaticReplyRes(e)"
                  >
                    {{ i + 1 }}:{{ e.message }}
                  </div>
                </div>
              </div>
            </div>
            <div class="messageBox" v-else-if="item.messageType == -1">
              <div class="time">
                {{ item.message }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="inputBox">
        <div class="input">
          <el-input
            v-model.trim="message"
            ref="messageInput"
            placeholder="发送消息"
            @keyup.enter.native="handleSendMessage"
          ></el-input>
        </div>
        <div class="icons">
          <Icon
            fontName="icon-dianhua"
            @click="call"
            v-if="selectUserObj.isOnline == 1 && selectUserObj.fromUserId != 0"
          ></Icon>
          <!-- <el-tooltip
            class="item"
            effect="light"
            content="截图完成后点击倒数第二个复制或Ctrl+C即可发送"
            placement="top"
          > -->
          <Icon fontName="icon-jietu" @click="screenshot"></Icon>
          <!-- </el-tooltip> -->
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
    </div>

    <div v-if="windowType != 0 && windowType != 8" class="problem">
      <div class="header">
        <div>全部:{{ page.total }}</div>
        <!-- <div class="submit" @click="openQuery" v-if="windowType == 1">
          发布问题
        </div> -->
        <div style="color: red">金币余额:{{ userInfo.money }}</div>
      </div>
      <div class="problemBox">
        <!-- 草稿箱 -->
        <div
          class="problemItem"
          v-if="windowType == 1 && this.page.pageNo == 1"
        >
          <div>CPU:{{ deviceInfo?.cpu }}</div>
          <div v-for="item in deviceInfo.gpu" :key="item">GPU:{{ item }}</div>
          <div class="submit" @click="openQuery">
            <div>发布问题预约</div>
            <div>专业客服调试</div>
          </div>
        </div>
        <div class="problemItem" v-for="item in actionList" :key="item.id">
          <div class="problemItemHeader">
            <div>用户ID:{{ item.userId }}</div>
            <div>昵称:{{ item.nickname }}</div>
            <div>金额:{{ item.price }}金币</div>
          </div>
          <div class="jzs">
            <span v-if="windowType == 7"
              >售后截止时间:{{ item.completionTime }}</span
            >
            <span v-else>预约时间:{{ item.reserveTime }}</span>
            <span v-if="windowType != 1 && windowType != 2"
              >接单人:{{ item.receiverId }}</span
            >
          </div>
          <div class="problemItemMain">
            <img :src="item.avatar" alt="" />
            <div>问题描述:{{ item.description }}</div>
          </div>
          <div class="problemItemFoot">
            <div class="text">
              <div class="onLine" v-if="item.isOnline == '1'">· 在线</div>
              <div class="unLine" v-else>· 不在线</div>
            </div>
            <div class="buttons">
              <div v-if="windowType == 1" @click="submitDraft(item)">发布</div>
              <div v-if="windowType == 1" @click="edit(item)">编辑</div>
              <div v-if="windowType == 1" @click="del(item)">删除</div>
              <div v-if="windowType != 1" @click="details(item)">详情</div>
              <div
                v-if="windowType == 2 && isBlogger == 0"
                @click="cusCancel(item)"
              >
                下架
              </div>
              <div
                v-if="windowType == 3 && isBlogger == 1"
                @click="cusServiceConfirm(item)"
              >
                已解决
              </div>
              <div
                v-if="windowType == 6 && isBlogger == 0"
                @click="cusConfirm(item)"
              >
                已解决
              </div>
              <div
                v-if="windowType == 3 && isBlogger == 1"
                @click="cusServiceCancel(item)"
              >
                退回
              </div>
              <!-- 博主在待接单中接单 -->
              <div
                v-if="windowType == 2 && isBlogger == 1"
                @click="takingOrders(item)"
              >
                确认接单
              </div>
              <div
                v-if="
                  (windowType == 7 || windowType == 3 || windowType == 6) &&
                  isBlogger == 0 &&
                  (item.status == 4 || item.status == 3 || item.status == 2)
                "
                @click="
                  $refs.comment.visible = true;
                  $refs.comment.id = item.id;
                "
              >
                退款申请
              </div>
              <div @click="openChat(item)" v-if="windowType != 1">
                打开聊天框
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        v-if="page.total > 6"
        layout="prev, pager, next"
        class="text-center"
        :page-size="6"
        :current-page.sync="page.pageNo"
        :total="page.total"
        @current-change="(e) => currentChange(e, key)"
      ></el-pagination>
    </div>
    <!-- 个人中心 -->
    <div v-if="windowType == 8" class="dateListBox">
      <div class="dateList">
        <div :class="timeType == 1 ? 'action' : ''" @click="bloggerEarnings(1)">
          全部
        </div>
        <div :class="timeType == 2 ? 'action' : ''" @click="bloggerEarnings(2)">
          本月
        </div>
        <div :class="timeType == 3 ? 'action' : ''" @click="bloggerEarnings(3)">
          本周
        </div>
        <div :class="timeType == 4 ? 'action' : ''" @click="bloggerEarnings(4)">
          今天
        </div>
        <div :class="timeType == 5 ? 'action' : ''" @click="bloggerEarnings(5)">
          选择时间
        </div>
      </div>

      <div class="setting">
        <div class="infoBox">
          <div class="incomeType">
            <div
              :class="incomeType == 1 && 'action'"
              @click="incomeTypeChange(1)"
            >
              客服收益
            </div>
            <div
              :class="incomeType == 0 && 'action'"
              @click="incomeTypeChange(0)"
            >
              素材收益
            </div>
          </div>
          <div class="info" v-if="incomeType == 1">
            <div></div>
            <div class="infoItem">
              <div>个人收益</div>
              <div>{{ income.realEarnings }}</div>
            </div>
            <div></div>
          </div>
          <div class="info" v-if="incomeType == 1">
            <div class="infoItem">
              <div>接单数量</div>
              <div>{{ income.orderCout }}</div>
            </div>
            <div class="infoItem">
              <div>接单收益</div>
              <div>{{ income.earnings }}</div>
            </div>
            <div class="infoItem">
              <div>退单数量</div>
              <div>{{ income.refundOrderCount }}</div>
            </div>
            <div class="infoItem">
              <div>退单金额</div>
              <div>{{ income.cutMoney }}</div>
            </div>
            <div class="infoItem">
              <div>平台抽成</div>
              <div>{{ income.rack }}</div>
            </div>
          </div>
          <div class="info" v-if="incomeType == 0">
            <div></div>
            <div class="infoItem">
              <div>个人收益</div>
              <div>{{ article.realEarnings }}</div>
            </div>
            <div></div>
          </div>
          <div class="info" v-if="incomeType == 0">
            <div class="infoItem">
              <div>销售额</div>
              <div>{{ article.earnings }}</div>
            </div>
            <div class="infoItem">
              <div>销售量</div>
              <div>{{ article.orderCout }}</div>
            </div>
            <div class="infoItem">
              <div>平台抽成</div>
              <div>{{ article.rack }}</div>
            </div>
          </div>
        </div>
        <!-- 控制是否接收到短信 -->
        <div>
          <span class="label">问题发布短信开关:</span>
          <el-switch
            v-model="userInfo.needSms"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch"
          >
          </el-switch>
        </div>
        <div class="selectTime" v-if="timeType == 5">
          <span class="label">选择查询收益时间:</span>
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            @change="pickerChange"
          >
          </el-date-picker>
        </div>
      </div>
    </div>

    <!-- 发布问题 -->
    <SubmitQuery
      ref="submitQuery"
      @changeWindow="changeWindow"
      @getUserInfo="getUserInfo"
      @del="del"
      :deviceInfo="deviceInfo"
      :windowType="windowType"
    ></SubmitQuery>
    <!-- 右键弹框 -->
    <div
      class="rightClickBox"
      ref="rightClickBox"
      v-show="isShowRight"
      v-if="selectUserObj"
    >
      <!-- 0 否 1是 -1强制置顶 -->
      <div v-if="rightClickItem.topStatus == '0'" @click="setTop">置顶</div>
      <div v-if="rightClickItem.topStatus == '1'" @click="setTop">取消置顶</div>
      <div
        v-if="
          rightClickItem.unreadCount == 0 &&
          selectUserObj.id !== rightClickItem.id
        "
        @click="setRead(0)"
      >
        标为未读
      </div>
      <div
        v-if="
          rightClickItem.unreadCount != 0 &&
          selectUserObj.id !== rightClickItem.id
        "
        @click="setRead(1)"
      >
        标为已读
      </div>
    </div>
    <Comment ref="comment" @changeWindow="changeWindow"></Comment>
  </div>
</template>

<script>
import {
  getChatRecord,
  getUserList,
  listByStatus,
  publishQuery,
  cusServiceConfirm,
  cusServiceReceive,
  cusServiceCancel,
  cusCancel,
  cusConfirm,
  updateReadStatus,
  read,
  updateTopStatus,
  bloggerEarnings,
  del,
  updateUserInfo,
  articleBloggerEarnings,
  messageList,
  getResMessageById,
} from "@/api/chat";
import moment from "moment";
import { getUuid } from "@/utils/index";
import ipcUtil from "@/ipc";
import axios from "axios";
import SubmitQuery from "@/views/Chat/components/SubmitQuery";
import ChoiceTime from "@/views/Chat/components/ChoiceTime";
import feedback from "@/utils/feedback";
import Comment from "./components/Comment.vue";

export default {
  name: "chat",
  components: { SubmitQuery, ChoiceTime, Comment },
  data() {
    return {
      list: [],
      isBlogger: 0, //0 不是博主 1是博主
      message: "",
      messageType: 1, //消息类型
      lasTime: 0, //最后时间
      messageList: [],
      srcList: [], //预览列表
      selectUserObj: null, //选中的用户
      userInfo: {}, //个人信息
      windowType: 0, //0--聊天 1--草稿箱 2--待接单 3--待确认 4--待评价 5--退款/投诉 6--今日全部 7--收入记录
      actionList: [], //操作列表
      page: {
        total: 0,
        pageNo: 1,
        pageSize: 6,
      },
      deviceInfo: null, //电脑设备
      isShowRight: false,
      rightClickItem: {}, //右键的项
      totalNumber: [],
      timeType: 1, //1全部，2本月，3本周，4今天
      income: {}, //收益对象
      article: {}, //素材收益
      time: null, //定时任务
      value: new Date(),
      incomeType: 1, //1为客服收益 2为素材收益
      automaticReplyList: [], //自动回复
    };
  },
  mounted() {
    // 获取媒体源
    // navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    // 设置监听主程序
    this.hear();
    // 初始化一些需要用到的数据
    this.init();
    // 获取联系人列表
    this.getUserList();
    // 定时任务,实时刷新
    this.timing();
  },
  beforeDestroy() {
    window.ipc.removeAll("getUerInfo");
    window.ipc.removeAll("onmessage");
    window.ipc.removeAll("onShow");
    clearTimeout(this.time);
  },
  methods: {
    async init() {
      await this.getUserInfo();
      this.isBlogger = this.userInfo.isBlogger == 1 ? 1 : 0;
      try {
        this.deviceInfo = await ipcUtil.getDeviceInfo();

        this.deviceInfo.gpu = this.deviceInfo.gpu.filter(
          (item) =>
            item != "" && item != "Name" && item != "OrayIddDriver Device"
        );
      } catch (error) {
        console.log(error);
      }
      console.log(this.deviceInfo, "this.deviceInfo");
      // 获取侧边栏全部信息
      this.totalNumber = await this.$root.getTotalNumber();
      if (this.selectUserObj.unreadCount > 0) {
        // 让客服上的统计数字也修改
        this.totalNumber.splice(
          0,
          1,
          this.totalNumber[0] - this.selectUserObj.unreadCount
        );
        // 发送请求给后端，通知已读
        await read({ id: this.selectUserObj.id });
      }
      // 默认打开 默认已读
      this.selectUserObj.unreadCount = 0;
    },
    // 监听
    hear() {
      // 监听主界面是否重新登录了
      window.ipc.on("getUerInfo", async () => {
        this.$router.go(0);
      });
      // 监听是否有消息返回
      window.ipc.on("onmessage", async (e, data) => {
        if (data.fromUserId == this.selectUserObj.fromUserId) {
          this.setTimeAndData(data);
          this.toBottom();
        } else {
          this.getUserList();
          /* let index = this.list.findIndex((item) => {
            if (item.fromUserId == data.fromUserId) {
              item.unreadCount++;
            }
            return item.fromUserId == data.fromUserId;
          });
          if (index == -1) {
            this.getUserList();
          } */
        }
      });
      // 页面重新打开了
      window.ipc.on("onShow", async (e) => {});
    },
    // 获取个人信息
    async getUserInfo() {
      this.userInfo = await this.$root.getUserInfo();
    },
    // 获取联系人列表
    async getUserList() {
      const res = await getUserList();
      console.log(res, "res");
      if (res.data.code == 200) {
        res.data.data.lists.splice(1, 0, { fromUserId: -10, topStatus: -1 });
        this.list = res.data.data.lists;
        if (this.selectUserObj == null) {
          this.selectUserObj = this.list[0];
          console.log(this.list, "this.list");
          await this.getRecord();
        }
        this.$nextTick(() => {
          this.$refs.messageInput.focus();
        });
      }
    },
    // 获取聊天记录
    async getRecord() {
      this.messageList = [];
      let record = await getChatRecord({
        receiveUserId: Number(this.selectUserObj.fromUserId),
      });
      if (record.data.code == 200) {
        let data = record.data.data.chatRecordDetails.reverse();
        data.forEach((item, index) => {
          this.setTimeAndData(item, index);
        });
        this.toBottom();
      }
    },
    // 选中用户
    async selectUser(item) {
      if (this.selectUserObj.fromUserId != item.fromUserId) {
        // 把上一个设置为已读
        await read({ id: this.selectUserObj.id });
        this.selectUserObj = item;
        this.message = "";
        this.messageList = [];
        this.srcList = [];
        // 查询聊天记录
        this.getRecord();
        // 模拟已读
        this.list.forEach(async (e) => {
          if (item.fromUserId == e.fromUserId) {
            if (e.unreadCount != 0) {
              // 让客服上的统计数字也修改
              this.totalNumber.splice(
                0,
                1,
                this.totalNumber[0] - e.unreadCount
              );
              e.unreadCount = 0;
              // 发送请求给后端，通知已读
              await read({ id: e.id });
            }
          }
        });
        this.$nextTick(() => {
          this.$refs.messageInput.focus();
        });
      }
    },
    // 右键选中用户
    rightClick(e, item) {
      document.removeEventListener("click", this.clickWin);
      this.$refs.rightClickBox.style.top = e.pageY + "px";
      this.$refs.rightClickBox.style.left = e.pageX + "px";
      this.rightClickItem = item;
      this.isShowRight = true;
      document.addEventListener("click", this.clickWin);
    },
    // 设置已读未读
    async setRead(type) {
      // 更新已读未读状态
      await updateReadStatus({ id: this.rightClickItem.id, readStatus: type });
      await this.getUserList();
      this.totalNumber = await this.$root.getTotalNumber();
    },
    // 左键点击软件任意
    clickWin() {
      this.isShowRight = false;
      document.removeEventListener("click", this.clickWin);
    },
    // 自动回复
    async automaticReply() {
      const res = await messageList();
      console.log(res, "res");
      if (res.data.code == 200) {
        const data = {
          messageType: 0,
          receiveUserId: this.userInfo.id,
          fromUserId: this.selectUserObj.fromUserId,
          message: res.data.data,
          avatar: this.selectUserObj.avatar,
        };
        this.messageList.push(data);
        this.toBottom();
      }
    },
    // 点击自动回复
    async automaticReplyRes(e) {
      const data = {
        messageType: 1,
        receiveUserId: this.selectUserObj.fromUserId,
        fromUserId: this.userInfo.id,
        message: e.message,
        avatar: this.userInfo.avatar,
      };
      this.messageList.push(data);
      this.toBottom();
      const res = await getResMessageById({ id: e.id });
      if (res.data.code == 200) {
        const data = {
          messageType: 1,
          receiveUserId: this.userInfo.id,
          fromUserId: this.selectUserObj.fromUserId,
          message: res.data.msg,
          avatar: this.selectUserObj.avatar,
        };
        this.messageList.push(data);
        this.toBottom();
      }
    },
    // 发送消息
    async handleSendMessage() {
      if (this.message) {
        const createTime = Math.round(new Date().getTime() / 1000);
        const data = {
          messageType: this.messageType,
          receiveUserId: this.selectUserObj.fromUserId,
          fromUserId: this.userInfo.id,
          message: this.message,
          avatar: this.userInfo.avatar,
        };
        this.setTimeAndData(Object.assign(data, { createTime }));
        // 如果发送的是客服而且不在线 isOnline为0
        if (
          this.selectUserObj.fromUserId == 0 &&
          this.selectUserObj.isOnline == 0
        ) {
          this.automaticReply();
        }
        // 发送消息
        ipcUtil.sendWs(data);
        let index = this.list.findIndex(
          (item) => item.fromUserId == data.receiveUserId
        );
        // 如果发消息的不是第一个 需要排除置顶项
        if (index != 0) {
          let obj = this.list.splice(index, 1)[0];
          obj.unreadCount = 0;
          let i = this.list.findIndex((item) => item.topStatus == 0);
          this.list.splice(i == -1 ? this.list.length - 1 : i, 0, obj);
        }
        this.message = null;
        this.messageType = 1;
        this.toBottom();
      }
    },
    toBottom() {
      requestAnimationFrame(() => {
        // 让滚动条滚动到底部
        this.$refs.main?.scrollTo({
          top: this.$refs.main.scrollHeight,
          // behavior: "smooth",
          behavior: "auto",
        });
      });
    },
    // 设置时间
    setTimeAndData(data, index) {
      let time = this.lasTime;
      this.lasTime = data.createTime;
      if (data.createTime - time > 300 || index === 0) {
        this.messageList.push({
          messageType: -1,
          receiveUserId: 0,
          fromUserId: 0,
          key: getUuid(),
          createTime: data.createTime,
          message: moment(data.createTime * 1000).format("MM-DD HH:mm"),
        });
      }
      data.key = getUuid();
      this.messageList.push(data);
      // 存入预览列表
      if (data.messageType == 2) {
        this.srcList.push(data.message);
      }
    },
    // 上传图片
    handleUploadSuccess(res) {
      if (res.code == 200) {
        this.message = "https://resource.yuantiaoshi.com/" + res.msg;
        this.messageType = 2;
        this.handleSendMessage();
      }
    },
    // 截图
    screenshot() {
      ipcUtil.screenshot(async (res) => {
        let file = new File([res], "1.png");
        const formData = new FormData();
        formData.append("file", file);
        const upload = await axios.post(
          "https://yts.yuantiaoshi.com:8880/api/upload/resource",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.handleUploadSuccess(upload.data);
      });
    },
    async changeWindow(type = this.windowType) {
      console.log(111);
      // 如果是切换页面 就要清空页面信息
      if (type != this.windowType) {
        this.page = this.$options.data().page;
      }
      console.log("[ type ] >", type);
      this.windowType = type;
      this.actionList = [];

      let res = null;
      if (type == 0) {
        // 初始化聊天界面
        this.toBottom();
      } else if (type == 1) {
        // 草稿箱
        // 如果是草稿箱 而且页码为1，则只请求5条数据
        if (this.page.pageNo == 1) {
          this.page.pageSize = 5;
        } else {
          this.page.pageSize = 6;
        }
        res = await listByStatus({ status: 0, ...this.page });
      } else if (type == 2) {
        //待接单
        res = await listByStatus({ status: 1, ...this.page });
      } else if (type == 3) {
        //待解决
        res = await listByStatus({ status: 2, ...this.page });
      } else if (type == 6) {
        //待用户确认
        res = await listByStatus({ status: 3, ...this.page });
      } else if (type == 5) {
        // 退款中
        res = await listByStatus({ status: 5, ...this.page });
      } else if (type == 7) {
        // 已完结
        this.getUserInfo();
        res = await listByStatus({ status: 4, ...this.page });
      } else if (type == 8) {
        // 个人中心
        this.bloggerEarnings(1);
        return;
      }

      if (res && res.data.code == 200) {
        // 如果是草稿箱 而且页码为1，则增加一个固定项
        this.actionList = res.data.data.lists.map((item) => {
          return {
            ...item,
            time: moment(item.createTime * 1000).format("YYYY-MM-DD HH:mm:ss"),
            completionTime: item.servicePeriod
              ? moment(item.servicePeriod * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "无",
          };
        });
        console.log(
          "[ this.actionList ] >",
          this.actionList,
          this.windowType,
          this.isBlogger
        );
        this.page.total = res.data.data.count;
      }
    },
    // 分页
    currentChange(e, key) {
      this.changeWindow();
    },
    // 打开发布问题窗口
    openQuery() {
      this.$refs.submitQuery.isDetails = false;
      this.$refs.submitQuery.visible = true;
    },
    // 编辑
    edit(item) {
      this.$refs.submitQuery.id = item.id;
      this.$refs.submitQuery.formData = {
        ...item,
      };
      this.$refs.submitQuery.isDetails = false;
      this.$refs.submitQuery.visible = true;
    },
    // 发布草稿
    async submitDraft(item) {
      const res = await publishQuery(item);
      if (res.data.code == 200) {
        feedback.msgSuccess("发布成功");
        this.changeWindow();
        this.getUserInfo();
      } else {
        feedback.msgWarning(res.data.msg);
      }
    },
    // 打开聊天框 博主主动打开用户的聊天框
    openChat(item) {
      let index;
      if (this.isBlogger == 1) {
        index = this.list.findIndex((e) => e.fromUserId == item.userId);
      } else {
        index = this.list.findIndex((e) => e.fromUserId == item.receiverId);
      }
      console.log("[ index ] >", index);
      if (index == -1) {
        // 如果不是好友
        // 找到非置顶的好友，把新的好友插入到非置顶好友最上面
        this.selectUserObj = this.list[0];
        this.messageList = [];
        this.windowType = 0;
      } else {
        this.selectUserObj = this.list[index];
        this.getRecord();
        this.windowType = 0;
      }
      this.$nextTick(() => {
        this.$refs.messageInput.focus();
      });
    },
    // 博主接单
    async takingOrders(item) {
      const res = await cusServiceReceive({ id: item.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("接单成功");
        // 默认发送消息
        const data = {
          messageType: 1,
          receiveUserId: item.userId,
          fromUserId: this.userInfo.id,
          message: "您好,我接了您发布的问题,有什么问题可以直接联系我~",
        };
        // 发送消息
        ipcUtil.sendWs(data);
        this.totalNumber = await this.$root.getTotalNumber();
        this.getUserList();
        // 接单成功刷新列表
        this.changeWindow();
      }
    },
    // 博主取消
    async cusServiceCancel(item) {
      const res = await cusServiceCancel({ id: item.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("退回成功");
        this.totalNumber = await this.$root.getTotalNumber();
        // 接单成功刷新列表
        this.changeWindow();
      }
    },
    // 用户下架
    async cusCancel(item) {
      const res = await cusCancel({ id: item.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("下架成功");
        this.getUserInfo();
        this.totalNumber = await this.$root.getTotalNumber();
        // 接单成功刷新列表
        this.changeWindow();
      }
    },
    // 用户点击已解决 确定收货
    async cusConfirm(item) {
      const res = await cusConfirm({ id: item.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("问题已解决");
        this.totalNumber = await this.$root.getTotalNumber();
        // 接单成功刷新列表
        this.changeWindow();
      }
    },
    // 博主点已解决
    async cusServiceConfirm(item) {
      const res = await cusServiceConfirm({ id: item.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("已解决问题,等待用户点确认");
        this.totalNumber = await this.$root.getTotalNumber();
        // 接单成功刷新列表
        this.changeWindow();
      }
    },
    // 设置置顶
    async setTop() {
      // 0 否 1是 -1强制置顶
      const data = {
        id: this.rightClickItem.id,
        fromUserId: this.rightClickItem.fromUserId,
        topStatus: this.rightClickItem.topStatus == 0 ? 1 : 0,
      };
      const res = await updateTopStatus(data);
      console.log(res, "res");
      if (res.data.code == 200) {
        await this.getUserList();
      }
    },
    // 个人中心初始化
    async bloggerEarnings(type) {
      this.timeType = type;
      if (type == 5) {
        return;
      }
      if (this.incomeType == 1) {
        const res = await bloggerEarnings({ type });
        if (res && res.data.code == 200) {
          this.income = res.data.data;
        }
      } else {
        const res = await articleBloggerEarnings({ type });
        if (res && res.data.code == 200) {
          this.article = res.data.data;
        }
      }
    },
    // 删除
    async del(item) {
      if (!moment(item.servicePeriod * 1000).isBefore(moment())) {
        feedback.msgWarning("还没到售后结束时间");
        return;
      }
      const res = await del({ id: item.id });
      if (res.data.code == 200) {
        this.totalNumber = await this.$root.getTotalNumber();
        this.changeWindow();
      }
    },
    // 详情
    details(item) {
      this.$refs.submitQuery.formData = {
        ...item,
      };
      this.$refs.submitQuery.isDetails = true;
      this.$refs.submitQuery.visible = true;
    },
    // 定时任务
    timing() {
      clearTimeout(this.time);
      this.time = setTimeout(async () => {
        // 获取侧边栏全部信息
        let arr = await this.$root.getTotalNumber();
        if (arr[this.windowType] != this.totalNumber[this.windowType]) {
          await this.changeWindow();
        }
        this.totalNumber = arr;
        this.timing();
      }, 3000);
    },
    // 呼出
    call() {
      window.ipc.send("openSpeech", { ...this.selectUserObj, w: 350, h: 500 });
    },
    // 修改是否接受到短信
    async changeSwitch(e) {
      console.log(e);
      const res = await updateUserInfo({ needSms: e });
      console.log(res, "res");
    },
    async pickerChange(e) {
      if (this.incomeType == 1) {
        const res = await bloggerEarnings({
          type: this.timeType,
          date: moment(e).format("YYYY-MM-DD"),
        });
        if (res && res.data.code == 200) {
          this.income = res.data.data;
        }
      } else {
        const res = await articleBloggerEarnings({
          type: this.timeType,
          date: moment(e).format("YYYY-MM-DD"),
        });
        if (res && res.data.code == 200) {
          this.article = res.data.data;
        }
      }
    },
    // 切换个人中心
    incomeTypeChange(type) {
      this.incomeType = type;
      // 客服
      this.bloggerEarnings(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.dateListBox {
  width: 100%;
  display: flex;
  flex-direction: column;

  .infoBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 32px;
    position: relative;
    .incomeType {
      position: absolute;
      top: -10px;
      left: 20px;
      display: flex;
      width: 130px;
      height: 30px;
      font-size: 14px;
      line-height: 30px;
      border-radius: 16px;
      justify-content: space-around;
      background: var(--carousel);
      div {
        cursor: pointer;
        border-radius: 16px;
      }
      .action {
        background: var(--action);
      }
    }
    .info {
      display: flex;
      width: 500px;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .infoItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 18px;
      div {
        &:nth-child(2) {
          font-weight: 600;
          color: #f56c6c;
        }
      }
    }
  }
  .selectTime {
    height: 100px;
    display: flex;
    align-items: center;
  }
  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
  }
}
.dateList {
  width: 100%;
  height: 52px;
  margin-top: 16px;
  display: flex;
  /* border-top-left-radius: 8px;
  border-top-right-radius: 8px; */
  justify-content: center;

  div {
    width: 80px;
    height: 100%;
    text-align: center;
    line-height: 52px;
    cursor: pointer;
    border-radius: 8px;
    background: var(--secondLevel);
    margin-left: 8px;
  }
  .action {
    background: var(--action);
  }
}
// ::v-deep .text-center {
//   text-align: center;
//   display: block;
//   height: 35px;
//   line-height: 35px;
//   position: absolute;
//   bottom: 0;
//   left: -35px;
//   width: calc(100% + 80px);
//   .active {
//     color: #409eff !important;
//   }
//   .btn-prev,
//   .el-pager li,
//   .btn-next {
//     font-size: 22px;
//     background-color: rgba(0, 0, 0, 0);
//     height: 32px;
//     width: 30px;
//     line-height: 32px;
//     background-size: 80% 80%;

//     .number {
//       font-weight: 700;
//     }

//     i {
//       &::before {
//         font-size: 16px;
//       }
//     }
//   }
//   .el-pager li {
//     color: var(--fc);
//   }
// }
.chat {
  display: flex;
  width: 960px;
  color: var(--fc);
  font-size: 16px;

  /deep/ .el-divider--vertical {
    height: 620px;
  }
  .text {
    font-size: 14px;
    width: 100px;
    .nickname {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
    }
    div {
      margin-top: 8px;
      font-size: 10px;
      font-weight: 600;
    }
    .onLine {
      color: #05cc31;
    }
    .unLine {
      color: #41424c;
    }
  }
  .sidebar {
    width: 60px;
    height: 600px;
    padding-top: 16px;
    box-sizing: border-box;
    text-align: center;
    div {
      height: 20px;
      width: 50px;
      border: 1px solid var(--fc);
      font-size: 10px;
      margin-bottom: 20px;
      line-height: 20px;
      border-radius: 6px;
      text-align: center;
      cursor: pointer;
      /*  &:nth-child(6) {
        margin-top: 370px;
      } */
    }
    .action {
      border: 2px solid #3169a4;
    }
    .item {
      border: none;
      z-index: 999;
    }
  }
  .left {
    width: 25%;
    padding: 5px;
    box-sizing: border-box;
    height: 600px;
    /deep/ .el-scrollbar__bar {
      right: 0px;
      width: 0px !important;
    }
    .selectUser {
      background: var(--secondLevel);
    }
    .box {
      margin-left: 2%;
      height: 64px;
      cursor: pointer;
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 5px;
      box-sizing: border-box;
      margin-bottom: 8px;
      position: relative;
      .top,
      .forceTop {
        position: absolute;

        right: 5px;
        bottom: 3px;
        font-size: 12px;
      }
      .forceTop {
        color: var(--topping);
      }
      .top {
        color: var(--fc);
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 16px;
      }

      .tip {
        width: 20px;
        height: 20px;
        font-size: 12px;
        border-radius: 50%;
        line-height: 20px;
        background: #f56c6c;
        text-align: center;
        color: #fff;
      }
    }
    .release {
      background: #98d7fa;
      // display: ;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #1a1a1a;
      font-weight: 600;
    }
  }
  .right {
    flex: 1;
    .header {
      width: 100%;
      height: 50px;
      font-weight: 600;
      padding: 0 16px;
      div {
        &:nth-child(1) {
          padding-top: 8px;
        }
        &:nth-child(2) {
          font-size: 12px;
        }
      }
    }
    .main {
      width: 96%;
      height: 500px;
      padding: 0 12px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none; /* 针对Webkit内核浏览器如Chrome和Safari */
      }
      .messageBox {
        display: flex;
        margin-top: 8px;
        width: 100%;
        .time {
          text-align: center;
          width: 100%;
          font-size: 13px;
          color: #41424c;
          font-weight: 600;
        }
        img {
          width: 28px;
          height: 28px;
          margin-top: 2px;
          border-radius: 50%;
        }
        .message {
          background: var(--secondLevel);
          padding: 8px;
          max-width: 80%;
          margin-left: 8px;
          border-radius: 8px;
          /deep/ .el-image {
            width: 300px;
            // height: 200px;
          }
          .automaticReply {
            color: #409eff;
            text-decoration: #409eff;
            cursor: pointer;
            &:hover {
              color: var(--action);
            }
          }
        }
      }
      .messageBoxRi {
        flex-direction: row-reverse;
        .message {
          margin-left: 0px;
          margin-right: 8px;
        }
      }
    }
    .inputBox {
      width: 96%;
      margin-left: 2%;
      height: 50px;
      background: var(--secondLevel);
      margin-top: 10px;
      border-radius: 16px;
      display: flex;
      .input {
        width: 510px;
        height: 100%;
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
  }
  .problem {
    width: 90%;
    padding: 16px;
    padding-bottom: 0;
    .header {
      width: 96%;
      display: flex;
      justify-content: space-between;
    }
    .problemBox {
      width: 96%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .problemItem {
        width: 380px;
        height: 160px;
        // background: #fff;
        margin-top: 16px;
        border-radius: 16px;
        border: 1px solid var(--fc);
        box-sizing: border-box;
        padding: 8px;
        font-size: 14px;
        position: relative;
        .problemItemHeader {
          display: flex;
          justify-content: space-between;
          div {
            &:nth-child(2) {
              width: 170px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &:nth-child(3) {
              color: red;
              font-weight: 600;
            }
          }
        }
        .submit {
          width: 120px;
          height: 40px;
          text-align: center;
          position: absolute;
          bottom: 4px;
          right: 4px;
          padding: 4px;
          background: var(--action);
          border-radius: 8px;
          cursor: pointer;
        }
        .problemItemMain {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50px;
          }
          div {
            width: 290px;
            height: 80px;
          }
        }
        .problemItemFoot {
          width: 96%;
          display: flex;
          .buttons {
            width: 290px;
            display: flex;
            justify-content: space-between;
            div {
              width: 80px;
              border: 1px solid var(--fc);
              border-radius: 4px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              cursor: pointer;
              &:hover {
                background: #409eff;
              }
            }
          }
        }
      }
    }
  }
}
.rightClickBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  background: var(--time);
  // border: 3px solid #000;
  box-sizing: border-box;
  border-radius: 16px;
  div {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    border-radius: 16px;
    &:hover {
      background: var(--carousel);
    }
  }
}
.incomingCall {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .buts {
    width: 200px;
    display: flex;
    justify-content: space-around;
  }
}
.setting {
  width: 90%;
  margin-left: 2%;
  margin-top: 16px;
  height: 400px;
  background: var(--secondLevel);
  padding: 16px;
  border-radius: 16px;
}
</style>
