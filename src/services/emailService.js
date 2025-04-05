import axiosInstance from '../utils/axiosConfig';

const generatePayload = (days, trip, email) => {
  const types = ['activities', 'hotels', 'restaurants'];
    return {
      destination: trip.destination.name,
      startDate: trip.startDate.includes('T') ? trip.startDate.toISOString().split('T')[0] : trip.startDate,
      endDate: trip.endDate.includes('T') ? trip.endDate.toISOString().split('T')[0] : trip.endDate,
      recipientEmail: email,
      dayPlans: days.map(day => ({
        date: day.date,
        locations: types.flatMap(type => 
          day.sections[type].map(res => ({
              name: res.location.name,
              address: res.location.address,
              category: type
          }))
      ) 
      }))
    };
  };

 const emaiService = {
    async sendEmail(days, trip, email) {
        try {
          const payload = generatePayload(days, trip, email);
          const response = await axiosInstance.post('/email/send-itinerary', payload);
          return response.data;
        } catch (error) {
          console.error('Error saving itinerary:', error);
          throw error;
        }
      },
}

export default emaiService;