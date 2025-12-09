// =============================
// Forecast.jsx (FULL + MULTILINGUAL)
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

function WeatherGraph({ data15, data30, trans }) {
  const [mode, setMode] = useState("15");
  const data = mode === "15" ? data15 : data30;

  return (
    <div className="weather-graph-card">
      <div className="graph-header">
        <h3 className="graph-title">
          {trans.tempTrend} ({trans.last} {mode} {trans.days})
        </h3>

        <div className="graph-btn-row">
          <button
            className={`graph-btn ${mode === "15" ? "active" : ""}`}
            onClick={() => setMode("15")}
          >
            15 {trans.days}
          </button>
          <button
            className={`graph-btn ${mode === "30" ? "active" : ""}`}
            onClick={() => setMode("30")}
          >
            30 {trans.days}
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
            name={trans.tempC}
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
// TRANSLATIONS (EN, HI, PA, BN)
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
      dewPoint: "Dew Point",
      lastUpdated: "Last Updated",
      feelsLike: "Feels like",
      highChance: "High chance of rain/storm.",
      mediumChance: "Moderate chance of clouds or rain.",
      mildChance: "Mild weather changes expected.",
      stable: "Stable weather expected.",
      today: "Today",
      tomorrow: "Tomorrow",
      tempTrend: "Temperature Trend",
      days: "Days",
      last: "Last",
      tempC: "Temperature (°C)",
    },
  },

  hi: {
    weather: {
      title: "मौसम डैशबोर्ड",
      overview: "सारांश",
      todayTab: "आज",
      tomorrowTab: "कल",
      weekTab: "अगले 7 दिन",
      currentWeather: "वर्तमान मौसम",
      forecast: "7-दिवसीय पूर्वानुमान",
      smartPrediction: "3-दिवसीय स्मार्ट भविष्यवाणी",
      humidity: "नमी",
      windSpeed: "हवा",
      pressure: "दबाव",
      visibility: "दृश्यता",
      uvIndex: "यूवी इंडेक्स",
      dewPoint: "ड्यू पॉइंट",
      lastUpdated: "अंतिम अपडेट",
      feelsLike: "महसूस होता है",
      highChance: "बारिश/तूफान की अधिक संभावना।",
      mediumChance: "बादल या हल्की बारिश की संभावना।",
      mildChance: "हल्का मौसम परिवर्तन संभव।",
      stable: "मौसम स्थिर रहेगा।",
      today: "आज",
      tomorrow: "कल",
      tempTrend: "तापमान रुझान",
      days: "दिन",
      last: "पिछले",
      tempC: "तापमान (°C)",
    },
  },

  pa: {
    weather: {
      title: "ਮੌਸਮ ਡੈਸ਼ਬੋਰਡ",
      overview: "ਝਲਕ",
      todayTab: "ਅੱਜ",
      tomorrowTab: "ਭਲਕੇ",
      weekTab: "ਅਗਲੇ 7 ਦਿਨ",
      currentWeather: "ਮੌਜੂਦਾ ਮੌਸਮ",
      forecast: "7-ਦਿਨਾਂ ਦਾ ਅਨੁਮਾਨ",
      smartPrediction: "3-ਦਿਨਾਂ ਦੀ ਸਮਾਰਟ ਭਵਿੱਖਵਾਣੀ",
      humidity: "ਨਮੀ",
      windSpeed: "ਹਵਾ",
      pressure: "ਦਬਾਅ",
      visibility: "ਦਿੱਖ",
      uvIndex: "ਯੂਵੀ ਇੰਡੈਕਸ",
      dewPoint: "ਔਸ ਬਿੰਦੂ",
      lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ",
      feelsLike: "ਅਹਿਸਾਸ ਹੁੰਦਾ ਹੈ",
      highChance: "ਮੀਂਹ/ਤੂਫ਼ਾਨ ਦੀ ਵੱਧ ਸੰਭਾਵਨਾ।",
      mediumChance: "ਬੱਦਲ ਜਾਂ ਹਲਕੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ।",
      mildChance: "ਹਲਕਾ ਮੌਸਮੀ ਬਦਲਾਅ ਸੰਭਵ ਹੈ।",
      stable: "ਮੌਸਮ ਸਥਿਰ ਰਹੇਗਾ।",
      today: "ਅੱਜ",
      tomorrow: "ਭਲਕੇ",
      tempTrend: "ਤਾਪਮਾਨ ਰੁਝਾਨ",
      days: "ਦਿਨ",
      last: "ਪਿਛਲੇ",
      tempC: "ਤਾਪਮਾਨ (°C)",
    },
  },

  bn: {
    weather: {
      title: "আবহাওয়া ড্যাশবোর্ড",
      overview: "সংক্ষিপ্ত বিবরণ",
      todayTab: "আজ",
      tomorrowTab: "আগামীকাল",
      weekTab: "আগামী ৭ দিন",
      currentWeather: "বর্তমান আবহাওয়া",
      forecast: "৭ দিনের পূর্বাভাস",
      smartPrediction: "৩ দিনের স্মার্ট পূর্বাভাস",
      humidity: "আর্দ্রতা",
      windSpeed: "বাতাস",
      pressure: "চাপ",
      visibility: "দৃশ্যমানতা",
      uvIndex: "ইউভি সূচক",
      dewPoint: "ডিউ পয়েন্ট",
      lastUpdated: "সর্বশেষ আপডেট",
      feelsLike: "মনে হয়",
      highChance: "বৃষ্টি/ঝড়ের উচ্চ সম্ভাবনা।",
      mediumChance: "মেঘ বা হালকা বৃষ্টির সম্ভাবনা।",
      mildChance: "আবহাওয়ায় সামান্য পরিবর্তন হতে পারে।",
      stable: "আবহাওয়া স্থিতিশীল থাকবে।",
      today: "আজ",
      tomorrow: "আগামীকাল",
      tempTrend: "তাপমাত্রার প্রবণতা",
      days: "দিন",
      last: "শেষ",
      tempC: "তাপমাত্রা (°C)",
    },
  },
};

// =============================
// WEATHER CODE → ICON + DESCRIPTION (Translated)
// =============================
function getWeatherInfoFromCode(code, langData) {
  const map = {
    0: { en: "Clear sky", hi: "खुला आसमान", pa: "ਸਾਫ਼ ਆਸਮਾਨ", bn: "পরিষ্কার আকাশ", icon: "Sun" },
    1: { en: "Mainly clear", hi: "मुख्यतः साफ़", pa: "ਜਿਆਦਾਤਰ ਸਾਫ਼", bn: "মূলত পরিষ্কার", icon: "Sun" },
    2: { en: "Partly cloudy", hi: "आंशिक बादल", pa: "ਅੰਸ਼ਕ ਬੱਦਲ", bn: "আংশিক মেঘলা", icon: "CloudSun" },
    3: { en: "Overcast", hi: "बादल छाए", pa: "ਘੱਟ-ਵੱਧ ਬੱਦਲ", bn: "মেঘাচ্ছন্ন", icon: "Cloud" },
    45: { en: "Fog", hi: "कोहरा", pa: "ਧੁੰਦ", bn: "কুয়াশা", icon: "CloudFog" },
    61: { en: "Rain", hi: "बारिश", pa: "ਮੀਂਹ", bn: "বৃষ্টি", icon: "CloudRain" },
    95: { en: "Thunderstorm", hi: "आंधी-तूफान", pa: "ਗਰਜ-ਤੂਫ਼ਾਨ", bn: "বজ্রঝড়", icon: "CloudLightning" },
  };

  const item = map[code] || map[0];

  return {
    description: item[langData],
    icon: item.icon,
  };
}

// =============================
// DYNAMIC SMART PREDICTION
// =============================
function predictNext3Days(current, daily, trans) {
  const trend = [];
  const temp = current.temperature_2m ?? 0;
  const humidity = current.relative_humidity_2m ?? 0;
  const wind = current.wind_speed_10m ?? 0;

  for (let i = 1; i <= 3; i++) {
    let score = 0;

    const precip = daily.precipitation_probability_max?.[i] || 0;
    const maxTemp = daily.temperature_2m_max?.[i] || temp;
    const code = daily.weather_code?.[i] || 0;

    if (humidity > 75) score += 2;
    if (precip > 50) score += 2;
    if (maxTemp > temp + 3) score += 1;
    if (wind > 30) score += 1;
    if (code >= 61) score += 2;

    let text =
      score >= 5
        ? trans.highChance
        : score >= 3
        ? trans.mediumChance
        : score >= 1
        ? trans.mildChance
        : trans.stable;

    trend.push({ day: i, text });
  }

  return trend;
}

// =============================
// MAIN COMPONENT
// =============================
export default function Forecast() {
  const navigate = useNavigate();
  const location = useLocation();

  const lang = localStorage.getItem("appLanguage") || "en";
  const trans = translations[lang].weather;

  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [graph, setGraph] = useState({ data15: [], data30: [] });
  const [lastUpdated, setLastUpdated] = useState("--");
  const [tab, setTab] = useState("overview");

  const isActive = (path) => (location.pathname === path ? "active-nav-btn" : "");

  async function fetchWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    setCurrent(data.current);
    setDaily(data.daily);

    setPrediction(predictNext3Days(data.current, data.daily, trans));
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

  const weatherInfo = getWeatherInfoFromCode(current.weather_code, lang);
  const WeatherIcon = Icons[weatherInfo.icon];

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
            <HomeIcon /> Home
          </button>

          <button onClick={() => navigate("/manager")} className={isActive("/manager")}>
            <Sprout /> Crops
          </button>

          <button onClick={() => navigate("/weather")} className={isActive("/weather")}>
            <Sun /> Weather
          </button>

          <button onClick={() => navigate("/settings")} className={isActive("/settings")}>
            <Settings /> Settings
          </button>

          <button onClick={() => navigate("/language")} className={isActive("/language")}>
            <Globe /> Language
          </button>

          <button onClick={() => navigate("/about")} className={isActive("/about")}>
            <Info /> About Us
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="forecast-dashboard">
        <h1>{trans.title}</h1>
        <p>{trans.lastUpdated}: {lastUpdated}</p>

        {/* Weather Tabs */}
        <div className="weather-tabs">
          <button className={tab === "overview" ? "active-tab" : ""} onClick={() => setTab("overview")}>
            {trans.overview}
          </button>

          <button className={tab === "today" ? "active-tab" : ""} onClick={() => setTab("today")}>
            {trans.todayTab}
          </button>

          <button className={tab === "tomorrow" ? "active-tab" : ""} onClick={() => setTab("tomorrow")}>
            {trans.tomorrowTab}
          </button>

          <button className={tab === "week" ? "active-tab" : ""} onClick={() => setTab("week")}>
            {trans.weekTab}
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            <WeatherGraph data15={graph.data15} data30={graph.data30} trans={trans} />

            <div className="forecast-card">
              <h2><Sun /> {trans.currentWeather}</h2>

              <div className="forecast-current-weather">
                <WeatherIcon className="forecast-weather-main-icon" />
                <div>
                  <p className="forecast-temperature">
                    {Math.round(current.temperature_2m)}°C
                  </p>
                  <p>{weatherInfo.description}</p>
                  <p>{trans.feelsLike} {Math.round(current.apparent_temperature)}°C</p>
                </div>
              </div>

              <div className="forecast-details-grid">
                <p>{trans.humidity}: {current.relative_humidity_2m}%</p>
                <p>{trans.windSpeed}: {current.wind_speed_10m} km/h</p>
                <p>{trans.pressure}: {current.pressure_msl} hPa</p>
                <p>{trans.visibility}: {(current.visibility / 1000).toFixed(1)} km</p>
                <p>{trans.uvIndex}: {daily.uv_index_max[0]}</p>
                <p>{trans.dewPoint}: {Math.round(current.dew_point_2m)}°C</p>
              </div>
            </div>

            {/* PREDICTION */}
            <div className="forecast-card">
              <h2><Radar /> {trans.smartPrediction}</h2>

              <div className="forecast-prediction-list">
                {prediction.map((p) => (
                  <div className="forecast-prediction-item" key={p.day}>
                    <strong>{trans.day} {p.day}:</strong> {p.text}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TODAY TAB */}
        {tab === "today" && (
          <div className="forecast-card">
            <h2><Calendar /> {trans.todayTab}</h2>

            <p className="forecast-temp-big">
              {Math.round(current.temperature_2m)}°C • {weatherInfo.description}
            </p>

            <div className="forecast-details-grid">
              <p>{trans.humidity}: {current.relative_humidity_2m}%</p>
              <p>{trans.windSpeed}: {current.wind_speed_10m} km/h</p>
              <p>{trans.uvIndex}: {daily.uv_index_max[0]}</p>
              <p>{trans.visibility}: {(current.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        )}

        {/* TOMORROW TAB */}
        {tab === "tomorrow" && (
          <div className="forecast-card">
            <h2><Calendar /> {trans.tomorrowTab}</h2>

            <p className="forecast-temp-big">
              {Math.round(daily.temperature_2m_max[1])}°C / {Math.round(daily.temperature_2m_min[1])}°C
            </p>

            <p>{getWeatherInfoFromCode(daily.weather_code[1], lang).description}</p>
          </div>
        )}

        {/* WEEK TAB */}
        {tab === "week" && (
          <div className="forecast-card">
            <h2><Calendar /> {trans.forecast}</h2>

            <div className="forecast-grid">
              {daily.time.map((date, i) => {
                const data = getWeatherInfoFromCode(daily.weather_code[i], lang);
                const Icon = Icons[data.icon];

                return (
                  <div className="forecast-grid-item" key={i}>
                    <p className="forecast-day">
                      {i === 0
                        ? trans.today
                        : i === 1
                        ? trans.tomorrow
                        : new Date(date).toLocaleDateString(lang === "bn" ? "bn" : "en", {
                            weekday: "short",
                          })}
                    </p>

                    <Icon className="forecast-grid-icon" />

                    <p>
                      {Math.round(daily.temperature_2m_max[i])}°C /{" "}
                      {Math.round(daily.temperature_2m_min[i])}°C
                    </p>

                    <p className="forecast-condition-small">{data.description}</p>
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
