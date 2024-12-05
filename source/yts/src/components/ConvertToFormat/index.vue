<template>
  <el-dialog
    title="视频格式转换"
    :visible.sync="dialogVisible"
    :modal="false"
    width="70%"
    @open="open"
  >
    <div class="box">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="输入视频:">
          <el-button type="primary" @click="choice">选择视频</el-button>
          <span v-if="form.input" class="input">{{ form.input }}</span>
        </el-form-item>
        <el-form-item label="目标格式:">
          <el-radio-group v-model="form.format">
            <el-radio label="webm"></el-radio>
            <el-radio label="mp4"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频码率:">
          <div class="progress">
            <el-input v-model="form.bitrate" placeholder=""></el-input>
          </div>
        </el-form-item>
        <el-form-item label="转换进度:" v-if="form.speedOfProgress > 0">
          <div class="progress">
            <el-progress
              :percentage="form.speedOfProgress"
              :text-inside="true"
              :stroke-width="20"
            ></el-progress>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="buts">
            <el-button type="primary" @click="conversion">转换</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import ipcUtil from '@/ipc';
import feedback from '@/utils/feedback';
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        input: '',
        format: 'webm',
        speedOfProgress: 0,
        bitrate: '',
      },
    };
  },
  mounted() {
    // window.ipc.on('speedOfProgress', (e, data) => {
    //   if (data.code == 202) {
    //     this.form.speedOfProgress = Number(data.progress);
    //   } else if (data.code == 201) {
    //     feedback.msgWarning('码率不匹配,请重新设置码率');
    //   } else {
    //     feedback.msgSuccess('转换成功');
    //     this.dialogVisible = false;
    //     this.form = this.$options.data().form;
    //   }
    // });
  },
  methods: {
    open() {},
    choice() {
      ipcUtil.selectFile(async (res) => {
        this.form.input = res.data;
        const rel = await window.ipc.invoke('getVideoInfo', {
          input: this.form.input,
        });
        console.log('[ rel ] >', rel);
      });
    },
    // 转换
    submit() {},
    // 转换视频格式
    conversion() {
      window.ipc.send('conversion', this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  /deep/ .el-form-item__label {
    color: var(--fc) !important;
  }
  .input {
    margin-left: 16px;
  }
  .progress {
    width: 300px;
    margin-top: 8px;
  }
  .buts {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0 32px;
    box-sizing: border-box;
  }
}
</style>
