import React, { useRef } from "react";
import style from "./mapsidebar.module.scss";
import LeftArrow from "../../../../assets/images/leftArrow.svg";

const Sidebar = ({ isOpen, onClose, garageSpot, distance }) => {
    if (!garageSpot) return null;

    const sliderRef = useRef(null);

    const handleSliderMovement = (direction) => {
        const slider = sliderRef.current; // This refers to the scrollable container
        const scrollAmount = slider.offsetWidth;

        // If moving left, scroll by -scrollAmount, if right, scroll by +scrollAmount
        slider.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth", // Smooth scroll behavior
        });
    };

    return (
        <div className={`${style.sidebar} ${isOpen ? style.open : ""}`}>
            <div className={style.sidebarHeader}>
                <button className={style.closeButton} onClick={onClose}>
                    <img src={LeftArrow} alt="Close" />
                </button>
            </div>
            <div className={style.sidebarContent}>
                <h2>{garageSpot.locationName}</h2>
                <p>
                    <strong>Address:</strong> {garageSpot.address}
                </p>
                <p>
                    <strong>Available:</strong>{" "}
                    {garageSpot.isAvailable ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Total Spots:</strong> {garageSpot.totalSpots}
                </p>
                <p>
                    <strong>Free Spots:</strong> {garageSpot.freeSpots}
                </p>
                <p>
                    <strong>Price:</strong> ${garageSpot.price}
                </p>
                <p>
                    <strong>Distance</strong> ${distance} km
                </p>

                {/* Display garage images if available */}
                {garageSpot.garageImages &&
                    garageSpot.garageImages.length > 0 && (
                        <div className={style.imageSlider}>
                            <button
                                className={`${style.arrow} ${style.arrowLeft}`}
                                onClick={() => handleSliderMovement("left")}
                            >
                                &lt;
                            </button>
                            <div
                                className={style.imageContainer}
                                ref={sliderRef}
                            >
                                {garageSpot.garageImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Garage Image ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                className={`${style.arrow} ${style.arrowRight}`}
                                onClick={() => handleSliderMovement("right")}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Sidebar;
