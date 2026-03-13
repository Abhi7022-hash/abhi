import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock ML Model Logic for Preview (Since we are in Node.js)
// In the actual student project, they would use the Python backend provided.
const predictCrop = (data) => {
    const { N, P, K, temperature, humidity, ph, rainfall } = data;
    
    // Simple rule-based simulation of the RandomForest model
    if (rainfall > 200 && N > 80) return "Rice";
    if (temperature > 25 && humidity > 80) return "Banana";
    if (ph < 6 && rainfall > 150) return "Tea";
    if (N > 100 && P > 30) return "Maize";
    if (temperature < 20) return "Wheat";
    if (humidity < 40) return "Kidney Beans";
    if (ph > 7) return "Pigeon Peas";
    
    const crops = ["Rice", "Maize", "Chickpea", "Kidney Beans", "Pigeon Peas", "Moth Beans", "Mung Bean", "Blackgram", "Lentil", "Pomegranate", "Banana", "Mango", "Grapes", "Watermelon", "Muskmelon", "Apple", "Orange", "Papaya", "Coconut", "Cotton", "Jute", "Coffee"];
    return crops[Math.floor(Math.random() * crops.length)];
};

// API Endpoints
app.post('/api/predict-crop', (req, res) => {
    const prediction = predictCrop(req.body);
    res.json({ prediction });
});

app.post('/api/detect-pest', (req, res) => {
    const pests = ["Aphids", "Spider Mites", "Leaf Miner", "Blight", "Rust"];
    const treatments = {
        "Aphids": "Use neem oil spray or insecticidal soap.",
        "Spider Mites": "Increase humidity and use miticides.",
        "Leaf Miner": "Remove affected leaves and use yellow sticky traps.",
        "Blight": "Apply copper-based fungicides and improve air circulation.",
        "Rust": "Use sulfur-based fungicides and avoid overhead watering."
    };
    const detected = pests[Math.floor(Math.random() * pests.length)];
    res.json({ pest: detected, treatment: treatments[detected] });
});

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    // Mock weather data for preview
    // In actual project, use OpenWeather API
    const weatherData = {
        temp: (Math.random() * 15 + 20).toFixed(1),
        humidity: Math.floor(Math.random() * 40 + 50),
        condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
    };
    
    let advice = "Standard farming practices recommended.";
    const tempNum = parseFloat(weatherData.temp);
    if (tempNum > 30) advice = "High temperature! Ensure adequate irrigation for your crops.";
    if (weatherData.condition === "Rainy") advice = "Rain expected. Postpone fertilizer application to avoid runoff.";
    
    res.json({ ...weatherData, advice });
});

app.get('/api/market-prices', (req, res) => {
    const pricesPath = path.join(__dirname, 'public', 'market_prices.json');
    const data = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
    res.json(data);
});

app.post('/api/chatbot', (req, res) => {
    const text = req.body.message.toLowerCase();
    let response = "I'm here to help with farming! Ask me about crops, pests, or fertilizers.";
    
    if (text.includes("crop")) response = "You should choose a crop based on your soil's NPK values and local weather. Try our Crop Recommendation tool!";
    else if (text.includes("pest")) response = "For pest control, identify the pest first. Neem oil is a good organic option for many common pests.";
    else if (text.includes("fertilizer")) response = "Fertilizer choice depends on the crop. Generally, N is for leaves, P for roots, and K for overall health.";
    
    res.json({ response });
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
