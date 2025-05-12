import React, { useRef, useState, useEffect } from "react";
import styles from "./landingPage.module.scss";
import { useNavigate } from "react-router-dom";
import { getCurrentPosition } from "../../utils/geolocation";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapConstant from "../Home/map/constants/constantMap";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { blueIcon } from "../../assets/icons/mapicons";

// Custom marker component for react-leaflet
const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return position ? <Marker position={position} icon={blueIcon} /> : null;
};

const LandingPage = () => {
    const searchRef = useRef();
    const navigate = useNavigate();

    // State variables
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationStatus, setLocationStatus] = useState("pending"); // 'pending', 'granted', 'denied'
    const [showLocationPrompt, setShowLocationPrompt] = useState(true);

    // Ask for location permission when component mounts
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    setLocationStatus(result.state);
                    if (result.state === "granted") {
                        setShowLocationPrompt(false);
                        // Get initial position
                        getCurrentPosition()
                            .then((position) => {
                                setSelectedPosition(position);
                            })
                            .catch(console.error);
                    }
                });
        } else {
            setLocationStatus("denied");
            setShowLocationPrompt(false);
        }
    }, []);

    // Function to handle location permission request
    const handleLocationPermission = async () => {
        setShowLocationPrompt(false);
        setLoading(true);
        try {
            const position = await getCurrentPosition();
            setSelectedPosition(position);
            setLocationStatus("granted");
        } catch (error) {
            console.error("Location error:", error);
            setLocationStatus("denied");
            setShowModal(true);
            setErrorMessage(
                "Please select your starting point on the map for better results."
            );
        } finally {
            setLoading(false);
        }
    };

    // Function to handle country search
    const searchCountry = async (e) => {
        e.preventDefault();
        const value = searchRef.current.value?.trim();

        if (!value) {
            setErrorMessage("Please enter a country name.");
            return;
        }

        if (!selectedPosition) {
            setErrorMessage(
                "Please select your starting point for better results."
            );
            setShowModal(true);
            return;
        }

        // Proceed with the search
        navigate(
            `/home?country=${encodeURIComponent(value)}&userLat=${
                selectedPosition.lat
            }&userLng=${selectedPosition.lng}`
        );
    };

    // Function to find nearby parking
    const findNearbyParking = async () => {
        try {
            let position;
            try {
                position = await getCurrentPosition();
            } catch (error) {
                position = selectedPosition;
                console.log(selectedPosition, "selected points");
            }
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json&zoom=18&addressdetails=1`
            );

            if (!response.ok) throw new Error("Failed to get location details");

            const data = await response.json();
            if (!data.address?.country)
                throw new Error("Could not determine your country");

            navigate(
                `/home?country=${encodeURIComponent(
                    data.address.country
                )}&userLat=${position.lat}&userLng=${position.lng}`
            );
        } catch (error) {
            console.error("Location error:", error);
            setErrorMessage(
                "Could not determine your location. Please select manually."
            );
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };
    function LeafletgeoSearch() {
        const map = useMap();
        useEffect(() => {
            const provider = new OpenStreetMapProvider();

            const searchControl = new GeoSearchControl({
                provider,
                style: "bar",
                showMarker: false,
            });

            map.addControl(searchControl);
            return () => map.removeControl(searchControl);
        }, []);

        return null;
    }

    return (
        <div className={styles.landingPage}>
            {/* Location Permission Prompt */}
            {showLocationPrompt && (
                <div className={styles.locationPrompt}>
                    <div className={styles.promptContent}>
                        <h3>Enable Location Services</h3>
                        <p>
                            Allow access to your location for better parking
                            recommendations near you.
                        </p>
                        <div className={styles.promptActions}>
                            <button
                                onClick={handleLocationPermission}
                                className={styles.acceptButton}
                            >
                                Allow Location Access
                            </button>
                            <button
                                onClick={() => {
                                    setShowLocationPrompt(false);
                                    setShowModal(true);
                                }}
                                className={styles.denyButton}
                            >
                                Select Manually
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Window */}
            <div className={styles.mainWindow}>
                <div className={styles.header}>
                    <h1>Reserve Parking Now & Save</h1>
                    {selectedPosition && (
                        <p className={styles.locationStatus}>
                            Starting point selected ✓
                        </p>
                    )}
                </div>
                <form
                    onSubmit={searchCountry}
                    className={styles.searchContainer}
                >
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Enter country name"
                        className={styles.searchBar}
                    />
                    <button className={styles.searchButton} type="submit">
                        Search
                    </button>
                </form>
                <button
                    onClick={findNearbyParking}
                    className={styles.nearbyButton}
                    disabled={loading}
                >
                    {loading ? (
                        <div className={styles.loader}></div>
                    ) : (
                        "Find Parking Near My Point"
                    )}
                </button>
                {!selectedPosition && (
                    <button
                        onClick={() => setShowModal(true)}
                        className={styles.selectLocationButton}
                    >
                        Select Starting Point
                    </button>
                )}
            </div>

            {/* Modal for Manual Location Selection */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Select Your Starting Point</h3>
                        {errorMessage && (
                            <p className={styles.errorMessage}>
                                {errorMessage}
                            </p>
                        )}
                        <div className={styles.mapContainer}>
                            <MapContainer
                                center={selectedPosition || [21.505, 40.09]}
                                zoom={13}
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    marginBottom: "20px",
                                }}
                            >
                                <LeafletgeoSearch />

                                <TileLayer
                                    url={
                                        MapConstant.tileLayer ||
                                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    }
                                    attribution={MapConstant.attribution}
                                />
                                <LocationMarker
                                    position={selectedPosition}
                                    setPosition={setSelectedPosition}
                                />
                            </MapContainer>
                            <p className={styles.mapInstruction}>
                                Click on the map to select your starting point
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => {
                                    if (selectedPosition) {
                                        setShowModal(false);
                                        setErrorMessage("");
                                    } else {
                                        setErrorMessage(
                                            "Please select a starting point on the map"
                                        );
                                    }
                                }}
                                className={styles.modalConfirmButton}
                            >
                                Confirm Location
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setErrorMessage("");
                                }}
                                className={styles.modalCloseButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            <div className={styles.howItWorks}>
                <h2>How It Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <img
                            src="https://images.prismic.io/spothero/75c23d5f-4186-47e7-a509-1de92d779b7a_8a7dbd48-4df5-4a26-9a76-611d8183bd86_faq-map.webp?auto=compress,format"
                            alt="Look"
                        />
                        <div className={styles.content}>
                            <h3>Look</h3>
                            <p>
                                Browse parking slots posted by garage owners in
                                your area or country.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <img
                            src="https://images.prismic.io/spothero/290a7d11-ef71-4c4a-8caf-5a5bfc390deb_d837206c-d8de-4b0c-a491-2ba5b94563df_faq-pass.webp?auto=compress,format"
                            alt="Book"
                        />
                        <div className={styles.content}>
                            <h3>Book</h3>
                            <p>
                                Reserve your parking slot and pay instantly via
                                our secure platform.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <img
                            src="https://images.prismic.io/spothero/b0651627-3881-4d29-8c9a-2519e73be525_e8b36b04-1ad0-406a-b609-63ace2e3937e_faq-car.webp?auto=compress,format"
                            alt="Park"
                        />
                        <div className={styles.content}>
                            <h3>Park</h3>
                            <p>
                                Follow the directions to your parking spot,
                                park, and enjoy a hassle-free experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
