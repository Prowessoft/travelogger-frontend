import axiosInstance from '../utils/axiosConfig';

const generatePayload = (days, trip, user) => {
  const types = ['activities', 'hotels', 'restaurants'];
    return {
      destination: trip.destination.name,
      startDate: trip.startDate.includes('T') ? trip.startDate.toISOString().split('T')[0] : trip.startDate,
      endDate: trip.endDate.includes('T') ? trip.endDate.toISOString().split('T')[0] : trip.endDate,
      recipientEmail: user.email,
      dayPlans: days.map(day => ({
        date: day.date,
        locations: types.flatMap(type => 
          day.sections[type].map(res => ({
              name: res.location.name,
              address: res.location.address,
              category: res.type
          }))
      ) 
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