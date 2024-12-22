import React, { useRef, useState } from "react";
import styles from "./landingPage.module.scss";
import { useNavigate } from "react-router-dom";
import { getCurrentPosition } from "../../utils/geolocation";

const LandingPage = () => {
    const searchRef = useRef();
    const modalSearchRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const searchCountry = () => {
        const value = searchRef.current.value?.trim();
        if (value) {
            navigate(`/home?country=${encodeURIComponent(value)}`);
        }
    };

    const modalSearchCountry = () => {
        const value = modalSearchRef.current.value?.trim();
        if (value) {
            setShowModal(false);
            navigate(`/home?country=${encodeURIComponent(value)}`);
        }
    };

    const findNearbyParking = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            // Get precise location
            const position = await getCurrentPosition();
            console.log(position);
            // Reverse geocoding with better error handling
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json&zoom=18&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error("Failed to get location details");
            }

            const data = await response.json();

            if (!data.address?.country) {
                throw new Error("Could not determine your country");
            }

            navigate(
                `/home?country=${encodeURIComponent(
                    data.address.country
                )}&userLat=${position.lat}&userLng=${position.lng}`
            );
        } catch (error) {
            console.error("Location error:", error);
            setErrorMessage(error.message);
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.landingPage}>
            <div className={styles.mainWindow}>
                <div className={styles.header}>
                    <h1>Reserve Parking Now & Save</h1>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        searchCountry();
                    }}
                    className={styles.searchContainer}
                >
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Country"
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
                        "Find Parking Near Me"
                    )}
                </button>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Location Access Issue</h3>
                        <p>
                            {errorMessage ||
                                "Please allow location access or search manually."}
                        </p>
                        <div className={styles.modalActions}>
                            <input
                                ref={modalSearchRef}
                                type="text"
                                placeholder="Enter country"
                                className={styles.modalSearchBar}
                            />
                            <button
                                onClick={modalSearchCountry}
                                className={styles.modalSearchButton}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setErrorMessage("");
                                }}
                                className={styles.modalCloseButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
