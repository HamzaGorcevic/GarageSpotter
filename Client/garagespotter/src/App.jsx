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
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/admin.jsx";
import ProtectedRoute from "./helpers/ProtectedRoute/index.jsx";
import AccessDenied from "./pages/AccesDenied/accesDenied.jsx";
import { NotFound } from "./pages/notFound/notFound.jsx";
import EditProfile from "./pages/EditProfile/editProfile.jsx";

function App() {
    return (
        <Router>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: "",
                    duration: 5000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },

                    success: {
                        duration: 3000,
                        theme: {
                            primary: "#1a73e8",
                            secondary: "#dadce0",
                        },
                    },
                }}
            />
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["User", "Owner"]} />
                        }
                    >
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/create" element={<GarageForm />} />
                        <Route path="/update/:id" element={<GarageForm />} />
                        <Route
                            path="/reservations"
                            element={<Reservations />}
                        />
                        <Route path="/garages" element={<MyGarages />} />
                    </Route>
                    <Route
                        element={<ProtectedRoute allowedRoles={["Owner"]} />}
                    >
                        <Route path="/garages" element={<MyGarages />} />
                    </Route>
                    <Route
                        element={<ProtectedRoute allowedRoles={["Admin"]} />}
                    >
                        <Route path="/admin" element={<Admin />} />
                    </Route>

                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/access-denied" element={<AccessDenied />} />
                    <Route path="/not-found" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
