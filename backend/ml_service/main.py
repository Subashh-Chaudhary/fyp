from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import io
from PIL import Image

app = FastAPI()

# Load model once at startup
MODEL_PATH = "model/epoch_06_inference.keras"
print("🧠 Loading model...")
model = load_model(MODEL_PATH)
print("✅ Model loaded")

IMG_SIZE = (224, 224)

class Prediction(BaseModel):
    classIndex: int
    confidence: float
    classIndex: int
    className: str
    confidence: float
    disease: str
    description: str
    recommended_action: str


@app.get("/healthz")
def healthz():
    return {"status": "ok", "modelPath": MODEL_PATH, "imgSize": IMG_SIZE}

@app.post("/predict", response_model=Prediction)
async def predict(file: UploadFile = File(...)):
    # Read image bytes
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # normalize

    # Predict
    preds = model.predict(img_array)
    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))
    class_name = class_names[class_index]


    # Get disease info
    info = disease_info.get(class_name, {})

    # Only return the fields defined in the response model
    return {
        "classIndex": class_index,
        "className": class_name,
        "confidence": confidence,
        "disease": info.get("disease", "Unknown"),
        "description": info.get("description", "No description available"),
        "recommended_action": info.get("recommended_action", "No action recommended")
    }
