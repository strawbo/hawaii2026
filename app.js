// ===== Kauai 2026 Trip Planner =====
// Hyper-local hourly weather for key Kauai locations

const TRIP_START = '2026-04-12';
const TRIP_END = '2026-04-19';
const TIMEZONE = 'Pacific/Honolulu';

// Key locations with precise coordinates
const LOCATIONS = [
    {
        id: 'poipu',
        name: 'Poipu Beach',
        area: 'South Shore',
        lat: 21.8744,
        lon: -159.4535,
        desc: 'Home base — snorkeling, sea turtles, monk seals',
        coastal: true,
    },
    {
        id: 'shipwreck',
        name: 'Shipwreck Beach',
        area: 'South Shore',
        lat: 21.8691,
        lon: -159.4439,
        desc: 'Dramatic cliffs, bodyboarding, Mahaulepu Trail',
        coastal: true,
    },
    {
        id: 'salt-pond',
        name: 'Salt Pond Beach',
        area: 'West Side',
        lat: 21.9069,
        lon: -159.6636,
        desc: 'Calm protected cove — great for kids, tide pools',
        coastal: true,
    },
    {
        id: 'polihale',
        name: 'Polihale State Park',
        area: 'West Side',
        lat: 22.0764,
        lon: -159.7636,
        desc: '17-mile beach, Na Pali views, remote & stunning',
        coastal: true,
    },
    {
        id: 'waimea-canyon',
        name: 'Waimea Canyon',
        area: 'West Side',
        lat: 22.0389,
        lon: -159.6600,
        desc: 'Grand Canyon of the Pacific — jaw-dropping lookouts',
        coastal: false,
    },
    {
        id: 'sleeping-giant',
        name: 'Sleeping Giant (Nounou)',
        area: 'East Side',
        lat: 22.0500,
        lon: -159.3500,
        desc: 'Moderate hike with panoramic island views',
        coastal: false,
    },
    {
        id: 'lydgate',
        name: 'Lydgate Beach',
        area: 'East Side',
        lat: 22.0397,
        lon: -159.3397,
        desc: 'Protected lava-rock pools — easy snorkeling for all ages',
        coastal: true,
    },
    {
        id: 'kapaa',
        name: 'Kapa\'a Town & Bike Path',
        area: 'East Side',
        lat: 22.0881,
        lon: -159.3219,
        desc: 'Shops, food, coastal bike path',
        coastal: true,
    },
    {
        id: 'hanalei',
        name: 'Hanalei Bay',
        area: 'North Shore',
        lat: 22.2087,
        lon: -159.5030,
        desc: 'Iconic crescent bay — swimming, SUP, stunning mountains',
        coastal: true,
    },
    {
        id: 'tunnels',
        name: 'Tunnels Beach (Makua)',
        area: 'North Shore',
        lat: 22.2194,
        lon: -159.5694,
        desc: 'Premier snorkeling — massive reef, crystal clear',
        coastal: true,
    },
];

// Time blocks for weather comparison
const TIME_BLOCKS = [
    { label: 'Morning', hours: [8, 9, 10, 11] },
    { label: 'Midday', hours: [11, 12, 13, 14] },
    { label: 'Afternoon', hours: [14, 15, 16, 17, 18] },
];

// Special day notes (non-weather info)
const DAY_NOTES = {
    '2026-04-12': { title: 'Arrival Day', note: 'Flight lands 9:29 PM. Pick up rental car, 30 min drive to Waiohai in Poipu.' },
    '2026-04-18': { title: 'Move to Princeville', note: 'Check out of Waiohai in the morning. Drive to Princeville Airbnb (~1 hr). Based on the North Shore tonight.' },
    '2026-04-19': { title: 'Last Day — Late Flight', note: 'Check out of Princeville Airbnb. Flight departs LIH at 10:29 PM — full day to enjoy! Allow 45 min drive from Princeville to airport.' },
};

// Compute average score for a location during a time block on a given date
function scoreBlock(locId, dateStr, hourRange) {
    const hours = weatherData[locId] || [];
    const matching = hours.filter(h => {
        if (!h.time.startsWith(dateStr)) return false;
        const hr = parseInt(h.time.split('T')[1].split(':')[0]);
        return hourRange.includes(hr);
    });
    if (matching.length === 0) return null;
    const scores = matching.map(h => scoreHour(h));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Get representative weather for a location during a time block
function blockWeather(locId, dateStr, hourRange) {
    const hours = weatherData[locId] || [];
    const matching = hours.filter(h => {
        if (!h.time.startsWith(dateStr)) return false;
        const hr = parseInt(h.time.split('T')[1].split(':')[0]);
        return hourRange.includes(hr);
    });
    if (matching.length === 0) return null;
    // Use the middle hour as representative
    const mid = matching[Math.floor(matching.length / 2)];
    const avgTemp = Math.round(matching.reduce((s, h) => s + h.temp, 0) / matching.length);
    const avgWind = Math.round(matching.reduce((s, h) => s + h.wind, 0) / matching.length);
    const avgSun = Math.round(100 - matching.reduce((s, h) => s + h.clouds, 0) / matching.length);
    const totalPrecip = matching.reduce((s, h) => s + (h.precip || 0), 0);
    return { code: mid.code, temp: avgTemp, wind: avgWind, sun: avgSun, precip: totalPrecip };
}

// ===== Weather API =====

const WEATHER_PARAMS = [
    'temperature_2m',
    'apparent_temperature',
    'precipitation',
    'precipitation_probability',
    'cloudcover',
    'windspeed_10m',
    'windgusts_10m',
    'weathercode',
    'uv_index',
].join(',');

async function fetchWeatherForLocation(loc) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}`
        + `&hourly=${WEATHER_PARAMS}`
        + `&temperature_unit=fahrenheit&windspeed_unit=mph`
        + `&timezone=${TIMEZONE}&forecast_days=10`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Weather fetch failed for ${loc.name}`);
    return res.json();
}

async function fetchOceanTemp() {
    // Use a south shore point for ocean temp
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=21.87&longitude=-159.45`
        + `&hourly=wave_height,wave_period,wave_direction`
        + `&daily=wave_height_max,wave_direction_dominant`
        + `&timezone=${TIMEZONE}&forecast_days=10`;
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// ===== Weather Utilities =====

function weatherIcon(code, isDay = true) {
    // WMO weather codes → emoji
    const icons = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌧️',
        56: '🌧️', 57: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        66: '🌧️', 67: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '🌨️',
        77: '🌨️',
        80: '🌦️', 81: '🌧️', 82: '🌧️',
        85: '🌨️', 86: '🌨️',
        95: '⛈️', 96: '⛈️', 99: '⛈️',
    };
    return icons[code] || '🌤️';
}

function weatherDesc(code) {
    const descs = {
        0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Fog',
        51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
        61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
        80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
        95: 'Thunderstorm', 96: 'Thunderstorm + hail',
    };
    return descs[code] || 'Fair';
}

// Score 0–100: how good is this hour for outdoor activities?
// Weighted: sunshine (35%), rain (30%), temperature (20%), wind (15%)
function scoreHour(hourData) {
    // --- Sunshine score (0–100): inverse of cloud cover ---
    const sunScore = 100 - hourData.clouds;

    // --- Rain score (0–100): based on ACTUAL precipitation, not just probability ---
    // Open-Meteo precipitation_probability is often inflated for tropical islands.
    // We use actual precipitation amount as the primary signal, with probability as a modifier.
    let rainScore = 100;
    const precip = hourData.precip || 0;
    const prob = hourData.precipProb || 0;

    if (precip >= 2.0) {
        // Heavy rain (>2mm/hr) — bad
        rainScore = 10;
    } else if (precip >= 0.5) {
        // Moderate rain — noticeable
        rainScore = 35;
    } else if (precip >= 0.2) {
        // Light drizzle — barely matters for most activities
        rainScore = 70;
    } else if (precip > 0) {
        // Trace — negligible
        rainScore = 90;
    } else {
        // No actual precipitation — only mild penalty if high probability
        // (this handles the "45% prob but 0mm" case from Open-Meteo)
        if (prob >= 70) rainScore = 75;
        else if (prob >= 50) rainScore = 85;
        else rainScore = 100;
    }

    // --- Temperature score (0–100): ideal 75–85°F ---
    let tempScore = 100;
    const temp = hourData.temp;
    if (temp >= 75 && temp <= 85) {
        tempScore = 100;
    } else if (temp < 75) {
        tempScore = Math.max(0, 100 - (75 - temp) * 5);
    } else {
        tempScore = Math.max(0, 100 - (temp - 85) * 8);
    }

    // --- Wind score (0–100) ---
    let windScore = 100;
    const wind = hourData.wind;
    if (wind <= 8) windScore = 100;
    else if (wind <= 12) windScore = 85;
    else if (wind <= 18) windScore = 65;
    else if (wind <= 25) windScore = 40;
    else windScore = 15;

    // Weighted composite
    const composite = (sunScore * 0.35) + (rainScore * 0.30) + (tempScore * 0.20) + (windScore * 0.15);
    return Math.max(0, Math.min(100, Math.round(composite)));
}

function scoreLabel(score) {
    if (score >= 75) return { text: 'Great', cls: 'score-great' };
    if (score >= 50) return { text: 'Good', cls: 'score-good' };
    return { text: 'Fair', cls: 'score-fair' };
}


// ===== Data Processing =====

function parseHourlyData(json) {
    const h = json.hourly;
    const hours = [];
    for (let i = 0; i < h.time.length; i++) {
        hours.push({
            time: h.time[i],
            temp: h.temperature_2m[i],
            feelsLike: h.apparent_temperature[i],
            precip: h.precipitation[i],
            precipProb: h.precipitation_probability[i],
            clouds: h.cloudcover[i],
            wind: h.windspeed_10m[i],
            gusts: h.windgusts_10m[i],
            code: h.weathercode[i],
            uv: h.uv_index[i],
        });
    }
    return hours;
}

function getHoursForDate(hours, dateStr) {
    return hours.filter(h => h.time.startsWith(dateStr));
}

function getDaytimeHours(dayHours) {
    // 8 AM to 8 PM Hawaii time
    return dayHours.filter(h => {
        const hour = parseInt(h.time.split('T')[1].split(':')[0]);
        return hour >= 8 && hour <= 20;
    });
}

// Sunrise/sunset times for Kauai in mid-April (approximate, varies by ~1 min/day)
const SUN_TIMES = {
    '2026-04-12': { rise: '6:23', set: '6:51' },
    '2026-04-13': { rise: '6:22', set: '6:51' },
    '2026-04-14': { rise: '6:21', set: '6:52' },
    '2026-04-15': { rise: '6:20', set: '6:52' },
    '2026-04-16': { rise: '6:19', set: '6:52' },
    '2026-04-17': { rise: '6:19', set: '6:53' },
    '2026-04-18': { rise: '6:18', set: '6:53' },
    '2026-04-19': { rise: '6:17', set: '6:54' },
};

// Compute average daytime score for a location on a given date
function computeDayScore(locId, dateStr) {
    const hours = weatherData[locId] || [];
    const dayHours = getHoursForDate(hours, dateStr);
    const daytime = getDaytimeHours(dayHours);
    if (daytime.length === 0) return null;
    const scores = daytime.map(h => scoreHour(h));
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg);
}

function scoreRingClass(score) {
    if (score >= 75) return 'score-ring-great';
    if (score >= 50) return 'score-ring-good';
    return 'score-ring-fair';
}

function scoreRingLabel(score) {
    if (score >= 75) return 'Great';
    if (score >= 50) return 'Good';
    return 'Fair';
}

function hourScoreClass(score) {
    if (score >= 75) return 'hour-score-great';
    if (score >= 50) return 'hour-score-good';
    return 'hour-score-fair';
}

// ===== State =====

let weatherData = {}; // locationId -> hourly array
let oceanData = null;
let selectedDate = null;

// ===== Rendering =====

function formatHour(timeStr) {
    const hour = parseInt(timeStr.split('T')[1].split(':')[0]);
    if (hour === 0) return '12a';
    if (hour < 12) return `${hour}a`;
    if (hour === 12) return '12p';
    return `${hour - 12}p`;
}

function getTripDays() {
    const days = [];
    const start = new Date(TRIP_START + 'T00:00:00');
    const end = new Date(TRIP_END + 'T00:00:00');
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateNum = d.getDate();
        days.push({ iso, dayName, dateNum });
    }
    return days;
}

// Home base location for day score: Poipu through Fri, Hanalei for Sat/Sun
function getHomeBase(dateStr) {
    // Apr 18 (Sat) and Apr 19 (Sun) = Princeville/Hanalei
    return (dateStr === '2026-04-18' || dateStr === '2026-04-19') ? 'hanalei' : 'poipu';
}

function renderDayNav() {
    const nav = document.getElementById('dayNav');
    const days = getTripDays();
    const today = getCurrentHawaiiDate();
    const hasData = Object.keys(weatherData).length > 0;

    nav.innerHTML = days.map(d => {
        const isActive = d.iso === selectedDate;
        const isToday = d.iso === today;

        // Day score from home base
        let scoreHtml = '';
        if (hasData) {
            const baseId = getHomeBase(d.iso);
            const dayScore = computeDayScore(baseId, d.iso);
            if (dayScore !== null) {
                const cls = dayScore >= 75 ? 'pill-score-great' : dayScore >= 50 ? 'pill-score-good' : 'pill-score-fair';
                scoreHtml = `<span class="pill-score ${cls}">${dayScore}</span>`;
            }
        }

        return `<button class="day-pill ${isActive ? 'active' : ''}" data-date="${d.iso}">
            <span class="pill-day">${d.dayName}</span>
            <span class="pill-date">${isToday ? 'Today' : 'Apr ' + d.dateNum}</span>
            ${scoreHtml}
        </button>`;
    }).join('');

    nav.querySelectorAll('.day-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDate = btn.dataset.date;
            renderAll();
            // Scroll active pill into view
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });
}

function getCurrentHawaiiDate() {
    return new Date().toLocaleDateString('en-CA', { timeZone: TIMEZONE });
}

function getCurrentHawaiiHour() {
    return parseInt(new Date().toLocaleTimeString('en-US', { timeZone: TIMEZONE, hour12: false, hour: '2-digit' }));
}

function renderRightNow() {
    const container = document.getElementById('rightNowContent');
    const now = getCurrentHawaiiDate();
    const currentHour = getCurrentHawaiiHour();

    // Check if we have weather data
    const hasData = Object.keys(weatherData).length > 0;
    if (!hasData) {
        container.innerHTML = '<div class="loading-pulse">Fetching live weather...</div>';
        return;
    }

    // If trip hasn't started yet, show countdown
    if (now < TRIP_START) {
        const start = new Date(TRIP_START + 'T00:00:00');
        const today = new Date(now + 'T00:00:00');
        const daysUntil = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
        container.innerHTML = `<div class="pre-trip-msg">
            <div class="countdown">${daysUntil} day${daysUntil !== 1 ? 's' : ''} to go!</div>
            <p>Scroll down for the forecast at each location.</p>
        </div>`;
        return;
    }

    // If trip is over
    if (now > TRIP_END) {
        container.innerHTML = `<div class="post-trip-msg">
            <p>Hope you had an amazing trip! 🌺</p>
        </div>`;
        return;
    }

    // During trip: find current conditions at each location and pick the best
    const locScores = LOCATIONS.map(loc => {
        const hours = weatherData[loc.id] || [];
        const currentData = hours.find(h => {
            const hDate = h.time.split('T')[0];
            const hHour = parseInt(h.time.split('T')[1].split(':')[0]);
            return hDate === now && hHour === currentHour;
        });
        if (!currentData) return { loc, score: -1, data: null };
        const score = scoreHour(currentData);
        return { loc, score, data: currentData };
    }).filter(x => x.data).sort((a, b) => b.score - a.score);

    if (locScores.length === 0) {
        container.innerHTML = '<div class="loading-pulse">No current data available</div>';
        return;
    }

    const best = locScores[0];
    const rest = locScores.slice(1);

    let html = `<div class="best-spot-card">
        <div class="best-spot-label">Best spot right now</div>
        <div class="best-spot-name">${best.loc.name}</div>
        <div class="best-spot-area">${best.loc.area}</div>
        <div class="best-spot-conditions">
            <div class="condition-item">
                <span class="condition-icon">${weatherIcon(best.data.code)}</span>
                <span class="condition-value">${Math.round(best.data.temp)}°F</span>
            </div>
            <div class="condition-item">
                <span class="condition-icon">💨</span>
                <span class="condition-value">${Math.round(best.data.wind)}</span>
                <span class="condition-label">mph</span>
            </div>
            <div class="condition-item">
                <span class="condition-icon">☀️</span>
                <span class="condition-value">${100 - best.data.clouds}%</span>
                <span class="condition-label">sun</span>
            </div>
            <div class="condition-item">
                <span class="condition-icon">🌧️</span>
                <span class="condition-value">${best.data.precip > 0 ? best.data.precip.toFixed(1) + 'mm' : '0mm'}</span>
            </div>
            <div class="condition-item">
                <span class="condition-icon">☀️</span>
                <span class="condition-value">UV ${Math.round(best.data.uv)}</span>
            </div>
        </div>
    </div>`;

    // Grid of other locations
    html += '<div class="now-grid">';
    for (const item of rest) {
        const sl = scoreLabel(item.score);
        html += `<div class="now-card">
            <div class="now-card-name">${item.loc.name}</div>
            <div class="now-card-area">${item.loc.area}</div>
            <div class="now-card-weather">
                <span class="now-card-icon">${weatherIcon(item.data.code)}</span>
                <div>
                    <div class="now-card-temp">${Math.round(item.data.temp)}°</div>
                    <div class="now-card-desc">${weatherDesc(item.data.code)}</div>
                </div>
            </div>
            <div class="now-card-detail">💨 ${Math.round(item.data.wind)} mph · ☀️ ${100 - item.data.clouds}% · 🌧️ ${item.data.precip > 0 ? item.data.precip.toFixed(1) + 'mm' : '0mm'}</div>
            <span class="score-badge ${sl.cls}">${sl.text}</span>
        </div>`;
    }
    html += '</div>';

    container.innerHTML = html;
}

function renderOceanBar() {
    const container = document.getElementById('oceanItems');
    // Ocean temp for Kauai in April is typically 75-78°F
    // We show wave data if available, plus estimated ocean temp
    const oceanTemp = '76–78';

    let html = `<div class="ocean-chip">
        <span class="ocean-icon">🌊</span>
        <span class="ocean-temp">${oceanTemp}°F</span>
        <span class="ocean-label">Ocean</span>
    </div>`;

    if (oceanData && oceanData.daily) {
        const dateIdx = oceanData.daily.time.indexOf(selectedDate);
        if (dateIdx >= 0 && oceanData.daily.wave_height_max) {
            const waveMax = oceanData.daily.wave_height_max[dateIdx];
            if (waveMax != null) {
                const waveFt = (waveMax * 3.281).toFixed(1);
                html += `<div class="ocean-chip">
                    <span class="ocean-icon">🏄</span>
                    <span class="ocean-temp">${waveFt} ft</span>
                    <span class="ocean-label">Wave max</span>
                </div>`;
            }
        }
    }

    // Sunrise/sunset for selected date
    const sunTimes = SUN_TIMES[selectedDate] || { rise: '6:20', set: '6:52' };
    html += `<div class="ocean-chip">
        <span class="ocean-icon">🌅</span>
        <span class="ocean-temp">${sunTimes.rise}a</span>
        <span class="ocean-label">Sunrise</span>
    </div>`;
    html += `<div class="ocean-chip">
        <span class="ocean-icon">🌇</span>
        <span class="ocean-temp">${sunTimes.set}p</span>
        <span class="ocean-label">Sunset</span>
    </div>`;

    container.innerHTML = html;
}

function renderItinerary() {
    const titleEl = document.getElementById('itineraryTitle');
    const container = document.getElementById('itineraryContent');
    const hasData = Object.keys(weatherData).length > 0;
    const homeBase = getHomeBase(selectedDate);
    const homeBaseName = homeBase === 'hanalei' ? 'Hanalei' : 'Poipu';

    // Day note (arrival, move day, departure)
    const dayNote = DAY_NOTES[selectedDate];
    const title = dayNote ? dayNote.title : 'Where\'s the Best Weather?';
    titleEl.textContent = title;

    let html = '';

    // Show day note if exists
    if (dayNote) {
        html += `<div class="day-note">${dayNote.note}</div>`;
    }

    if (!hasData) {
        html += '<div class="loading-pulse">Loading weather comparison...</div>';
        container.innerHTML = html;
        return;
    }

    // Arrival day — no weather comparison needed
    if (selectedDate === '2026-04-12') {
        container.innerHTML = html;
        return;
    }

    // For each time block, rank all locations
    html += '<div class="block-list">';

    for (const block of TIME_BLOCKS) {
        // Score every location for this block
        const locScores = LOCATIONS.map(loc => {
            const score = scoreBlock(loc.id, selectedDate, block.hours);
            const weather = blockWeather(loc.id, selectedDate, block.hours);
            return { loc, score, weather };
        }).filter(x => x.score !== null).sort((a, b) => b.score - a.score);

        if (locScores.length === 0) continue;

        const best = locScores[0];
        const homeScore = locScores.find(x => x.loc.id === homeBase);
        const diff = homeScore ? best.score - homeScore.score : 0;

        // If home base is within 5 points of the best, recommend staying
        const stayHome = diff <= 5;
        const recLoc = stayHome ? (homeScore || best) : best;
        const recName = stayHome ? homeBaseName : best.loc.name;
        const recArea = stayHome ? (homeBase === 'hanalei' ? 'North Shore' : 'South Shore') : best.loc.area;

        const ringCls = scoreRingClass(recLoc.score);
        const w = recLoc.weather;

        // Build the runner-up line if there's a notably better spot
        let runnerUpHtml = '';
        if (!stayHome && homeScore) {
            runnerUpHtml = `<div class="block-runner-up">${homeBaseName} is ${homeScore.score} · ${diff} pts better at ${recName}</div>`;
        } else if (stayHome && locScores.length > 1) {
            // Show if everywhere else is similar or worse
            const second = locScores.find(x => x.loc.id !== homeBase) || locScores[1];
            if (second && best.score - second.score <= 3) {
                runnerUpHtml = `<div class="block-runner-up">Similar everywhere — stay close to home</div>`;
            }
        }

        // Show top 3 as comparison dots
        const top3 = locScores.slice(0, 4);
        let comparisonHtml = '<div class="block-comparison">';
        for (const item of top3) {
            const isRec = item.loc.id === recLoc.loc.id;
            comparisonHtml += `<div class="comp-item ${isRec ? 'comp-active' : ''}">
                <span class="comp-score">${item.score}</span>
                <span class="comp-name">${item.loc.name.split('(')[0].split(' Beach')[0].trim()}</span>
            </div>`;
        }
        comparisonHtml += '</div>';

        html += `<div class="block-card">
            <div class="block-header">
                <div class="block-time">${block.label}</div>
                <div class="block-hours">${block.hours[0] > 12 ? (block.hours[0] - 12) : block.hours[0]}${block.hours[0] >= 12 ? 'p' : 'a'}–${block.hours[block.hours.length - 1] > 12 ? (block.hours[block.hours.length - 1] - 12) : block.hours[block.hours.length - 1]}${block.hours[block.hours.length - 1] >= 12 ? 'p' : 'a'}</div>
            </div>
            <div class="block-body">
                <div class="block-score-ring ${ringCls}" data-label="${scoreRingLabel(recLoc.score)}">
                    ${recLoc.score}
                </div>
                <div class="block-rec">
                    <div class="block-rec-name">${stayHome ? 'Stay in ' + homeBaseName : 'Head to ' + recName}</div>
                    <div class="block-rec-area">${recArea}</div>
                    ${w ? `<div class="block-rec-conditions">
                        ${weatherIcon(w.code)} ${w.temp}°F · ☀️ ${w.sun}% · 💨 ${w.wind}mph${w.precip > 0 ? ' · 🌧️ ' + w.precip.toFixed(1) + 'mm' : ''}
                    </div>` : ''}
                    ${runnerUpHtml}
                </div>
            </div>
            ${comparisonHtml}
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

function renderForecasts() {
    const container = document.getElementById('forecastCards');
    const sunTimes = SUN_TIMES[selectedDate] || { rise: '6:20', set: '6:52' };

    // Compute day scores and sort locations best → worst
    const locWithScores = LOCATIONS.map(loc => {
        const dayScore = computeDayScore(loc.id, selectedDate);
        return { loc, dayScore: dayScore ?? -1 };
    }).sort((a, b) => b.dayScore - a.dayScore);

    let html = '';
    locWithScores.forEach(({ loc, dayScore }, rank) => {
        const hours = weatherData[loc.id] || [];
        const dayHours = getHoursForDate(hours, selectedDate);
        const daytime = getDaytimeHours(dayHours);

        // Midday summary
        const middayHour = dayHours.find(h => h.time.includes('T12:')) || dayHours[Math.floor(dayHours.length / 2)];

        // Summary conditions for the header
        let condHtml = '';
        if (daytime.length > 0) {
            const avgWind = Math.round(daytime.reduce((s, h) => s + h.wind, 0) / daytime.length);
            const avgSun = Math.round(100 - daytime.reduce((s, h) => s + h.clouds, 0) / daytime.length);
            const totalRain = daytime.reduce((s, h) => s + (h.precip || 0), 0);
            condHtml = `<div class="forecast-conditions-row">
                <span class="forecast-cond">☀️ ${avgSun}%</span>
                <span class="forecast-cond">💨 ${avgWind} mph</span>
                ${totalRain > 0 ? `<span class="forecast-cond">🌧️ ${totalRain.toFixed(1)}mm</span>` : ''}
            </div>`;
        }

        // Find top 3 best hours
        const scored = daytime.map(h => ({ ...h, score: scoreHour(h) }));
        scored.sort((a, b) => b.score - a.score);
        const bestHours = new Set(scored.slice(0, 3).map(h => h.time));

        const rankClass = rank < 3 ? `rank-${rank + 1}` : '';
        const ringClass = dayScore >= 0 ? scoreRingClass(dayScore) : '';
        const ringLabel = dayScore >= 0 ? scoreRingLabel(dayScore) : '';

        html += `<div class="forecast-card ${rankClass}" data-loc="${loc.id}">
            <div class="forecast-header">
                ${dayScore >= 0 ? `
                    <div class="forecast-score-ring ${ringClass}" data-label="${ringLabel}">
                        ${dayScore}
                    </div>
                ` : ''}
                <div class="forecast-loc-info">
                    <div class="forecast-loc-name">${loc.name}</div>
                    <div class="forecast-loc-area">${loc.area}</div>
                    ${condHtml}
                </div>
                <div class="forecast-summary">
                    ${middayHour ? `
                        <span class="forecast-summary-icon">${weatherIcon(middayHour.code)}</span>
                        <span class="forecast-summary-temp">${Math.round(middayHour.temp)}°</span>
                    ` : '<span class="forecast-summary-temp">--</span>'}
                    <span class="forecast-chevron">▼</span>
                </div>
            </div>
            <div class="forecast-hours">
                ${daytime.map(h => {
                    const hHour = parseInt(h.time.split('T')[1].split(':')[0]);
                    const hour = formatHour(h.time);
                    const score = scoreHour(h);
                    const isBest = bestHours.has(h.time);
                    const hsClass = hourScoreClass(score);

                    // Insert sunrise/sunset markers
                    let sunMarker = '';
                    // Sunrise is ~6:20 AM, so it'll be before the 8 AM start — we'll show it as a note
                    // Sunset is ~6:52 PM, between 18:00 and 19:00
                    if (hHour === 19) {
                        sunMarker = `<div class="hour-col sunset-col">
                            <div class="hour-time">🌇</div>
                            <div class="hour-icon"></div>
                            <div class="hour-temp" style="font-size:0.7rem">${sunTimes.set}p</div>
                            <div class="hour-detail">Sunset</div>
                        </div>`;
                    }

                    return `${hHour === 19 ? sunMarker : ''}<div class="hour-col ${isBest ? 'best-hour' : ''}">
                        ${isBest ? '<div class="best-label">Best</div>' : ''}
                        <div class="hour-time">${hour}</div>
                        <div class="hour-icon">${weatherIcon(h.code)}</div>
                        <div class="hour-temp">${Math.round(h.temp)}°</div>
                        <div class="hour-detail">
                            ☀️${100 - h.clouds}%<br>
                            💨${Math.round(h.wind)}mph<br>
                            ${h.precip > 0 ? '🌧️' + h.precip.toFixed(1) + 'mm' : ''}
                        </div>
                        <div class="hour-score ${hsClass}">${score}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // Toggle expand on click
    container.querySelectorAll('.forecast-header').forEach(header => {
        header.addEventListener('click', () => {
            header.closest('.forecast-card').classList.toggle('expanded');
        });
    });
}

function renderAll() {
    renderDayNav();
    renderRightNow();
    renderOceanBar();
    renderItinerary();
    renderForecasts();
}

// ===== Init =====

async function init() {
    // Determine which day to show
    const today = getCurrentHawaiiDate();
    if (today >= TRIP_START && today <= TRIP_END) {
        selectedDate = today;
    } else if (today < TRIP_START) {
        selectedDate = TRIP_START;
    } else {
        selectedDate = TRIP_END;
    }

    // Render skeleton first
    renderAll();

    // Fetch all weather data in parallel
    try {
        const [weatherResults, ocean] = await Promise.all([
            Promise.all(LOCATIONS.map(async loc => {
                try {
                    const json = await fetchWeatherForLocation(loc);
                    return { id: loc.id, hours: parseHourlyData(json) };
                } catch (e) {
                    console.error(`Failed to fetch weather for ${loc.name}:`, e);
                    return { id: loc.id, hours: [] };
                }
            })),
            fetchOceanTemp(),
        ]);

        for (const result of weatherResults) {
            weatherData[result.id] = result.hours;
        }
        oceanData = ocean;
    } catch (e) {
        console.error('Weather fetch error:', e);
    }

    // Re-render with data
    renderAll();

    // Auto-refresh every 30 minutes
    setInterval(async () => {
        try {
            const results = await Promise.all(LOCATIONS.map(async loc => {
                const json = await fetchWeatherForLocation(loc);
                return { id: loc.id, hours: parseHourlyData(json) };
            }));
            for (const result of results) {
                weatherData[result.id] = result.hours;
            }
            renderAll();
        } catch (e) {
            console.error('Auto-refresh failed:', e);
        }
    }, 30 * 60 * 1000);
}

init();
