import React, { useState, useEffect, useContext } from "react";
import styles from "../admin.module.scss";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/config";
import { DocumentDetailsModal } from "../../../components/Modals/DocumentDetailsModal/documentDetailsModal";
import ImagesModal from "../../../components/Modals/ImagesModal/imagesModal";

const GarageList = () => {
    const { authData } = useContext(AuthContext);
    const [garages, setGarages] = useState([]);
    const [filteredGarages, setFilteredGarages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDocumentModal, setShowDocumentModal] = useState("");
    const [showImagesModal, setShowImagesModal] = useState([]);
    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        garageId: null,
    });

    const fetchGarages = async () => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/getGarages`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            const data = await response.json();
            const garageData = data?.value || [];
            setGarages(garageData);
            setFilteredGarages(garageData);
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

    useEffect(() => {
        const filtered = garages.filter((garage) =>
            Object.values(garage)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredGarages(filtered);
    }, [searchTerm, garages]);

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
        setConfirmationModal({ show: false, garageId: null });
    };

    const verifyGarage = async (garageSpotId) => {
        try {
            const response = await fetch(`${BASE_URL}/Admin/verifyGarage`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: garageSpotId, verify: true }),
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Garage verified successfully.");
                fetchGarages();
            } else {
                toast.error(result.message || "Failed to verify garage.");
            }
        } catch (error) {
            console.error("Error verifying garage:", error);
            toast.error("Failed to verify garage.");
        }
    };

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Garage List</h2>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search garages..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                    {filteredGarages.map((garage) => (
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
                                        setShowDocumentModal(
                                            garage.verificationDocument
                                        );
                                    }}
                                >
                                    View Document
                                </button>
                                <button
                                    className={styles.detailsButton}
                                    onClick={() => {
                                        setShowImagesModal(garage.garageImages);
                                    }}
                                >
                                    View Images
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() =>
                                        setConfirmationModal({
                                            show: true,
                                            garageId: garage.id,
                                        })
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDocumentModal?.length > 0 && (
                <DocumentDetailsModal
                    documentFile={showDocumentModal}
                    setShowDocumentModal={setShowDocumentModal}
                />
            )}

            {showImagesModal?.length > 0 && (
                <ImagesModal
                    images={showImagesModal}
                    setShowImagesModal={setShowImagesModal}
                />
            )}

            {confirmationModal.show && (
                <div className={styles.confirmationModal}>
                    <div className={styles.modalContent}>
                        <h3>Confirm Deletion</h3>
                        <p>
                            Are you sure you want to delete this garage? This
                            action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() =>
                                    setConfirmationModal({
                                        show: false,
                                        garageId: null,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={() =>
                                    deleteGarage(confirmationModal.garageId)
                                }
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

export default GarageList;
