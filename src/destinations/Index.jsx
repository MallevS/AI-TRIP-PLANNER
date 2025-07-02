import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

export const fetchWeather = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await axios.get(url);
  return {
    temp: res.data.main.temp,
    icon: res.data.weather[0].icon,
    desc: res.data.weather[0].description,
  };
};

const initialDestinations = [
  { name: "Tokyo", country: "Japan", lat: 35.6895, lng: 139.6917 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615 },
  { name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920 },
];

const featuredExperiences = [
  { title: "Skydiving Over Dubai", location: "Dubai, UAE" },
  { title: "Hot Air Balloon Ride", location: "Cappadocia, Turkey" },
  { title: "Scuba Diving in Bali", location: "Bali, Indonesia" },
  { title: "Northern Lights Tour", location: "Reykjavík, Iceland" },
];

function Destinations() {
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState(initialDestinations);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    async function loadWeather() {
      const updated = await Promise.all(
        initialDestinations.map(async place => {
          const weather = await fetchWeather(place.lat, place.lng);
          return { ...place, weather };
        })
      );
      setDestinations(updated);
    }
    loadWeather();
  }, []);

  useEffect(() => {
    async function fetchSearchedCity() {
      if (
        search &&
        !initialDestinations.some(d => d.name.toLowerCase() === search.toLowerCase())
      ) {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          search
        )}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_KEY}`;
        const geoRes = await axios.get(geoUrl);
        if (geoRes.data && geoRes.data.length > 0) {
          const { lat, lon, name, country } = geoRes.data[0];
          const weather = await fetchWeather(lat, lon);
          setSearchResult({
            name,
            country,
            lat,
            lng: lon,
            weather,
          });
        } else {
          setSearchResult(null);
        }
      } else {
        setSearchResult(null);
      }
    }
    fetchSearchedCity();
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1b] to-[#1a1a3a] relative overflow-hidden flex flex-col items-center">
      {/* AI Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-cyan-400 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-80 h-80 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>

      {/* AI Tagline */}
      <motion.p
        className="mt-50 text-lg text-white/60 tracking-wide uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        "AI-powered travel insights, tailored just for you."
      </motion.p>

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Discover Stunning Destinations
      </motion.h1>

      {/* 🔍 AI Destination Search */}
      <div className="relative mt-8">
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-all"
        />
        <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl" />
      </div>

      {/* Searched City Result (if not in initial list) */}
      {searchResult && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 text-center text-white transition-all cursor-pointer hover:border-cyan-400 mb-8 mt-8"
        >
          <h3 className="text-xl font-semibold text-white">{searchResult.name}</h3>
          <p className="text-sm text-white/60">{searchResult.country}</p>
          <div className="flex items-center gap-2 mt-3">
            <img
              src={`https://openweathermap.org/img/wn/${searchResult.weather.icon}@2x.png`}
              alt={searchResult.weather.desc}
              className="w-8 h-8"
            />
            <span className="text-white/70">
              {Math.round(searchResult.weather.temp)}°C - {searchResult.weather.desc}
            </span>
          </div>
        </motion.div>
      )}

      {/* Destination Grid */}
      <motion.div
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        {destinations
          .filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((destination, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 text-center text-white transition-all cursor-pointer hover:border-cyan-400"
            >
              <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
              <p className="text-sm text-white/60">{destination.country}</p>
              {/* Weather */}
              {destination.weather ? (
                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${destination.weather.icon}@2x.png`}
                    alt={destination.weather.desc}
                    className="w-8 h-8"
                  />
                  <span className="text-white/70">
                    {Math.round(destination.weather.temp)}°C - {destination.weather.desc}
                  </span>
                </div>
              ) : (
                <div className="text-white/40 mt-3">Loading weather...</div>
              )}
            </motion.div>
          ))}
      </motion.div>

      {/* 🏆 Featured AI-Recommended Experiences */}
      <div className="mt-20 w-full max-w-6xl px-6">
        <motion.h2
          className="text-3xl text-center font-bold text-white mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          AI-Recommended Experiences
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {featuredExperiences.map((exp, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 text-center text-white transition-all cursor-pointer hover:border-cyan-400"
            >
              <h3 className="text-lg font-semibold">{exp.title}</h3>
              <p className="text-sm text-white/60 mt-2">{exp.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div >
  );
}

export default Destinations;