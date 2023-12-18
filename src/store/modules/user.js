import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserInfo, login } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, value) {
    state.token = value
    setToken(value)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, value) {
    state.userInfo = value
  }
}
const actions = {
  async login(context, data) {
    const token = await login(data)
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
