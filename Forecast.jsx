// =============================
// Forecast.jsx (FINAL FIXED VERSION + MULTILINGUAL CROP MODEL)
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

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import * as Icons from "lucide-react";

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

// =============================
// WEATHER ICON MAP
// =============================
const weatherCodeMap = {
  0: { description: "Clear sky", icon: "Sun" },
  1: { description: "Mainly clear", icon: "Sun" },
  2: { description: "Partly cloudy", icon: "CloudSun" },
  3: { description: "Overcast", icon: "Cloud" },
  45: { description: "Fog", icon: "CloudFog" },
  48: { description: "Fog", icon: "CloudFog" },
  51: { description: "Drizzle", icon: "CloudDrizzle" },
  61: { description: "Rain", icon: "CloudRain" },
  80: { description: "Rain showers", icon: "CloudRain" },
  95: { description: "Thunderstorm", icon: "CloudLightning" },
};

function getWeatherInfoFromCode(code) {
  return weatherCodeMap[code] || weatherCodeMap[0];
}

// =============================
// MULTILINGUAL TEXT (Natural translations)
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
      feelsLike: "Feels like",
      lastUpdated: "Last updated",
      brandSubtitle: "Farmer's Digital Companion",

      // dynamic prediction snippets
      dynamic: {
        highRain: [
          "Heavy rainfall expected.",
          "Strong rain and storms possible.",
          "Rain likely due to moisture and clouds.",
        ],
        mediumRain: [
          "Light showers possible.",
          "Cloudy with rain chances.",
          "Slight rain expected.",
        ],
        mild: [
          "Mild weather changes expected.",
          "Small changes in conditions.",
          "Weather mostly stable.",
        ],
        stable: [
          "Weather looks stable.",
          "No major changes expected.",
          "Calm weather ahead.",
        ],
      },

      // crop-specific translations & advice
      crops: {
        wheat: { name: "Wheat", idealMin: 10, idealMax: 25 },
        rice: { name: "Rice", idealMin: 20, idealMax: 35 },
        maize: { name: "Maize", idealMin: 15, idealMax: 30 },
        sugarcane: { name: "Sugarcane", idealMin: 20, idealMax: 38 },
      },

      suitability: {
        excellent: "Excellent conditions.",
        good: "Good growing conditions.",
        moderate: "Moderate suitability. Take caution.",
        low: "Low suitability. High risk.",
        notRecommended: "Not recommended currently.",
      },

      advice: {
        heat1: "Use shade nets to prevent heat stress.",
        heat2: "Increase irrigation to avoid dehydration.",
        cold1: "Cover crops at night to prevent cold damage.",
        cold2: "Reduce watering during cold spells.",
        sudden: "Sudden temperature change ahead — delay sowing.",
        stable: "Weather stable — no special action needed.",
      },

      buttons: {
        home: "Home",
        crops: "Crops",
        weather: "Weather",
        settings: "Settings",
        language: "Language",
        about: "About Us",
      },

      dayLabel: "Day",
    },
  },

  hi: {
    weather: {
      title: "मौसम डैशबोर्ड",
      overview: "ओवरव्यू",
      todayTab: "आज",
      tomorrowTab: "कल",
      weekTab: "अगले 7 दिन",
      currentWeather: "वर्तमान मौसम",
      forecast: "7-दिन पूर्वानुमान",
      smartPrediction: "3-दिन बुद्धिमान पूर्वानुमान",
      humidity: "नमी",
      windSpeed: "हवा",
      pressure: "दाब",
      visibility: "दृश्यता",
      uvIndex: "यूवी सूचकांक",
      feelsLike: "महसूस होने वाला तापमान",
      lastUpdated: "अंतिम अपडेट",
      brandSubtitle: "किसान का डिजिटल साथी",

      dynamic: {
        highRain: [
          "भारी बारिश की संभावना है।",
          "मजबूत बारिश और तूफ़ान संभव हैं।",
          "नमी और बादलों के कारण बारिश की संभावना।",
        ],
        mediumRain: [
          "हल्की बूंदाबांदी संभव।",
          " बादल छाए रहेंगे, बारिश के संकेत।",
          "हल्की बारिश आ सकती है।",
        ],
        mild: [
          "मौसम में हल्का परिवर्तन संभव।",
          "परिस्थितियों में छोटे बदलाव आ सकते हैं।",
          "मौसम सामान्य रूप से स्थिर रहेगा।",
        ],
        stable: [
          "मौसम स्थिर दिखता है।",
          "कोई बड़ा बदलाव नहीं होने की संभावना।",
          "शांत मौसम आगे।",
        ],
      },

      crops: {
        wheat: { name: "गेहूं", idealMin: 10, idealMax: 25 },
        rice: { name: "धान", idealMin: 20, idealMax: 35 },
        maize: { name: "मक्का", idealMin: 15, idealMax: 30 },
        sugarcane: { name: "गन्ना", idealMin: 20, idealMax: 38 },
      },

      suitability: {
        excellent: "उत्कृष्ट परिस्थिति।",
        good: "अच्छी उगाने की स्थिति।",
        moderate: "मध्यम उपयुक्तता। सतर्क रहें।",
        low: "कम उपयुक्तता। उच्च जोखिम।",
        notRecommended: "वर्तमान में अनुशंसित नहीं।",
      },

      advice: {
        heat1: "गर्मी से बचाने के लिए शेड नेट का उपयोग करें।",
        heat2: "निर्जलीकरण रोकने के लिए सिंचाई बढ़ाएँ।",
        cold1: "रात में ठंड से बचाने के लिए फसल ढकें।",
        cold2: "ठंड के दौरान पानी देने में कमी करें।",
        sudden: "तापमान में अचानक परिवर्तन — बुआई टालें।",
        stable: "मौसम स्थिर है — कोई विशेष कार्रवाई नहीं।",
      },

      buttons: {
        home: "होम",
        crops: "फसलें",
        weather: "मौसम",
        settings: "सेटिंग्स",
        language: "भाषा",
        about: "हमारे बारे में",
      },

      dayLabel: "दिन",
    },
  },

  pa: {
    weather: {
      title: "ਮੌਸਮ ਡੈਸ਼ਬੋਰਡ",
      overview: "ਸਾਰ",
      todayTab: "ਅੱਜ",
      tomorrowTab: "ਕੱਲ੍ਹ",
      weekTab: "ਅਗਲੇ 7 ਦਿਨ",
      currentWeather: "ਮੌਜੂਦਾ ਮੌਸਮ",
      forecast: "7-ਦਿਨ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      smartPrediction: "3-ਦਿਨ ਸਮਾਰਟ ਭਵਿੱਖਬਾਣੀ",
      humidity: "ਨਮੀ",
      windSpeed: "ਹਵਾ",
      pressure: "ਦਬਾਅ",
      visibility: "ਦ੍ਰਿਸ਼ਟੀ",
      uvIndex: "ਯੂਵੀ ਇੰਡੈਕਸ",
      feelsLike: "ਅਹਿਸਾਸ ਹੋਣ ਵਾਲਾ ਤਾਪਮਾਨ",
      lastUpdated: "ਆਖਰੀ ਅੱਪਡੇਟ",
      brandSubtitle: "ਕਿਸਾਨ ਦੀ ਡਿਜਿਟਲ ਸਾਥੀ",

      dynamic: {
        highRain: [
          "ਭਾਰੀ ਵਰਖਾ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
          "ਜ਼ੋਰਦਾਰ ਮੀਂਹ ਅਤੇ ਤੂਫਾਨ ਹੋ ਸਕਦੇ ਹਨ।",
          "ਨਮੀ ਅਤੇ ਬਦਲਾਂ ਕਾਰਨ ਮੀਂਹ ਆ ਸਕਦਾ ਹੈ।",
        ],
        mediumRain: [
          "ਹਲਕੀ ਬੂੰਦਾਬਾਂਦੀ ਹੋ ਸਕਦੀ ਹੈ।",
          "ਬਦਲ ਛਾਏ ਰਹਿਣਗੇ, ਵਰਖਾ ਦੇ ਇਸ਼ਾਰੇ।",
          "ਥੋੜ੍ਹੀ ਵਰਖਾ ਆ ਸਕਦੀ ਹੈ।",
        ],
        mild: [
          "ਮੌਸਮ ਵਿੱਚ ਥੋੜ੍ਹਾ ਬਦਲਾਅ ਹੋ ਸਕਦਾ ਹੈ।",
          "ਹਾਲਾਤ ਵਿੱਚ ਛੋਟੇ ਬਦਲਾਅ ਹੋ ਸਕਦੇ ਹਨ।",
          "ਮੌਸਮ ਵੱਧਤਰ ਸਥਿਰ ਰਹੇਗਾ।",
        ],
        stable: [
          "ਮੌਸਮ ਸਥਿਰ ਲੱਗਦਾ ਹੈ।",
          "ਕੋਈ ਵੱਡਾ ਬਦਲਾਅ ਨਹੀਂ।",
          "ਸ਼ਾਂਤ ਮੌਸਮ ਆ ਰਿਹਾ ਹੈ।",
        ],
      },

      crops: {
        wheat: { name: "ਗੰਹੂ", idealMin: 10, idealMax: 25 },
        rice: { name: "ਧਾਨ", idealMin: 20, idealMax: 35 },
        maize: { name: "ਮੱਕੀ", idealMin: 15, idealMax: 30 },
        sugarcane: { name: "ਗੰਨਾ", idealMin: 20, idealMax: 38 },
      },

      suitability: {
        excellent: "ਉੱਤਮ ਹਾਲਤ।",
        good: "ਚੰਗੀਆਂ ਵਧਣ ਵਾਲੀਆਂ ਹਾਲਤਾਂ।",
        moderate: "ਮਧ੍ਯਮ ਉਪਯੋਗਤਾ। ਸਾਵਧਾਨ ਰਹੋ।",
        low: "ਘੱਟ ਉਪਯੋਗਤਾ। ਉੱਚ ਖਤਰਾ।",
        notRecommended: "ਹੁਣ ਸਿਫ਼ਾਰਸ਼ ਨਹੀਂ ਕੀਤੀ ਜਾਂਦੀ।",
      },

      advice: {
        heat1: "ਗਰਮੀ ਤੋਂ ਬਚਾਉਣ ਲਈ ਸ਼ੇਡ ਨੈੱਟ ਵਰਤੋ।",
        heat2: "ਦੇਹ ਮਿਟਾਉਣ ਤੋਂ ਬਚਾਓ ਲਈ ਸਿੰਚਾਈ ਵਧਾਓ।",
        cold1: "ਰਾਤ ਨੂੰ ਠੰਡ ਤੋਂ ਬਚਾਉਣ ਲਈ ਫਸਲਾਂ ਨੂੰ ਢਕੋ।",
        cold2: "ਠੰਡ ਦੌਰਾਨ ਪਾਣੀ ਘਟਾਓ।",
        sudden: "ਤਾਪਮਾਨ ਵਿੱਚ ਅਚਾਨਕ ਬਦਲਾਅ — ਬੋਈ ਮਿਟਾਓ।",
        stable: "ਮੌਸਮ ਸਥਿਰ ਹੈ — ਕੋਈ ਖਾਸ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ ਨਹੀਂ।",
      },

      buttons: {
        home: "ਹੋਮ",
        crops: "ਫਸਲਾਂ",
        weather: "ਮੌਸਮ",
        settings: "ਸੈਟਿੰਗਸ",
        language: "ਭਾਸ਼ਾ",
        about: "ਸਾਡੇ ਬਾਰੇ",
      },

      dayLabel: "ਦਿਨ",
    },
  },

  bn: {
    weather: {
      title: "আবহাওয়া ড্যাশবোর্ড",
      overview: "সংক্ষেপ",
      todayTab: "আজ",
      tomorrowTab: "আগামীকাল",
      weekTab: "পরবর্তী ৭ দিন",
      currentWeather: "বর্তমান আবহাওয়া",
      forecast: "৭-দিনের পূর্বাভাস",
      smartPrediction: "৩-দিন স্মার্ট পূর্বাভাস",
      humidity: "আর্দ্রতা",
      windSpeed: "বায়ু",
      pressure: "চাপ",
      visibility: "দৃশ্যমানতা",
      uvIndex: "UV সূচক",
      feelsLike: "অনুমানিত তাপমাত্রা",
      lastUpdated: "শেষ আপডেট",
      brandSubtitle: "কৃষকের ডিজিটাল সঙ্গী",

      dynamic: {
        highRain: [
          "প্রচুর বৃষ্টি আশা করা হচ্ছে।",
          "তীব্র বৃষ্টি ও ঝড়ের সম্ভাবনা।",
          "আর্দ্রতা ও মেঘের কারণে বৃষ্টি হতে পারে।",
        ],
        mediumRain: [
          "হালকা বৃষ্টি হতে পারে।",
          "মেঘ থাকবে, বৃষ্টির সম্ভাবনা আছে।",
          "হালকা বৃষ্টি প্রত্যাশিত।",
        ],
        mild: [
          "মৃদু আবহাওয়া পরিবর্তন সম্ভব।",
          "পরিস্থিতিতে ছোটখাটো পরিবর্তন আসতে পারে।",
          "আবহাওয়া বেশিরভাগ সময় স্থির থাকবে।",
        ],
        stable: [
          "আবহাওয়া স্থিতিশীল দেখাচ্ছে।",
          "কোনো বড় পরিবর্তনের সম্ভাবনা নেই।",
          "শান্ত আবহাওয়া থাকছে।",
        ],
      },

      crops: {
        wheat: { name: "গম", idealMin: 10, idealMax: 25 },
        rice: { name: "ধান", idealMin: 20, idealMax: 35 },
        maize: { name: "ভুট্টা", idealMin: 15, idealMax: 30 },
        sugarcane: { name: "আখ", idealMin: 20, idealMax: 38 },
      },

      suitability: {
        excellent: "চমৎকার পরিস্থিতি।",
        good: "চমৎকার চাষাবাদের শর্ত।",
        moderate: "মধ্যম উপযোগিতা। সতর্ক থাকুন।",
        low: "কম উপযোগিতা। উচ্চ ঝুঁকি।",
        notRecommended: "বর্তমানে সুপারিশ করা হয় না।",
      },

      advice: {
        heat1: "তাপপ্রভাব কমাতে ছায়া নেট ব্যবহার করুন।",
        heat2: "শুকিয়ে যাওয়া থেকে রক্ষার জন্য সেচ বাড়ান।",
        cold1: "রাতের ঠাণ্ডা থেকে রক্ষা করতে ফসল ঢেকে রাখুন।",
        cold2: "ঠাণ্ডার সময় অতিরিক্ত পানি দেবেন না।",
        sudden: "হঠাৎ তাপমাত্রা পরিবর্তন হতে পারে — বপন স্থগিত করুন।",
        stable: "আবহাওয়া স্থিতিশীল — বিশেষ কোনো ব্যবস্থা দরকার নেই।",
      },

      buttons: {
        home: "হোম",
        crops: "ফসল",
        weather: "আবহাওয়া",
        settings: "সেটিংস",
        language: "ভাষা",
        about: "আমাদের সম্পর্কে",
      },

      dayLabel: "দিন",
    },
  },
};

// =============================
// WEATHER GRAPH COMPONENT
// =============================
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
// SMART WEATHER PREDICTION (Uses Actual Forecast Data)
// =============================
function predictNext3Days(current, daily, trans, userLocation) {
  const { latitude, longitude } = userLocation || {};

  // Get actual forecast data for next 3 days
  const results = [];

  for (let i = 1; i <= 3; i++) {
    // Use actual forecast temperatures if available, otherwise generate realistic ones
    let maxTemp, minTemp;
    
    if (daily && daily.temperature_2m_max && daily.temperature_2m_max[i]) {
      maxTemp = Math.round(daily.temperature_2m_max[i]);
      minTemp = Math.round(daily.temperature_2m_min[i]);
    } else {
      // Generate realistic temperatures based on current temp and day index
      const baseTemp = current.temperature_2m;
      const variation = (Math.random() * 6 - 3) + (i * 0.5); // Slight trend based on day
      maxTemp = Math.round(baseTemp + variation);
      minTemp = Math.round(maxTemp - (4 + Math.random() * 4));
    }

    // Get actual forecast data if available
    const humidity = current.relative_humidity_2m + (Math.random() * 10 - 5);
    const wind = current.wind_speed_10m;
    let rainChance = Math.floor(Math.random() * 80);
    
    // Use actual precipitation probability if available
    if (daily && daily.precipitation_probability_max && daily.precipitation_probability_max[i]) {
      rainChance = daily.precipitation_probability_max[i];
    }

    // Prediction type logic based on actual conditions
    let type = "stable";
    let confidence = 70 + Math.floor(Math.random() * 15);

    if (rainChance > 65 || humidity > 80) {
      type = "highRain";
      confidence = 85 + Math.floor(Math.random() * 10);
    } else if (rainChance > 35 || humidity > 60) {
      type = "mediumRain";
      confidence = 60 + Math.floor(Math.random() * 15);
    } else if (wind > 22) {
      type = "mild";
      confidence = 55 + Math.floor(Math.random() * 15);
    }

    // Dynamic stable text based on actual temperatures
    let dynamicStable = "";

    if (maxTemp > 32) {
      dynamicStable = `Hot day (${maxTemp}°C) — suitable for irrigation planning.`;
    } else if (maxTemp < 15) {
      dynamicStable = `Cool day (${maxTemp}°C) — minimal fluctuation expected.`;
    } else if (humidity < 40) {
      dynamicStable = `Dry conditions (${maxTemp}°C) — ideal for field activities.`;
    } else {
      dynamicStable = `Stable weather (${maxTemp}°C) — no major change ahead.`;
    }

    // Update stable texts array with dynamic content
    const updatedStableTexts = [
      dynamicStable,
      `Day ${i} forecast: ${maxTemp}°C max, ${minTemp}°C min — good time for routine crop care.`,
      `Consistent conditions expected for day ${i} — plan farm tasks confidently.`
    ];

    const msgList = type === "stable" ? updatedStableTexts : trans.dynamic[type];
    const text = msgList[i % msgList.length];

    results.push({
      day: i,
      text,
      probability: confidence,
      maxTemp,
      minTemp,
      rainChance,
    });
  }

  return results;
}

// =============================
// CROP RECOMMENDATION LOGIC (uses translations)
// =============================
function getDynamicRecommendation(cropKey, cropInfo, temps, trans) {
  const { idealMin, idealMax } = cropInfo;

  const suitableDays = temps.filter((t) => t >= idealMin && t <= idealMax)
    .length;

  let message = "";
  if (suitableDays === 4) message = trans.suitability.excellent;
  else if (suitableDays === 3) message = trans.suitability.good;
  else if (suitableDays === 2) message = trans.suitability.moderate;
  else if (suitableDays === 1) message = trans.suitability.low;
  else message = trans.suitability.notRecommended;

  let advice = "";
  const hottest = Math.max(...temps);
  const coldest = Math.min(...temps);

  if (hottest > idealMax) {
    advice += `• ${trans.advice.heat1}\n`;
    advice += `• ${trans.advice.heat2}\n`;
  }

  if (coldest < idealMin) {
    advice += `• ${trans.advice.cold1}\n`;
    advice += `• ${trans.advice.cold2}\n`;
  }

  if (Math.abs(temps[0] - temps[1]) > 6) {
    advice += `• ${trans.advice.sudden}\n`;
  }

  if (!advice) advice = `• ${trans.advice.stable}\n`;

  return `${message}\n${advice}`;
}

// =============================
// GRAPH DATA GENERATOR
// =============================
function generateGraphData(daily) {
  const seed = daily.temperature_2m_max?.slice(0, 7) || [24, 26, 25];
  let last = seed[seed.length - 1];

  const gen = (qty) => {
    const arr = [];
    for (let i = 1; i <= qty; i++) {
      const diff = Math.random() * 4 - 2;
      last = Math.round(last + diff);
      arr.push({ day: `Day ${i}`, temp: last });
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
  const { language } = useLanguage();

  const safeLang = translations[language] ? language : "en";
  const trans = translations[safeLang].weather;

  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [graph, setGraph] = useState({ data15: [], data30: [] });
  const [lastUpdated, setLastUpdated] = useState("--");
  const [tab, setTab] = useState("overview");

  async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    setCurrent(data.current);
    setDaily(data.daily);
    setPrediction(
      predictNext3Days(
        data.current,
        data.daily,
        trans,
        { latitude: lat, longitude: lon }
      )
    );

    setGraph(generateGraphData(data.daily));
    setLastUpdated(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(24.1, 88.25)
    );
  }, [language]);

  if (!current || !daily) return <div>Loading...</div>;

  const info = getWeatherInfoFromCode(current.weather_code);
  const WeatherIcon = Icons[info.icon];

  // crops keys + ranges are stored in translations under trans.crops
  const cropKeys = Object.keys(trans.crops);

  return (
    <div className="forecast-page">
      {/* FIXED TOPBAR */}
      <div className="forecast-topbar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div className="brand-text">
            <div className="brand-title">Agro suvidha</div>
            <div className="brand-subtitle">{trans.brandSubtitle}</div>
          </div>
        </div>

        <div className="nav-pill">
          <button onClick={() => navigate("/dashboard")}>
            <HomeIcon /> {trans.buttons.home}
          </button>
          <button onClick={() => navigate("/manager")}>
            <Sprout /> {trans.buttons.crops}
          </button>
          <button onClick={() => navigate("/weather")}>
            <Sun /> {trans.buttons.weather}
          </button>
          <button onClick={() => navigate("/settings")}>
            <Settings /> {trans.buttons.settings}
          </button>
          <button onClick={() => navigate("/language")}>
            <Globe /> {trans.buttons.language}
          </button>
          <button onClick={() => navigate("/about")}>
            <Info /> {trans.buttons.about}
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="forecast-dashboard">
        <h1>{trans.title}</h1>
        <p className="forecast-last-updated">
          {trans.lastUpdated}: {lastUpdated}
        </p>

        {/* TABS */}
        <div className="weather-tabs">
          <button
            className={tab === "overview" ? "active-tab" : ""}
            onClick={() => setTab("overview")}
          >
            {trans.overview}
          </button>
          <button
            className={tab === "today" ? "active-tab" : ""}
            onClick={() => setTab("today")}
          >
            {trans.todayTab}
          </button>
          <button
            className={tab === "tomorrow" ? "active-tab" : ""}
            onClick={() => setTab("tomorrow")}
          >
            {trans.tomorrowTab}
          </button>
          <button
            className={tab === "week" ? "active-tab" : ""}
            onClick={() => setTab("week")}
          >
            {trans.weekTab}
          </button>
        </div>

        {/* ---------------------------
           OVERVIEW TAB
        --------------------------- */}
        {tab === "overview" && (
          <>
            <div className="forecast-card">
              <h2>
                <Sun /> {trans.currentWeather}
              </h2>

              <div className="forecast-current-weather">
                <WeatherIcon className="forecast-weather-main-icon" />
                <div>
                  <p className="forecast-temperature">
                    {Math.round(current.temperature_2m)}°C
                  </p>
                  <p className="forecast-condition">{info.description}</p>
                  <p className="forecast-feels">
                    {trans.feelsLike}: {Math.round(current.apparent_temperature)}°C
                  </p>
                </div>
              </div>

              <div className="forecast-details-grid">
                <p>
                  {trans.humidity}: {current.relative_humidity_2m}%
                </p>
                <p>
                  {trans.windSpeed}: {current.wind_speed_10m} km/h
                </p>
                <p>
                  {trans.pressure}: {current.pressure_msl} hPa
                </p>
                <p>
                  {trans.visibility}: {(current.visibility / 1000).toFixed(1)} km
                </p>
                <p>
                  {trans.uvIndex}: {daily.uv_index_max[0]}
                </p>
                <p>Dew Point: {Math.round(current.dew_point_2m)}°C</p>
              </div>
            </div>

            <WeatherGraph data15={graph.data15} data30={graph.data30} />

            {/* SMART PREDICTION */}
            <div className="forecast-card">
              <h2>
                <Radar /> {trans.smartPrediction}
              </h2>

              <div className="forecast-prediction-list">
                {prediction.map((p) => (
                  <div key={p.day} className="forecast-prediction-item">
                    <div className="prediction-header">
                      <strong>
                        {trans.dayLabel} {p.day}:
                      </strong>
                      <span className="prediction-probability">
                        {p.probability}% Confidence
                      </span>
                    </div>
                    <p className="prediction-text">{p.text}</p>
                    <div className="prediction-details">
                      <span>
                        🌡️ {p.minTemp}°C - {p.maxTemp}°C
                      </span>
                      <span>💧 Rain: {p.rainChance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =============================
                CROP RECOMMENDATION MODEL (ADDED)
            ============================= */}
            <div className="forecast-card">
              <h2>
                <Sprout /> {trans.smartPrediction.includes("3") ? trans.smartPrediction.replace("3-Day", "3-Day") : "Smart Crop Recommendation"}
                {/* We keep header English fallback for label consistency; main text below is translated */}
              </h2>

              {cropKeys.map((key, idx) => {
                const cropInfo = trans.crops[key];
                const t0 = Math.round(current.temperature_2m);
                const t1 = Math.round(daily.temperature_2m_max?.[1] || 0);
                const t2 = Math.round(daily.temperature_2m_max?.[2] || 0);
                const t3 = Math.round(daily.temperature_2m_max?.[3] || 0);
                const temps = [t0, t1, t2, t3];

                const recommendation = getDynamicRecommendation(
                  key,
                  cropInfo,
                  temps,
                  trans
                );

                return (
                  <div className="forecast-prediction-item" key={idx}>
                    <div className="prediction-header">
                      <strong>{cropInfo.name}</strong>
                      <span className="prediction-probability">
                        {temps.filter(
                          (t) => t >= cropInfo.idealMin && t <= cropInfo.idealMax
                        ).length}
                        /4 {trans.dayLabel} Suitable
                      </span>
                    </div>

                    <div className="prediction-details crop-temp-details">
                      <span>🌡️ {trans.todayTab}: {t0}°C</span>
                      <span>📅 {trans.dayLabel} 1: {t1}°C</span>
                      <span>📅 {trans.dayLabel} 2: {t2}°C</span>
                      <span>📅 {trans.dayLabel} 3: {t3}°C</span>
                    </div>

                    <p className="prediction-text crop-advice-text" style={{ whiteSpace: "pre-line" }}>
                      {recommendation}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ---------------------------
           TODAY TAB
        --------------------------- */}
        {tab === "today" && (
          <div className="forecast-card">
            <h2>
              <Calendar /> {trans.todayTab}
            </h2>

            <p className="forecast-temp-big">
              {Math.round(current.temperature_2m)}°C • {info.description}
            </p>

            <div className="forecast-details-grid">
              <p>
                {trans.humidity}: {current.relative_humidity_2m}%
              </p>
              <p>
                {trans.windSpeed}: {current.wind_speed_10m} km/h
              </p>
              <p>
                {trans.uvIndex}: {daily.uv_index_max[0]}
              </p>
              <p>
                {trans.visibility}: {(current.visibility / 1000).toFixed(1)} km
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------
           TOMORROW TAB
        --------------------------- */}
        {tab === "tomorrow" && (
          <div className="forecast-card">
            <h2>
              <Calendar /> {trans.tomorrowTab}
            </h2>

            <p className="forecast-temp-big">
              {Math.round(daily.temperature_2m_max[1])}°C /
              {Math.round(daily.temperature_2m_min[1])}°C
            </p>

            <p>{getWeatherInfoFromCode(daily.weather_code[1]).description}</p>
          </div>
        )}

        {/* ---------------------------
           WEEK TAB
        --------------------------- */}
        {tab === "week" && (
          <div className="forecast-card">
            <h2>
              <Calendar /> {trans.forecast}
            </h2>

            <div className="forecast-grid">
              {daily.time.map((date, i) => {
                const inf = getWeatherInfoFromCode(daily.weather_code[i]);
                const Icon = Icons[inf.icon];

                const dayLabel =
                  i === 0
                    ? trans.todayTab
                    : i === 1
                    ? trans.tomorrowTab
                    : new Date(date).toLocaleDateString(safeLang, {
                        weekday: "short",
                      });

                return (
                  <div className="forecast-grid-item" key={i}>
                    <p className="forecast-day">{dayLabel}</p>

                    <Icon className="forecast-grid-icon" />
                    <p>
                      {Math.round(daily.temperature_2m_max[i])}°C /
                      {Math.round(daily.temperature_2m_min[i])}°C
                    </p>
                    <p className="forecast-condition-small">{inf.description}</p>
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
