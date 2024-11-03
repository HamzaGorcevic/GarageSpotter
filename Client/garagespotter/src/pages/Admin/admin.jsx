// Admin.js
import React from "react";
import style from "./admin.module.scss";
import GarageList from "./GarageList/garageList";

const Admin = () => {
    return (
        <div className={style.adminContainer}>
            <h1 className={style.pageTitle}>Admin Dashboard</h1>
            <GarageList />
        </div>
    );
};

export default Admin;
