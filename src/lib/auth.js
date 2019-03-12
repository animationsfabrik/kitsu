import superagent from 'superagent'
import store from '../store'
import router from '../router'
import {
  RESET_ALL,
  USER_LOGIN,
  USER_LOGOUT,
  USER_LOGIN_FAIL,
  DATA_LOADING_START
} from '../store/mutation-types.js'

const auth = {

  logIn (email, password, callback) {
    superagent
      .post('/api/auth/login')
      .send({ email, password })
      .end((err, res) => {
        if (err) {
          if (res.body.default_password) {
            router.push({
              name: 'reset-change-password',
              params: {token: res.body.token}
            })
          }
          callback(err)
        } else {
          if (res.body.login) {
            const user = res.body.user
            const isLdap = res.body.ldap
            store.commit(DATA_LOADING_START, { isLdap })
            callback(null, user)
          } else {
            store.commit(USER_LOGIN_FAIL)
            callback(new Error('Login failed'))
          }
        }
      })
  },

  logout (callback) {
    superagent
      .get('/api/auth/logout')
      .end((err, res) => {
        if (err) {
          console.error(err)
          callback(err)
        }
        store.commit(USER_LOGOUT)
        callback()
      })
  },

  backToLogin () {
    router.push('/login')
    store.commit(RESET_ALL)
    store.commit(USER_LOGOUT)
  },

  resetPassword (email) {
    return new Promise((resolve, reject) => {
      superagent
        .post('/api/auth/reset-password')
        .send({ email })
        .end((err, res) => {
          if (err) reject(err)
          else resolve()
        })
    })
  },

  resetChangePassword (token, password, password2) {
    return new Promise((resolve, reject) => {
      superagent
        .put('/api/auth/reset-password')
        .send({ token, password, password2 })
        .end((err, res) => {
          if (err) reject(err)
          else resolve()
        })
    })
  },

  isServerLoggedIn (callback) {
    superagent
      .get('/api/auth/authenticated')
      .end((err, res) => {
        if (err && [401, 422].includes(res.statusCode)) {
          store.commit(USER_LOGIN_FAIL)
          callback(null)
        } else if (err) {
          store.commit(USER_LOGIN_FAIL)
          callback(err)
        } else if (res.body === null) {
          store.commit(USER_LOGIN_FAIL)
          callback(err)
        } else {
          const user = res.body.user
          const isLdap = res.body.ldap
          store.commit(USER_LOGIN, user)
          callback(null, isLdap)
        }
      })
  },

  // Needed for router to know if a redirection to login page is required or
  // not.
  requireAuth (to, from, next) {
    const finalize = (isLdap) => {
      if (!store.state.user.isAuthenticated) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        store.commit(DATA_LOADING_START, { isLdap })
        next()
      }
    }

    if (store.state.user.user === null) {
      auth.isServerLoggedIn((err, isLdap) => {
        if (err) {
          next({
            path: '/server-down',
            query: { redirect: to.fullPath }
          })
        } else {
          finalize(isLdap)
        }
      })
    } else {
      finalize()
    }
  },

  isPasswordValid (password, password2) {
    return password.length > 6 && password === password2
  }
}
export default auth
