import { get, post } from '@/utils/request'

// 用户信息
export function userInfo() {
    return get({ url: '/user/info' })
}

// 编辑信息
export function userEdit(data) {
    return post({ url: '/user/updateUserInfo', data })
}

// 上传配置
export function upload(data) {
    return post({ url: '/userSetting/upload', data })
}

// 获取配置
export function getList(params) {
    return get({ url: '/userSetting/getList', params })
}

// 置顶配置
export function top(data) {
    return post({ url: '/userSetting/top', data })
}
// 取消置顶配置
export function untop(data) {
    return post({ url: '/userSetting/untop', data })
}

// 重命名配置
export function rename(data) {
    return post({ url: '/userSetting/rename', data })
}

// 删除配置
export function del(data) {
    return post({ url: '/userSetting/delete', data })
}

// 获取所有分类
export function getClassification() {
    return get({ url: '/debug/all' })
}

// 保存分类
export function saveClassification(data) {
    return post({ url: '/debug/set', data })
}

// 获取配置
export function getUserClassification() {
    return get({ url: '/debug/get' })
}

// 获取系统配置列表
export function getSystemSettingList() {
    return get({ url: '/setting/list' })
}
// 一键调试日志
export function useDebug() {
    return post({ url: '/debug/useDebug' })
}
// 点击音效软件
export function userMusic() {
    return post({ url: '/userMusic/use' })
}