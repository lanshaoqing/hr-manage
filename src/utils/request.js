import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
service.interceptors.response.use(response => {
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async err => {
  if (err.response.status === 401) {
    Message({ type: 'warning', message: 'token超时了' })
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(err)
  }
  Message({ type: 'error', message: err.message })
  return Promise.reject(err)
})
export default service
