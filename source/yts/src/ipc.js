/***********************************************************************************************************************
 * status IPC状态
 * isAccess(...path: string[]): Promise<boolean> 路径是否存在
 * getInfo(): Promise<object> 获取安装信息
 * getObsStatus(locate: string): Promise<number> 获取OBS状态
 * startObs(locate: string): Promise<> 打开OBS
 * stopObs(pid: number): Promise<> 关闭OBS
 * getWebsocketSetting(locate: string): Promise<object> 获取OBS Websocket插件配置
 * setWebsocketSetting(locate: string, config: object): Promise<> 设置OBS Websocket插件配置
 * getDouyinStatus(locate: string): Promise<number> 获取直播伴侣状态
 * getRoomInfo(locate: string): Promise<object> 获取直播伴侣房间状态
 * getMediasdkVersion(locate: string): Promise<object> 获取Mediasdk版本
 **********************************************************************************************************************/
import axios from 'axios';
class IPC {
  // 状态机
  local = {
    status: false,
    getInfo: undefined,
    setWebsocketSetting: undefined,
    getWebsocketSetting: undefined,
    getRoomInfo: undefined,
    OBS_getStatus: undefined,
    DOUYIN_getStatus: undefined,
    getMediasdkStatus: undefined,
    selectDir: undefined,
    drives: [],
    store: {
      token: undefined,
      info: undefined,
      setting: undefined,
      propsList: undefined,
      upload: undefined,
      userList: undefined,
      homeDir: null,
    },

    handleDownload: () => {},
    handleDebug: () => {},
    handleUpload: () => {},
    handleFontResources: () => {},
    handleMoveFile: () => {},
    handleDownloadResources: () => {},
    handleInstallResources: () => {},
    handleUploadFontResources: () => {},
    handleGetFile: () => {}, //安装字体的回调
    handleSlideshow: () => {}, //安装字体的回调
    handleSpecialEffects: () => {}, //安装特效的回调
    getAudioFrequency: () => {}, //获取音频输出
    handleWechatLogin: () => {}, //微信扫码登录的回调
    handleInstallFonts: () => {}, //一键调试安装字体
    handleGroup: () => {}, //纯净录屏
    handleInstallUploadHz: () => {}, //猴子配置
    handleInstallSelectDir: () => {}, //选择文件夹
    handleScanQrcode: () => {}, //0粉开播扫码登录
    handleStartLive: () => {}, //0粉开播开始直播
    handleModifyResolution: () => {}, //调整分辨率
    handleInstallUploadThemes: () => {},
    handleInstallUploadAiBg: () => {},
    handleInstallUploadDate: () => {},
    handleInstallUploadLogo: () => {},
    downloadFileCallback: () => {},
    realTimeRendering: () => {},
    screenshotCallback: () => {}, //截图
    getDrives: () => {},
    handlePercentageCallback: () => {}, //下载进度条
  };

  constructor() {
    window.ipc.on('callback', (event, res) => {
      this.local[res.key] = res.data == undefined ? null : res.data;
    });

    window.ipc.on('download', (event, res) => this.local.handleDownload(res));
    window.ipc.on('debug', (event, res) => this.local.handleDebug(res));
    window.ipc.on('upload', (event, res) => this.local.handleUpload(res));
    window.ipc.on('moveFile', (event, res) => this.local.handleMoveFile(res));
    window.ipc.on('downloadResources', (event, res) =>
      this.local.handleDownloadResources(res)
    );
    window.ipc.on('installResource', (event, res) =>
      this.local.handleInstallResources(res)
    );
    window.ipc.on('fontResources', (event, res) =>
      this.local.handleFontResources(res)
    ); //安装字体
    window.ipc.on('uploadFont', (event, res) =>
      this.local.handleUploadFontResources(res)
    );
    window.ipc.on('getFile', (event, res) => this.local.handleGetFile(res));
    window.ipc.on('slideshow', (event, res) => this.local.handleSlideshow(res)); //安装obs-text-slideshow
    window.ipc.on('specialEffects', (event, res) =>
      this.local.handleSpecialEffects(res)
    ); //安装特效
    window.ipc.on('audioFrequency', (event, res) =>
      this.local.getAudioFrequency(res)
    ); //获取音频输出
    window.ipc.on('audioFrequency', (event, res) =>
      this.local.getAudioFrequency(res)
    ); //快捷键
    window.ipc.on('wechatLogin', (event, res) =>
      this.local.handleWechatLogin(res)
    ); //微信扫码登录
    window.ipc.on('handleInstallFonts', (event, res) =>
      this.local.handleInstallFonts(res)
    ); //一键调试安装字体
    window.ipc.on('handleGroup', (event, res) => this.local.handleGroup(res)); //一键调试安装字体
    window.ipc.on('handleInstallUploadHz', (event, res) =>
      this.local.handleInstallUploadHz(res)
    ); //猴子配置
    window.ipc.on('selectDirCallback', (event, res) =>
      this.local.handleInstallSelectDir(res)
    ); //选择文件夹
    window.ipc.on('scanQrcode', (event, res) =>
      this.local.handleScanQrcode(res)
    ); //0粉开播扫码登录
    window.ipc.on('getDrives', (event, res) => this.getDrives(res));
    window.ipc.on('startLive', (event, res) => this.local.handleStartLive(res)); //0粉开播开始直播
    window.ipc.on('modifyResolution', (event, res) =>
      this.local.handleModifyResolution(res)
    ); //调整分辨率
    window.ipc.on('UploadThemes', (event, res) =>
      this.local.handleInstallUploadThemes(res)
    );
    window.ipc.on('UploadAiBg', (event, res) =>
      this.local.handleInstallUploadAiBg(res)
    );
    window.ipc.on('uploadDate', (event, res) =>
      this.local.handleInstallUploadDate(res)
    );
    window.ipc.on('uploadLogo', (event, res) =>
      this.local.handleInstallUploadLogo(res)
    );
    window.ipc.on('downloadFileCallback', (event, res) =>
      this.local.downloadFileCallback(res)
    );
    window.ipc.on('realTimeRendering', (event, res) =>
      this.local.realTimeRendering(res)
    );
    window.ipc.on('screenshot', (event, res) =>
      this.local.screenshotCallback(res)
    ); //截图
    window.ipc.on('handlePercentageCallback', (event, res) => {
      this.local.handlePercentageCallback(res);
    }); //下载进度条
    window.ipc.on('log', async (e, data) => {
      let options = {
        method: 'post',
        url: 'https://yts.yuantiaoshi.com:8880/api/logs/addObsLog',
        data: {
          key: this.local.store.token,
          time: Date.now(),
          info: `${data.title}-----------${data.msg}`,
        },
      };
      const res = await axios(options);
    });
  }

  // IPC状态
  status() {
    this.local.status = window.ipc_status == 'finish' ? true : false;
    return this.local.status;
  }

  setStore(key, value) {
    this.local.store[key] = value;
    return window.store.set(key, value);
  }

  getStore(key, real = false) {
    if (
      this.local.store[key] === undefined ||
      this.local.store[key] === null ||
      real
    ) {
      this.local.store[key] = window.store.get(key);
    }
    return this.local.store[key];
  }

  // 等待回调
  wait(key, timeout = 1000) {
    return new Promise((resolve, reject) => {
      let count = parseInt(timeout / 100);
      let loop = setInterval(() => {
        if (this.local[key] != undefined) {
          const data = this.local[key];
          this.local[key] = undefined;
          clearInterval(loop);
          resolve(data);
        } else if (count <= 0) {
          clearInterval(loop);
          resolve(null);
        }
        count -= 1;
      }, 100);
    });
  }

  // 路径是否存在
  async isAccess() {
    const locate = arguments.length == 1 ? arguments[0] : [...arguments];
    return await window.ipc.invoke('V2_IsAccess', { path: locate });
  }

  // 读取指定目录
  async readDir() {
    const locate = arguments.length == 1 ? arguments[0] : [...arguments];
    return await window.ipc.invoke('V2_ReadDir', { path: locate });
  }

  // 创建文件夹
  async mkdir(src) {
    window.ipc.send('V2_MkDir', { src });
  }

  // 选择文件夹
  async selectDir(path, callback) {
    this.local.handleInstallSelectDir = callback;
    window.ipc.send('V2_SelectDir', { path: path || null });
  }

  // 选择文件
  async selectFile(callback) {
    window.ipc.send('V2_SelectFile');
    window.ipc.on('selectFileCallback', (event, res) => callback(res));
  }

  // 打开文件夹
  async openDir(src) {
    window.ipc.send('V2_OpenDir', { src });
  }

  // 获取安装信息
  async getInfo() {
    window.ipc.send('V2_GetInfo');
    let info = await this.wait('getInfo');
    if (info == null) return null;
    this.log('[ obs.path ] >', info.obs.path);
    if (info.obs.path != null) {
      info.obs.path = (await this.isAccess(info.obs.path))
        ? info.obs.path
        : this.local.store.setting.path;
    }

    // obs补丁
    if (info.obs.version == null && info.obs.path != null) {
      if (info.obs.reg.includes('Steam App 1905180')) {
        const obsInfo = await window.ipc.invoke('V2_OBS_GetObsVersion', {
          path: info.obs.path,
        });
        if (obsInfo != null && obsInfo.version != null) {
          info.obs.version = obsInfo.version;
        }
      }
    }

    if (info.obs.config != null) {
      info.obs.config = (await this.isAccess(info.obs.config))
        ? info.obs.config
        : null;
    }
    if (info.douyin.path != null) {
      info.douyin.path = (await this.isAccess(info.douyin.path))
        ? info.douyin.path
        : null;
    }

    if (info.douyin.config != null) {
      info.douyin.config = (await this.isAccess(info.douyin.config))
        ? info.douyin.config
        : null;
    }
    this.log('获取安装信息', info);
    return info;
  }

  // 获取OBS状态
  async getObsStatus(locate) {
    return await window.ipc.invoke('V2_OBS_GetStatus', { path: locate });
  }

  // 打开OBS
  async startObs(locate) {
    await window.ipc.invoke('V2_StartObs', { path: locate });
  }

  // 关闭OBS
  async stopObs(pid) {
    const res = await window.ipc.invoke('stopObs', { pid });
    this.log('关闭OBS', res);
  }

  // 获取OBS Websocket插件配置
  async getWebsocketSetting(locate) {
    // console.log('[ locate ] >', locate)
    window.ipc.send('V2_OBS_GetWebsocketSetting', { path: locate });

    return await this.wait('getWebsocketSetting');
  }

  // 设置OBS Websocket插件配置
  async setWebsocketSetting(locate, config) {
    window.ipc.send('V2_OBS_SetWebsocketSetting', {
      path: locate,
      data: config,
    });

    return await this.wait('setWebsocketSetting');
  }

  // 获取OBS配置列表
  async getObsProfilesLists(config) {
    const locate = arguments.length == 1 ? arguments[0] : [...arguments];
    return await window.ipc.invoke('V2_OBS_GetObsProfilesLists', {
      path: config,
    });
  }

  // 打开直播伴侣
  async startDouyin(locate) {
    const res = await window.ipc.invoke('V2_StartDouyin', { path: locate });
    this.log('打开直播伴侣', res);
  }
  // 关闭直播伴侣
  async killDouyin(pid) {
    const res = await window.ipc.invoke('stopDouyin', { pid });
    this.log('关闭直播伴侣', res);
  }

  // 获取直播伴侣状态
  async getDouyinStatus(locate) {
    window.ipc.send('V2_DOUYIN_GetStatus', { path: locate });

    const res = await this.wait('DOUYIN_getStatus');
    this.log('获取直播伴侣状态', res);
    return res;
  }

  // 获取直播伴侣房间状态
  async getRoomInfo(locate) {
    window.ipc.send('V2_DOUYIN_GetRoomInfo', { path: locate });

    return await this.wait('getRoomInfo');
  }

  // 获取Mediasdk进程PID
  async getMediasdkStatus() {
    window.ipc.send('V2_DOUYIN_GetMediasdkStatus');

    return await this.wait('getMediasdkStatus');
  }

  // 获取Mediasdk版本
  async getMediasdkVersion(locate) {
    const mediasdkPath =
      '../resources/app/app.content/node_modules/@byted/mediasdk-client/lib/MediaSDK_Server.exe';
    let info = null;
    if (await this.isAccess(locate, mediasdkPath)) {
      info = await window.ipc.invoke('V2_DOUYIN_GetMediasdkVersion', {
        path: locate,
      });
    }
    return info;
  }

  // 直播伴侣截流
  async stopMediasdk(pids, version, exeName, time, token, exeVersion) {
    let status = false;
    for (let i in pids) {
      const pid = pids[i];
      if (0 < pid) {
        const res = await window.ipc.invoke('V2_DOUYIN_StopMediasdk', {
          pid,
          version,
          exeName,
          time,
          token,
          exeVersion,
        });
        if ('success' == res) status = true;
      }
    }
    return status;
  }

  async log(title, msg) {
    msg = JSON.stringify(msg);
    window.ipc.send('log', { title, msg });
  }

  async downloadFile(path, percentageCallback, callback) {
    this.local.handlePercentageCallback = percentageCallback;
    this.local.handleDownload = callback;
    let resources = null,
      setting = null;
    try {
      setting = this.getStore('setting') || {};
      resources = setting.resourcesPath || null;
    } catch (e) {}

    if (resources == null) {
      let basePath = await this.getSystemDisk();
      resources = basePath + 'yuantiaoshi-hc\\resources';
      setting.resourcesPath = resources;

      this.setStore('setting', setting);
    }
    if (!(await this.isAccess(resources))) {
      await this.mkdir(resources);
    }
    // 进度条函数

    window.ipc.send('V2_DEBUG_DownloadFile', { path, resources });
  }

  async debug(path, config, name, exePath, code, callback) {
    let setting = await this.checkSetting();
    this.local.handleDebug = callback;
    window.ipc.send('V2_DEBUG_Debug', {
      path,
      config,
      name,
      resources: setting.resourcesPath,
      exePath,
      code,
    });
  }

  async upload(org, callback, type) {
    this.local.handleUpload = callback;
    let setting = await this.checkSetting();
    window.ipc.send('V2_OBS_Upload', {
      info: org,
      resources: setting.resourcesPath,
      type,
    });
  }

  async parseResources() {
    window.ipc.send('V2_OBS_ParseResources');
  }

  async loginStartStatus(status) {
    window.ipc.send('V2_LoginStartStatus', { status });
  }

  async openWindow(url, data) {
    window.ipc.send('V2_OpenWindow', { url, data });
  }

  async getDeviceInfo() {
    return await window.ipc.invoke('V2_GetDeviceInfo');
  }
  // 获取用户系统盘
  async getSystemDisk() {
    let find = null;
    try {
      const arr = ['D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'C:'];
      find = arr.find((item) => this.drives.includes(item));
    } catch (error) {}
    return find ? find + '\\' : 'C:\\';
  }
  async getDisk() {
    window.ipc.send('getDrives');
  }
  getDrives(res) {
    this.drives = res.arr;
    this.setStore('homeDir', res.homeDir);
    this.checkSetting();
  }
  async checkSetting() {
    // 创建插件的json目录
    // 读取是否存在插件校验文件

    // if (!(await this.isAccess('C:\\yts'))) {
    //   // 创建对应文件
    //   await this.mkdir('C:\\yts');
    //   const data = JSON.stringify({
    //     token: this.getStore('token'),
    //   });
    //   window.ipc.send('setJson', { path: 'C:\\yts\\config.json', text: data });
    // } else {
    //   window.ipc.send('setJsonToken', {
    //     path: 'C:\\yts\\config.json',
    //     text: {
    //       token: this.getStore('token'),
    //     },
    //   });
    // }
    // 创建源调试目录
    let setting = this.getStore('setting') || {};

    const basePath = await this.getSystemDisk();
    const logPath = basePath + 'yuantiaoshi-hc';
    window.ipc.send('initLog', { basePath: logPath });
    setting.resourcesPath = basePath + 'yuantiaoshi-hc\\resources';
    if (!(await this.isAccess(setting.resourcesPath))) {
      await this.mkdir(setting.resourcesPath);
    }
    setting.videoPath = basePath + 'yuantiaoshi-hc\\video';
    if (!(await this.isAccess(setting.videoPath))) {
      await this.mkdir(setting.videoPath);
    }
    setting.imagePath = basePath + 'yuantiaoshi-hc\\image';
    if (!(await this.isAccess(setting.imagePath))) {
      await this.mkdir(setting.imagePath);
    }
    setting.audiosPath = basePath + 'yuantiaoshi-hc\\audios';
    if (!(await this.isAccess(setting.audiosPath))) {
      await this.mkdir(setting.audiosPath);
    }

    this.setStore('setting', setting);
    return setting;
  }

  async downloadResource(name, url, callback) {
    let setting = await this.checkSetting();
    window.ipc.send('V2_DEBUG_DownloadResources', { name, url, setting });
    this.local.handleDownloadResources = callback;
  }

  async installResource(name, url, obs, callback) {
    let setting = await this.checkSetting();
    window.ipc.send('V2_DEBUG_InstallResources', { name, url, setting, obs });
    this.local.handleInstallResources = callback;
  }
  // 安装字体
  async installFont(name, obs, callback, slideConfiguration, scene) {
    let setting = await this.checkSetting();
    window.ipc.send('V2_DEBUG_Fonts', {
      name,
      setting,
      obs,
      slideConfiguration,
      scene,
    });
    this.local.handleFontResources = callback;
  }
  // 下载字体
  async uploadFont(url, fileName, dirname, callback) {
    this.local.handleUploadFontResources = callback;
    window.ipc.send('V2_UploadFont', { url, fileName, dirname });
  }
  // 安装纯净录屏
  async installGroup(obs, slideConfiguration, scene, callback) {
    let setting = await this.checkSetting();
    window.ipc.send('V2_DEBUG_Group', {
      setting,
      obs,
      slideConfiguration,
      scene,
    });
    this.local.handleGroup = callback;
  }

  async moveDebugFile(tempPath, path, name, callback) {
    this.local.handleMoveFile = callback;
    window.ipc.send('V2_OBS_MoveFile', { tempPath, path, name });
  }
  // 下载文件到指定目录
  getfileByUrl(ObsPath, url, fileName, dir, callback) {
    this.local.handleGetFile = callback;
    window.ipc.send('V2_GetfileByUrl', { ObsPath, url, fileName, dir });
  }
  // 设置快捷键
  async registerKeys(data) {
    window.ipc.send('registerKeys', data);
    // 绑定方法
    window.ipc.on('shortcutKeysCall', () => {
      // 调用渲染进程中的方法
      if (typeof window.shortcutKeysCall === 'function') {
        window.shortcutKeysCall();
      }
    });
  }
  // 设置音频的快捷键
  async audioKey(data) {
    window.ipc.send('audioKey', data);
    window.ipc.on('audioKeyKeysCall' + data.id, (e, id) => {
      // 调用渲染进程中的方法
      try {
        window.audioKeyKeysCall(e, id);
      } catch (error) {
        console.log(error);
      }
    });
  }
  // 注销快捷键
  async logoutKeys(data) {
    window.ipc.send('logoutKeys', data);
  }
  // 注销所有快捷键
  async unregisterAll() {
    window.ipc.send('unregisterAll');
  }
  // 调整大小
  async setSize(data, type) {
    window.ipc.send('setSize', { data, type });
  }
  // 打开网站
  openUrl(url) {
    window.ipc.send('openUrl', { url });
  }
  // 安装obs-text-slideshow
  uploadSlideshow(url, pathName, slideConfiguration, scene, callback) {
    window.ipc.send('uploadSlideshow', {
      url,
      pathName,
      slideConfiguration,
      scene,
    });
    this.local.handleSlideshow = callback;
  }
  // 安装特效
  specialEffects(url, name, pathName, callback, percentageCallback) {
    this.local.handleSpecialEffects = callback;
    // 进度条
    this.local.handlePercentageCallback = percentageCallback;
    window.ipc.send('V2_DEBUG_SpecialEffects', { url, name, pathName });
  }
  // 下载
  async uploadChineseFile(uploadPath, basePath, percentageCallback) {
    // this.local.handlePercentageCallback = percentageCallback;
    return await window.ipc.invoke('uploadChineseFile', {
      uploadPath,
      basePath,
    });
  }
  // 获取音频输出设备
  getAudioFrequency(callback) {
    this.local.getAudioFrequency = callback;
    window.ipc.send('getAudioFrequency');
  }
  // 窗口状态同步
  setConsole(data) {
    window.ipc.send('setConsole', data);
  }
  //
  refreshAudio(name) {
    window.ipc.send('refreshAudio', { name });
  }
  getWechatLoginCode(callback) {
    this.local.handleWechatLogin = callback;
  }
  // 一键调试安装字体
  installFonts(fonts, obs, resources, callback) {
    this.local.handleInstallFonts = callback;
    window.ipc.send('installFonts', { fonts, obs, resources });
  }
  // 安装猴子玩游戏
  uploadHz(groups, sources, obs, callback) {
    this.local.handleInstallUploadHz = callback;
    window.ipc.send('V2_DEBUG_installUploadHz', { groups, sources, obs });
  }
  setThemes(path, resourceUrl, resourceName, config, callback) {
    this.local.handleInstallUploadThemes = callback;
    window.ipc.send('V2_DEBUG_setThemes', {
      path,
      resourceUrl,
      resourceName,
      config,
    });
  }
  uploadAiBg(path, resourceUrl, resourceName, callback) {
    this.local.handleInstallUploadAiBg = callback;
    window.ipc.send('installAiBg', { path, resourceUrl, resourceName });
  }
  uploadDate(path, resourceUrl, resourceName, config, callback) {
    this.local.handleInstallUploadDate = callback;
    window.ipc.send('uploadDate', { path, resourceUrl, resourceName, config });
  }
  /**
   * 0粉开播
   */
  // 获取二维码
  getQrcode(callback) {
    window.ipc.send('V2_NO_THRESHOLD_GetQrcode', {});
    this.local.handleScanQrcode = callback;
  }

  // 开始直播
  startLive(data, callback) {
    window.ipc.send('V2_NO_THRESHOLD_StartLive', data);
    this.local.handleStartLive = callback;
  }

  // 停止直播
  stopLive() {
    window.ipc.send('V2_NO_THRESHOLD_StopLive', {});
  }

  // 调整分辨率
  modifyResolution(obs, path, callback) {
    this.local.handleModifyResolution = callback;
    window.ipc.send('V2_DEBUG_modifyResolution', { obs, path });
  }
  // 修改是否置顶
  changeTop(isTop) {
    window.ipc.send('changeTop', { isTop });
  }
  uploadLogo(path, resourceUrl, resourceName, config, callback) {
    this.local.handleInstallUploadLogo = callback;
    window.ipc.send('uploadLogo', { path, resourceUrl, resourceName, config });
  }

  // 自动更新
  updateVersion(url, basePath, callback) {
    this.local.downloadFileCallback = callback;
    window.ipc.send('updateVersion', { url, basePath });
  }
  realTimeRendering(path, resourceUrl, resourceName, config, type, callback) {
    this.local.realTimeRendering = callback;
    window.ipc.send('realTimeRendering', {
      path,
      resourceUrl,
      resourceName,
      config,
      type,
    });
  }
  // 截图
  screenshot(callback) {
    this.local.screenshotCallback = callback;
    window.ipc.send('screenshot');
  }
  // 启动聊天
  openChat(route, data) {
    // this.log('启动聊天', data);
    window.ipc.send('openChat', data);
  }
  // 创建ws
  initWs(url) {
    window.ipc.send('initWs', { url });
  }
  sendWs(data) {
    window.ipc.send('sendWs', { ...data });
  }
  onmessage(data) {
    window.ipc.send('onmessage', { ...data });
  }
  // 切换皮肤
  changeCss(data) {
    window.ipc.send('changeCss', { ...data });
  }
}

export default new IPC();
