import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/register.jsx";
import Login from "./pages/Login/login.jsx";
import Home from "./pages/Home/home.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import GarageForm from "./pages/CreateGarage/garageForm.jsx";
import LandingPage from "./pages/LandingPage/landingPage.jsx";
import Reservations from "./pages/Reservations/reservations.jsx";
import MyGarages from "./pages/MyGarages/myGarages.jsx";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/admin.jsx";
import ProtectedRoute from "./helpers/ProtectedRoute/index.jsx";
import AccessDenied from "./pages/AccesDenied/accesDenied.jsx";
import { NotFound } from "./pages/notFound/notFound.jsx";
import EditProfile from "./pages/EditProfile/editProfile.jsx";
import CreateElectricCharger from "./pages/CreateElectricCharger/createElectricCharger.jsx";
import MyElectricChargers from "./pages/MyElectricChargers/myElectricChargers.jsx";
import Favorites from "./pages/Favorites/favorites.jsx";
import Footer from "./components/Footer/footer.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar/navbar.jsx";
import EmailVerification from "./components/EmailVerification/emailVerification.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/privacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService/termsOfService.jsx";
function App() {
    return (
        <GoogleOAuthProvider
            clientId={
                "338263297768-ch4slvrh0pjnrsb3enbg0ifasdnmhmun.apps.googleusercontent.com"
            }
        >
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
                            zIndex: 9999,
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
                                <ProtectedRoute
                                    allowedRoles={["User", "Owner"]}
                                />
                            }
                        >
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/create" element={<GarageForm />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route
                                path="/create/charger"
                                element={<CreateElectricCharger />}
                            />

                            <Route
                                path="/update/:id"
                                element={<GarageForm />}
                            />
                            <Route
                                path="/update/charger/:id"
                                element={<CreateElectricCharger />}
                            />
                            <Route
                                path="/reservations"
                                element={<Reservations />}
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute allowedRoles={["Owner"]} />
                            }
                        >
                            <Route path="/garages" element={<MyGarages />} />
                            <Route
                                path="/chargers"
                                element={<MyElectricChargers />}
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute allowedRoles={["Admin"]} />
                            }
                        >
                            <Route path="/admin" element={<Admin />} />
                        </Route>

                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route
                            path="/verify-email"
                            element={<EmailVerification />}
                        />
                        <Route
                            path="/access-denied"
                            element={<AccessDenied />}
                        />
                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
