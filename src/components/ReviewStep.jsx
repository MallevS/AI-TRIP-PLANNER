import React from "react";
import { format } from "date-fns";
import Chatbot from "@/components/custom/Chatbot";
import ItineraryMap from "../components/custom/ItineraryMap";
import { useEffect } from 'react';

const PreferenceItem = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-white/10">
        <span className="text-cyan-300">{label}:</span>
        <span className="font-medium">{value || 'Not specified'}</span>
    </div>
);

export default function ReviewStep({ formData, Chatbot, chatSession }) {
    const [coords, setCoords] = React.useState(null);

    useEffect(() => {
        const placeId = formData?.location?.value?.place_id;
        if (!placeId) return;

        const fetchCoords = async () => {
            const query = encodeURIComponent(formData.location?.label);
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
            const data = await res.json();
            if (data && data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            }
        };

        fetchCoords();
    }, [formData?.location?.value?.place_id]);

    return (
        <>
            <div className="reviewComponentWrap">
                <div className="leftPart">
                    <PreferenceItem label="Destination" value={formData.location?.label} />
                    <PreferenceItem
                        label="Dates"
                        value={
                            formData.startDate && formData.endDate
                                ? `${format(new Date(formData.startDate), 'MMM dd')} - ${format(new Date(formData.endDate), 'MMM dd')} (${formData.noOfDays} days)`
                                : 'Not specified'
                        }
                    />
                    <PreferenceItem label="Travelers" value={formData.traveler} />
                    <PreferenceItem label="Budget" value={`${formData.budget} ${formData.exactBudget ? `($${formData.exactBudget} pp)` : ''}`} />
                    <PreferenceItem label="Travel Style" value={formData.travelStyle} />
                    <PreferenceItem label="Activities" value={formData.activities?.join(', ')} />
                    <PreferenceItem label="Dietary" value={formData.dietary || 'No preference'} />
                    <PreferenceItem
                        label="Accessibility"
                        value={
                            formData.accessibility && formData.accessibility.length > 0
                                ? formData.accessibility.join(', ')
                                : 'No requirements'
                        }
                    />
                </div>
                <div className="rightPart">
                    <Chatbot
                        formData={formData}
                        onSend={async (userMessage, messages) => {
                            const chatHistory = messages
                                .map(m => `${m.from === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
                                .join('\n');
                            const tripSummary = `Destination: ${formData.location?.label}
Budget: ${formData.budget}
Travelers: ${formData.traveler}
Style: ${formData.travelStyle}
Activities: ${formData.activities?.join(', ')}
Dietary: ${formData.dietary}
Accessibility: ${formData.accessibility?.join(', ') || 'None'}
`;
                            const prompt = `
You are a helpful travel assistant. Here is the user's trip:
${tripSummary}

Conversation so far:
${chatHistory}

Respond to the user's last message. If they ask for suggestions, give them. If they want to change something, update the plan. If they ask for a packing list, give a packing list. If they want a summary, return a JSON trip plan.
`;
                            const result = await chatSession.sendMessage(prompt);
                            return await result?.response?.text();
                        }}
                    />
                </div>
            </div>
            <div style={{ height: 400 }}>
                {coords && (
                    <ItineraryMap destination={[{ coordinates: coords, title: formData.location.label }]} />
                )}
            </div>
        </>
    );
}