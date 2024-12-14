import React from "react";
import styles from "./editProfile.module.scss";

const TabHeader = ({ activeTab, onTabChange }) => {
    return (
        <div className={styles.header}>
            <button
                className={
                    activeTab === "profile" ? styles.activeTab : styles.tab
                }
                onClick={() => onTabChange("profile")}
            >
                Profile
            </button>
            <button
                className={
                    activeTab === "password" ? styles.activeTab : styles.tab
                }
                onClick={() => onTabChange("password")}
            >
                Password
            </button>
            <button
                className={
                    activeTab === "delete" ? styles.activeTab : styles.tab
                }
                onClick={() => onTabChange("delete")}
            >
                Delete Account
            </button>
        </div>
    );
};

export default TabHeader;
