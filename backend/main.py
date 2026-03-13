from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import pickle
import pandas as pd
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None

class CropData(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/predict-crop")
async def predict_crop(data: CropData):
    if model is None:
        return {"prediction": "Model not trained yet!"}
    
    # Prepare input for prediction
    input_df = pd.DataFrame([data.dict()])
    prediction = model.predict(input_df)[0]
    return {"prediction": prediction}

@app.post("/detect-pest")
async def detect_pest(file: UploadFile = File(...)):
    # Simulated pest detection logic
    pests = ["Aphids", "Spider Mites", "Leaf Miner", "Blight", "Rust"]
    treatments = {
        "Aphids": "Use neem oil spray or insecticidal soap.",
        "Spider Mites": "Increase humidity and use miticides.",
        "Leaf Miner": "Remove affected leaves and use yellow sticky traps.",
        "Blight": "Apply copper-based fungicides and improve air circulation.",
        "Rust": "Use sulfur-based fungicides and avoid overhead watering."
    }
    
    detected = random.choice(pests)
    return {
        "pest": detected,
        "treatment": treatments[detected]
    }

@app.get("/market-prices")
async def get_market_prices():
    # In a real app, this would read from a database or JSON file
    # For simplicity, returning sample data
    return [
        {"crop": "Rice", "price": "₹2,500/quintal", "trend": "up"},
        {"crop": "Wheat", "price": "₹2,100/quintal", "trend": "down"},
        {"crop": "Maize", "price": "₹1,800/quintal", "trend": "up"}
    ]

class ChatMessage(BaseModel):
    message: str

@app.post("/chatbot")
async def chatbot(msg: ChatMessage):
    text = msg.message.lower()
    if "crop" in text:
        return {"response": "You should choose a crop based on your soil's NPK values and local weather. Try our Crop Recommendation tool!"}
    elif "pest" in text:
        return {"response": "For pest control, identify the pest first. Neem oil is a good organic option for many common pests."}
    elif "fertilizer" in text:
        return {"response": "Fertilizer choice depends on the crop. Generally, N is for leaves, P for roots, and K for overall health."}
    else:
        return {"response": "I'm here to help with farming! Ask me about crops, pests, or fertilizers."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
