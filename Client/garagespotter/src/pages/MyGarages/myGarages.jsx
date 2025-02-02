import React, { useState, useEffect, useContext } from "react";
import { gql } from "@apollo/client";
import { apolloClient } from "../../config/apolloClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loader/loader";
import { Search } from "lucide-react";
import styles from "./myGarages.module.scss";

const DELETE_GARAGE_MUTATION = gql`
    mutation DeleteGarage($input: DeleteGarageSpotInput!) {
        deleteGarage(input: $input) {
            value
            message
            success
        }
    }
`;

const GET_GARAGES = gql`
    query GetGarages {
        garageSpots {
            id
            locationName
            countryName
            isAvailable
            price
            latitude
            longitude
            isVerified
            verificationDocument
            garageImages
            totalSpots {
                id
            }
        }
    }
`;
const MyGarages = () => {
    const { authData } = useContext(AuthContext);
    const [garageSpots, setGarageSpots] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const getMyGarages = async () => {
        setLoading(true);
        try {
            const { data } = await apolloClient.query({
                query: GET_GARAGES,
                fetchPolicy: "network-only",
            });
            setGarageSpots(data.garageSpots);
        } catch (error) {
            console.error("Error fetching garage spots:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGarageDelete = async (spotId) => {
        if (!window.confirm("Are you sure you want to delete this garage?")) {
            return;
        }

        try {
            const { data } = await apolloClient.mutate({
                mutation: DELETE_GARAGE_MUTATION,
                variables: {
                    input: {
                        spotId: spotId,
                    },
                },
            });
            if (data.deleteGarage.success) {
                setGarageSpots((prev) =>
                    prev.filter((garage) => garage.id !== spotId)
                );
            } else {
                console.error(data.deleteGarage.message);
            }
        } catch (error) {
            console.error("Error deleting garage spot:", error);
        }
    };

    useEffect(() => {
        if (authData?.token) {
            getMyGarages();
        }
    }, [authData]);

    const filteredGarages = garageSpots
        .filter(
            (garage) =>
                garage.locationName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                garage.countryName
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
                <h1 className={styles.title}>My Garages</h1>

                <div className={styles.searchContainer}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Search garages..."
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

                {filteredGarages.length === 0 ? (
                    <p className={styles.noGarages}>
                        No garage spots available.
                    </p>
                ) : (
                    <div className={styles.garageList}>
                        {filteredGarages.map((garage, index) => (
                            <div key={garage.id} className={styles.garageCard}>
                                <div className={styles.garageHeader}>
                                    <div className={styles.garageNumber}>
                                        {index + 1}
                                    </div>
                                    <div className={styles.garageInfo}>
                                        <h2 className={styles.locationName}>
                                            {garage.locationName},{" "}
                                            {garage.countryName}
                                        </h2>
                                        <p
                                            className={
                                                styles.verificationStatus
                                            }
                                        >
                                            {garage.isVerified
                                                ? "✓ Verified"
                                                : "Pending verification"}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.garageDetails}>
                                    <p>
                                        <strong>Price:</strong> ${garage.price}
                                    </p>
                                    <p>
                                        <strong>Total Spots:</strong>{" "}
                                        {garage.totalSpots.length}
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {garage.latitude}, {garage.longitude}
                                    </p>
                                </div>

                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() =>
                                            navigate(`/update/${garage.id}`)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                            handleGarageDelete(garage.id)
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

export default MyGarages;
