import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken()
}
const mutations = {
  setToken(state, value) {
    state.token = value
    setToken(value)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  login(context, data) {
    console.log(data)
    // 调用登录接口
    context.commit('setToken', '123456')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
