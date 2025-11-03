from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np, io, json
from PIL import Image

app = FastAPI()

MODEL_PATH = "model/epoch_06_inference.keras"
CLASS_NAMES_PATH = "model/class_names.json"
DISEASE_INFO_PATH = "model/disease_info.json"

print("🧠 Loading model...")
model = load_model(MODEL_PATH)
print("✅ Model loaded")

with open(CLASS_NAMES_PATH) as f:
    class_names = json.load(f)

with open(DISEASE_INFO_PATH) as f:
    disease_info = json.load(f)

IMG_SIZE = (224, 224)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Load and preprocess
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.expand_dims(img_to_array(img) / 255.0, axis=0)

    # Predict
    preds = model.predict(img_array)
    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))
    class_name = class_names[class_index]

    info = disease_info.get(class_name, {})

    return {
        "classIndex": class_index,
        "className": class_name,
        "confidence": confidence,
        "disease": info.get("disease", "Unknown"),
        "description": info.get("description", "No description available"),
        "recommended_action": info.get("recommended_action", "No recommendation available")
    }
