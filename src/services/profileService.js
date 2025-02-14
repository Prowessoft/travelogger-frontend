import axiosInstance from '../utils/axiosConfig';

const profileService = {
  async getProfile(userId) {
    try {
      const response = await axiosInstance.get(`/getProfile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(userId, profile) {
    try {
      const response = await axiosInstance.post(`/profiles/save/${userId}`, profile);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

export default profileService;