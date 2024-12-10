import React, { useRef, useState } from "react";
import styles from "./landingPage.module.scss";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const searchRef = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const searchCountry = () => {
        let value = searchRef.current.value;
        navigate(`/home?country=${value}`);
    };
    const findNearbyParking = async () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const res = await response.json();
                    const countryName =
                        res.address.country || "Unknown country";
                    setLoading(false);
                    navigate(
                        `/home?country=${countryName}&lat=${latitude}&lon=${longitude}`
                    );
                } catch (error) {
                    console.error("Error fetching countryName:", error);
                    setError("Failed to retrieve country name");
                }
            });
        }
    };

    return (
        <div className={styles.landingPage}>
            <div className={styles.mainWindow}>
                <div className={styles.header}>
                    <h1>Reserve Parking Now & Save</h1>
                </div>

                <form
                    onSubmit={searchCountry}
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
                >
                    {loading ? <div className={styles.loader}></div> : null}
                    Find Parking Near Me
                </button>
            </div>

            {/* New Section: How It Works */}
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
