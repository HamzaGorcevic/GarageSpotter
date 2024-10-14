import React, { useEffect, useState } from "react";

import styles from "./Home.module.scss";
import MapComponent from "./map/Map";
import { BASE_URL } from "../../config/config";
const Home = () => {
    const [garageSpots, setGarageSpots] = useState([]);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [routeControl, setRouteControl] = useState(null);

    useEffect(() => {
        const fetchGarageSpots = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/GarageSpot/getgaragespots`
                );
                const data = await response.json();
                setGarageSpots(data.value);
                console.log(data.value);
            } catch (error) {
                console.error("Error fetching garage spots:", error);
            }
        };

        fetchGarageSpots();
    }, []);

    return (
        <div className={styles.homeContainer}>
            <h1>Free Parking Spots</h1>
            <MapComponent garageSpots={garageSpots} />
        </div>
    );
};

export default Home;
