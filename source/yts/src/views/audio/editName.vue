<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="40%"
    @open="open"
    :before-close="handleClose"
  >
    <el-input
      v-model="input"
      placeholder="请输入内容"
      size="mini"
      v-if="title == '重命名'"
      :clearable="true"
      @clear="input = ''"
    ></el-input>
    <el-input
      v-else
      :value="input.join('+')"
      @clear="shortcutKeysClear"
      @focus="falseInput"
      size="small"
      :clearable="true"
      :class="isFocus ? 'isFocus' : ''"
    />
    <input
      v-if="title != '重命名'"
      style="width: 0px; height: 0px; opacity: 0"
      :value="input.join('+')"
      :clearable="true"
      @focus="shortcutKeysFocus"
      @blur="shortcutKeysBlur"
      type="password"
      ref="falseInput"
    />
    <div slot="footer" class="dialog-footer">
      <div @click="$emit('update:dialogVisible', false)">取消</div>
      <div @click="editName">确定</div>
    </div>
  </el-dialog>
</template>

<script>
import { updateCategory, updateList, updateInfo } from "@/api/audio";
import ipcUtil from "@/ipc";
import feedback from "@/utils/feedback";
import lodash from "lodash";
import { keyboardProcessing } from "@/utils/index";
export default {
  props: ["title", "dialogVisible", "clickItem", "showType", "list",'userMusicMenu'],
  data() {
    return {
      input: [],
      isFocus: false,
    };
  },
  methods: {
    open() {
      console.log('[ this.clickItem ] >', this.clickItem)
      if (this.title == "重命名") {
        this.input = this.clickItem.name || "";
      } else {
        this.input = this.clickItem.shortcutKey
          ? this.clickItem.shortcutKey.split("+")
          : [];
      }
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    //快捷键获取焦点
    shortcutKeysFocus() {
      // window.shortcutKeysCall = null;
      document.onkeydown = this.focus;
    },
    // 获得焦点
    focus(e) {
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
    // 清除事件
    shortcutKeysClear() {
      this.input = [];
    },
    // 假的input获得焦点
    async falseInput(e) {
      this.isFocus = true;
      this.$refs.falseInput.focus();
    },
    // 失去焦点
    async shortcutKeysBlur() {
      this.isFocus = false;
      document.onkeydown = null;
    },
    // 快捷键的回调
    shortcutKeyCallback(e, id) {
      this.$emit("idPlay", id);
    },
    // 重命名 或设置快捷键
    async editName() {
      if (this.title == "全局快捷键") {
        const rel = await updateInfo({
          globalShortcutKey: this.input.join("+"),
        });
        if (rel.data.code == 200) {
          await ipcUtil.logoutKeys({ keyWord: this.clickItem.shortcutKey });
          const data = {
            shortcutKey: this.input.join("+"),
            id: -2,
          };
          await ipcUtil.audioKey(data);
          this.handleClose();
          this.$emit("init");
        }
        return;
      }
      if (this.title == "播放快捷键") {
        const rel = await updateInfo({
          playShortcutKey: this.input.join("+"),
        });
        if (rel.data.code == 200) {
          await ipcUtil.logoutKeys({ keyWord: this.clickItem.shortcutKey });
          this.handleClose();
          this.$emit("init");
        }
        return;
      }
      if (this.title == "快捷键") {
        // 防止重复快捷键
        const data = {
          shortcutKey: this.input.join("+"),
          id: this.clickItem.id,
        };
        if (
          this.list.findIndex((item) => item.shortcutKey == data.shortcutKey) ==
          -1
        ) {
          const res = await updateList(data);
          console.log(res.data, "res.data");
          if (res.data.code == 200) {
            this.handleClose();
            this.$emit("getList");
            await ipcUtil.audioKey(data);
            // window.audioKeyKeysCall = this.shortcutKeyCallback;
            // 清除上一个快捷键
            if (this.clickItem.shortcutKey) {
              await ipcUtil.logoutKeys({
                keyWord: this.clickItem.shortcutKey,
              });
            }
          } else {
            feedback.msgSuccess(res.data.msg);
          }
        } else {
          feedback.msgSuccess("同分类下快捷键重复");
        }
        console.log(data, "data");

        return;
      }
      const data = {
        id: this.clickItem.id,
        name: this.input,
        menuId:this.userMusicMenu
      };
      if (this.showType == "class") {
        const res = await updateCategory(data);
        if (res.data.code == 200) {
          this.handleClose();
          this.$emit("getClassList");
        }
      } else {
        const res = await updateList(data);
        if (res.data.code == 200) {
          this.handleClose();
          this.$emit("getList");
        }
      }
      this.shortcutKeysClear()
    },
  },
};
</script>

<style lang="scss" scoped>
.isFocus {
  border: 2px solid #bde2f6 !important;
  box-sizing: border-box;
}
::v-deep .el-dialog__body {
  display: flex;
  justify-content: center;
}
::v-deep .el-input {
  border-radius: 12px;
  overflow: hidden;
  width: 250px;
  border: 2px solid #000;
  box-sizing: border-box;
  .el-input__inner {
    height: 28px;
    border: none;
    // width: 120px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  div {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 16px;
    font-weight: 500;
    border: 3px solid #b3b1ad;
    cursor: pointer;
    margin-right: 14px;
    font-size: 14px;
    color: #b3b1ad;
    &:nth-child(1) {
      background: #fff;
      border: 3px solid #000;
    }
    &:nth-child(2) {
      background: #c3fbba;
    }
  }
}
</style>