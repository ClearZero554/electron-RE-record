import CryptoJS from 'crypto-js'
import { AES_KEY, AES_IV, PARAM_ENCRYPT_ABLE, EXCLUE_PATH, RESULT_ENCRYPT_ABLE } from './aseKeConfig.js'
const key = CryptoJS.enc.Utf8.parse(AES_KEY) // 16位
const iv = CryptoJS.enc.Utf8.parse(AES_IV)
const excluePath = EXCLUE_PATH
const paramEncryptAble = PARAM_ENCRYPT_ABLE
const resultEncryptAble = RESULT_ENCRYPT_ABLE
/**
 * Description AES CBC BASE64加密解密
 * @author 
 * @date 13:38 2022/3/31
 */
export default {
  // aes加密
  encrypt(word) {
    let encrypted = ''
    if (typeof word === 'string') {
      const srcs = CryptoJS.enc.Utf8.parse(word)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
    } else if (typeof word === 'object') {
      // 对象格式的转成json字符串
      const data = JSON.stringify(word)
      const srcs = CryptoJS.enc.Utf8.parse(data)
      encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
    }
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  },
  // aes解密
  decrypt(word) {
    if (word) {
      let base64 = CryptoJS.enc.Base64.parse(word)
      let src = CryptoJS.enc.Base64.stringify(base64)
      var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
      var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
      return decryptedStr.toString()
    } else {
      return word
    }
  },
  // 判断url是否在匹配的正则表达式上,匹配则不进行加密，不配则需要加密
  checkIsExcluePath(url) {
    // 如果包含需要排除加密的接口返回true
    let flag = false
    for (let i = 0; i < excluePath.length; i++) {
      // if (new RegExp('^' + excluePath[i]).test(url)) {
      if (excluePath[i]==url) {
        flag = true
        break
      } else {
        flag = false
      }
    }
    return flag
  },
  // 判断是否请求需要进行加密，配置值true的时候需要加密否则不需要
  checkParamEncryptAble() {
    // console.log(encryptAble)
    return paramEncryptAble
  },
  // 判断是否只对结果进行加密
  checkResultEncryptAble() {
    // console.log(encryptAble)
    return resultEncryptAble
  }
}