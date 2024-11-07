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

    useEffect(() => {
        const fetchGarageSpots = async () => {
            try {
                const query = new URLSearchParams(location.search);
                const country = query.get("country");
                console.log(authData);
                const response = await fetch(
                    `${BASE_URL}/GarageSpot/getGaragSspotsByCountry?country=${
                        country ? country : "Serbia"
                    }`,
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
        fetchGarageSpots();
    }, []);

    return (
        <div className={styles.homeContainer}>
            <MapComponent garageSpots={garageSpots} />
        </div>
    );
};

export default Home;
