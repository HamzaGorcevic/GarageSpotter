import React, { useState, useEffect, useContext } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Loading } from "../../components/Loader/loader";
import styles from "./electricChargers.module.scss";
import { BASE_URL } from "../../config/config";
const MyElectricChargers = () => {
    const { authData } = useContext(AuthContext);
    const navigate = useNavigate();
    const [chargers, setChargers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const getElectricChargers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/getOwnerElectricChargers`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (response.ok) {
                const res = await response.json();
                setChargers(res?.value);
            } else {
                console.error("Failed to fetch electric chargers");
            }
        } catch (error) {
            console.error("Error fetching electric chargers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChargerDelete = async (chargerId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this charger station?"
            )
        ) {
            return;
        }
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/deleteElectricCharger?chargerId=${chargerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (response.ok) {
                setChargers((prev) =>
                    prev.filter((charger) => charger.id !== chargerId)
                );
            } else {
                console.error("Failed to delete electric charger");
            }
        } catch (error) {
            console.error("Error deleting electric charger:", error);
        }
    };

    useEffect(() => {
        if (authData?.token) {
            getElectricChargers();
        }
    }, [authData]);

    const filteredChargers = chargers
        .filter(
            (charger) =>
                charger.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                charger.countryName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                charger.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a.price - b.price;
            }
            return b.price - a.price;
        });

    if (loading) return <Loading />;

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title}>My Electric Chargers</h1>

                <div className={styles.searchContainer}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search chargers..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className={styles.addBtn}
                    >
                        Price:{" "}
                        {sortOrder === "asc" ? "Low to High" : "High to Low"}
                    </button>
                </div>

                {filteredChargers.length === 0 ? (
                    <p className={styles.noChargers}>
                        No electric chargers found.
                    </p>
                ) : (
                    <div className={styles.chargerList}>
                        {filteredChargers.map((charger, index) => (
                            <div
                                key={charger.id}
                                className={styles.chargerCard}
                            >
                                <div className={styles.chargerHeader}>
                                    <div className={styles.chargerNumber}>
                                        {index + 1}
                                    </div>
                                    <div className={styles.chargerInfo}>
                                        <h2 className={styles.locationName}>
                                            {charger.name},{" "}
                                            {charger.countryName}
                                        </h2>
                                        <p
                                            className={
                                                styles.verificationStatus
                                            }
                                        >
                                            {charger.isVerified
                                                ? "✓ Verified"
                                                : "Pending verification"}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.chargerDetails}>
                                    <p>
                                        <strong>Price per kWh:</strong> $
                                        {charger.price}
                                    </p>
                                    <p>
                                        <strong>Available chargers:</strong>{" "}
                                        {charger.availableSpots}
                                    </p>
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {charger.description}
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {charger.latitude}, {charger.longitude}
                                    </p>
                                </div>

                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() =>
                                            navigate(
                                                `/update/charger/${charger.id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                            handleChargerDelete(charger.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyElectricChargers;
