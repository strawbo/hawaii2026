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

// Day-by-day itinerary
const ITINERARY = [
    {
        date: '2026-04-12',
        title: 'Arrival Day',
        dayLabel: 'Sun',
        theme: 'Aloha! Settle into Waiohai and soak in the South Shore sunset.',
        activities: [
            {
                time: 'Evening',
                hour: 20,
                name: 'Arrive & Check In',
                desc: 'Flight lands 9:29 PM. Pick up rental car, drive 30 min to Waiohai in Poipu.',
                location: 'poipu',
                type: 'family',
            },
        ],
    },
    {
        date: '2026-04-13',
        title: 'South Shore Day',
        dayLabel: 'Mon',
        theme: 'Get your bearings at home base. Easy beach day after travel.',
        activities: [
            {
                time: 'Morning',
                hour: 9,
                name: 'Poipu Beach Snorkeling',
                desc: 'Walk from Waiohai. Snorkel the left side for turtles & tropical fish. Monk seals often rest on the beach.',
                location: 'poipu',
                type: 'snorkel',
            },
            {
                time: 'Midday',
                hour: 12,
                name: 'Spouting Horn & Koloa Town',
                desc: 'Quick drive to the blowhole (free!), then lunch in Old Koloa Town. Try Koloa Fish Market or Pizzetta.',
                location: 'poipu',
                type: 'sightseeing',
            },
            {
                time: 'Afternoon',
                hour: 15,
                name: 'Shipwreck Beach & Mahaulepu Trail',
                desc: 'Dramatic cliffs and tide pools. Walk the coastal trail east from the Grand Hyatt. Incredible views.',
                location: 'shipwreck',
                type: 'hike',
            },
            {
                time: 'Sunset',
                hour: 18,
                name: 'Beach House Restaurant',
                desc: 'Best sunset on the south shore. Reserve ahead or grab a spot at the bar. Right on the water.',
                location: 'poipu',
                type: 'food',
            },
        ],
    },
    {
        date: '2026-04-14',
        title: 'Canyon & West Side',
        dayLabel: 'Tue',
        theme: 'Waimea Canyon in the morning (clearest skies), west beaches in the afternoon.',
        activities: [
            {
                time: 'Early AM',
                hour: 7,
                name: 'Waimea Canyon Lookouts',
                desc: 'Leave early — clouds build by late morning. Hit Waimea Canyon Lookout and Pu\'u o Kila at the end of the road. Bring layers, it\'s cooler up top.',
                location: 'waimea-canyon',
                type: 'sightseeing',
            },
            {
                time: 'Late Morning',
                hour: 10,
                name: 'Cliff & Canyon Trails',
                desc: 'Short hikes: Canyon Trail (0.3 mi) for a waterfall view, or Cliff Trail for dramatic canyon edge. Kid-friendly.',
                location: 'waimea-canyon',
                type: 'hike',
            },
            {
                time: 'Lunch',
                hour: 12,
                name: 'Waimea Town',
                desc: 'Grab shave ice at Jo-Jo\'s (legendary) and poke bowls in town. Historic Waimea — Captain Cook landed here.',
                location: 'salt-pond',
                type: 'food',
            },
            {
                time: 'Afternoon',
                hour: 14,
                name: 'Salt Pond Beach',
                desc: 'Calm, protected cove perfect for the whole family. Great snorkeling, tide pools on the far end. Often uncrowded.',
                location: 'salt-pond',
                type: 'beach',
            },
        ],
    },
    {
        date: '2026-04-15',
        title: 'East Side Adventure',
        dayLabel: 'Wed',
        theme: 'Sleeping Giant hike in the cool morning, then beaches and Kapa\'a town.',
        activities: [
            {
                time: 'Early AM',
                hour: 7,
                name: 'Sleeping Giant Hike',
                desc: 'East side trail (Nounou East) is most popular — 1.75 mi to the top. Moderate difficulty. Panoramic 360° views of the coast. Bring water!',
                location: 'sleeping-giant',
                type: 'hike',
            },
            {
                time: 'Late Morning',
                hour: 10,
                name: 'Lydgate Beach Park',
                desc: 'Protected lava-rock pools make this the easiest snorkeling on the island. Great for all skill levels. Playground nearby.',
                location: 'lydgate',
                type: 'snorkel',
            },
            {
                time: 'Afternoon',
                hour: 14,
                name: 'Kapa\'a Coastal Bike Path',
                desc: 'Rent bikes and ride the paved coastal path — stunning ocean views. Goes for miles along the east shore. Rent at Coconut Coasters.',
                location: 'kapaa',
                type: 'adventure',
            },
            {
                time: 'Evening',
                hour: 18,
                name: 'Kapa\'a Town Dinner',
                desc: 'Tiki Tacos (casual, great fish tacos), or Hukilau Lanai for a nicer sit-down. Browse the shops on the main drag.',
                location: 'kapaa',
                type: 'food',
            },
        ],
    },
    {
        date: '2026-04-16',
        title: 'North Shore Day',
        dayLabel: 'Thu',
        theme: 'Hanalei and Tunnels — the crown jewels of Kauai. Go early for parking.',
        activities: [
            {
                time: 'Early AM',
                hour: 7,
                name: 'Tunnels Beach (Makua)',
                desc: 'Get there by 7:30 for parking (seriously). World-class snorkeling over massive reef. Calm mornings are best. The reef starts right at the sand.',
                location: 'tunnels',
                type: 'snorkel',
            },
            {
                time: 'Late Morning',
                hour: 10,
                name: 'Ke\'e Beach & Kalalau Trailhead',
                desc: 'End of the road. Quick peek at the Na Pali coast from the first 0.25 mi of Kalalau Trail. Ke\'e Beach is gorgeous (needs Ha\'ena parking reservation).',
                location: 'tunnels',
                type: 'beach',
            },
            {
                time: 'Lunch',
                hour: 12,
                name: 'Hanalei Town',
                desc: 'Hanalei Bread Company for sandwiches, or Postcards Cafe. Browse art galleries and surf shops. Get shave ice at Wishing Well.',
                location: 'hanalei',
                type: 'food',
            },
            {
                time: 'Afternoon',
                hour: 14,
                name: 'Hanalei Bay',
                desc: 'The iconic bay — swim, SUP, or just hang on the beach. Pier is great for photos. Mountain backdrop is unreal.',
                location: 'hanalei',
                type: 'beach',
            },
        ],
    },
    {
        date: '2026-04-17',
        title: 'Adventure Day',
        dayLabel: 'Fri',
        theme: 'Na Pali Coast boat tour or kayak adventure — pick your pace.',
        activities: [
            {
                time: 'Morning',
                hour: 8,
                name: 'Na Pali Coast Boat Tour',
                desc: 'Book with Captain Andy\'s or Holo Holo Charters. Catamaran or zodiac. Morning tours have calmer seas. You\'ll see dolphins, sea caves, waterfalls. Book ASAP — sells out.',
                location: 'poipu',
                type: 'adventure',
            },
            {
                time: 'Alt Morning',
                hour: 8,
                name: 'OR: Kayak Wailua River to Secret Falls',
                desc: 'Alternative if boats are sold out. Paddle up Wailua River, short hike to 100-ft waterfall. Book with Wailua Kayak Adventures. ~5 hours total.',
                location: 'lydgate',
                type: 'adventure',
            },
            {
                time: 'Afternoon',
                hour: 14,
                name: 'Recovery Beach Time',
                desc: 'Head back to Poipu for easy beach time. Pool at Waiohai is great for decompressing after a big morning.',
                location: 'poipu',
                type: 'beach',
            },
            {
                time: 'Evening',
                hour: 18,
                name: 'Brennecke\'s Beach Broiler',
                desc: 'Casual spot right across from Poipu Beach. Great burgers, fish, and sunset views from the upstairs lanai.',
                location: 'poipu',
                type: 'food',
            },
        ],
    },
    {
        date: '2026-04-18',
        title: 'Flex / Best-of Day',
        dayLabel: 'Sat',
        theme: 'Revisit your favorites or hit what you missed. Check weather for the best spot!',
        activities: [
            {
                time: 'Morning',
                hour: 8,
                name: 'Weather-Based Pick',
                desc: 'Check the forecast above! North Shore clear? Go back to Tunnels. West side sunny? Hit Polihale for the most remote beach on earth.',
                location: 'poipu',
                type: 'beach',
            },
            {
                time: 'Midday',
                hour: 11,
                name: 'Allerton / McBryde Garden (NTBG)',
                desc: 'Stunning botanical garden in Poipu. The Allerton tour is the famous one (Jurassic Park scenes filmed here). Book the guided tour in advance.',
                location: 'poipu',
                type: 'sightseeing',
            },
            {
                time: 'Afternoon',
                hour: 14,
                name: 'Poipu Pool & Beach',
                desc: 'Soak up final full afternoon at Waiohai pool and Poipu Beach. Grab açaí bowls from Living Foods.',
                location: 'poipu',
                type: 'family',
            },
            {
                time: 'Sunset',
                hour: 18,
                name: 'Merriman\'s Fish House',
                desc: 'Upscale-casual farm-to-table in Poipu. Excellent fish, great cocktails. One of the best restaurants on the island. Reserve ahead.',
                location: 'poipu',
                type: 'food',
            },
        ],
    },
    {
        date: '2026-04-19',
        title: 'Last Day — Late Flight',
        dayLabel: 'Sun',
        theme: 'Full day to enjoy! Flight doesn\'t leave until 10:29 PM.',
        activities: [
            {
                time: 'Morning',
                hour: 8,
                name: 'One Last Snorkel',
                desc: 'Hit Poipu Beach or Lydgate one more time. Make it count!',
                location: 'poipu',
                type: 'snorkel',
            },
            {
                time: 'Late Morning',
                hour: 11,
                name: 'Checkout & Pack',
                desc: 'Check out of Waiohai (usually 11 AM). Store bags if needed.',
                location: 'poipu',
                type: 'family',
            },
            {
                time: 'Afternoon',
                hour: 13,
                name: 'Kukui\'ula Shopping Village',
                desc: 'Last-minute shopping and souvenirs in Poipu. Art galleries, local goods, great açaí.',
                location: 'poipu',
                type: 'shopping',
            },
            {
                time: 'Late PM',
                hour: 16,
                name: 'Kalapaki Beach & Lihue',
                desc: 'Beach near the airport. Grab dinner at Duke\'s Kauai (right on the beach) before heading to LIH. Allow 30 min to airport.',
                location: 'lydgate',
                type: 'food',
            },
        ],
    },
];

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
    const res = await fetch(url);
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
        const res = await fetch(url);
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
function scoreHour(hourData) {
    let score = 100;

    // Temperature: ideal 75–85°F
    const temp = hourData.temp;
    if (temp < 68) score -= (68 - temp) * 3;
    else if (temp > 90) score -= (temp - 90) * 4;
    else if (temp >= 75 && temp <= 85) score += 0; // perfect
    else if (temp < 75) score -= (75 - temp) * 1;
    else score -= (temp - 85) * 2;

    // Rain: big penalty
    if (hourData.precip > 0.1) score -= 30;
    if (hourData.precip > 0.5) score -= 20;
    if (hourData.precipProb > 50) score -= 15;
    else if (hourData.precipProb > 30) score -= 8;

    // Clouds: mild penalty
    if (hourData.clouds > 80) score -= 15;
    else if (hourData.clouds > 60) score -= 8;
    else if (hourData.clouds > 40) score -= 3;

    // Wind: moderate penalty for beaches
    if (hourData.wind > 20) score -= 20;
    else if (hourData.wind > 15) score -= 10;
    else if (hourData.wind > 10) score -= 3;

    // UV bonus for beach (but warn if extreme)
    if (hourData.uv > 10) score -= 5;

    return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreLabel(score) {
    if (score >= 75) return { text: 'Great', cls: 'score-great' };
    if (score >= 50) return { text: 'Good', cls: 'score-good' };
    return { text: 'Fair', cls: 'score-fair' };
}

function weatherNoteClass(score) {
    if (score >= 75) return 'weather-great';
    if (score >= 50) return 'weather-ok';
    return 'weather-poor';
}

function weatherNoteText(score, data) {
    if (score >= 75) return `☀️ Great conditions — ${Math.round(data.temp)}°F, ${data.clouds}% clouds`;
    if (score >= 50) {
        if (data.precipProb > 30) return `🌦️ ${data.precipProb}% chance of rain — have a backup plan`;
        if (data.wind > 12) return `💨 Breezy at ${Math.round(data.wind)} mph — may affect water activities`;
        return `⛅ Decent — ${Math.round(data.temp)}°F, ${data.clouds}% clouds`;
    }
    if (data.precip > 0.3) return `🌧️ Rain likely — consider indoor alternatives`;
    return `☁️ Not ideal — check other locations`;
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
    // 6 AM to 8 PM Hawaii time
    return dayHours.filter(h => {
        const hour = parseInt(h.time.split('T')[1].split(':')[0]);
        return hour >= 6 && hour <= 20;
    });
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

function renderDayNav() {
    const nav = document.getElementById('dayNav');
    const days = getTripDays();
    const today = getCurrentHawaiiDate();

    nav.innerHTML = days.map(d => {
        const isActive = d.iso === selectedDate;
        const isToday = d.iso === today;
        return `<button class="day-pill ${isActive ? 'active' : ''}" data-date="${d.iso}">
            <span class="pill-day">${d.dayName}</span>
            <span class="pill-date">${isToday ? 'Today' : 'Apr ' + d.dateNum}</span>
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
                <span class="condition-icon">☁️</span>
                <span class="condition-value">${best.data.clouds}%</span>
            </div>
            <div class="condition-item">
                <span class="condition-icon">🌧️</span>
                <span class="condition-value">${best.data.precipProb}%</span>
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
            <div class="now-card-detail">💨 ${Math.round(item.data.wind)} mph · ☁️ ${item.data.clouds}% · 🌧️ ${item.data.precipProb}%</div>
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

    // Sunrise/sunset for Kauai in April
    html += `<div class="ocean-chip">
        <span class="ocean-icon">🌅</span>
        <span class="ocean-temp">6:22a</span>
        <span class="ocean-label">Sunrise</span>
    </div>`;
    html += `<div class="ocean-chip">
        <span class="ocean-icon">🌇</span>
        <span class="ocean-temp">6:52p</span>
        <span class="ocean-label">Sunset</span>
    </div>`;

    container.innerHTML = html;
}

function renderItinerary() {
    const titleEl = document.getElementById('itineraryTitle');
    const container = document.getElementById('itineraryContent');

    const dayData = ITINERARY.find(d => d.date === selectedDate);
    if (!dayData) {
        titleEl.textContent = 'No plans for this day';
        container.innerHTML = '';
        return;
    }

    titleEl.textContent = dayData.title;

    let html = `<div class="day-theme">${dayData.theme}</div><div class="activity-list">`;

    for (const act of dayData.activities) {
        // Get weather for this activity's time
        const locHours = weatherData[act.location] || [];
        const actHour = locHours.find(h => {
            return h.time.startsWith(selectedDate) &&
                parseInt(h.time.split('T')[1].split(':')[0]) === act.hour;
        });

        let weatherHtml = '';
        let weatherNoteHtml = '';
        if (actHour) {
            const score = scoreHour(actHour);
            weatherHtml = `
                <div class="activity-weather-mini">${weatherIcon(actHour.code)}</div>
                <div class="activity-weather-temp">${Math.round(actHour.temp)}°F</div>
            `;
            weatherNoteHtml = `<div class="activity-weather-note ${weatherNoteClass(score)}">
                ${weatherNoteText(score, actHour)}
            </div>`;
        }

        html += `<div class="activity-card">
            <div class="activity-time-col">
                <div class="activity-time">${act.time}</div>
                ${weatherHtml}
            </div>
            <div class="activity-body">
                <div class="activity-name">${act.name}</div>
                <div class="activity-desc">${act.desc}</div>
                <span class="activity-tag tag-${act.type}">${act.type}</span>
                ${weatherNoteHtml}
            </div>
        </div>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

function renderForecasts() {
    const container = document.getElementById('forecastCards');

    let html = '';
    for (const loc of LOCATIONS) {
        const hours = weatherData[loc.id] || [];
        const dayHours = getHoursForDate(hours, selectedDate);
        const daytime = getDaytimeHours(dayHours);

        // Current/summary: find the "best" hour or use midday
        const middayHour = dayHours.find(h => h.time.includes('T12:')) || dayHours[Math.floor(dayHours.length / 2)];

        // Find top 3 best hours
        const scored = daytime.map(h => ({ ...h, score: scoreHour(h) }));
        scored.sort((a, b) => b.score - a.score);
        const bestHours = new Set(scored.slice(0, 3).map(h => h.time));

        html += `<div class="forecast-card" data-loc="${loc.id}">
            <div class="forecast-header">
                <div class="forecast-loc-info">
                    <div class="forecast-loc-name">${loc.name}</div>
                    <div class="forecast-loc-area">${loc.area} · ${loc.desc}</div>
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
                    const hour = formatHour(h.time);
                    const score = scoreHour(h);
                    const isBest = bestHours.has(h.time);
                    return `<div class="hour-col ${isBest ? 'best-hour' : ''}">
                        ${isBest ? '<div class="best-label">Best</div>' : ''}
                        <div class="hour-time">${hour}</div>
                        <div class="hour-icon">${weatherIcon(h.code)}</div>
                        <div class="hour-temp">${Math.round(h.temp)}°</div>
                        <div class="hour-detail">
                            💨${Math.round(h.wind)}<br>
                            ☁️${h.clouds}%<br>
                            🌧️${h.precipProb}%
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }

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
