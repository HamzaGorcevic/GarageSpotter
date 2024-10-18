import React, { useState } from "react";
import style from "./defaultSidebar.module.scss";

const DefaultSidebar = ({
    garageSpots,
    setSidebarOpen,
    setSelectedGarageSpotId,
    countDistanceToSpot,
    selectedGarageSpotId,
}) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const reserveGarageSpot = async (reservationData) => {
        const response = await fetch(
            `${BASE_URL}/Reservation/reserveSingleSpot`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    garageSpotId: garageSpotId,
                    ...reservationData,
                }),
            }
        );
        const res = await response.json();
        fetchGarageSpot();
    };
    return (
        <div className={style.sidebarContainer}>
            {garageSpots.map((garage) => (
                <div
                    key={garage.id}
                    className={`${style.garageItem} ${
                        selectedGarageSpotId == garage.id
                            ? style.selectedGarageItem
                            : ""
                    }`}
                >
                    <img
                        src={garage.garageImages[0] || "/placeholder.png"}
                        alt={garage.locationName}
                        className={style.garageImage}
                    />
                    <div className={style.garageInfo}>
                        <h3 className={style.garageTitle}>
                            {garage.locationName}
                        </h3>
                        <p className={style.price}>${garage.price || "N/A"}</p>
                        <p className={style.availableSpots}>
                            {garage.totalSpots.length > 0
                                ? `${
                                      garage.totalSpots.filter(
                                          (spot) => spot.isAvailable
                                      ).length
                                  } available spots`
                                : "No spots"}
                        </p>
                        <button
                            className={style.reserveButton}
                            onClick={() => {
                                setSidebarOpen(true);
                                setSelectedGarageSpotId(garage.id);
                                countDistanceToSpot(garage);
                            }}
                        >
                            Reserve spot
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DefaultSidebar;
