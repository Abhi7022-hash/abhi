// State Management
let currentLang = localStorage.getItem('lang') || 'en';
let translations = {};

// Initialize Translations
async function initTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function applyTranslations() {
    const langData = translations[currentLang];
    if (!langData) return;

    // Common Elements
    const navTitle = document.getElementById('nav-title');
    if (navTitle) navTitle.innerText = langData.title;

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) langBtn.innerText = langData.lang_toggle;

    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.innerText = langData.back;

    // Page Specific Elements
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.innerText = langData.title;

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.innerText = langData.subtitle;

    // Cards
    if (document.getElementById('card-crop')) document.getElementById('card-crop').innerText = langData.crop_rec;
    if (document.getElementById('card-pest')) document.getElementById('card-pest').innerText = langData.pest_det;
    if (document.getElementById('card-weather')) document.getElementById('card-weather').innerText = langData.weather_adv;
    if (document.getElementById('card-market')) document.getElementById('card-market').innerText = langData.market_prices;
    if (document.getElementById('card-chatbot')) document.getElementById('card-chatbot').innerText = langData.chatbot;

    // Forms
    if (document.getElementById('page-title')) {
        const title = document.getElementById('page-title').innerText;
        if (title.includes('Crop')) document.getElementById('page-title').innerText = langData.crop_rec;
        if (title.includes('Pest')) document.getElementById('page-title').innerText = langData.pest_det;
        if (title.includes('Weather')) document.getElementById('page-title').innerText = langData.weather_adv;
        if (title.includes('Market')) document.getElementById('page-title').innerText = langData.market_prices;
        if (title.includes('Chatbot')) document.getElementById('page-title').innerText = langData.chatbot;
    }

    if (document.getElementById('label-n')) document.getElementById('label-n').innerText = langData.n;
    if (document.getElementById('label-p')) document.getElementById('label-p').innerText = langData.p;
    if (document.getElementById('label-k')) document.getElementById('label-k').innerText = langData.k;
    if (document.getElementById('label-temp')) document.getElementById('label-temp').innerText = langData.temp;
    if (document.getElementById('label-hum')) document.getElementById('label-hum').innerText = langData.hum;
    if (document.getElementById('label-ph')) document.getElementById('label-ph').innerText = langData.ph;
    if (document.getElementById('label-rain')) document.getElementById('label-rain').innerText = langData.rain;
    if (document.getElementById('predict-btn')) document.getElementById('predict-btn').innerText = langData.predict;

    if (document.getElementById('upload-text')) document.getElementById('upload-text').innerText = langData.upload;
    if (document.getElementById('detect-btn')) document.getElementById('detect-btn').innerText = langData.detect;

    if (document.getElementById('city-input')) document.getElementById('city-input').placeholder = langData.city;
    if (document.getElementById('weather-btn')) document.getElementById('weather-btn').innerText = langData.get_weather;

    if (document.getElementById('send-btn')) document.getElementById('send-btn').innerText = langData.send;
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'kn' : 'en';
    localStorage.setItem('lang', currentLang);
    applyTranslations();
}

// Crop Recommendation Logic
const cropForm = document.getElementById('crop-form');
if (cropForm) {
    cropForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(cropForm);
        const data = Object.fromEntries(formData.entries());
        
        // Convert string values to numbers
        for (let key in data) data[key] = parseFloat(data[key]);

        try {
            const response = await fetch('/api/predict-crop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            document.getElementById('predicted-crop').innerText = result.prediction;
            document.getElementById('result').classList.remove('d-none');
        } catch (error) {
            console.error('Error predicting crop:', error);
            alert('Failed to connect to backend. Make sure the server is running.');
        }
    });
}

// Pest Detection Logic
const fileInput = document.getElementById('file-input');
const detectBtn = document.getElementById('detect-btn');
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('image-preview').src = event.target.result;
                document.getElementById('preview-container').classList.remove('d-none');
                detectBtn.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        }
    });

    detectBtn.addEventListener('click', async () => {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch('/api/detect-pest', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            document.getElementById('pest-name').innerText = result.pest;
            document.getElementById('pest-treatment').innerText = result.treatment;
            document.getElementById('pest-result').classList.remove('d-none');
        } catch (error) {
            console.error('Error detecting pest:', error);
        }
    });
}

// Weather Logic
const weatherBtn = document.getElementById('weather-btn');
if (weatherBtn) {
    weatherBtn.addEventListener('click', async () => {
        const city = document.getElementById('city-input').value;
        if (!city) return;

        try {
            const response = await fetch(`/api/weather?city=${city}`);
            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
                return;
            }

            document.getElementById('w-temp').innerText = data.temp;
            document.getElementById('w-hum').innerText = data.humidity;
            document.getElementById('w-cond').innerText = data.condition;
            document.getElementById('w-advice').innerText = data.advice;
            document.getElementById('weather-result').classList.remove('d-none');
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    });
}

// Market Prices Logic
const marketTableBody = document.getElementById('market-table-body');
if (marketTableBody) {
    async function loadMarketPrices() {
        try {
            const response = await fetch('/api/market-prices');
            const data = await response.json();
            
            marketTableBody.innerHTML = data.map(item => `
                <tr>
                    <td>${item.crop}</td>
                    <td>${item.price}</td>
                    <td>
                        <span class="trend-${item.trend}">
                            ${item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'} 
                            ${item.trend.toUpperCase()}
                        </span>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading market prices:', error);
        }
    }
    loadMarketPrices();
}

// Chatbot Logic
const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        // Add User Message
        addChatMessage(message, 'user');
        input.value = '';

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            
            // Add Bot Message
            setTimeout(() => {
                addChatMessage(data.response, 'bot');
            }, 500);
        } catch (error) {
            console.error('Error in chatbot:', error);
        }
    });

    function addChatMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-message ${sender}-message mb-3`;
        div.innerHTML = `
            <div class="message-content p-3 rounded shadow-sm bg-white">
                ${text}
            </div>
        `;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Init
document.addEventListener('DOMContentLoaded', initTranslations);
