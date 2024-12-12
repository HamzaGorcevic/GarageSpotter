import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";

const NavDropdown = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    // For desktop hover
    const handleMouseEnter = (e) => {
        if (window.innerWidth > 768) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = (e) => {
        if (window.innerWidth > 768) {
            setIsOpen(false);
        }
    };

    return (
        <li
            className={`${styles.dropdownContainer} ${
                isOpen ? styles.open : ""
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className={styles.dropdownTrigger} onClick={toggleDropdown}>
                {label}
                <span
                    className={`${styles.arrow} ${
                        isOpen ? styles.up : styles.down
                    }`}
                >
                    ▼
                </span>
            </button>
            <ul
                className={`${styles.dropdownMenu} ${
                    isOpen ? styles.show : ""
                }`}
            >
                {children}
            </ul>
        </li>
    );
};

export default NavDropdown;
