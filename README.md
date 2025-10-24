# 🌾 Agri-Culture

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)

**Agri-Culture** (also known as the *“Sheti Vadi Project”*) is a full-stack web application designed to provide various agriculture-related services.  
The project is built using the **MERN stack** and includes features such as user authentication, AI-powered chat, weather updates, and marketplace listings.

---

## 📸 Project Preview

*Replace these links with your own screenshots and a demo video link.*

**[Watch the Live Demo / Video Walkthrough](http://your-demo-link.com)**

| Home Page | Marketplace | AI Chat |
| :---: | :---: | :---: |
| ![Home Page Preview](path/to/your/homepage-screenshot.png) | ![Marketplace Preview](path/to/your/marketplace-screenshot.png) | ![AI Chat Preview](path/to/your/chat-screenshot.png) |

---

## 🚀 Technologies Used

### 🧩 Backend

- **Runtime:** Node.js  
- **Framework:** Express  
- **Database:** MongoDB (via Mongoose)  
- **Authentication:** JSON Web Tokens (JWT), cookie-parser  
- **File Uploads:** Multer, Cloudinary  
- **APIs & Services:**
  - OpenAI (AI chat)
  - Twilio (OTP/SMS services)
  - Node Geocoder (location services)
  - OpenWeather (weather data)
- **Middleware:** CORS, dotenv  
- **Development Tool:** Nodemon  

### 💻 Frontend

- **Library:** React  
- **Routing:** React Router DOM  
- **HTTP Client:** Axios  
- **Mapping:** Leaflet, React-Leaflet, Leaflet.markercluster  
- **Internationalization (i18n):** i18next, react-i18next  
- **Tooling:** React Scripts (Create React App)

---

## ⚙️ Project Setup Instructions

This project is divided into two main parts:  
1. **Backend server** – handles APIs, authentication, and database operations.  
2. **Frontend client** – React-based interface that consumes the backend APIs.  

You’ll need to install dependencies and run each part in separate terminal windows.

---

### 🖥️ 1. Backend Setup

#### **Navigate to the Backend Directory**
```bash
cd blueboi77/agri-culture/agri-culture-feature-react-conversion/backend

#### **Create Environment File**

Create a `.env` file in the `backend` directory.  
Copy the contents of `env-template.txt` and fill in your secret keys and database URI.

Your `backend/.env` file should look like this:

```env
PORT=5000
MONGODB_URI=[your_mongodb_url_here]
CLOUDINARY_CLOUD_NAME=[your_cloud_name_here]
CLOUDINARY_API_KEY=[your_api_key_here]
CLOUDINARY_API_SECRET=[your_api_secret_here]
OPENROUTER_API_KEY=[your_api_key_here]
TWILIO_ACCOUNT_SID=[your_account_sid_here]
TWILIO_AUTH_TOKEN=[your_auth_token_here]
TWILIO_SERVICE_SID=[your_service_sid_here]
GEOCODER_PROVIDER=openstreetmap
JWT_SECRET=your_super_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret_key
OPENWEATHER_API_KEY=[your_api_key_here]
