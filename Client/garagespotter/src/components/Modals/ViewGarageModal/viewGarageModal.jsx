import React, { useState } from "react";
import styles from "./viewGarageModal.module.scss";

const ViewGarageModal = ({ garage, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const closeModal = (e) => {
        if (e.target.classList.contains(styles.modal)) {
            onClose();
        }
    };

    const previousImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(garage.garageImages.length - 1);
        }
    };

    const nextImage = () => {
        if (currentImageIndex < garage.garageImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal} onClick={closeModal}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>

                    <h2 className={styles.modalTitle}>
                        {garage.locationName}, {garage.countryName}
                    </h2>

                    {garage.garageImages && garage.garageImages.length > 0 && (
                        <div className={styles.imageSlider}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={garage.garageImages[currentImageIndex]}
                                    alt="Garage"
                                />
                            </div>
                            <button
                                className={`${styles.arrow} ${styles.arrowLeft}`}
                                onClick={previousImage}
                            >
                                &#10094;
                            </button>
                            <button
                                className={`${styles.arrow} ${styles.arrowRight}`}
                                onClick={nextImage}
                            >
                                &#10095;
                            </button>
                        </div>
                    )}

                    <div className={styles.garageDetails}>
                        <p>
                            <strong>Location:</strong> {garage.locationName},{" "}
                            {garage.countryName}
                        </p>
                        <p>
                            <strong>Price:</strong> ${garage.price}
                        </p>
                        <p>
                            <strong>Latitude:</strong> {garage.latitude}
                        </p>
                        <p>
                            <strong>Longitude:</strong> {garage.longitude}
                        </p>
                        <p>
                            <strong>Total Spots:</strong>{" "}
                            {garage.totalSpots.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewGarageModal;
