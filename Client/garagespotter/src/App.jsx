import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/register";
import Login from "./pages/Login/login";
import Home from "./pages/home";
import { AuthProvider } from "./context/AuthContext.jsx";
import GarageForm from "./pages/CreateGarage/garageForm.jsx";
import Navbar from "./components/Modals/Navbar/Navbar.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create" element={<GarageForm />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
