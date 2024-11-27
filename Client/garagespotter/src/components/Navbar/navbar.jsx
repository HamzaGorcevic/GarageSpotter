import React, { useContext, useEffect, useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import styles from "./navbar.module.scss";

const Navbar = () => {
    const { authData, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log(authData,authData.token);
    const handleLogout = () => {
        logout();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>MyApp</div>
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            <ul
                className={`${styles.navLinks} ${
                    isMenuOpen ? styles.active : ""
                }`}
            >
                {!authData.token ? (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        {authData.user?.role != "Admin" ? (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/home">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/create">Create Garage</Link>
                                </li>
                                <li>
                                    <Link to="/create/charger">
                                        Create Electric Charger
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/favorites">Favorites</Link>
                                </li>
                                <li>
                                    <Link to="/reservations">Reservations</Link>
                                </li>
                                
                                {authData.user?.role === "Owner" && (
                                    <>
                                    <li>
                                    <Link to="/garages">My Garages</Link>
                                </li>
                                <li>
                                    <Link to="/chargers">My E Chargers</Link>
                                </li>
                                    </>
                        )}
                            </>
                        ) : (
                            <>
                                {authData.user &&
                                    authData.user.role === "Admin" && (
                                        <>
                                            <li>
                                                <Link to="/admin">
                                                    Admin Panel
                                                </Link>
                                            </li>
                                        </>
                                    )}
                            </>
                        )}
                        <li>
                            <Link to="/edit-profile">Edit profile</Link>
                        </li>
                        <li>
                            <button
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
