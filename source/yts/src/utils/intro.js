import introJs from 'intro.js';
import 'intro.js/introjs.css';

const intro = introJs();
// 更多配置参数请到官方文档查看
intro.setOptions({
  nextLabel: '下一个', // 下一个按钮文字
  prevLabel: '上一个', // 上一个按钮文字
  skipLabel: '跳过', // 跳过按钮文字
  doneLabel: '立即体验', // 完成按钮文字
  tooltipClass: 'intro-tooltip',
  hidePrev: true, // 在第一步中是否隐藏上一个按钮
  hideNext: false, // 在最后一步中是否隐藏下一个按钮
  exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
  showStepNumbers: false, // 是否显示红色圆圈的步骤编号
  disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
  showBullets: false, // 是否显示面板指示点
  overlayOpacity: 0,
  scrollToElement: false,
  steps: [
    {
      element: '#start1', // 目标元素
      intro:
        '自动推流,打开OBS、源调试、抖音直播伴侣,等待源调试变黄色,抖音直播伴侣开播就可以了', // 提示文本
      position: 'left', // 提示位置
    },
    {
      element: '#debug',
      intro: '一键配置,可保存配置可一键调试',
      position: 'top',
    },
    {
      element: '#course',
      intro: '音效软件,可设置快捷键,一键播放音乐',
      position: 'top',
    },
    {
      element: '#tabs',
      intro: '素材中心',
      position: 'top',
    },
    {
      element: '#userInfo',
      intro: '个人中心',
      position: 'left',
    },
  ],
});

export default intro;
