import request from '@/utils/request'

/**
 * 获取新闻文章栏目列表
 */
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
/**
 * 获取新闻文章每个栏目列表文章
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
/**
 * 添加新闻文章栏目列表
 */
export const addArticles = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}
/**
 * 删除新闻文章栏目列表
 */
export const deleteArticles = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${articleId}`,
  })
}
/**
 * 获取新闻文章详情
 */
export const getArticlesDetails = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`,
  })
}
/**
 * 关注
 */
export const Followed = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/user/followings`,
    data: {
      target: articleId
    }
  })
}
/**
 * 取消关注
 */
export const deFollowed = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${articleId}`,
  })
}
/**
 * 收藏文章
 */
export const Articlecollections = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/collections`,
    data: {
      target: articleId
    }
  })
}
/**
 * 取消收藏文章
 */
export const deArticlecollections = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`,
  })
}
/**
 * 点赞文章
 */
export const likeArticle = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/likings`,
    data: {
      target: articleId
    }
  })
}
/**
 * 取消点赞文章
 */
export const deLikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`,
  })
}