import request from '@/utils/request'
/**
 * 全部评论回复
 */
export const getComment = params => {
  return request({
    method: 'GET',
    url: `/app/v1_0/comments`,
    params
  })
}
/**
 * 评论点赞
 */
export const commentLikings = commentId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/comment/likings`,
    data: {
      target: commentId
    }
  })
}
/**
 * 取消评论点赞
 */
export const deleteCommentLikings = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}
/**
 * 添加文章评论
 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: `/app/v1_0/comments`,
    data
  })
}