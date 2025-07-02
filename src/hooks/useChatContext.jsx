import { useMemo } from 'react';

export default function useChatContext(formData) {
  return useMemo(() => {
    if (!formData) return null;
    
    return {
      location: formData.location?.label || '',
      budget: formData.budget || '',
      traveler: formData.traveler || '',
      travelStyle: formData.travelStyle || '',
      activities: formData.activities?.join(', ') || '',
      dietary: formData.dietary || '',
      accessibility: formData.accessibility?.join(', ') || ''
    };
  }, [formData]);
}