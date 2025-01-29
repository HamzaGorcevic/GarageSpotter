import React, { useState, useEffect, useContext } from "react";
import { gql } from "@apollo/client";
import { apolloClient } from "../../config/apolloClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loader/loader";
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

    return !loading ? (
        <div className={styles.container}>
            <h1 className={styles.title}>My Garages</h1>
            <div className={styles.garageList}>
                {!garageSpots || garageSpots?.length === 0 ? (
                    <p className={styles.noGarages}>
                        No garage spots available.
                    </p>
                ) : (
                    garageSpots?.map((garage) => (
                        <div className={styles.garageCard} key={garage.id}>
                            <h2 className={styles.locationName}>
                                {garage.locationName}, {garage.countryName}
                            </h2>
                            <p>
                                <strong>Price:</strong> ${garage.price}
                            </p>
                            <p>
                                <strong>Is verified:</strong>{" "}
                                {garage.isVerified ? "Yes" : "Pending ..."}
                            </p>
                            <p>
                                <strong>Total Spots:</strong>{" "}
                                {garage.totalSpots.length}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {garage.latitude},{" "}
                                <strong>Longitude:</strong> {garage.longitude}
                            </p>
                            <button
                                className={styles.addBtn}
                                onClick={() => navigate(`/update/${garage.id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleGarageDelete(garage.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default MyGarages;
