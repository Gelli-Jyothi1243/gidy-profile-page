# Gidy Profile Page - Full-Stack Application

A professional profile management system built with React, Node.js, Express, and MongoDB. This application allows users to showcase their skills, experience, projects, education, and achievements with an intuitive interface.

## � Live Application

- **Frontend**: https://gidy-profile-page.vercel.app
- **Backend API**: https://gidy-profile-backend-odl6.onrender.com/api/profile
- **GitHub Repository**: https://github.com/Gelli-Jyothi1243/gidy-profile-page

## � Tech Stack

**Frontend:**
- React 18 - UI library
- Vite - Build tool
- Axios - API requests
- Lucide React - Icons
- CSS3 - Styling

**Backend:**
- Node.js & Express - Server
- MongoDB & Mongoose - Database
- CORS - Cross-origin support

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## ✨ Innovation Features

### 1. Dark Mode with Persistent Settings

Users can toggle between light and dark themes, and their preference is saved to the database. This means when they come back later or use a different device, their chosen theme is remembered.

**Why I built this:**
- Reduces eye strain during long sessions
- Modern apps need theme options
- Shows attention to user experience

**How it works:**
- Toggle button in the header switches themes instantly
- Theme preference stored in MongoDB
- CSS variables make switching smooth
- Works across all devices and sessions

---

### 2. Real-Time Inline Editing

Instead of navigating to separate edit pages, users can click any card to edit it right there. Changes save automatically when you click away or move to another card.

**Why I built this:**
- Faster than traditional form-based editing
- Feels natural, like editing a document
- Prevents accidental data loss with auto-save
- Better user experience overall

**How it works:**
- Click any card to enter edit mode
- Type and see changes immediately
- Auto-saves when you blur the input or click another card
- Only one card can be edited at a time to avoid confusion

---

### 3. Skill Level System

Skills aren't just listed - each one shows your proficiency level (Beginner, Intermediate, Advanced, or Expert) with color-coded badges.

**Why I built this:**
- Helps recruiters quickly assess expertise
- More informative than a simple skill list
- Professional presentation
- Easy to update as skills improve

**How it works:**
- Four proficiency levels with distinct colors
- Click any skill to edit name and level
- Dropdown makes it easy to update
- Stored in database for persistence

---

### 4. Interactive Education Timeline

Education history is displayed as a visual timeline with icons, dates, and scores. It's easier to understand at a glance compared to a plain list.

**Why I built this:**
- Education is naturally chronological
- Visual timelines are easier to scan
- Looks more professional
- Shows progression clearly

**How it works:**
- Vertical timeline with gradient line
- Icon markers for each education level
- Displays duration and scores prominently
- Hover effects for interactivity

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gelli-Jyothi1243/gidy-profile-page.git
   cd gidy-profile-page
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file:
   ```
   MONGODB_URI=mongodb+srv://gellijyothi2005:Chintu99088@cluster10.neqdo.mongodb.net/profileDB?retryWrites=true&w=majority
   PORT=5000
   ```

   Start server:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   ```

   Create `.env` file (optional for local development):
   ```
   VITE_API_URL=http://localhost:5000/api/profile
   ```

   Start development server:
   ```bash
   npm run dev
   ```

4. **Access the app**
   Open http://localhost:5174 in your browser

---

## 📁 Project Structure

```
gidy-profile-page/
├── client/                 # React frontend
│   ├── src/
│   │   ├── ProfilePage.jsx # Main component
│   │   ├── ProfilePage.css # Styles
│   │   ├── InputFix.css    # Input visibility fixes
│   │   └── services/
│   │       └── api.js      # API configuration
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   ├── models/
│   │   └── Profile.js      # MongoDB schema
│   └── server.js           # API routes
│
└── README.md
```

---

## 🚀 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `server`
4. Add environment variable: `MONGODB_URI`
5. Deploy

### Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `client`
3. Framework preset: Vite
4. Add environment variable: `VITE_API_URL` = `https://gidy-profile-backend-odl6.onrender.com`
5. Deploy

---

## 🎯 Features

- Add, edit, and delete items in all sections
- Dark/light theme toggle
- Skill level management
- Real-time auto-save
- Responsive design
- Interactive timeline
- Smooth animations
- MongoDB data persistence

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile data |
| PUT | `/api/profile/:id` | Update profile |

---

## � Developer

**Jyothi Siva Naga Devi Gelli**

- Email: gellijyothi17@gmail.com
- GitHub: https://github.com/Gelli-Jyothi1243
- LinkedIn: https://www.linkedin.com/in/jyothi-gelli-791017257/

Created as part of the Gidy Full-Stack Developer Assessment.

---

## 📝 Notes

- Free tier backend may sleep after inactivity (first request takes 30-60 seconds)
- Theme preference syncs across devices
- All data stored in MongoDB Atlas
- Uncontrolled inputs used for better text visibility during editing

---

## 📄 License

Created for assessment purposes.
