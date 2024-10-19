import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { authData, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>MyApp</div>
            <ul className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/reservations">My reservations</Link>
                </li>
                <li>
                    <Link to="/garages">My garages</Link>
                </li>
                <li>
                    <Link to="/create">Create Garage</Link>
                </li>

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
                    <li>
                        <button onClick={logout}>Logout</button>
                    </li>
                )}
            </ul>
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
        </nav>
    );
};

export default Navbar;
