import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3 className={styles.logo}>GarageSpotter</h3>
                    <p>Find and reserve your perfect parking spot</p>
                </div>

                <div className={styles.footerSection}>
                    <h4>Quick Links</h4>
                    <ul>
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
                            <Link to="/reservations">Reservations</Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h4>Support</h4>
                    <ul>
                        <li>
                            <Link to="/privacy">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/terms">Terms of Service</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>
                    &copy; {new Date().getFullYear()} GarageSpotter. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
