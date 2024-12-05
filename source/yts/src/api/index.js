import { get, post } from '@/utils/request'

// 发送短信
export function sendSms(data) {
    return post({ url: '/index/sendSms', data })
}
// 修改手机号
export function modify(data) {
    return post({ url: '/user/updateMobile', data })
}

// 热门搜索
export function hotSearch(params) {
    return get({ url: '/index/hotSearch', params })
}
// 用户上线
export function userOnline() {
    return post({ url: '/login/userOnline' })
}
// 用户下线
export function userOutline() {
    return post({ url: '/login/userOutline' })
}
// 用户注销
export function logout() {
    return post({ url: '/user/delete' })
}
export function cancelDelete() {
    return post({ url: '/user/cancelDelete' })
}
// 问卷列表
export function questionList() {
    return get({ url: '/question/allList' })
}
// 问卷保存
export function resultSave(data) {
    return post({ url: 'result/save', data })
}
// 更新logs
export function updateLogs(id) {
    return get({ url: '/setting/dict/type/selectById?id=' + id })
}
// log
export function log(data) {
    return post({ url: '/logs/addObsLog',data})
}
// 价格查询
export function priceInquiry() {
    return post({ url: '/member-ship-package/memberList'})
}
// 价格查询
export function chatPriceInquiry(id) {
    return get({ url: `/member-ship-package/detail/${id}`})
}
// 上传日志
export function userUploadLog(data) {
    return post({ url: `/userUploadLog/add`,data})
}
// 上传推流码
export function userObsStream(data) {
    return post({ url: `/userObsStream/add`,data})
}
// 获取推流码
export function userObsStreamList(params) {
    return get({ url: `/userObsStream/list`,params})
}
// 查人员
export function selectById(params) {
    return get({ url: `/user/selectById`,params})
}
export function bindingInviter(data) {
    return post({ url: `/user/bindingInviter`,data})
}
export function inviterInfo() {
    return post({ url: `/user/inviterInfo`})
}

