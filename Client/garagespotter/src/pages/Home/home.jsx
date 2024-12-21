import React, { useContext, useEffect, useState } from "react";
import styles from "./home.module.scss";
import MapComponent from "./map/mapComponent";
import { BASE_URL } from "../../config/config";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import getLatLngFromCountry from "../../hooks/useLocationName";
import { Loading } from "../../components/Loader/loader";

const Home = () => {
    const location = useLocation();
    const { authData } = useContext(AuthContext);
    const [garageSpots, setGarageSpots] = useState([]);
    const [electricChargers, setElectricChargers] = useState([]);
    const [mapInfo, setMapInfo] = useState({
        lat: null,
        lon: null,
        country: "Serbia",
    });

    useEffect(() => {
        const resolveLocation = async () => {
            const query = new URLSearchParams(location.search);
            const queryCountry = query.get("country") || "Serbia";

            // Otherwise, resolve lat/lon from the country name
            const resolvedLocation = await getLatLngFromCountry(queryCountry);
            setMapInfo({
                lat: resolvedLocation.lat,
                lon: resolvedLocation.lon,
                country: resolvedLocation.name || queryCountry,
            });
        };

        resolveLocation();
    }, [location]);

    useEffect(() => {
        if (!mapInfo.lat || !mapInfo.lon) return;

        const fetchGarageSpots = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/GarageSpot/getGaragSspotsByCountry?country=${mapInfo.country}`,
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
                const response = await fetch(
                    `${BASE_URL}/ElectricCharger/getElectricChargersByCountry?countryName=${mapInfo.country}`,
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
    }, [mapInfo, authData]);

    return (
        <div className={styles.homeContainer}>
            {mapInfo.lat && mapInfo.lon ? (
                <MapComponent
                    garageSpots={garageSpots}
                    eChargers={electricChargers}
                    lat={mapInfo.lat}
                    lon={mapInfo.lon}
                    country={mapInfo.country}
                />
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Home;
