<template>
  <div>
    <el-dialog
      width="70%"
      title="发布问题"
      :visible.sync="visible"
      custom-class="dialog"
      append-to-body
      top="2vh"
      @close="close"
      @open="handleOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="header">
        <div class="info">发布问题</div>
        <iconpark-icon
          name="close-small"
          class="close-small"
          @click="visible = false"
        ></iconpark-icon>
      </div>
      <el-form label-width="80px" :model="formData" ref="form">
        <el-form-item label="cpu:" v-if="isDetails">
          <div>{{ formData.cpu }}</div>
        </el-form-item>
        <el-form-item label="显卡:" v-if="isDetails">
          <div>
            <span v-for="item in formData.gpuList" :key="item"
              >{{ item }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="联系方式:" v-if="windowType != 2">
          <el-input v-model.trim.number="formData.mobile" v-if="!isDetails">
          </el-input>
          <div v-else>{{ formData.mobile }}</div>
        </el-form-item>
        <el-form-item label="直播设备:">
          <div class="df" v-if="!isDetails">
            <div class="singleChoice">
              <div
                @click="changeDeviceType(1)"
                :class="formData.deviceType == 1 ? 'action' : ''"
              >
                平板
              </div>
              <div
                @click="changeDeviceType(2)"
                :class="formData.deviceType == 2 ? 'action' : ''"
              >
                手机
              </div>
              <div
                @click="changeDeviceType(3)"
                :class="formData.deviceType == 3 ? 'action' : ''"
              >
                电脑
              </div>
            </div>
            <div class="inputBox">
              <el-input
                v-model.trim="formData.deviceRemark"
                placeholder="可自己输入设备型号"
              >
              </el-input>
            </div>
          </div>
          <div v-else>
            {{
              formData.deviceType == 1
                ? "平板"
                : formData.deviceType == 2
                ? "手机"
                : "电脑"
            }}
            {{ formData.deviceRemark }}
          </div>
        </el-form-item>
        <el-form-item label="采集方式:">
          <div class="df" v-if="!isDetails">
            <div class="singleChoice">
              <div
                @click="changeCollectType(1)"
                :class="formData.collectType == 1 ? 'action' : ''"
              >
                采集卡
              </div>
              <div
                @click="changeCollectType(2)"
                :class="formData.collectType == 2 ? 'action' : ''"
              >
                电脑屏幕
              </div>
              <div
                @click="changeCollectType(3)"
                :class="formData.collectType == 3 ? 'action' : ''"
              >
                投屏
              </div>
            </div>
            <div class="inputBox">
              <el-input
                v-model.trim="formData.collectRemark"
                placeholder="可输入采集方式"
              >
              </el-input>
            </div>
          </div>
          <div v-else>
            {{
              formData.collectType == 1
                ? "采集卡"
                : formData.collectType == 2
                ? "电脑屏幕"
                : "投屏"
            }}
            {{ formData.collectRemark }}
          </div>
        </el-form-item>
        <el-form-item label="问题:">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请简要输入问题"
            v-model.trim="formData.description"
            :maxlength="50"
            show-word-limit
            v-if="!isDetails"
          >
          </el-input>
          <div v-else>{{ formData.description }}</div>
        </el-form-item>
        <el-form-item label="预约时间:">
          <el-input
            v-model.trim="formData.reserveTime"
            ref="reserveTime"
            placeholder="可选择预约时间"
            @focus="reserveTimeFocus"
            v-if="!isDetails"
          >
          </el-input>
          <div v-else>{{ formData.reserveTime }}</div>
        </el-form-item>
        <el-form-item label="发布时间:" v-if="isDetails">
          <div>{{ formData.time }}</div>
        </el-form-item>
        <el-form-item label="金币:">
          <el-input v-model.trim="formData.price" placeholder="至少20金币">
          </el-input>
        </el-form-item>
        <el-form-item v-if="!isDetails">
          <el-button
            type="info"
            @click="submitForm('addQuery')"
            class="submitForm"
            >存储</el-button
          >
          <el-button type="primary" @click="submitForm('publishQuery')"
            >发布</el-button
          >
        </el-form-item>
        <el-form-item v-if="windowType == 7">
          <el-button type="danger" @click="del" class="submitForm"
            >删除订单</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <ChoiceTime ref="choiceTime" @setReserveTime="setReserveTime"></ChoiceTime>
  </div>
</template>

<script>
import { addQuery, publishQuery, editQuery } from "@/api/chat";
import feedback from "@/utils/feedback";
import ChoiceTime from "./ChoiceTime";
export default {
  name: "SubmitQuery", //发布问题
  components: { ChoiceTime },
  props: ["deviceInfo", "windowType"],
  data() {
    return {
      visible: false,
      id: null,
      isDetails: false,
      formData: {
        description: null,
        price: 20,
        mobile: null, //手机号
        deviceType: 1, //1平板，2手机，3电脑
        deviceRemark: null, //设备备注
        collectType: 1, //1采集卡，2电脑屏幕，3投屏
        collectRemark: null, //采集备注
        reserveTime: null, //预约时间 2024-03-28 10:00
        cpu: null,
        gpu: null,
        gpuList: null,
      },
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  methods: {
    close() {
      this.formData = this.$options.data().formData;
    },
    handleOpen() {
      /*  if (this.userInfo.id) {
        this.formData.mobile = this.userInfo.mobile;
      } */
    },
    // 发布
    async submitForm(type) {
      this.formData.cpu = this.deviceInfo.cpu;
      if (this.formData.price < 20) {
        feedback.msgWarning("至少20金币");
        return;
      }
      this.deviceInfo.gpu.forEach((element, index) => {
        if (index == 0) {
          this.formData.gpu = element;
        } else {
          this.formData.gpu = this.formData.gpu + "-" + element;
        }
      });
      for (const key in this.formData) {
        if (
          [
            "mobile",
            "deviceType",
            "collectType",
            "description",
            "reserveTime",
            "price",
          ].includes(key)
        ) {
          if (this.formData[key] == null) {
            feedback.msgWarning("请填写完再发布");
            return;
          }
        }
      }
      console.log(this.formData, "this.formData");
      let res;
      if (type == "addQuery") {
        if (this.id == null) {
          // 新增
          res = await addQuery(this.formData);
        } else {
          // 编辑
          res = await editQuery({ id: this.id, ...this.formData });
        }
      } else {
        const data = {
          id: this.id,
          ...this.formData,
        };
        res = await publishQuery(data);
      }
      console.log(res);
      if (res.data.code == 200) {
        this.formData = this.$options.data().formData;
        this.id = null;
        this.$emit("changeWindow");
        this.$emit("getUserInfo");
        this.visible = false;
      } else {
        feedback.msgWarning(res.data.msg);
      }
    },
    singleChoice(e) {
      this.formData.price = e;
    },
    changeDeviceType(e) {
      this.formData.deviceType = e;
    },
    changeCollectType(e) {
      this.formData.collectType = e;
    },
    changePrice(e) {
      this.formData.price = e;
    },
    // 预约时间获取焦点
    reserveTimeFocus() {
      // 打开弹框
      this.$refs.choiceTime.visible = true;
      // 失去焦点
      this.$refs.reserveTime.blur();
    },
    // 子组件回传数据
    setReserveTime(e) {
      console.log(e, "e");
      this.formData.reserveTime = e;
    },
    del() {
      console.log("[ this.formData ] >", this.formData);
      this.$emit("del", this.formData);
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog {
    background: rgba($color: #000000, $alpha: 0) !important;
  }
  .el-dialog__body {
    // height: 250px;
    width: 691px;
    border-radius: 9px;
    padding: 16px;
    box-sizing: border-box;
    .tip {
      font-size: 9px;
      margin-left: 12px;
      margin-top: 14px;
      // color: #000000;
    }
    .header {
      display: flex;
      justify-content: space-between;
      position: relative;
      font-size: 18px;
      margin-bottom: 18px;
      .close-small {
        font-size: 24px;
        // cursor: pointer;
        // position: absolute;
        // right: 0px;
      }
    }
  }
}

.submitForm {
  margin-left: 393px;
}
.singleChoice {
  width: 340px;
  display: flex;
  div {
    width: 70px;
    height: 23px;
    padding: 8px;
    border: 1px solid var(--bor);
    margin-left: 8px;
    border-radius: 8px;
    text-align: center;
    line-height: 23px;
    cursor: pointer;
  }
  .action {
    background: #409eff;
  }
}
::v-deep .el-scrollbar {
  background: #fff !important;
}
::v-deep .el-dialog__body {
  // padding: 0 16px !important;
  .el-form-item {
    margin-bottom: 12px !important;
  }
}
::v-deep .el-form-item__label {
  color: var(--fc);
  width: 75px !important;
}
::v-deep .el-form-item__content {
  color: var(--fc);
  margin-left: 75px !important;
}
::v-deep .el-input__inner,
.el-textarea {
  width: 540px !important;
  margin-left: 8px;
}
.df {
  /deep/ .el-input__inner {
    width: 200px !important;
  }
}
</style>
