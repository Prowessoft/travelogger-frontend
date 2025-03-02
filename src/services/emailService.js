import axiosInstance from '../utils/axiosConfig';

const generatePayload = (days, trip, user) => {
    return {
      destination: trip.destination.label,
      startDate: trip.startDate.toISOString().includes('T') ? trip.startDate.toISOString().split('T')[0] : trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString().includes('T') ? trip.endDate.toISOString().split('T')[0] : trip.endDate.toISOString(),
      recipientEmail: user.email,
      dayPlans: days.map(day => ({
        date: day.date,
        locations: day.activities.map(activity => ({
          name: activity.title,
          category: activity.type,
          address: activity.location.name || activity.location,
        }))
      }))
    };
  };

 const emaiService = {
    async sendEmail(days, trip, user) {
        try {
          const payload = generatePayload(days, trip, user);
          const response = await axiosInstance.post('/email/send-itinerary', payload);
          return response.data;
        } catch (error) {
          console.error('Error saving itinerary:', error);
          throw error;
        }
      },
}

export default emaiService;