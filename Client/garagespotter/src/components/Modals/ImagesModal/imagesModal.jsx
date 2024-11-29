import React, { useState } from "react";
import styles from "./imagesModal.module.scss";

const ImagesModal = ({ images, setShowImagesModal }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log(images);
    if (!images || images.length === 0) {
        return <div>No images to display</div>;
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };
    window.addEventListener("keydown",(e)=>{
        console.log(e,"clicked");
        if(e.key == "Escape"){
            setShowImagesModal(false)
        }
    })

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button
                    className={styles.closeButton}
                    onClick={() => setShowImagesModal([])}
                >
                    &times;
                </button>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className={styles.image}
                />
                <button className={styles.prevButton} onClick={goToPrevious}>
                    &#9664;
                </button>
                <button className={styles.nextButton} onClick={goToNext}>
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
