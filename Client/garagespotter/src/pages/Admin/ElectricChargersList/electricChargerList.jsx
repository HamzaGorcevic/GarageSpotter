import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";
import styles from "../admin.module.scss";
import DocumentDetailsModal from "../../../components/Modals/DocumentDetailsModal/documentDetailsModal";
const ChargerList = () => {
    const { authData } = useContext(AuthContext);
    const [chargers, setChargers] = useState([]);
    const [showDocumentModal, setShowDocumentModal] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedChargerId, setSelectedChargerId] = useState(null);

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

    const handleDeleteClick = (chargerId) => {
        setSelectedChargerId(chargerId);
        setShowDeleteModal(true);
    };

    const deleteCharger = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/Admin/deleteElectricCharger?chargerId=${selectedChargerId}`,
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
                    chargers.filter(
                        (charger) => charger.id !== selectedChargerId
                    )
                );
            } else {
                toast.error(result.message || "Failed to delete charger.");
            }
        } catch (error) {
            console.error("Error deleting charger:", error);
            toast.error("Failed to delete charger.");
        } finally {
            setShowDeleteModal(false);
            setSelectedChargerId(null);
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
            } else {
                toast.error(result.message || "Failed to verify charger.");
            }
        } catch (error) {
            console.error("Error verifying charger:", error);
            toast.error("Failed to verify charger.");
        }
    };

    const filteredChargers = chargers.filter((charger) =>
        Object.values(charger)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Electric Charger List</h2>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search chargers..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                    {filteredChargers.map((charger) => (
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
                                    onClick={() =>
                                        handleDeleteClick(charger.id)
                                    }
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

            {showDeleteModal && (
                <div className={styles.confirmationModal}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this charger?</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={deleteCharger}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChargerList;
