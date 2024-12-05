// 手机号校验
export function verifyMobile(mobile) {
    return (new RegExp("^[1][3,4,5,6,7,8,9][0-9]{9}$")).test(mobile)
}

// 邮箱校验
export function verifyEmail(email) {
    return !(new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")).test(email)
}