import React, { useContext, useEffect, useState } from "react";
import styles from "./home.module.scss";
import MapComponent from "./map/mapComponent";
import { BASE_URL } from "../../config/config";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCountryCoordinates } from "../../utils/countryCoords";
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
        userLat: null,
        userLng: null,
    });

    useEffect(() => {
        const resolveLocation = async () => {
            const query = new URLSearchParams(location.search);
            const queryCountry = query.get("country") || "Serbia";
            const userLat = query.get("userLat");
            const userLng = query.get("userLng");

            try {
                const countryLocation = await getCountryCoordinates(
                    queryCountry
                );
                setMapInfo({
                    lat: countryLocation.lat,
                    lon: countryLocation.lon,
                    country: countryLocation.name || queryCountry,
                    userLat: userLat || null,
                    userLng: userLng || null,
                });
            } catch (error) {
                console.error("Error resolving location:", error);
                // Fallback to default coordinates if country lookup fails
                setMapInfo({
                    lat: "44.787197", // Default coordinates (Serbia)
                    lon: "20.457273",
                    country: queryCountry,
                    userLat: userLat || null,
                    userLng: userLng || null,
                });
            }
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
                    userLat={mapInfo.userLat}
                    userLng={mapInfo.userLng}
                    country={mapInfo.country}
                />
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Home;
