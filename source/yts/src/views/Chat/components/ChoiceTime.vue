<template>
  <el-dialog
    width="70%"
    title="时间选择"
    :visible.sync="visible"
    custom-class="dialog"
    append-to-body
    top="5vh"
    @close="close"
    @open="handleOpen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <!-- 选择未来7天 -->
    <div class="jz">选择日期</div>
    <div class="dateList">
      <div
        v-for="item in dateList"
        :key="item"
        @click="choiceDate(item)"
        :class="date == item ? 'action' : ''"
      >
        {{ item }}
      </div>
    </div>
    <div class="timeBox">
      <!-- 选择时间节点 -->
      <div class="jz">选择时刻</div>
      <div class="timeList">
        <div
          v-for="item in timeList"
          :key="item.time"
          @click="choiceTime(item)"
          :class="
            date != dateList[0] || item.isAfter
              ? time == item.time
                ? 'action'
                : ''
              : 'disabled'
          "
        >
          <span v-if="item.isRapidly && date == dateList[0]" class="rapidly"
            >急速</span
          >
          {{ item.time }}
          <span class="num">{{ item.num }}/3</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reserveTimeList } from '@/api/chat';
import moment from 'moment';
export default {
  name: 'choiceTime', //选择时间
  data() {
    return {
      visible: false,
      dateList: [],
      date: '',
      timeList: [],
      time: '',
    };
  },
  mounted() {
    this.handleOpen();
  },
  methods: {
    async handleOpen() {
      this.dateList = [];
      this.timeList = [];
      let date = moment();
      this.date = date.format('MM-DD');
      this.dateList.push(date.format('MM-DD'));
      for (let index = 0; index < 6; index++) {
        this.dateList.push(date.add(1, 'd').format('MM-DD'));
      }

      let time = moment().hour('10').minute('0');
      this.timeList.push({
        time: time.format('HH:mm'),
        isAfter: time.isAfter(moment()),
        isRapidly: false,
      });
      for (let index = 0; index < 20; index++) {
        this.timeList.push({
          time: time.add(30, 'm').format('HH:mm'),
          isAfter: time.isAfter(moment()),
          isRapidly: false,
        });
      }
      // 查找到最近的急速时间
      let index = this.timeList.findIndex((item) => item.isAfter);
      if (index !== -1) {
        this.timeList[index].isRapidly = true;
        this.timeList[index + 1].isRapidly = true;
      }
      this.reserveTimeList();
    },
    close() {},
    // 查询时间
    async reserveTimeList() {
      const res = await reserveTimeList({ date: moment().format('MM-DD') });
      if (res.data.code == 200) {
        this.timeList.forEach((item, index) => {
          this.$set(item, 'num', res.data.data[index]);
        });
      }
    },
    // 选择时间
    choiceTime(item) {
      if ((this.date == this.dateList[0] && !item.isAfter) || item.num >= 3) {
        return;
      }
      console.log(item, 'item');
      this.time = item.time;
    },
    choiceDate(item) {
      this.date = item;
      this.time = '';
    },
    confirm() {
      if (this.time) {
        this.$emit('setReserveTime', '2024-' + this.date + ' ' + this.time);
        this.time = '';
        this.visible = false;
      }else{
        this.$emit('setReserveTime', '');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jz {
  margin-bottom: 8px;
}
.dateList {
  width: 100%;
  height: 52px;
  display: flex;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  justify-content: space-between;
  background: var(--secondLevel);
  div {
    width: 80px;
    height: 100%;
    text-align: center;
    line-height: 52px;
    cursor: pointer;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .action {
    background: var(--time);
  }
}
.timeList {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 16px 0;

  div {
    width: 80px;
    height: 40px;
    background: var(--secondLevel);
    text-align: center;
    line-height: 30px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    .rapidly {
      position: absolute;
      font-size: 10px;
      top: -8px;
      left: 0px;
      color: var(--topping);
    }
    .num {
      position: absolute;
      font-size: 12px;
      top: 16px;
      left: 0px;
      color: var(--topping);
    }
  }
  .action {
    background: var(--action);
  }
  .disabled {
    background: #ccc;
  }
}
.timeBox {
  background: var(--time);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  .jz {
    margin-top: 8px;
  }
}
</style>
