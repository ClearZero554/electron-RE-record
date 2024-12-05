import { get, post } from '@/utils/request'

// 手机登录
export function mobileLogin(data) {
    return post({ url: '/login/mobileLogin', data })
}
// 退出登录
export function quit() {
    return post({ url: '/login/logOut' })
}

// 微信扫码登录
export function wxScanLogin(data) {
    return post({ url: '/login/wx/scanLogin', data })
}
// 是否开启游客模式
export function isTouristLoginShow() {
    return post({ url: '/user/visitorLogin' })
}
export function update() {
    return get({ url: '/setting/dict/type/selectById?id=1',})
}
export function logByUserId(data) {
    return post({ url: '/login/logByUserId',data})
}
export function useMembershipCode(data) {
    return post({ url: '/membershipCode/use',data})
}
