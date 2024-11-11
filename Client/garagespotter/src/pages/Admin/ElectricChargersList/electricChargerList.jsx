import React, { useState, useEffect, useContext } from "react";
import styles from "./electricCharger.module.scss";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";
import { DocumentDetailsModal } from "../../../components/Modals/DocumentDetailsModal/documentDetailsModal";

const ChargerList = () => {
    const { authData } = useContext(AuthContext);
    const [chargers, setChargers] = useState([]);
    const [showDocumentModal, setShowDocumentModal] = useState("");
    const fetchChargers = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/getElectricChargers`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            const data = await response.json();
            setChargers(data?.value || []);
        } catch (error) {
            console.error("Error fetching chargers:", error);
            toast.error("Failed to load chargers.");
        }
    };

    useEffect(() => {
        if (authData?.token) {
            fetchChargers();
        }
    }, [authData]);

    const deleteCharger = async (chargerId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/deleteElectricCharger?chargerId=${chargerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            const result = await response.json();

            if (result.success) {
                toast.success("Charger deleted successfully.");
                setChargers(
                    chargers.filter((charger) => charger.id !== chargerId)
                );
            } else {
                toast.error(result.message || "Failed to delete charger.");
            }
        } catch (error) {
            console.error("Error deleting charger:", error);
            toast.error("Failed to delete charger.");
        }
    };

    const verifyCharger = async (chargerId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/verifyElectricCharger`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: chargerId, verify: true }),
                }
            );
            const result = await response.json();

            if (result.success) {
                toast.success("Charger verified successfully.");
                fetchChargers();
                setChargers(
                    chargers.filter((charger) => charger.id !== chargerId)
                );
            } else {
                toast.error(result.message || "Failed to verify charger.");
            }
        } catch (error) {
            console.error("Error verifying charger:", error);
            toast.error("Failed to verify charger.");
        }
    };

    return (
        <div className={styles.chargerList}>
            <h2 className={styles.title}>Electric Charger List</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Charger Type</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chargers.map((charger) => (
                        <tr key={charger.id}>
                            <td>{charger.name}</td>
                            <td>{charger.countryName}</td>
                            <td>
                                {charger.isAvailable ? "Available" : "Occupied"}
                            </td>
                            <td>${charger.price}</td>
                            <td>{charger.chargerType}</td>

                            <td>{charger.latitude}</td>
                            <td>{charger.longitude}</td>

                            <td className={styles.actions}>
                                <button
                                    className={styles.verifyButton}
                                    onClick={() => verifyCharger(charger.id)}
                                    disabled={charger.isVerified}
                                >
                                    {charger.isVerified ? "Verified" : "Verify"}
                                </button>
                                <button
                                    className={styles.detailsButton}
                                    onClick={() => {
                                        setShowDocumentModal(
                                            charger.verificationDocument
                                        );
                                    }}
                                >
                                    Document Details
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => deleteCharger(charger.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDocumentModal.length > 0 && (
                <DocumentDetailsModal
                    documentFile={showDocumentModal}
                    setShowDocumentModal={setShowDocumentModal}
                />
            )}
        </div>
    );
};

export default ChargerList;
