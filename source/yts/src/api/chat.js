import { get, post } from '@/utils/request'

// 获取消息记录
export function getChatRecord(data) {
    return post({ url: '/chat-record/detail', data })
}
// 设置已读未读
export function updateReadStatus(data) {
    return post({ url: '/chat-record/updateReadStatus', data })
}
// 用户已读 
export function read(data) {
    return post({ url: '/chat-record/read', data })
}

// 自动回复
export function getAutoResMessage(data) {
    return post({ url: '/chat-auto-res/message', data })
}

// 获取客服所有数量
export function getNum() {
    return get({ url: '/chat-record/pcStatistics' })
}
// 修改客服订单状态
export function setEdit(data) {
    return post({ url: '/chatQuestion/edit', data })
}
// 聊天列表
export function getUserList() {
    return get({ url: '/chat-record/userList' })
}
// 存草稿
export function addQuery(data) {
    return post({ url: '/chatQuestion/add',data })
}
// 修改草稿
export function editQuery(data) {
    return post({ url: '/chatQuestion/edit',data })
}
// 发布问题
export function publishQuery(data) {
    return post({ url: '/chatQuestion/publish',data })
}
// 根据问题状态获取列表
// status=0未发布，1用户发布，2客服接单，3待用户确认解决，4待评价，5已评价，6退款中，7已退款
export function listByStatus(params) {
    return get({ url: '/chatQuestion/listByStatus',params })
}
// 博主接单
export function cusServiceReceive(data) {
    return post({ url: '/chatQuestion/cusServiceReceive',data })
}
// 博主点击已解决
export function cusServiceConfirm(data) {
    return post({ url: '/chatQuestion/cusServiceConfirm',data })
}
// 博主退回问题
export function cusServiceCancel(data) {
    return post({ url: '/chatQuestion/cusServiceCancel',data })
}
// 用户确认完成订单
export function cusConfirm(data) {
    return post({ url: '/chatQuestion/cusConfirm',data })
}
// 用户撤回发布
export function cusCancel(data) {
    return post({ url: '/chatQuestion/cusCancel',data })
}
// 预约时间列表
export function reserveTimeList(params) {
    return get({ url: '/chatQuestion/reserveTimeList',params })
}
// 删除草稿箱
export function del(data) {
    return post({ url: '/chatQuestion/del',data })
}
// 个人中心初始化
export function bloggerEarnings(data) {
    return post({ url: '/chatQuestion/bloggerEarnings',data })
}
// 是否置顶
export function updateTopStatus(data) {
    return post({ url: '/chat-record/updateTopStatus',data })
}
// 售后
export function refund(data) {
    return post({ url: '/chatQuestion/refund',data })
}
// 修改是否接受到短信
export function updateUserInfo(data) {
    return post({ url: '/user/updateUserInfo',data })
}
// 素材收益
export function articleBloggerEarnings(data) {
    return post({ url: '/article/articleBloggerEarnings',data })
}
// 自动回复列表
export function messageList() {
    return post({ url: '/chat-auto-res/messageList' })
}
// 自动回复
export function getResMessageById(data) {
    return get({ url: '/chat-auto-res/getResMessageById?id='+data.id })
}

