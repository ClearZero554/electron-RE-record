import axios from 'axios'
import ipcUtil from '@/ipc'
import Vue from 'vue';
import aesSecretUtil from './aesSecretUtil';
import $root from '@/root';
// 创建 axios 请求实例
let url=sessionStorage.getItem("baseURL")
let baseURL=url?url:process.env.VUE_APP_API_URL
const serviceAxios = axios.create({
    // baseURL: process.env.VUE_APP_API_URL, // 线下请求地址
    timeout: 10000, // 请求超时设置
    withCredentials: false, // 跨域请求是否需要携带 cookie
})
serviceAxios.interceptors.request.use(
    (config) => {
        if (config.data && !aesSecretUtil.checkIsExcluePath(config.url)) {
            config.data = aesSecretUtil.encrypt(config.data)
        }
        // 设置请求头
        if (!config.headers["content-type"]) { // 如果没有设置请求头
            config.headers["content-type"] = "application/json"; // 默认类型
        }
        config.baseURL=baseURL
        return config
    }
)
let errNum = 0
//添加响应拦截器
serviceAxios.interceptors.response.use((res) => {
    try {
        res.data = JSON.parse(aesSecretUtil.decrypt(res.data))
    } catch (error) { }
    if ((res.data.code == 333 || res.data.code == 332)) {
        ipcUtil.setStore("token", null);
        $root.userInfo = {}
        ipcUtil.log("登录过期",res)
        Vue.prototype.$bus.$emit('isShowLogin', '登录过期,请重新登录'); // 触发事件并传递数据 
        return false;
    }

    return res;
}, function (err) {
    // errNum++
    // if (errNum == 5) {
    //     Vue.prototype.$bus.$emit('isShowLogin', '登录过期,请重新登录'); // 触发事件并传递数据 
    //     // sessionStorage.setItem("baseURL", 'http://212.64.10.96:8882/api')
    //     // 重载当前页
    //     // window.ipc.send("reload")
    // }
    ipcUtil.log("接口报错",err)
    //访问失败时执行
    return Promise.reject(err);
});


export function get(config) {
    return serviceAxios({
        ...config,
        method: 'GET'
    })
}

export function post(config) {
    return serviceAxios({
        ...config,
        method: 'POST'
    })
}

