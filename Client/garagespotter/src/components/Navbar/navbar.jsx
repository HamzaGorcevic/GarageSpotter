import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./navbar.module.scss";
import { AuthContext } from "../../context/AuthContext";
import NavDropdown from "./navbarDropDown";

const Navbar = () => {
    const { authData, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close the menu when the route changes
    useEffect(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [location]);

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
                        {authData.user?.role !== "Admin" ? (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/home">Dashboard</Link>
                                </li>

                                <NavDropdown label="Services">
                                    <li>
                                        <Link to="/create">Create Garage</Link>
                                    </li>
                                    <li>
                                        <Link to="/create/charger">
                                            Create Electric Charger
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/reservations">
                                            Reservations
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/favorites">Favorites</Link>
                                    </li>
                                </NavDropdown>

                                {authData.user?.role === "Owner" && (
                                    <NavDropdown label="My Business">
                                        <li>
                                            <Link to="/garages">
                                                My Garages
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/chargers">
                                                My E Chargers
                                            </Link>
                                        </li>
                                    </NavDropdown>
                                )}
                            </>
                        ) : (
                            <>
                                {authData.user?.role === "Admin" && (
                                    <li>
                                        <Link to="/admin">Admin Panel</Link>
                                    </li>
                                )}
                            </>
                        )}

                        <NavDropdown label="Account">
                            <li>
                                <Link to="/edit-profile">Edit Profile</Link>
                            </li>
                            <li>
                                <button
                                    className={styles.logoutButton}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </NavDropdown>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
