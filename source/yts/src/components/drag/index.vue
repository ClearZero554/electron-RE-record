<template>
  <div
    ref="floatDrag"
    class="float-position"
    :style="{ left: left + 'px', top: top + 'px', zIndex: zIndex }"
    @touchmove.prevent
    @mousemove.prevent
    @mousedown="mouseDown"
    @mouseup="mouseUp"
  >
    <slot></slot>
  </div>
</template>
  
  <script>
export default {
  name: "DragBall",
  props: {
    distanceRight: {
      type: Number,
      default: 0,
    },
    distanceBottom: {
      type: Number,
      default: 100,
    },
    isScrollHidden: {
      type: Boolean,
      default: false,
    },
    isCanDraggable: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 50,
    },
    value: {
      type: String,
      default: "",
    },
  },

  //data 域
  data() {
    return {
      clientWidth: null,
      clientHeight: null,
      left: 0,
      top: 0,
      timer: null,
      currentTop: 0,
      mousedownX: 0,
      mousedownY: 0,
      isMove: false,
    };
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
  },
  mounted() {
    this.isCanDraggable &&
      this.$nextTick(() => {
        this.floatDrag = this.$refs.floatDrag;
        // 获取元素位置属性
        this.floatDragDom = this.floatDrag.getBoundingClientRect();
        // 设置初始位置
        this.left =
          this.clientWidth - this.floatDragDom.width - this.distanceRight;
        this.top =
          this.clientHeight - this.floatDragDom.height - this.distanceBottom;
      });
    this.isScrollHidden && window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
    document
      .getElementsByClassName("el-scrollbar__wrap")[0]
      .addEventListener("mouseleave", this.mouseleave);
  },
  methods: {
    /**
     * 设置滚动监听
     * 设置滚动时隐藏悬浮按钮，停止时显示
     */
    handleScroll() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleScrollEnd();
      }, 200);
      this.currentTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (this.left > this.clientWidth / 2) {
        // 判断元素位置再左侧还是右侧
        this.left = this.clientWidth + this.floatDragDom.width;
      } else {
        this.left = -this.floatDragDom.width;
      }
    },
    /**
     * 滚动结束
     */
    handleScrollEnd() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        if (this.left > this.clientWidth / 2) {
          // 判断元素位置再左侧还是右侧
          this.left = this.clientWidth - this.floatDragDom.width;
        } else {
          this.left = 0;
        }
        clearTimeout(this.timer);
      }
    },
    /**
     * 窗口resize监听
     */
    handleResize() {
      this.clientWidth = document.documentElement.clientWidth;
      this.clientHeight = document.documentElement.clientHeight;
      this.checkDraggablePosition();
    },
    mouseDown(e) {
      this.isMove = true;
      let time = setTimeout(() => {
        if (this.isMove) {
          this.move(e);
        } else {
          this.$emit("handlepaly");
        }
      }, 500);

      this.$refs.floatDrag.onmouseup = () => {
        this.isMove = false;
        // this.mouseUp(e)
      };
      this.$refs.floatDrag.onmouseout = () => {
        this.isMove = false;
        clearTimeout(time)
      };
    },
    // 移动
    move(e) {
      const event = e || window.event;
      this.mousedownX = event.screenX;
      this.mousedownY = event.screenY;
      const that = this;
      let floatDragWidth = this.floatDragDom.width / 2;
      let floatDragHeight = this.floatDragDom.height / 2;
      if (event.preventDefault) {
        event.preventDefault();
      }
      this.canClick = false;
      this.floatDrag.style.transition = "none";
      document.onmousemove = function (e) {
        var event = e || window.event;
        that.left = event.clientX - floatDragWidth;
        that.top = event.clientY - 28 - floatDragHeight;
        if (that.left < 0) that.left = 0;
        if (that.top < 0) that.top = 0;
        if (that.left >= that.clientWidth - floatDragWidth * 2) {
          that.left = that.clientWidth - floatDragWidth * 2;
        }
        if (that.top >= that.clientHeight - floatDragHeight * 2) {
          that.top = that.clientHeight - floatDragHeight * 2;
        }
      };
    },
    mouseUp(e) {
      this.isMove = false;
      const event = e || window.event;
      //判断只是单纯的点击，没有拖拽
      if (
        this.mousedownY == event.screenY &&
        this.mousedownX == event.screenX
      ) {
        this.$emit("handlepaly");
      }
      document.onmousemove = null;
      this.checkDraggablePosition();
      this.floatDrag.style.transition = "all 0.3s";
    },
    /**
     * 判断元素显示位置
     * 在窗口改变和move end时调用
     */
    checkDraggablePosition() {
      if (this.left + this.floatDragDom.width / 2 >= this.clientWidth / 2) {
        // 判断位置是往左往右滑动
        this.left =
          this.clientWidth - this.floatDragDom.width - this.distanceRight;
      } else {
        this.left = this.distanceRight;
      }
      if (this.top < 0) {
        // 判断是否超出屏幕上沿
        this.top = 0;
      }
      if (this.top + this.floatDragDom.height >= this.clientHeight) {
        // 判断是否超出屏幕下沿
        this.top = this.clientHeight - this.floatDragDom.height;
      }
    },
    //  鼠标离开事件
    mouseleave(e) {
      this.mouseUp(e);
    },
    // 判断是什么类型的事件
    addLongtabListener(target, callback) {
      let timer = 0; // 初始化timer

      target.ontouchstart = () => {
        timer = 0; // 重置timer
        timer = setTimeout(() => {
          callback();
          timer = 0;
        }, 380); // 超时器回调能成功执行，说明是长按
      };

      target.ontouchmove = () => {
        clearTimeout(timer); // 如果来到这里，说明是滑动，清除超时器，不执行回调
        timer = 0;
      };

      target.ontouchend = () => {
        // 到这里如果timer有值，说明此触摸时间不足380ms，是点击，清除超时器，不执行回调
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mouseleave", this.mouseleave);
  },
};
</script>
  <style scoped lang="scss">
.float-position {
  position: absolute;
  z-index: 10003;
  right: 0;
  top: 70%;
  width: 60px;
  height: 60px;
  background: #fff;
  border: 3px solid #1a7fe3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>
  
  