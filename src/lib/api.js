const API_BASE_URL = 'http://localhost:5000';

export const authAPI = {
  async register(userData) {
    try {
      const formattedData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        firstname: userData.firstName,
        lastname: userData.lastName,
        phone: userData.phone,
        DOB: `${userData.birthYear}-${userData.birthMonth}-${userData.birthDay}`
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      return data
    } catch (error) {
      console.error('Registration API error:', error)
      throw error
    }
  },

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      return data
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  }
}