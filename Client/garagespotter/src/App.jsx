import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/register";
import Login from "./pages/Login/login";
import Home from "./pages/home";
import { AuthProvider } from "./context/AuthContext.jsx";
import GarageForm from "./pages/CreateGarage/garageForm.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import LandingPage from "./pages/LandingPage/landingPage.jsx";
import Reservations from "./pages/Reservations/reservations.jsx";
import MyGarages from "./pages/MyGarages/myGarages.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create" element={<GarageForm />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/garages" element={<MyGarages />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
