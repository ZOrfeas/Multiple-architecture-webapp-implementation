// const axios = require('axios')
// const url = process.env.REACT_APP_AUTH_URL
// const url = 'http://localhost:3001'

class Auth {
  login({ user, token }) {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  logout() {
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
