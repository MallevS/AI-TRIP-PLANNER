import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';


const getCustomIcon = (dayNumber) =>
  new L.DivIcon({
    html: `<div style="background:#0ea5e9;color:white;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.2rem;box-shadow:0 0 18px #00f3ff, 0 0 8px #0ea5e9;">${dayNumber}</div>`,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 1) {
      map.setView(positions[0], 12);
    } else if (positions.length > 1) {
      map.fitBounds(positions);
    }
  }, [positions, map]);

  return null;
}

const ItineraryMap = ({ destination = [] }) => {
  const safeItinerary = Array.isArray(destination) ? destination : [];
  const center = safeItinerary?.[0]?.coordinates || [51.505, -0.09];
  const polyline = safeItinerary.map((day) => day.coordinates);

  const resolveImagePath = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `${process.env.PUBLIC_URL || ''}${imgPath}`;
  };

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={false}
      style={{
        height: "400px",
        width: "100%",
        marginTop: "5rem",
        borderRadius: "1.5rem",
        boxShadow: "0 8px 32px 0 rgba(14,165,233,0.25), 0 1.5px 6px 0 rgba(0,0,0,0.10)"
      }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
      />
      <FitBounds positions={polyline} />
      {safeItinerary.map((day, i) => (
        <Marker
          key={i}
          position={day.coordinates}
          icon={getCustomIcon(i + 1)}
          eventHandlers={{
            add: (e) => {
              e.target._icon.classList.add('marker-bounce');
            }
          }}
        >
          <Popup className="glass-popup">
            <strong>Day {i + 1}: {day.title}</strong><br />
            {day.image && <img src={resolveImagePath(day.image)}  alt={`Day ${i+1}`}  style={{ width: '100px', borderRadius: '8px', margin: '8px 0' }} />}
            <div>{day.description}</div>
            {day.weather && (
              <div style={{ marginTop: 8 }}>
                <img src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`} alt="" width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: 6 }}>{day.weather.temp}°C, {day.weather.desc}</span>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
      <Polyline
        positions={polyline}
        color="#00f3ff"
        weight={6}
        opacity={0.85}
        dashArray="12,8"
      />
    </MapContainer>
  );
};

export default ItineraryMap;
