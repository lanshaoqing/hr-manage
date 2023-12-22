import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserInfo, login } from '@/api/user'
import { constantRoutes } from '@/router'
const state = {
  token: getToken(),
  userInfo: {},
  routes: constantRoutes
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
  },
  setRoutes(state, value) {
    state.routes = [...constantRoutes, ...value]
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
    return result
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
