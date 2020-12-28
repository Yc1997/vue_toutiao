import request from '@/utils/request'

/**
 * 获取搜索联想建议
 */
export const getSearchSuggsions = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}
/**
 * 获取搜索结果
 */
export const getSearchResults = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
/**
 * 删除搜索记录
 */
export const deleteHistory = () => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/search/histories',
  })
}
