export const AES_KEY = 'ytsz9992Nzg5MYT8' 
export const AES_IV = 'YUJD999GMDk42028'
// 参数是否进行加密设置,需要与后端配置保持一致
export const PARAM_ENCRYPT_ABLE = true
// 结果是否进行加密
export const RESULT_ENCRYPT_ABLE = true
// 需要排除的不进行加密的接口，正则匹配
export const EXCLUE_PATH = ['/user/visitorLogin',"/alipay/chatPrecreate",'/login/wx/scanLogin','/alipay/precreate','/alipay/rechargePrecreate','/wxpay/precreate','/wxpay/rechargePrecreate','/wxpay/chatPrecreate','/logs/addObsLog','/wxpay/articlePrecreate']