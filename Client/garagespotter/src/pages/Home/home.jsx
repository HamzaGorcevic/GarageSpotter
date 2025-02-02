import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCountryCoordinates } from "../../utils/countryCoords";
import { Loading } from "../../components/Loader/loader";
import MapComponent from "./map/mapComponent";
import styles from "./home.module.scss";
import { BASE_URL } from "../../config/config";

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

    // Function to save map info to local storage
    const saveMapInfoToLocal = (info) => {
        localStorage.setItem("mapInfo", JSON.stringify(info));
        console.log("Saved to local storage:", info);
    };

    // Function to load map info from local storage
    const loadMapInfoFromLocal = () => {
        const storedInfo = localStorage.getItem("mapInfo");
        if (storedInfo) {
            const parsedInfo = JSON.parse(storedInfo);
            console.log("Loaded from local storage:", parsedInfo);
            return parsedInfo;
        }
        return null;
    };

    useEffect(() => {
        const resolveLocation = async () => {
            const query = new URLSearchParams(location.search);
            const queryCountry = query.get("country");
            const userLat = query.get("userLat");
            const userLng = query.get("userLng");

            try {
                // Check if new values are provided in the query parameters
                if (queryCountry || userLat || userLng) {
                    console.log("New query parameters detected:", {
                        queryCountry,
                        userLat,
                        userLng,
                    });

                    const countryToUse = queryCountry || "Serbia";
                    const countryLocation = await getCountryCoordinates(
                        countryToUse
                    );

                    const updatedMapInfo = {
                        lat: countryLocation.lat,
                        lon: countryLocation.lon,
                        country: countryLocation.name || countryToUse,
                        userLat: userLat || null,
                        userLng: userLng || null,
                    };

                    setMapInfo(updatedMapInfo);
                    saveMapInfoToLocal(updatedMapInfo); // Save new data to local storage
                } else {
                    // Try to load from local storage
                    const storedMapInfo = loadMapInfoFromLocal();
                    if (storedMapInfo) {
                        console.log("Using local storage data.");
                        setMapInfo(storedMapInfo);
                    } else {
                        // Only use default if there's no stored data
                        console.log("No local storage data. Using defaults.");
                        const defaultMapInfo = {
                            lat: "44.787197",
                            lon: "20.457273",
                            country: "Serbia",
                            userLat: null,
                            userLng: null,
                        };
                        setMapInfo(defaultMapInfo);
                        saveMapInfoToLocal(defaultMapInfo);
                    }
                }
            } catch (error) {
                console.error("Error resolving location:", error);
                // Use stored data as fallback if available
                const storedMapInfo = loadMapInfoFromLocal();
                if (storedMapInfo) {
                    setMapInfo(storedMapInfo);
                } else {
                    // Only use default as last resort
                    const defaultMapInfo = {
                        lat: "44.787197",
                        lon: "20.457273",
                        country: "Serbia",
                        userLat: null,
                        userLng: null,
                    };
                    setMapInfo(defaultMapInfo);
                    saveMapInfoToLocal(defaultMapInfo);
                }
            }
        };

        resolveLocation();
    }, [location]);

    useEffect(() => {
        // Fetch garage spots and electric chargers when mapInfo updates
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
