# SevaSetu — Smart Volunteer Coordination Platform

> AI-powered platform that helps NGOs digitize paper surveys, 
> prioritize community needs, and match volunteers intelligently.

## 🔗 Live Demo
[sevasetu.netlify.app](https://sevasetu.netlify.app)

## 🔐 Demo Login
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sevasetu.com | admin123 |
| Volunteer | rahul@sevasetu.com | volunteer123 |

## ✨ Features
- 📄 Paper survey digitization using OCR
- 🤖 AI urgency ranking using Google Gemini
- 🎯 Smart volunteer matching using Gemini AI
- 📊 Real-time community needs dashboard
- ✅ Complete task lifecycle tracking
- 🔐 Role-based access (Admin/Volunteer)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | Firebase Authentication |
| OCR | Tesseract.js |
| AI | Google Gemini API |
| Deployment | Netlify + Render |

## 🚀 Local Setup

### Backend
```bash
cd server
npm install
# Add .env file with required variables
npm run dev
```

### Frontend
```bash
cd client
npm install
# Add .env file with required variables
npm run dev
```

### Environment Variables

**server/.env**
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_key
GOOGLE_VISION_API_KEY=your_vision_key

**client/.env**
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_key
VITE_FIREBASE_PROJECT_ID=your_key
VITE_FIREBASE_STORAGE_BUCKET=your_key
VITE_FIREBASE_MESSAGING_SENDER_ID=your_key
VITE_FIREBASE_APP_ID=your_key

## 📁 Project Structure
sevasetu/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
└── server/          # Node.js backend
├── controllers/
├── middleware/
├── models/
├── routes/
└── utils/

## 🏆 Hackathon
Built for **Solution Challenge 2026 India** by GDG on Campus
Theme: Smart Resource Allocation