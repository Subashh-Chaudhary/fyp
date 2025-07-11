# AI Crop Disease Detection System

A comprehensive system for detecting and managing crop diseases using AI, featuring a NestJS backend, React Native frontend, and machine learning models.

## 🏗️ Project Structure

```
/ai-crop-disease-system
├── /backend                   # NestJS Backend
│   ├── /src
│   │   ├── /auth              # Auth module (JWT, guards)
│   │   ├── /users             # User management
│   │   ├── /disease           # Disease detection module
│   │   ├── /expert            # Plant expert module
│   │   ├── /storage           # File handling (AWS S3/Firebase)
│   │   ├── /reports           # PDF report generation
│   │   ├── common             # Shared utilities
│   │   │   ├── /decorators    # Custom decorators
│   │   │   ├── /filters       # Exception filters
│   │   │   ├── /interceptors  # Response transformers
│   │   │   └── /middlewares   # Auth/validation middleware
│   │   ├── config             # Env/config files
│   │   ├── entities           # TypeORM entities
│   │   ├── dto                # Data transfer objects
│   │   └── main.ts            # Entry point
│   ├── /test                  # Integration/unit tests
│   └── Dockerfile
│
├── /frontend                  # React Native Frontend
│   ├── /src
│   │   ├── /assets            # Fonts/images
│   │   ├── /components
│   │   │   ├── /ui           # Reusable UI (buttons, cards)
│   │   │   └── /camera        # Image capture component
│   │   ├── /screens
│   │   │   ├── Auth           # Login/registration
│   │   │   ├── Dashboard      # User home
│   │   │   ├── Detection      # Disease scan UI
│   │   │   └── Expert         # Expert review panel
│   │   ├── /context           # Auth/global state
│   │   ├── /hooks             # Custom hooks (e.g., useAPI)
│   │   ├── /navigation        # Stack/tab navigators
│   │   ├── /services          # API clients
│   │   ├── /utils             # Formatters/validators
│   │   └── App.tsx            # Root component
│   ├── /tests                 # Component/unit tests
│   └── app.json
│
├── /ai-model                  # AI Model Training/Serving
│   ├── /notebooks             # Jupyter notebooks
│   ├── /dataset               # Kaggle dataset
│   ├── model.py               # Training script
│   └── requirements.txt       # Python dependencies
│
├── /docs                      # API docs, wireframes
├── /scripts                   # Deployment/CI scripts
├── docker-compose.yml         # Multi-container setup
├── .gitignore
└── README.md                  # Project overview
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- Docker & Docker Compose
- PostgreSQL

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-crop-disease-system
   ```

2. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Or run services individually:**

   **Backend:**

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm install
   npm start
   ```

   **AI Model:**

   ```bash
   cd ai-model
   pip install -r requirements.txt
   python model.py
   ```

## 📱 Features

### Backend (NestJS)

- **Authentication**: JWT-based auth with role-based access
- **User Management**: CRUD operations for users
- **Disease Detection**: AI model integration for crop disease analysis
- **Expert System**: Plant expert consultation module
- **File Storage**: AWS S3/Firebase integration for image storage
- **Report Generation**: PDF reports for disease analysis
- **Database**: PostgreSQL with TypeORM

### Frontend (React Native)

- **Authentication**: Login/registration screens
- **Dashboard**: User overview and recent scans
- **Camera Integration**: Image capture for disease detection
- **Detection UI**: Real-time disease analysis interface
- **Expert Panel**: Expert consultation interface
- **Navigation**: Stack and tab navigation
- **State Management**: Context API for global state

### AI Model

- **Training**: Jupyter notebooks for model development
- **Dataset**: Kaggle crop disease dataset
- **Model Serving**: REST API for predictions
- **Requirements**: Python dependencies management

## 🛠️ Technology Stack

### Backend

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **File Storage**: AWS S3/Firebase
- **Testing**: Jest

### Frontend

- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Context API
- **UI Components**: Custom components
- **Testing**: Jest & React Native Testing Library

### AI/ML

- **Language**: Python
- **Frameworks**: TensorFlow/PyTorch
- **Notebooks**: Jupyter
- **API**: FastAPI/Flask

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (planned)

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Frontend Guide](./docs/frontend.md)
- [AI Model Guide](./docs/ai-model.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@cropdisease.com or create an issue in the repository.
