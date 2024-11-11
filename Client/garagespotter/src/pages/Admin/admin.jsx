import React, { useState } from "react";
import style from "./admin.module.scss";
import GarageList from "./GarageList/garageList";
import ChargerList from "./ElectricChargersList/electricChargerList";
import UsersList from "./UsersList/usersList";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("garages");

    return (
        <div className={style.adminContainer}>
            <h1 className={style.pageTitle}>Admin Dashboard</h1>
            <div className={style.header}>
                <button
                    className={
                        activeTab === "garages" ? style.activeTab : style.tab
                    }
                    onClick={() => setActiveTab("garages")}
                >
                    Garage List
                </button>
                <button
                    className={
                        activeTab === "chargers" ? style.activeTab : style.tab
                    }
                    onClick={() => setActiveTab("chargers")}
                >
                    Charger List
                </button>{" "}
                <button
                    className={
                        activeTab === "users" ? style.activeTab : style.tab
                    }
                    onClick={() => setActiveTab("users")}
                >
                    Users List
                </button>
            </div>

            {activeTab === "garages" && <GarageList />}
            {activeTab === "chargers" && <ChargerList />}
            {activeTab === "users" && <UsersList />}
        </div>
    );
};

export default Admin;
