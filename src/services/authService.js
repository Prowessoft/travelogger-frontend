import axiosInstance from '../utils/axiosConfig';

const authService = {
  async signUp(email, password, name, avatarImgUrl) {
    try {
      const response = await axiosInstance.post('/user/signup', {
        name,
        email,
        password,
        avatarImgUrl
      });

      if (!response.data) {
        throw new Error('No response data received');
      }

      const { userId, message, name: userName } = response.data;
      const user = {
        id: userId,
        name: userName,
        email,
        avatarImgUrl
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      return { user };
    } catch (error) {
      console.error('SignUp Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to sign up. Please try again.');
      }
    }
  },

  async signIn(email, password) {
    try {
      const response = await axiosInstance.post('/user/login', {
        email,
        password
      });

      if (!response.data) {
        throw new Error('No response data received');
      }

      const { userId, message, name, avatarImgUrl } = response.data;
      const user = {
        id: userId,
        name,
        email,
        avatarImgUrl
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      return { user };
    } catch (error) {
      console.error('SignIn Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      } else if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
    }
  },

  signOut() {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('SignOut Error:', error);
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.signOut(); // Clear potentially corrupted data
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};

export default authService;