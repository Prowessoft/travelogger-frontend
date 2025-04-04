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
        response: error.data?.data,
        status: error.data?.status
      });

      if (error.data?.message) {
        throw new Error(error.data.message);
      } else if (!error.data) {
        throw new Error(error);
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
        response: error.data?.data,
        status: error.data?.status
      });

      if (error.data?.data?.message) {
        throw new Error(error.data.data.message);
      } else if (error.data?.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (!error.data) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error(error);
      }
    }
  },

  

  async updatePassword(email, newPassword, confirmPassword) {
    try {
      const response = await axiosInstance.put('/password/update', {
        email,
        newPassword,
        confirmPassword,
      });

      if (!response.data) {
        throw new Error('No response data received');
      }

      return response;

      // return response.data; // Return success message
    } catch (error) {
      console.error('Update Password Error:', {
        message: error.message,
        response: error.data?.data,
        status: error.data?.status,
      });

      if (error.data?.data?.message) {
        throw new Error(error.data.data.message);
      } else if (!error.data) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update password. Please try again.');
      }
    }
  },

  async sendOtp(email) {
    try {
      const response = await axiosInstance.post(`email/send-otp?email=${email}`);

      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data; // Return success message
    } catch (error) {
      console.error('otp Error:', {
        message: error.message,
        response: error.data?.data,
        status: error.data?.status,
      });
      if(error.data.statusCode === 'EMAIL_NOT_EXIST') {
        throw new Error('Email does not exist. Please signup with the email or enter a valid email address to send otp.');
      } else if (error.data?.message) {
        throw new Error(error.data?.message);
      } else if (!error.data) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update password. Please try again.');
      }
    }
  },

  async verifyOtp(email, otp) {
    try {
      const response = await axiosInstance.post(`email/verify-otp?email=${email}&otp=${otp}`);

      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data; // Return success message
    } catch (error) {
      console.error('otp Error:', {
        message: error.message,
        response: error.data?.data,
        status: error.data?.status,
      });

      if (error.data?.message) {
        throw new Error(error.data.message);
      } else if (!error.data) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update password. Please try again.');
      }
    }
  },


  signOut() {
    try {
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (error) {
      console.error('SignOut Error:', error);
    }
  },

  async deleteAccount(userId) {
    try {
      const response = await axiosInstance.delete(`/user/hard/delete/${userId}`);
      // if (!response.data) {
      //   throw new Error('No response data received');
      // }
      localStorage.removeItem('user');
      sessionStorage.clear();
      return response.data.message; // Return success message
    } catch (error) {
      console.error('Delete Account Error:', {
        message: error.message,
        response: error.data?.data,
        status: error.data?.status,
      });

      if (error.data?.data?.message) {
        throw new Error(error.data.data.message); // Throw error with message from server
      }
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