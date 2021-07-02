const axios = require('axios')
const url = process.env.REACT_APP_AUTH_URL

/**
 * Class to handle login, logout, etc., methods
 */

class Auth {
  login({ user, token }) {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  logoutAllTabs(e) {
    if (e.key === 'token' && e.oldValue && !e.newValue) {
      window.location.reload()
    }
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  getToken() {
    return JSON.parse(localStorage.getItem('token'))
  }

  // check for token validity through auth service request
  async isAuth() {
    const token = JSON.parse(localStorage.getItem('token'))

    if (!token) return false

    const config = { headers: { 'Authorization': `Bearer ${token}` } }
    try {
      const response = await axios.get(`${url}/protected`, config)
      return response.status === 200
    } catch (error) {
      console.log(error)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return false
    }
  }
}

export default new Auth()
