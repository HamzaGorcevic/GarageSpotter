import React, { useState, useEffect, useContext } from "react";
import styles from "./myGarages.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const MyGarages = () => {
    const { authData } = useContext(AuthContext);
    const [garageSpots, setGarageSpots] = useState([]);
    const navigate = useNavigate();
    const getMyGarages = async () => {
        const response = await fetch(
            `${BASE_URL}/GarageSpot/getOwnerGarageSpots`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        const res = await response.json();
        setGarageSpots(res?.value);
    };
    useEffect(() => {
        if (authData?.token) {
            getMyGarages();
        }
    }, [authData]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Garages</h1>
            <div className={styles.garageList}>
                {!garageSpots || garageSpots?.length === 0 ? (
                    <p className={styles.noGarages}>
                        No garage spots available.
                    </p>
                ) : (
                    garageSpots?.map((garage) => (
                        <div className={styles.garageCard} key={garage.id}>
                            <h2 className={styles.locationName}>
                                {garage.locationName}, {garage.countryName}
                            </h2>
                            <p>
                                <strong>Price:</strong> ${garage.price}
                            </p>
                            <p>
                                <strong>Available:</strong>{" "}
                                {garage.isAvailable ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Total Spots:</strong>{" "}
                                {garage.totalSpots.length}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {garage.latitude},{" "}
                                <strong>Longitude:</strong> {garage.longitude}
                            </p>
                            <button
                                className={styles.editButton}
                                onClick={() => navigate(`/update/${garage.id}`)}
                            >
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyGarages;
