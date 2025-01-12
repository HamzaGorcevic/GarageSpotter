# 🚗 GarageSpotter

GarageSpotter is a web application designed to make it easy for users to find, reserve, and manage parking spots and electric chargers. Built with a React frontend and a C# .NET backend, the app provides seamless user experience with features like garage filtering, live availability, profile management, and more.

## 🧩 Tech Stack

### Frontend:
- React
- Bootstrap for styling

### Backend:
- C# .NET (Web API)
- SQL Server for data persistence

## 🌟 Features

### 🔑 Authentication
- Google login
- Password management
- Profile updates and deletion

### 📅 Reservations
- View and manage reservations
- Reserve a spot by date or by the hour
- Extend existing reservations

### 🏢 Garages & Chargers
- Search and filter garages by name, price, distance, or charger type
- Live availability status for parking spots
- View garages and electric chargers on a map

### 🗂️ Admin Features
- Manage garages and chargers (create, update, delete)
- Approve or reject unregistered garages and chargers
- View and manage users

## 📌 Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/HamzaGorcevic/GarageSpotter.git
cd GarageSpotter
```

### Backend Setup
1. Open the `AutoHub.Server.csproj` in Visual Studio
2. Configure the database connection in `appsettings.json`
3. Run the project using `dotnet run`

### Frontend Setup
1. Navigate to the client folder
```bash
cd client
npm install
npm run dev
```

## 🗺️ Architecture Overview

The system is built on a client-server architecture with a focus on scalability and maintainability. The React client communicates with the .NET backend API to manage data and handle business logic.


## 💡 Future Enhancements

- Push notifications for reservations
- Payment integration
- Dark mode support

## 🛠️ Development Tips

- Use Visual Studio Code for frontend development and Visual Studio for backend.
- Make sure your SQL Server instance is properly configured before running the backend.

## 📄 License

This project is open-source under the MIT License.

## 🚀 GarageSpotter – Your Smart Parking Assistant!
