# 🏗️ RentHub - Equipment Rental Platform

A modern, full-stack equipment rental platform built with React, Node.js, and MongoDB. RentHub provides a seamless experience for renting construction equipment, party supplies, and more.

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure login/register with JWT tokens
- **Equipment Catalog** - Browse and search through equipment categories
- **Wishlist Management** - Save favorite equipment for later
- **Shopping Cart** - Add items and manage rental quantities
- **User Profiles** - Manage personal information and preferences
- **Real-time Support** - Help center, returns, and safety guidelines

### 🛠️ Technical Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **MongoDB Integration** - Persistent data storage
- **JWT Authentication** - Secure user sessions
- **Modern UI/UX** - Built with Shadcn UI and Tailwind CSS
- **TypeScript** - Type-safe development
- **Hot Module Replacement** - Fast development experience

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lease-hub-suite-main
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp server/env.example server/.env
   
   # Edit .env file with your MongoDB connection string
   # MONGODB_URI=your_mongodb_atlas_connection_string
   # JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start separately:
   # Frontend: npm run dev
   # Backend: node server/server.js
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001/api

## 🏗️ Project Structure

```
lease-hub-suite-main/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── data/              # Mock data
│   └── assets/            # Images and static files
├── server/                # Backend source code
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── services/          # Business logic
├── public/                # Static files
└── package.json           # Project dependencies
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend only
npm run dev:full         # Start both frontend and backend
npm run build            # Build for production
npm run preview          # Preview production build

# Backend
cd server
node server.js           # Start backend server
npm run seed             # Seed database with sample data
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### User Management
- `POST /api/auth/upload-profile-picture` - Upload profile picture
- `GET /api/auth/verify` - Verify JWT token

## 🎨 UI Components

The project uses a comprehensive set of UI components from Shadcn UI:
- Buttons, Cards, Forms
- Navigation, Modals, Toasts
- Tables, Charts, Calendars
- And many more...

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Secure MongoDB connection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Deploy server/ folder to your hosting service
# Set environment variables
# Start with: node server.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Shadcn UI for the beautiful component library
- Tailwind CSS for the utility-first styling
- MongoDB Atlas for the database service
- Vite for the fast development experience

---

**Made with ❤️ for the rental industry**
