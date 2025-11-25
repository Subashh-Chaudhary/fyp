from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import timm
import numpy as np
import io
import json
from typing import Dict, Any

app = FastAPI(title="Plant Disease Detection API", version="2.0.0")

# CORS middleware for NestJS integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your NestJS origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = "model/final_model.pth"
CLASS_NAMES_PATH = "model/class_names.json"
DISEASE_INFO_PATH = "model/disease_info.json"
IMG_SIZE = 224

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"🖥️  Using device: {device}")

# Load model
print("🧠 Loading PyTorch model...")
checkpoint = torch.load(MODEL_PATH, map_location=device)

# Extract model configuration
model_name = checkpoint.get('model_name', 'efficientnet_b0')
num_classes = len(checkpoint['class_names'])

# Build model architecture
model = timm.create_model(model_name, pretrained=False, num_classes=num_classes)
model.load_state_dict(checkpoint['model_state_dict'])
model = model.to(device)
model.eval()
print("✅ Model loaded successfully")

# Load class names and disease info
with open(CLASS_NAMES_PATH) as f:
    class_names = json.load(f)

with open(DISEASE_INFO_PATH) as f:
    disease_info = json.load(f)

# Image preprocessing pipeline (same as training)
transform = transforms.Compose([
    transforms.Resize(int(IMG_SIZE * 1.14)),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.get("/")
async def root():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "model": model_name,
        "device": str(device),
        "num_classes": num_classes,
        "version": "2.0.0"
    }

@app.get("/classes")
async def get_classes():
    """Get all available disease classes"""
    return {
        "classes": class_names,
        "count": len(class_names)
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict plant disease from uploaded image.
    
    Request:
        - file: Image file (JPEG, PNG)
    
    Response:
        - classIndex: Integer index of predicted class
        - className: Full class name (e.g., "Apple___Apple_scab")
        - confidence: Prediction confidence (0-1)
        - disease: Human-readable disease name
        - description: Disease description
        - recommended_action: Treatment recommendations
        - top5Predictions: Top 5 predictions with confidences
    """
    try:
        # Read and preprocess image
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Apply transforms
        img_tensor = transform(img).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)
        
        # Get top prediction
        confidence, class_index = torch.max(probabilities, 1)
        class_index = class_index.item()
        confidence = confidence.item()
        class_name = class_names[class_index]
        
        # Get top-5 predictions
        top5_prob, top5_idx = torch.topk(probabilities, min(5, len(class_names)))
        top5_predictions = [
            {
                "className": class_names[idx.item()],
                "confidence": prob.item(),
                "disease": disease_info.get(class_names[idx.item()], {}).get("disease", "Unknown")
            }
            for prob, idx in zip(top5_prob[0], top5_idx[0])
        ]
        
        # Get disease information
        info = disease_info.get(class_name, {})
        
        return {
            "classIndex": class_index,
            "className": class_name,
            "confidence": confidence,
            "disease": info.get("disease", "Unknown"),
            "description": info.get("description", "No description available"),
            "recommended_action": info.get("recommended_action", "No recommendation available"),
            "severity": info.get("severity", "Unknown"),
            "top5Predictions": top5_predictions
        }
    
    except Exception as e:
        return {
            "error": str(e),
            "message": "Failed to process image"
        }

@app.post("/batch-predict")
async def batch_predict(files: list[UploadFile] = File(...)):
    """
    Predict diseases for multiple images at once.
    
    Request:
        - files: List of image files
    
    Response:
        - predictions: List of prediction results
    """
    results = []
    
    for file in files:
        try:
            # Process each image
            image_bytes = await file.read()
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img_tensor = transform(img).unsqueeze(0).to(device)
            
            # Predict
            with torch.no_grad():
                outputs = model(img_tensor)
                probabilities = F.softmax(outputs, dim=1)
            
            confidence, class_index = torch.max(probabilities, 1)
            class_index = class_index.item()
            confidence = confidence.item()
            class_name = class_names[class_index]
            
            info = disease_info.get(class_name, {})
            
            results.append({
                "filename": file.filename,
                "classIndex": class_index,
                "className": class_name,
                "confidence": confidence,
                "disease": info.get("disease", "Unknown")
            })
        
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {"predictions": results, "count": len(results)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)