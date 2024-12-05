import { get, post } from '@/utils/request'


// 获取分类
export function categoryList(params) {
  return get({ url: '/userMusic/categoryList',params })
}
// 添加分类
export function addCategory(data) {
  return post({ url: '/userMusic/addCategory', data })
}
//删除分类
export function deleteCategory(data) {
  return post({ url: '/userMusic/deleteCategory', data })
}
//修改分类
export function updateCategory(data) {
  return post({ url: '/userMusic/updateCategory', data })
}
//改变分类排序
export function sortCategory(data) {
  return post({ url: '/userMusic/reorderCategory', data })
}
//改变音频排序
export function sortList(data) {
  return post({ url: '/userMusic/reorder', data })
}

// 获取音频
export function list(params) {
  return get({ url: '/userMusic/listByCategoryId', params })
}
// 新增音频
export function addList(data) {
  return post({ url: '/userMusic/add', data })
}
//  修改音频
export function updateList(data) {
  return post({ url: '/userMusic/update', data })
}
//  删除音频
export function delList(data) {
  return post({ url: '/userMusic/delete', data })
}
//  上传音频
export function upload(data) {
  return post({
    url: '/upload/music', data
  })
}

// 获取基础信息
export function getInfo() {
  return get({ url: '/user/detail' })
}
// 获取修改信息
export function updateInfo(data) {
  return post({ url: '/user/update', data })
}
// 音效配置
export function userMusicMenu() {
  return get({ url: '/userMusicMenu/list' })
}
export function collect(data) {
  return post({ url: '/userMusicMenu/collect',data })
}

// ····························音效库
// --音效库分类
export function seCategoryList() {
  return get({ url: '/musicLibrary/categoryList' })
}
// --音效库列表
export function seGetList(data) {
  return get({ url: `/musicLibrary/list?categoryId=${data.id}&keyword=${data.search}&pageNo=${data.pageNo}&pageSize=${data.pageSize}` })
}

