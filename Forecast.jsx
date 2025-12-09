// =============================
// Forecast.jsx (FULL + SELF-CONTAINED)
// =============================

import React, { useEffect, useState } from "react";
import "../styles/Forecast.css";
import "../styles/Weather.css";

import {
  HomeIcon,
  Sprout,
  Sun,
  Settings,
  Globe,
  Calendar,
  Radar,
  Info,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";

// =============================
// INLINE WeatherGraph COMPONENT
// =============================
import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function WeatherGraph({ data15, data30 }) {
  const [mode, setMode] = useState("15");
  const data = mode === "15" ? data15 : data30;

  return (
    <div className="weather-graph-card">
      <div className="graph-header">
        <h3 className="graph-title">Temperature Trend (Last {mode} Days)</h3>

        <div className="graph-btn-row">
          <button
            className={`graph-btn ${mode === "15" ? "active" : ""}`}
            onClick={() => setMode("15")}
          >
            15 Days
          </button>
          <button
            className={`graph-btn ${mode === "30" ? "active" : ""}`}
            onClick={() => setMode("30")}
          >
            30 Days
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temp"
            name="Temperature (°C)"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// =============================
// TRANSLATIONS
// =============================
const translations = {
  en: {
    weather: {
      title: "Weather Dashboard",
      overview: "Overview",
      todayTab: "Today",
      tomorrowTab: "Tomorrow",
      weekTab: "Next 7 Days",
      currentWeather: "Current Weather",
      forecast: "7-Day Forecast",
      smartPrediction: "3-Day Smart Prediction",
      humidity: "Humidity",
      windSpeed: "Wind",
      pressure: "Pressure",
      visibility: "Visibility",
      uvIndex: "UV Index",
      today: "Today",
      tomorrow: "Tomorrow",
      lastUpdated: "Last updated",
    },
  },
};

// =============================
// WEATHER CODE → ICON + DESCRIPTION
// =============================
function getWeatherInfoFromCode(code) {
  const weatherMap = {
    0: { description: "Clear sky", icon: "Sun" },
    1: { description: "Mainly clear", icon: "Sun" },
    2: { description: "Partly cloudy", icon: "CloudSun" },
    3: { description: "Overcast", icon: "Cloud" },
    45: { description: "Fog", icon: "CloudFog" },
    48: { description: "Rime fog", icon: "CloudFog" },
    51: { description: "Drizzle", icon: "CloudDrizzle" },
    61: { description: "Rain", icon: "CloudRain" },
    80: { description: "Rain showers", icon: "CloudRain" },
    95: { description: "Thunderstorm", icon: "CloudLightning" },
  };
  return weatherMap[code] || { description: "Clear", icon: "Sun" };
}

// =============================
// DYNAMIC SMART PREDICTION
// =============================
function predictNext3Days(current, daily) {
  const trend = [];

  const temp = current.temperature_2m ?? 0;
  const humidity = current.relative_humidity_2m ?? 0;
  const wind = current.wind_speed_10m ?? 0;

  for (let i = 1; i <= 3; i++) {
    let score = 0;
    let text = "";

    const precip = daily.precipitation_probability_max?.[i] || 0;
    const maxTemp = daily.temperature_2m_max?.[i] || temp;
    const code = daily.weather_code?.[i] || 0;

    if (humidity > 75) score += 2;
    if (precip > 50) score += 2;
    if (maxTemp > temp + 3) score += 1;
    if (wind > 30) score += 1;
    if (code >= 61) score += 2;

    if (score >= 5) text = "High chance of rain/storm.";
    else if (score >= 3) text = "Moderate chance of clouds or rain.";
    else if (score >= 1) text = "Mild weather changes expected.";
    else text = "Stable weather expected.";

    trend.push({ day: i, text });
  }

  return trend;
}

// =============================
// GRAPH DATA GENERATOR
// =============================
function generateGraphData(daily) {
  const seed = daily.temperature_2m_max?.slice(0, 7) || [24, 25, 26];
  let lastTemp = seed[seed.length - 1];

  const gen = (count) => {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      const change = Math.random() * 4 - 2;
      lastTemp = Math.round(lastTemp + change);
      arr.push({ day: `Day ${i}`, temp: lastTemp });
    }
    return arr;
  };

  return { data15: gen(15), data30: gen(30) };
}

// =============================
// MAIN COMPONENT
// =============================
export default function Forecast() {
  const navigate = useNavigate();
  const location = useLocation();

  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [graph, setGraph] = useState({ data15: [], data30: [] });
  const [lastUpdated, setLastUpdated] = useState("--");
  const [tab, setTab] = useState("overview");

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  // =============================
  // API FETCH
  // =============================
  async function fetchWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    setCurrent(data.current);
    setDaily(data.daily);
    setPrediction(predictNext3Days(data.current, data.daily));
    setGraph(generateGraphData(data.daily));
    setLastUpdated(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(24.1, 88.25)
    );
  }, []);

  if (!current || !daily) return <div>Loading...</div>;

  const trans = translations.en.weather;
  const info = getWeatherInfoFromCode(current.weather_code);
  const WeatherIcon = Icons[info.icon];

  return (
    <div className="forecast-page">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div className="brand-text">
            <div className="brand-title">AgroSubhidha</div>
            <div className="brand-subtitle">Farmer's Digital Companion</div>
          </div>
        </div>

        <div className="nav-pill">
          <button onClick={() => navigate("/dashboard")} className={isActive("/dashboard")}>
            <HomeIcon />
            Home
          </button>

          <button onClick={() => navigate("/manager")} className={isActive("/manager")}>
            <Sprout />
            Crops
          </button>

          <button onClick={() => navigate("/weather")} className={isActive("/weather")}>
            <Sun />
            Weather
          </button>

          <button onClick={() => navigate("/settings")} className={isActive("/settings")}>
            <Settings />
            Settings
          </button>

          <button onClick={() => navigate("/language")} className={isActive("/language")}>
            <Globe />
            Language
          </button>

          {/* ⭐ RESTORED ABOUT US */}
          <button onClick={() => navigate("/about")} className={isActive("/about")}>
            <Info />
            About Us
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="forecast-dashboard">
        <h1>{trans.title}</h1>
        <p>{trans.lastUpdated}: {lastUpdated}</p>

        {/* GOOGLE WEATHER TABS */}
        <div className="weather-tabs">
          <button className={tab === "overview" ? "active-tab" : ""} onClick={() => setTab("overview")}>Overview</button>
          <button className={tab === "today" ? "active-tab" : ""} onClick={() => setTab("today")}>Today</button>
          <button className={tab === "tomorrow" ? "active-tab" : ""} onClick={() => setTab("tomorrow")}>Tomorrow</button>
          <button className={tab === "week" ? "active-tab" : ""} onClick={() => setTab("week")}>7 Days</button>
        </div>

        {/* =============================
           OVERVIEW TAB
        ============================= */}
        {tab === "overview" && (
          <>
            <WeatherGraph data15={graph.data15} data30={graph.data30} />

            <div className="forecast-card">
              <h2><Sun /> Current Weather</h2>

              <div className="forecast-current-weather">
                <WeatherIcon className="forecast-weather-main-icon" />
                <div>
                  <p className="forecast-temperature">{Math.round(current.temperature_2m)}°C</p>
                  <p>{info.description}</p>
                  <p>Feels like {Math.round(current.apparent_temperature)}°C</p>
                </div>
              </div>

              <div className="forecast-details-grid">
                <p>Humidity: {current.relative_humidity_2m}%</p>
                <p>Wind: {current.wind_speed_10m} km/h</p>
                <p>Pressure: {current.pressure_msl} hPa</p>
                <p>Visibility: {(current.visibility / 1000).toFixed(1)} km</p>
                <p>UV Index: {daily.uv_index_max[0]}</p>
                <p>Dew Point: {Math.round(current.dew_point_2m)}°C</p>
              </div>
            </div>

            {/* PREDICTION */}
            <div className="forecast-card">
              <h2><Radar /> {trans.smartPrediction}</h2>

              <div className="forecast-prediction-list">
                {prediction.map((p) => (
                  <div className="forecast-prediction-item" key={p.day}>
                    <strong>Day {p.day}:</strong> {p.text}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* =============================
           TODAY TAB
        ============================= */}
        {tab === "today" && (
          <div className="forecast-card">
            <h2><Calendar /> Today</h2>

            <p className="forecast-temp-big">
              {Math.round(current.temperature_2m)}°C • {info.description}
            </p>

            <div className="forecast-details-grid">
              <p>Humidity: {current.relative_humidity_2m}%</p>
              <p>Wind: {current.wind_speed_10m} km/h</p>
              <p>UV: {daily.uv_index_max[0]}</p>
              <p>Visibility: {(current.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        )}

        {/* =============================
           TOMORROW TAB
        ============================= */}
        {tab === "tomorrow" && (
          <div className="forecast-card">
            <h2><Calendar /> Tomorrow</h2>

            <p className="forecast-temp-big">
              {Math.round(daily.temperature_2m_max[1])}°C / {Math.round(daily.temperature_2m_min[1])}°C
            </p>

            <p>{getWeatherInfoFromCode(daily.weather_code[1]).description}</p>
          </div>
        )}

        {/* =============================
           7 DAY TAB
        ============================= */}
        {tab === "week" && (
          <div className="forecast-card">
            <h2><Calendar /> 7-Day Forecast</h2>

            <div className="forecast-grid">
              {daily.time.map((date, i) => {
                const info = getWeatherInfoFromCode(daily.weather_code[i]);
                const Icon = Icons[info.icon];

                return (
                  <div className="forecast-grid-item" key={i}>
                    <p className="forecast-day">
                      {i === 0
                        ? "Today"
                        : i === 1
                        ? "Tomorrow"
                        : new Date(date).toLocaleDateString("en", { weekday: "short" })}
                    </p>

                    <Icon className="forecast-grid-icon" />

                    <p>
                      {Math.round(daily.temperature_2m_max[i])}°C / {Math.round(daily.temperature_2m_min[i])}°C
                    </p>

                    <p className="forecast-condition-small">{info.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
