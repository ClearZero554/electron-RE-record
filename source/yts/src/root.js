import App from './App.vue';
import router from './router';
import ipcUtil from './ipc';
import lodash from 'lodash';
import OBSWebSocket from 'obs-websocket-js';
import { userInfo } from '@/api/user';
import { getDay } from '@/utils/index';
import { getNum } from '@/api/chat';
import { updateLogs, userObsStream } from '@/api/index';
import feedback from '@/utils/feedback';
import moment from 'moment';
import config from '@/../package.json';
export default {
  data() {
    return {
      count: 0,
      ipcStatus: false, // IPC状态
      obsHandle: null, // OBS句柄
      obs: {
        // OBS
        name: null, // 名称
        path: null, // 安装路径
        version: null, // 版本号
        config: null, // 配置文件地址
        reg: null, // 注册表地址
        pid: -1, // 进程PID
        needStart: 0, // 需要重启: 不需要 0 需要 1
        living: false, //obs直播状态
      },
      profiles: {
        locate: [],
        online: [{}],
      },
      websocket: {
        // WebSocket信息
        checked: false, // 是否检查过WebSocket
        installed: false, // 是否安装WebSocket
        connect: false, // 连接状态
        version: null, // WebSocket版本
        config: {
          // WebSocket配置信息
          FirstLoad: false, // 首次加载
          ServerEnabled: true, // 是否开启
          ServerPort: '4455', // 服务端口
          AlertsEnabled: false, // 是否提供报警信息
          AuthRequired: false, // 是否验证身份\
          // ServerPassword: '', // 连接密码
        },
      },
      rtmp: {
        streamServiceType: 'rtmp_custom', //
        streamServiceSettings: {
          //
          bwtest: false, //
          key: null, //
          server: null, //
          use_auth: false, //
        },
      },
      douyin: {
        // 抖音直播伴侣
        name: null, // 名称
        path: null, // 安装路径
        version: null, // 版本号
        config: null, // 配置文件地址
        reg: null, // 注册表地址
        pid: -1, // 进程PID
        living: false, // 直播状态
        rtmp_url: null, // rtmp地址
      },
      mediasdk: {
        pid: 0, // MediaSDK进程PID
        version: null, // MediaSDK版本号
        versionIndex: null, // MediaSDK版本序列号
        status: false, // MediaSDK截断状态
        hash: null, // MediaSDK文件哈希值
      },
      url: 'https://resource.yuantiaoshi.com/',
      userInfo: {}, //个人信息
      ws: null, //ws连接
      totalNumber: 0, //总数
      store: {
        isTourist: false, //是否为游客模式
        isUseTourist: false, //是否可以使用游客模式
      },
      route: {
        index: 0,
        router: [{ fullPath: '/home', name: 'home', path: '/home' }],
      },
      // 直播伴侣截流链接和版本
      liveVersion: {
        dictRemark: [],
        dictType: '',
        dictName: '', //版本号
        updateTime: '',
      },
      isBeginToShow: true, //任务栏是否提示
    };
  },
  mounted() {
    // 循环任务
    ipcUtil.status();
    router.beforeEach((to, from, next) => {
      next();
      if (
        this.route.index === this.route.router.length - 1 &&
        to.fullPath !== this.route.router[this.route.router.length - 1].fullPath
      ) {
        this.route.index = this.route.router.length;
        this.route.router.push(to);
      }
      if (to.fullPath == '/' && to.query.keyword == undefined) {
        this.route.index = 0;
      }
      if (this.route.index == 0) {
        this.route.router = [
          { fullPath: '/home', name: 'home', path: '/home' },
        ];
      }
    });
  },
  methods: {
    // 循环任务
    async loop() {
      if (!this.ipcStatus) {
        this.ipcStatus = ipcUtil.status();
        ipcUtil.log('[root] IPC初始化成功');

        return;
      }

      if (
        null == this.obs.path ||
        null == this.obs.config ||
        null == this.douyin.path ||
        null == this.douyin.config
      ) {
        // 获取安装信息
        const info = await ipcUtil.getInfo();
        if (info != null) {
          let setting = ipcUtil.getStore('setting') || {};
          3;
          let flag = await ipcUtil.isAccess(setting.path);
          if (setting.path && flag) {
            info.obs.path = setting.path;
          }
          lodash.merge(this, info);
          if (!(this.profiles.locate && this.profiles.locate.length != 0)) {
            this.profiles.locate = await ipcUtil.getObsProfilesLists(
              this.obs.config
            );
          }
        }
        if (null != this.obs.path && null != this.obs.config) {
          await this.checkObs();
        }

        return true;
      }
      let setting = ipcUtil.getStore('setting') || {};
      let flag = await ipcUtil.isAccess(setting.path);
      if (setting.path && flag) {
        this.obs.path = setting.path;
      }
      await this.checkDouyin();
      await this.checkObs();
      this.count += 1;

      return true;
    },

    // OBS相关逻辑
    async checkObs() {
      this.obs.pid = await window.ipc.invoke('V2_OBS_GetStatus', {
        path: this.obs.path,
      });
      // OBS版本大于27
      if (parseInt(this.obs.version.substr(0, 2)) > 27) {
        // 没有检查OBS插件状态
        if (this.websocket.checked == false) {
          const setting = await ipcUtil.getWebsocketSetting(this.obs.config);
          if (setting != null) {
            lodash.merge(this.websocket, setting);
          }
        }
        // 已经检查过并且已经安装
        else if (this.websocket.checked && this.websocket.installed) {
          // 校验Websocket配置是否合法
          if (
            // 没有开启Websocket服务
            this.websocket.config.ServerEnabled != true ||
            // 端口未设置或者端口不合法
            (parseInt(this.websocket.config.ServerPort) || 0) < 1024 ||
            // 有权限验证
            this.websocket.config.AuthRequired == true ||
            this.websocket.config.ServerPassword == null ||
            this.websocket.config.ServerPassword == ''
          ) {
            // 判断OBS状态，在运行的话需要重启
            if (this.obs.pid.length > 0) {
              await ipcUtil.stopObs(this.obs.pid);
              this.obs.needStart = 1;
              return;
            }
            // OBS不在运行
            else {
              let config = this.websocket.config;
              // 没有开启Websocket服务
              if (config.ServerEnabled != true) config.ServerEnabled = true;
              // 端口未设置或者端口不合法
              if ((parseInt(config.ServerPort) || 0) < 1024)
                config.ServerPort = 4455;
              // 未设置权限验证
              if (config.AuthRequired == true) config.AuthRequired = false;
              // 未设置服务密码
              if (config.ServerPassword == null || config.ServerPassword == '')
                config.ServerPassword = '123456';
              let res = await ipcUtil.setWebsocketSetting(
                this.obs.config,
                config
              );
              // 文件修改成功了，再修改缓存
              if (res) this.websocket.config = config;
            }
          }
          // Websocket配置合法
          else {
            // 检测OBS状态
            if (
              this.obs.pid.length > 0 &&
              this.obsHandle &&
              this.websocket.connect
            ) {
              // try {
              //   await this.obsHandle.call('GetVersion');
              // } catch (error) {
              //   console.log('[ error ] >', error);
              //   // this.websocket.connect = false;
              // }
            } else {
              this.websocket.connect = false;
            }

            // OBS关闭且需要重启
            if (1 == this.obs.needStart && this.obs.pid.length == 0) {
              await ipcUtil.startObs(this.obs.path);
              this.obs.needStart = 0;
            }
            // OBS正在运行且Websocket服务未连接
            else if (this.obs.pid.length > 0 && !this.websocket.connect) {
              await this.connectObs(
                this.websocket.config.ServerPort,
                this.websocket.config.ServerPassword
              );
            }
          }
        }
        return true;
      }
    },
    // 直播伴侣相关逻辑
    async checkDouyin() {
      this.douyin.pid = await window.ipc.invoke('V2_DOUYIN_GetStatus', {
        path: this.douyin.path,
      });
      if (-1 == this.douyin.pid) {
        this.mediasdk.status = false;
        return;
      }

      const info = await ipcUtil.getRoomInfo(this.douyin.config);
      // 直播伴侣关播了
      if (info != null && info.status == 4 && this.douyin.living == true) {
        this.$bus.$emit('closeLiving');
      }
      if (null != info && 2 == info.status) {
        this.douyin.living = true;
        if (
          info.rtmp_push_url != this.douyin.rtmp_url &&
          !this.obs.living &&
          this.count >= 5
        ) {
          try {
            userObsStream({ streamCode: info.rtmp_push_url });
          } catch (error) {
            console.log('[ rtmp_push_url ] >', error);
          }
          ipcUtil.log('直播流发生改变===', info.rtmp_push_url);
          this.$bus.$emit('isLiving');
          if (!this.websocket.connect) {
            ipcUtil.log('Obs尚未连接-----------------------------');
          }
        }
        this.douyin.rtmp_url = info.rtmp_push_url;
      } else {
        this.douyin.living = false;
      }
      // }

      if (this.douyin.living == true) return;
      // this.userInfo.days > 0 ||
      if (
        (this.count + 1) % 2 == 0 &&
        (this.userInfo.days > 0 || this.userInfo.isNewUserIn24h == 1) &&
        !this.mediasdk.status
      ) {
        const mediasdkInfo = await ipcUtil.getMediasdkVersion(this.douyin.path);
        if (null != mediasdkInfo && this.liveVersion.dictRemark.length > 0) {
          this.mediasdk.version = mediasdkInfo.version;

          this.mediasdk.versionIndex = this.liveVersion.dictRemark.findIndex(
            (item) => item == this.mediasdk.version
          );
          if (this.mediasdk.versionIndex == -1) {
            return;
          }
          // 获取到Mediasdk版本号 并且截流
          let pids = await window.ipc.invoke('V2_DOUYIN_GetMediasdkStatus');
          this.mediasdk.status = await ipcUtil.stopMediasdk(
            pids,
            this.mediasdk.versionIndex,
            this.liveVersion.dictType,
            new Date().getTime(),
            ipcUtil.getStore('token'),
            config.version
          );
        }
      }
    },
    // 连接OBS Websocket服务
    async connectObs(port, password) {
      console.log('准备连接');
      if (!this.obsHandle) this.obsHandle = new OBSWebSocket();

      try {
        ipcUtil.log('[root] 连接OBS 端口: ' + port);
        let res = await this.obsHandle.connect(
          `ws://127.0.0.1:${port}`,
          password
        );
        ipcUtil.log(res, 'ws');
        if (res && res.obsWebSocketVersion) {
          ipcUtil.log(
            '[root] OBS WebSocket协议版本：' + res.obsWebSocketVersion
          );
          this.websocket.version = res.obsWebSocketVersion;
          this.websocket.connect = true;
        }
      } catch (error) {
        console.log('Failed to connect', error.code, error.message);
        this.websocket.connect = false;
      }
    },
    // 权限判断
    authority() {
      return this.userInfo.isMember == 1 ? true : false;
    },
    // 获取个人信息
    async getUserInfo() {
      const res = await userInfo();
      if (res.data.code == 200) {
        this.userInfo = {
          ...res.data.data,
          memberExpirationTime: res.data.data.memberExpirationTime
            ? getDay(res.data.data.memberExpirationTime * 1000, 'yyyy/MM/dd')
            : null,
        };

        // localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        return this.userInfo;
      } else {
        /* let userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          this.userInfo = JSON.parse(userInfo);
          return this.userInfo;
        } */
        return null;
      }
    },
    // 回退
    handleGoBack() {
      this.route.index = this.route.index - 1;
      this.$router.push(this.route.router[this.route.index]);
    },
    // 前进
    handleGoBefore() {
      if (this.route.index != this.route.router.length - 1) {
        this.route.index = this.route.index + 1;
        this.$router.push(this.route.router[this.route.index]);
      }
    },
    // 判断是否为最后一页
    lastPage() {
      if (this.route.index != this.route.router.length - 1) {
        return false;
      } else {
        return true;
      }
    },
    // 获取未读总数
    async getTotalNumber() {
      const res = await getNum();
      if (res.data.code == 200) {
        this.totalNumber = res.data.data[0];
        return res.data.data;
      } else {
        return [];
      }
    },
    // 获取直播伴侣版本
    async getLiveVersion(type) {
      if (localStorage.getItem('dictRemark')) {
        this.liveVersion.dictRemark = JSON.parse(
          localStorage.getItem('dictRemark')
        );
      } else {
        this.liveVersion.dictRemark = [
          '4.8.0.7',
          '4.9.0.3',
          '4.9.0.6',
          '5.0.0.4',
          '5.0.0.5',
          '5.0.0.6',
          '5.1.0.9',
          '5.1.0.11',
          '5.2.0.15',
          '5.2.0.20',
          '5.2.0.21',
          '5.2.0.29',
          '5.2.0.33',
          '5.2.0.34',
          '5.3.0.7',
          '5.3.0.9',
          '5.3.0.11',
          '5.3.0.12',
          '5.3.0.14',
          '5.3.0.15',
          '5.4.0.4',
          '5.3.0.18',
          '5.3.0.21',
          '5.3.0.22',
          '5.3.0.24',
          '5.5.0.7',
          '5.4.0.6',
          '5.5.0.9',
          '5.4.0.8',
          '5.5.0.10',
          '5.5.0.11',
          '5.5.0.12',
          '5.6.0.5',
          '5.6.0.4',
          '5.5.0.15',
          '5.6.0.8',
          '5.5.0.16',
          '5.6.0.9',
          '6.0.0.7',
          '6.0.0.9',
          '6.1.0.5',
          '6.1.0.7',
          '6.2.0.3',
          '6.3.0.5',
          '6.3.0.6',
          '6.3.0.8',
          '6.4.0.6',
          '6.4.0.8',
          '6.4.0.9',
          '6.5.0.5',
          '6.5.0.6',
          '6.5.0.7',
          '6.5.0.10',
          '6.5.0.11',
          '6.6.0.11',
          '6.6.0.13',
          '6.6.0.14',
          '6.6.0.15',
          '6.7.0.10',
          '6.7.0.11',
          '6.8.0.6',
          '6.8.0.7',
          '6.9.0.5',
          '6.9.0.6',
          '6.9.0.7',
          '7.0.0.8',
          '7.0.0.9',
          '7.0.0.11',
          '7.0.0.12',
          '7.1.0.9',
          '7.1.0.10',
          '7.2.0.6',
          '7.2.0.8',
          '7.2.0.10',
          '7.2.0.11',
          '7.3.0.4',
          '7.4.0.9',
          '7.4.0.11',
          '7.4.0.13',
          '7.5.0.6',
          '7.6.0.6',
          '7.6.0.8',
          '7.7.0.3',
          '7.7.0.4',
          '7.7.0.5',
          '7.8.0.4',
          '7.8.0.5',
          '7.8.0.6',
          '7.9.0.6',
          '7.9.0.7',
          '8.0.0.4',
          '8.0.0.5',
          '8.0.0.6',
          '8.1.0.4',
          '8.1.0.5',
          '8.1.0.6',
          '8.2.0.5',
          '8.2.0.7',
          '8.2.0.8',
          '8.2.0.9',
          '8.3.0.6',
          '8.3.0.8',
          '8.3.0.10',
          '8.4.0.5',
          '8.4.0.6',
          '8.4.0.7',
          '8.4.0.8',
          '8.4.0.9',
          '8.5.0.6',
          '8.5.0.8',
          '8.5.0.10',
          '8.5.0.11',
          '8.6.0.5',
          '8.6.0.7',
          '8.6.0.9',
        ];
      }
      this.liveVersion.dictType =
        localStorage.getItem('dictType') ||
        'https://cdn.yuantiaoshi.com/process/process90.exe';
      const res = await updateLogs(12);
      if (res.data.code == 200) {
        this.liveVersion.dictRemark = res.data.data.dictRemark.split(',');
        this.liveVersion.dictType = res.data.data.dictType;
        this.liveVersion.dictName = res.data.data.dictName;
        this.liveVersion.updateTime = moment(
          res.data.data.updateTime * 1000
        ).format('YYYY-MM-DD');
        localStorage.setItem(
          'dictRemark',
          JSON.stringify(this.liveVersion.dictRemark)
        );
        localStorage.setItem('dictType', this.liveVersion.dictType);
        // 是否需要下载新的截流工具
        const flag = await window.ipc.invoke('downloadProcess', {
          url: this.liveVersion.dictType,
        });
        if (!flag || type) {
          feedback.msgSuccess(
            `热更新成功,已适配版本${res.data.data.dictName}版本`
          );
        }
      }
    },
  },
  router,
  render: (h) => h(App),
};
