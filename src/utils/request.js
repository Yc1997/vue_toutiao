import axios from 'axios'
import store from '@/store/'
import jsonBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'
const requestRefreshToken = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  timeout: 5000,
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { user } = store.state
  if (user) {
    //给请求拦截器添加header头
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config;

}, function (error) {
  // 对请求错误做些什么

  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 在2xx范围内的任何状态代码都会触发此函数，这里主要用于处理响应数据
  return response;
}, async function (error) {
  // 对响应错误做点什么
  // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误
  const { status } = error.response
  if (status === 400) {
    Toast.fail({
      message: '参数错误',
      forbidClick: true
    })
  } else if (status === 401) {
    const user = store.state.user
    if (!user || !user.refresh_token) {
      redirectPath()
    }
    try {
      const { data } = await requestRefreshToken({
        method: 'PUT',
        url: 'app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      user.token = data.data.token
      store.commit('setUser', user)
      // 把之前失败的用户请求继续发出去
      // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
      // return 把 request 的请求结果继续返回给发请求的具体位置
      return request(error.config)
    } catch (err) {
      redirectPath()
    }
  } else if (status === 403) {
    Toast.fail({
      message: '没有权限',
      forbidClick: true
    })
  } else if (status === 404) {
    Toast.fail({
      message: '请求资源不存在',
      forbidClick: true
    })
  } else if (status >= 500) {
    Toast.fail({
      message: '服务器未知错误',
      forbidClick: true
    })
  }

  return Promise.reject(error);
});
function redirectPath() {
  router.push('/login')
}

export default request