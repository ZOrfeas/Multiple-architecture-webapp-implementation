// const axios = require('axios')
// const url = process.env.REACT_APP_AUTH_URL

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

  /*async isAuth() {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      const response = await axios.get(`${url}/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // return response.status === 200
      if (response.status === 200) {
        return true
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return false
    }
  }*/
}

export default new Auth()
