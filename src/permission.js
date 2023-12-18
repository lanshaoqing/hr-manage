import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})
router.afterEach(() => {
  nprogress.done()
})

