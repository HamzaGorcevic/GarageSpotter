import React, { useState, useEffect } from "react";
import styles from "./imagesModal.module.scss";

const ImagesModal = ({ images, setShowImagesModal }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setShowImagesModal(false);
        } else if (e.key === "ArrowRight") {
            goToNext();
        } else if (e.key === "ArrowLeft") {
            goToPrevious();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    if (!images || images.length === 0) {
        return <div className={styles.error}>No images to display</div>;
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button
                    className={styles.closeButton}
                    onClick={() => setShowImagesModal(false)}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <div className={styles.imageContainer}>
                    {images.map((imageUrl, index) => (
                        <img
                            key={imageUrl}
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className={`${styles.image} ${
                                index === currentIndex ? styles.active : ""
                            }`}
                        />
                    ))}
                </div>

                <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={goToPrevious}
                    aria-label="Previous image"
                >
                    &#9664;
                </button>
                <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={goToNext}
                    aria-label="Next image"
                >
                    &#9654;
                </button>

                <div className={styles.imageCounter}>
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ImagesModal;
