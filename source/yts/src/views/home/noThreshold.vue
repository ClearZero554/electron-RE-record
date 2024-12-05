<template>
  <div class="noThreshold">
    <div class="header">
      <div class="logo">
        <img :src="from.avatar" alt="" />
        <div>{{ from.name }}</div>
      </div>
      <el-form
        label-position="right"
        label-width="45px"
        :model="from"
        size="mini"
      >
        <el-form-item label="id:">
          <el-input v-model="from.id" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="分类:">
          <el-input v-model="from.class" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="标题:">
          <el-input
            v-model="from.title"
            type="textarea"
            :rows="2"
            size="mini"
            maxlength="35"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="block obs">
        <div class="status">obs 状态（{{ label.obsStatus }}）</div>
        <div class="version">版本&nbsp;&nbsp;{{ label.obsVersion }}</div>
      </div>
      <span class="setting">
        <img src="@/assets/home.png" />
        <span>其他模式</span>
      </span>
    </div>
    <div class="main">
      <div class="qrCode" @click="handleClickGetQrcode">
        <span v-if="!qrcode">点击这里生成登录二维码</span>
        <img id="qrcode" src="" :style="qrcode ? '' : 'width: 0'" />
      </div>
      <div class="tip">
        可用不同账号扫码登录登录后会同步保存该账号最多支持保存 6
        个账号右键可查看信息与删除
      </div>
      <div class="control" @click="handleClickStart">
        <span>0粉推流</span>
        <span class="ps">PS：选择账号后点0粉开播</span>
      </div>
    </div>
    <div class="foot">
      <div>账号列表</div>
      <div class="footList">
        <div class="footItem" v-for="item in userList" :key="item.id" @click="handleClickUser(item.id)">
          <img :src="item.avatar" alt="" />
          <div class="title">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ipcUtil from "@/ipc";

export default {
  name: "noThreshold",
  props: ["label"],
  data() {
    return {
      from: {
        id: null,
        name: null,
        avatar: null,
        class: null,
        title: null,
        category1: null, // 1级分类
        category2: null, // 2级分类
      },
      qrcode: false,
      userList: []
    };
  },
  mounted() {
    this.getUserList()
    if (this.userList && this.userList.length > 0) {
      this.from.id = this.userList[0].id
      this.from.title = this.userList[0].title
      this.from.name = this.userList[0].name
      this.from.avatar = this.userList[0].avatar
    }
  },
  methods: {
    // 登录
    handleClickGetQrcode() {
      if (this.qrcode) return
      /**
       * qrcode: 获取到二维码
       *   qrcode: 二维码base64
       *   indexUrl: 二维码内容链接地址
       *   token: 登录验证令牌
       */
      ipcUtil.getQrcode(res => {
        // 获取二维码
        if (res.key == 'qrcode') {
          this.qrcode = true
          document.getElementById('qrcode').src = res.data.qrcode
        }
        // 二维码刷新
        else if (res.key == 'change') {
          this.qrcode = true
          document.getElementById('qrcode').src = res.data.qrcode
        }
        // 获取信息成功
        else if (res.key == 'getInfo') {
          this.from.id = res.data.id
          this.from.title = res.data.title
          this.from.name = res.data.name
          this.from.avatar = res.data.avatar
          this.getUserList()
        }
        // 异常
        else if (res.key == 'error') {
          this.qrcode = false
        }
      })
    },
    // 获取账号列表
    getUserList() {
      this.userList = ipcUtil.getStore('userList', true)
    },
    // 切换用户
    handleClickUser(id) {
      this.userList.forEach(item => {
        if (item.id == id) {
          this.from.id = item.id
          this.from.title = item.title
          this.from.name = item.name
          this.from.avatar = item.avatar
        }
      })
    },
    handleClickStart() {
      ipcUtil.startLive({
        id: this.from.id,
        title: this.from.title,
        // category1: this.from.category1,
        // category2: this.from.category2
        category1: 416,
        category2: 503
      }, res => {
      })
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 4px;
}
::v-deep .el-form-item__label {
  color: #000;
}
::v-deep .el-input--mini {
  width: 130px;
}
::v-deep .el-input__inner {
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 3px;
  color: #000;
  &:hover {
    border: 2px solid #a0cfff;
    cursor: pointer;
  }
}
::v-deep .el-textarea__inner {
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 3px;
  color: #000;
  &:hover {
    border: 2px solid #a0cfff;
    cursor: pointer;
  }
}
.noThreshold {
  width: 100%;
  height: 100%;
  padding: 3px;
  .header {
    width: 100%;
    height: 120px;
    display: flex;
    .logo {
      margin-left: 8px;
      img {
        width: 90px;
        height: 90px;
        border-radius: 16px;
        border: 2px solid #000;
      }
      div {
        font-size: 13px;
      }
    }
    .from {
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
    }
    .block {
      width: 140px;
      text-align: left;
      margin-left: 8px;
      margin-top: 16px;
      .status {
        display: block;
        font-size: 15px;
        font-weight: 600;
        color: #000;
      }

      .version {
        margin-top: 14px;
        font-size: 12px;
        color: #725247;
      }
    }
    .setting {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      margin-top: 16px;

      img {
        height: 40px;
      }

      span {
        display: block;
      }
    }
  }
  .main {
    width: 100%;
    display: flex;
    .qrCode {
      width: 110px;
      height: 100px;
      margin-left: 8px;
      border-radius: 16px;
      border: 2px solid #000;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      &:hover {
        border: 2px solid #a0cfff;
        cursor: pointer;
      }

      img {
        width: 100px;
        height: 100px;
      }
    }
    .tip {
      width: 160px;
      font-size: 14px;
      margin-left: 8px;
      color: #000;
      font-weight: 500;
    }
    .control {
      position: relative;
      cursor: pointer;
      height: 90px;
      width: 200px;
      margin-top: -10px;
      line-height: 60px;
      font-size: 35px;
      border: 3px solid #521a0e;
      box-sizing: border-box;
      border-radius: 20px;
      color: #000;
      font-weight: 500;
      margin-left: 16px;

      .ps {
        position: absolute;
        bottom: 16px;
        left: 0px;
        width: 100%;
        line-height: 14px;
        font-size: 14px;
        color: #986b5b;
      }
      &:hover {
        border: 3px solid #a0cfff;
        color: #a0cfff;
      }
    }
  }
  .foot {
    width: 100%;
    text-align: left;
    padding: 0 8px;
    font-size: 12px;
    .footList {
      display: flex;
      .footItem {
        width: 50px;
        height: 50px;
        border-radius: 16px;
        border: 2px solid #000;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
        .title {
          color: red;
          position: absolute;
          font-size: 16px;
          left: 3px;
          bottom: 0;
        }
        &:hover {
          border: 2px solid #a0cfff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>