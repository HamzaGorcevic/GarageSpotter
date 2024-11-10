import React, { useContext, useEffect, useState } from "react";
import styles from "./Home.module.scss";
import MapComponent from "./map/map";
import { BASE_URL } from "../../config/config";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
    const location = useLocation();
    const { authData } = useContext(AuthContext);
    const [garageSpots, setGarageSpots] = useState([]);
    const [electricChargers, setElectricChargers] = useState([]);

    useEffect(() => {
        const fetchGarageSpots = async () => {
            try {
                const query = new URLSearchParams(location.search);
                const country = query.get("country") || "Serbia";
                console.log(authData);
                const response = await fetch(
                    `${BASE_URL}/GarageSpot/getGaragSspotsByCountry?country=${country}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authData.token}`,
                        },
                    }
                );
                const data = await response.json();
                setGarageSpots(data.value);
            } catch (error) {
                console.error("Error fetching garage spots:", error);
            }
        };

        const fetchElectricChargers = async () => {
            try {
                const query = new URLSearchParams(location.search);
                const country = query.get("country") || "Serbia";
                const response = await fetch(
                    `${BASE_URL}/ElectricCharger/getElectricChargersByCountry?countryName=${country}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authData.token}`,
                        },
                    }
                );
                const data = await response.json();
                setElectricChargers(data.value);
            } catch (error) {
                console.error("Error fetching electric chargers:", error);
            }
        };

        fetchGarageSpots();
        fetchElectricChargers();
    }, [location, authData]);

    return (
        <div className={styles.homeContainer}>
            <MapComponent
                garageSpots={garageSpots}
                eChargers={electricChargers}
            />
        </div>
    );
};

export default Home;
