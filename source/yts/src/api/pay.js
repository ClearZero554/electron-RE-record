import { get, post } from '@/utils/request'

// 微信支付
export function preWxPay(data) {
    return post({ url: '/wxpay/precreate', data })
}

// 支付宝支付
export function preAliPay(data) {
    return post({ url: '/alipay/precreate', data })
}


// 素材支付
export function articlePrecreate(data) {
    return post({ url: '/wxpay/articlePrecreate', data })
}
// 原币微信充值
export function rechargePrecreate(data) {
    return post({ url: '/wxpay/rechargePrecreate', data })
}
// 原币支付宝充值
export function rechargeNotifyUrl(data) {
    return post({ url: '/alipay/rechargePrecreate', data })
}
// 购买素材
export function byMoney(data) {
    return post({ url: '/pay/byMoney', data })
}
// 获取订单信息
export function orderBySn(params) {
    return get({ url: '/recharge/orderBySn', params })
}
export function chatPrecreate(data) {
    return post({ url: '/wxpay/chatPrecreate',data })
}
export function chatAli(data) {
    return post({ url: '/alipay/chatPrecreate',data })
}
export function listByType(data) {
    return post({ url: `/member-ship-package/listByType`,data})
}
// 消费记录
export function consumptionRecordsList() {
    return get({ url: '/finance/wallet/list'})
}
// 可开发票订单列表
export function notInvoiceList() {
    return get({ url: '/finance/wallet/notInvoiceList'})
}
export function applyInvoice(data) {
    return post({ url: '/recharge/applyInvoice',data})
}