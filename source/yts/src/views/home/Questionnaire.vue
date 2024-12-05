<template>
  <el-dialog
    append-to-body
    :visible.sync="visible"
    width="60%"
    @open="open"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div>
      <div class="header">
        <div>问卷调查</div>
        <iconpark-icon
          name="close-small"
          class="close-small"
          @click="visible = false"
        ></iconpark-icon>
      </div>
      <div class="theme" v-if="this.butText == '确认提交'">
        ·感谢您抽出宝贵时间完成本次问卷！您的意见对我们至关重要，我们将认真考虑
        每一条建议,努力提升APP的用户体验。祝您使用愉快!
      </div>
      <div class="title">
        <div class="index">{{ numberOfItems }}</div>
        <div class="questionCount">{{ currentObj.questionCount }}</div>
      </div>
      <div v-if="currentObj.type == 2">
        <div
          v-for="e in currentObj.optionList"
          :key="e.optionId"
          class="radio"
          :class="
            disabled
              ? form[currentObj.questionId] == e.optionId
                ? 'action radio1'
                : 'radio1'
              : ''
          "
          @click="radioChange(e.optionId, currentObj.questionId)"
        >
          <div>
            {{ e.optionContent }}
            <Icon
              fontName="icon-duigou"
              style="color: #0d99ff"
              v-if="form[currentObj.questionId] == e.optionId"
            ></Icon>
          </div>
          <div v-if="disabled">{{ e.count }}票</div>
        </div>
      </div>
      <div v-if="currentObj.type == 1" class="textarea">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="currentObj.content"
        >
        </el-input>
        <div class="butText" @click="changeInput">{{ butText }}</div>
      </div>
      <div class="butText" v-if="disabled" @click="next">{{ butText }}</div>
    </div>
  </el-dialog>
</template>

<script>
import { questionList, resultSave } from "@/api/index";
export default {
  name: "questionnaire", //问卷
  data() {
    return {
      visible: false,
      form: {},
      list: [],
      currentObj: {},
      isShowButton: false, //提交按钮
      butText: "下一题",
      optionItem: {},
      isShowBut: false,
      disabled: false, //是否禁用
      numberOfItems: 1, //题目数
    };
  },
  mounted() {
    this.open();
  },
  methods: {
    async open() {
      const res = await questionList();
      if (res.data.code == 200) {
        this.list = res.data.data.map((item) => {
          return {
            content: "",
            ...item,
          };
        });
        this.currentObj = this.list[0];
        if (this.currentObj.type == 1) {
          if (0 == this.list.length - 1) {
            this.butText = "确认提交";
          } else {
            this.butText = "下一题";
          }
        }
      }
    },
    // 单选框改变
    radioChange(e, id) {
      if (this.disabled) return;
      // 存进form表单中
      this.$set(this.form, id, e);
      this.optionItem = e;
      let obj = this.currentObj.optionList.find(
        (item) => item.optionId == this.optionItem
      );
      console.log(obj, "obj");
      if (obj.nextQuestionId != "0" && obj.nextQuestionId != null) {
        this.butText = "下一题";
      } else {
        this.butText = "确认提交";
      }
      // 禁用单选框
      this.disabled = true;
    },
    changeInput() {
      // 下一题
      if (this.butText == "下一题") {
        let index = this.list.findIndex(
          (item) => item.questionId == this.currentObj.questionId
        );
        this.currentObj = this.list[index + 1];
        // 如果是输入类型
        if (this.currentObj.type == 1) {
          if (index == this.list.length - 1) {
            this.butText = "确认提交";
          } else {
            this.butText = "下一题";
          }
        }
      } else {
        this.submit();
      }
    },
    async submit() {
      // 处理数据
      const data = [];
      // 处理单选
      for (const key in this.form) {
        data.push({
          questionId: key,
          optionId: this.form[key],
        });
      }
      // 处理输入框
      this.list.forEach((item) => {
        if (item.type == 1) {
          data.push({
            questionId: item.questionId,
            content: item.content,
          });
        }
      });

      // 选择完成
      const res = await resultSave(data);
      if (res.data.code == 200) {
        this.visible = false;
      }
    },
    async next() {
      // 查出选择的哪一项
      let obj = this.currentObj.optionList.find(
        (item) => item.optionId == this.optionItem
      );
      if (obj.nextQuestionId != null && obj.nextQuestionId != "0") {
        // 说明有下文
        let index = this.list.findIndex(
          (item) => item.questionId == obj.nextQuestionId
        );
        this.currentObj = this.list[index];
        // 如果是输入类型
        if (this.currentObj.type == 1) {
          if (index == this.list.length - 1) {
            this.butText = "确认提交";
          } else {
            this.butText = "下一题";
          }
        }
        this.numberOfItems++;
      } else {
        this.submit();
      }
      // 解除禁用
      this.disabled = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  height: 384px;
  width: 600px;
  border-radius: 9px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  .el-textarea {
    border-radius: 18px;
  }
  .el-textarea__inner {
    border-radius: 9px !important;
  }
  // background-image: url('../../assets/wj.png') !important;
  // background-size: 100% 100% !important;
  // background-repeat: no-repeat;
  .theme {
    position: absolute;
    font-size: 10px;
    color: #666666;
    width: 365px;
    bottom: 56px;
    left: 34px;
  }
  .close-small {
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    font-weight: 700;
  }
  .textarea {
    width: 545px;
    margin-left: 16px;
    margin-top: 16px;
  }
  .title {
    padding: 0 18px;
    display: flex;

    margin-top: 12px;
    .index {
      width: 16px;
      height: 16px;
      background: #0d99ff;
      color: #fff;
      border-radius: 3px;
      font-size: 10px;
      text-align: center;
      margin-top: 3px;
      margin-right: 8px;
      line-height: 16px;
    }
    .questionCount {
      width: 550px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
    }
  }
  .radio {
    width: 484px;
    height: 40px;
    border-radius: 9px;
    border: 1px solid #666666;
    margin-left: 38px;
    margin-top: 8px;

    text-align: center;
    line-height: 40px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .radio1 {
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
  }
  .action {
    background: #d1e5f9;
    border: 1px solid #0d99ff;
  }
  .butText {
    width: 96px;
    height: 30px;
    background: #0d99ff;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    margin: 12px 0 0 450px;
    cursor: pointer;
  }
  .wj {
    width: 150px;
    height: 112px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>