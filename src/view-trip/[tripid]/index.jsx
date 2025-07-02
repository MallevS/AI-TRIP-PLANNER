import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import { useState } from 'react';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas-pro';

import jsPDF from 'jspdf';

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);
    const pdfRef = useRef();

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId]);

    const GetTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document:", docSnap.data());
            setTrip(docSnap.data());
        } else {
            console.log("No such document");
            toast("No such document found");
        }
    }

    const extractItineraryText = (trip) => {
        const itinerary = trip?.tripData?.itinerary || {};
        const sorted = Object.entries(itinerary).sort(([dayA], [dayB]) => {
            const numA = parseInt(dayA.replace('day', ''));
            const numB = parseInt(dayB.replace('day', ''));
            return numA - numB;
        });

        let text = '';
        sorted.forEach(([key, dayData]) => {
            text += `Day ${key.replace('day', '')}: ${dayData.theme}\n`;
            text += `Best Time: ${dayData.bestTimeToVisit}\n`;
            text += 'Places to Visit:\n';
            dayData.places?.forEach((place, idx) => {
                text += `  ${idx + 1}. ${place.placeName}\n`;
                text += `     Details: ${place.placeDetails}\n`;
                text += `     Time: ${place.timeTravel}\n`;
                text += `     Ticket: ${place.ticketPricing}\n\n`;
            });
            text += '\n';
        });
        return text;
    };

    const handleDownloadPDF = () => {
        if (!trip) return;
        const text = extractItineraryText(trip);

        const pdf = new jsPDF();
         pdf.setFontSize(12);

        const pageHeight = pdf.internal.pageSize.height;
        const margin = 10; 
        const lineHeight = 10;
        let y = margin;

        const lines = pdf.splitTextToSize(text, 180);

        for (let i = 0; i < lines.length; i++) {
            if (y > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
            pdf.text(lines[i], 10, y);
            y += lineHeight;
        }

        pdf.save('trip-itinerary.pdf');
    };

    return (
        <div className='smallPaddingTop p-10 md:px-20 lg:px-44 xl:px-56 min-h-screen bg-gradient-to-b from-[#0a0a1b] to-[#1a1a3a] text-white'>
            <InfoSection trip={trip} onDownload={handleDownloadPDF} pdfRef={pdfRef} />
            <Hotels trip={trip} />
            <div ref={pdfRef}>
                <PlacesToVisit trip={trip} />
            </div>
            <Footer trip={trip} />
        </div>
    )
}

export default ViewTrip