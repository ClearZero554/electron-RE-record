import { get, post } from '@/utils/request'

// 新增消息记录
export function addComment(data) {
    return post({ url: '/comment/add',data })
}
// 获取消息记录
export function listByArticleId(data) {
    return post({ url: '/comment/listByArticleId',data })
}
// 删除消息记录
export function del(data) {
    return post({ url: '/comment/del',data })
}