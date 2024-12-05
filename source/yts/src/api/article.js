import { get, post } from '@/utils/request'

// 文章分类
export function category() {
    return get({ url: '/article/category' })
}

// 文章列表
export function list(params) {
    return get({ url: '/article/list', params })
}
// 我的上传
export function userUploadList() {
    return get({ url: '/article/userUploadList' })
}


// 文章详情
export function detail(params) {
    return get({ url: '/article/detail', params })
}

// 下载素材
export function download(params) {
    return get({ url: '/article/download', params })
}

// 收藏加入
export function collectAdd(data) {
    return post({ url: '/article/collectAdd', data })
}

// 收藏取消
export function collectCancel(data) {
    return post({ url: '/article/collectCancel', data })
}

// 收藏列表
export function collectList(params) {
    return get({ url: '/article/collectList', params })
}

export function delHistory(data) {
    return post({ url: '/article/delectSearchHistory', data })
}
export function collectResort(data) {
    return post({ url: '/article/collectResort', data })
}
export function articleRecord() {
    return get({ url: '/recharge/articleRecord' })
}
// 用户上传
export function userUpload(data) {
    return post({ url: '/article/userUpload',data })
}
// 我的消息
export function remindList(data) {
    return post({ url: '/comment/remindList',data })
}
// 我的消息
export function remindUnreadCount() {
    return post({ url: '/comment/remindUnreadCount' })
}
// 我的消息
export function membershipCode(data) {
    return post({ url: '/membershipCode/list',data })
}
// 搜索
export function searchList() {
    return get({ url: '/setting/search/list' })
}
// 历史
export function searchHistory() {
    return post({ url: '/article/searchHistory' })
}
// 未读数量
export function remindUnreadCountList() {
    return post({ url: '/comment/remindUnreadCountList' })
}