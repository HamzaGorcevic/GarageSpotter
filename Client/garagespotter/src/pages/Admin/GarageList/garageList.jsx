import React, { useState, useEffect, useContext } from "react";
import styles from "./garageList.module.scss";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";
const GarageList = () => {
    const { authData } = useContext(AuthContext);
    const [garages, setGarages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const fetchGarages = async () => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/getGarages`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            const data = await response.json();
            setGarages(data?.value || []);
        } catch (error) {
            console.error("Error fetching garages:", error);
            toast.error("Failed to load garages.");
        }
    };

    useEffect(() => {
        if (authData?.token) {
            fetchGarages();
        }
    }, [authData]);

    const deleteGarage = async (garageSpotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/deleteGarage?garageSpotId=${garageSpotId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            const result = await response.json();

            if (result.success) {
                toast.success("Garage deleted successfully.");
                setGarages(
                    garages.filter((garage) => garage.id !== garageSpotId)
                );
            } else {
                toast.error(result.message || "Failed to delete garage.");
            }
        } catch (error) {
            console.error("Error deleting garage:", error);
            toast.error("Failed to delete garage.");
        }
    };

    const verifyGarage = async (garageSpotId) => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/verifyGarage`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ garageSpotId }),
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Garage verified successfully.");
                setGarages(
                    garages.map((garage) =>
                        garage.id === garageSpotId
                            ? { ...garage, isVerified: true }
                            : garage
                    )
                );
            } else {
                toast.error(result.message || "Failed to verify garage.");
            }
        } catch (error) {
            console.error("Error verifying garage:", error);
            toast.error("Failed to verify garage.");
        }
    };

    return (
        <div className={styles.garageList}>
            <h2 className={styles.title}>Garage List</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Location Name</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Latitude</th>
                        <th>longitude</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {garages.map((garage) => (
                        <tr key={garage.id}>
                            <td>{garage.locationName}</td>
                            <td>{garage.countryName}</td>
                            <td>
                                {garage.isAvailable ? "Available" : "Occupied"}
                            </td>
                            <td>${garage.price}</td>
                            <td>{garage.latitude}</td>
                            <td>{garage.longitude}</td>

                            <td className={styles.actions}>
                                <button
                                    className={styles.verifyButton}
                                    onClick={() => verifyGarage(garage.id)}
                                    disabled={garage.isVerified}
                                >
                                    {garage.isVerified ? "Verified" : "Verify"}
                                </button>
                                <button
                                    className={styles.detailsButton}
                                    onClick={() => {
                                        setShowModal(true);
                                    }}
                                >
                                    Details
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => deleteGarage(garage.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GarageList;
