# KRISHI SIRI – Smart Crop Advisory System

This is a simple full-stack web application designed for farmers to help them with crop recommendations, pest detection, weather advisory, and market prices.

## Project Structure
- `backend/`: Contains the Python FastAPI backend code.
  - `main.py`: The FastAPI application.
  - `train_model.py`: Script to train the RandomForest model.
  - `dataset.csv`: Sample dataset for training.
- `public/`: Contains the frontend HTML, CSS, and JavaScript files.
- `server.ts`: A Node.js server used for the live preview in this environment.

## How to run locally (Python)

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn scikit-learn pandas
   ```

2. **Train the model:**
   ```bash
   cd backend
   python train_model.py
   ```

3. **Run the backend:**
   ```bash
   python main.py
   ```

4. **Open the frontend:**
   Open `public/index.html` in your browser or serve it using a simple HTTP server.

## Features
- **Crop Recommendation:** Uses soil data (N, P, K, pH, etc.) to predict the best crop using a Machine Learning model.
- **Pest Detection:** Simulates detection of pests and suggests treatments.
- **Weather Advisory:** Provides weather information and farming advice.
- **Market Prices:** Displays current market trends for various crops.
- **Farmer Chatbot:** A simple rule-based AI to answer farming questions.
- **Bilingual Support:** Supports both English and Kannada.

## Note for Students
This project is designed as a template. You can expand the dataset, improve the ML model, or integrate real APIs for weather and market data.
