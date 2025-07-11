# #!/usr/bin/env python3
# """
# AI Crop Disease Detection Model
# Training and serving script for crop disease classification
# """

# import os
# import numpy as np
# import tensorflow as tf
# from tensorflow import keras
# from tensorflow.keras import layers
# from tensorflow.keras.preprocessing.image import ImageDataGenerator
# import cv2
# from PIL import Image
# import json
# from typing import Dict, List, Tuple
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# class CropDiseaseModel:
#     """Crop Disease Detection Model Class"""

#     def __init__(self, model_path: str = None):
#         self.model = None
#         self.class_names = [
#             'Apple___Apple_scab',
#             'Apple___Black_rot',
#             'Apple___Cedar_apple_rust',
#             'Apple___healthy',
#             'Cherry___healthy',
#             'Cherry___Powdery_mildew',
#             'Corn___Cercospora_leaf_spot Gray_leaf_spot',
#             'Corn___Common_rust',
#             'Corn___healthy',
#             'Corn___Northern_Leaf_Blight',
#             'Grape___Black_rot',
#             'Grape___Esca_(Black_Measles)',
#             'Grape___healthy',
#             'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
#             'Peach___Bacterial_spot',
#             'Peach___healthy',
#             'Pepper_bell___Bacterial_spot',
#             'Pepper_bell___healthy',
#             'Potato___Early_blight',
#             'Potato___healthy',
#             'Potato___Late_blight',
#             'Strawberry___healthy',
#             'Strawberry___Leaf_scorch',
#             'Tomato___Bacterial_spot',
#             'Tomato___Early_blight',
#             'Tomato___healthy',
#             'Tomato___Late_blight',
#             'Tomato___Leaf_Mold',
#             'Tomato___Septoria_leaf_spot',
#             'Tomato___Spider_mites Two-spotted_spider_mite',
#             'Tomato___Target_Spot',
#             'Tomato___Tomato_mosaic_virus',
#             'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
#         ]

#         if model_path and os.path.exists(model_path):
#             self.load_model(model_path)
#         else:
#             self.build_model()

#     def build_model(self):
#         """Build the CNN model architecture"""
#         logger.info("Building model architecture...")

#         self.model = keras.Sequential([
#             layers.Conv2D(32, 3, padding='same', activation='relu', input_shape=(224, 224, 3)),
#             layers.MaxPooling2D(),
#             layers.Conv2D(64, 3, padding='same', activation='relu'),
#             layers.MaxPooling2D(),
#             layers.Conv2D(128, 3, padding='same', activation='relu'),
#             layers.MaxPooling2D(),
#             layers.Dropout(0.2),
#             layers.Flatten(),
#             layers.Dense(128, activation='relu'),
#             layers.Dropout(0.5),
#             layers.Dense(len(self.class_names), activation='softmax')
#         ])

#         self.model.compile(
#             optimizer='adam',
#             loss='categorical_crossentropy',
#             metrics=['accuracy']
#         )

#         logger.info("Model built successfully")

#     def train(self, train_dir: str, validation_dir: str, epochs: int = 10):
#         """Train the model"""
#         logger.info("Starting model training...")

#         # Data augmentation for training
#         train_datagen = ImageDataGenerator(
#             rescale=1./255,
#             rotation_range=20,
#             width_shift_range=0.2,
#             height_shift_range=0.2,
#             shear_range=0.2,
#             zoom_range=0.2,
#             horizontal_flip=True,
#             fill_mode='nearest'
#         )

#         # Only rescaling for validation
#         validation_datagen = ImageDataGenerator(rescale=1./255)

#         train_generator = train_datagen.flow_from_directory(
#             train_dir,
#             target_size=(224, 224),
#             batch_size=32,
#             class_mode='categorical'
#         )

#         validation_generator = validation_datagen.flow_from_directory(
#             validation_dir,
#             target_size=(224, 224),
#             batch_size=32,
#             class_mode='categorical'
#         )

#         # Train the model
#         history = self.model.fit(
#             train_generator,
#             epochs=epochs,
#             validation_data=validation_generator
#         )

#         logger.info("Training completed")
#         return history

#     def predict(self, image_path: str) -> Dict:
#         """Predict disease from image"""
#         try:
#             # Load and preprocess image
#             img = Image.open(image_path)
#             img = img.resize((224, 224))
#             img_array = np.array(img) / 255.0
#             img_array = np.expand_dims(img_array, axis=0)

#             # Make prediction
#             predictions = self.model.predict(img_array)
#             predicted_class = np.argmax(predictions[0])
#             confidence = float(predictions[0][predicted_class])

#             result = {
#                 'disease': self.class_names[predicted_class],
#                 'confidence': confidence,
#                 'predictions': {
#                     self.class_names[i]: float(predictions[0][i])
#                     for i in range(len(self.class_names))
#                 }
#             }

#             return result

#         except Exception as e:
#             logger.error(f"Prediction error: {str(e)}")
#             return {'error': str(e)}

#     def save_model(self, model_path: str):
#         """Save the trained model"""
#         self.model.save(model_path)
#         logger.info(f"Model saved to {model_path}")

#     def load_model(self, model_path: str):
#         """Load a trained model"""
#         self.model = keras.models.load_model(model_path)
#         logger.info(f"Model loaded from {model_path}")

# def main():
#     """Main function for training"""
#     # Example usage
#     model = CropDiseaseModel()

#     # Train the model (uncomment when dataset is available)
#     # model.train('dataset/train', 'dataset/validation', epochs=10)
#     # model.save_model('models/crop_disease_model.h5')

#     logger.info("Model ready for predictions")

# if __name__ == "__main__":
#     main()
