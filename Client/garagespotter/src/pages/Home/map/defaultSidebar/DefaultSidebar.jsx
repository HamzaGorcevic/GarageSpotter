import React, { useState } from "react";
import style from "./defaultSidebar.module.scss";

const DefaultSidebar = ({
    filteredGarages,
    setSidebarOpen,
    setSelectedGarageSpotId,
    countDistanceToSpot,
    selectedGarageSpotId,
    searchTerm,
    setSearchTerm,
    distanceFilter,
    setDistanceFilter,
    setPriceFilter,
    priceFilter,
}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    return (
        <div className={style.sidebarContainer}>
            <div className={style.alwaysVisible}>
                <input
                    type="text"
                    placeholder="Search Garage by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={style.searchGarageName}
                />

                <div className={style.filtersContainer}>
                    <select
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                        className={style.filterSelect}
                    >
                        <option value="">All Distances</option>
                        <option value="50">Within 50 miles</option>
                        <option value="100">Within 100 miles</option>
                        <option value="200">Within 200 miles</option>
                    </select>

                    {/* Price Filter */}
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className={style.filterSelect}
                    >
                        <option value="">All Prices</option>
                        <option value="10">Under $10</option>
                        <option value="20">Under $20</option>
                        <option value="50">Under $50</option>
                    </select>
                </div>
                <button
                    className={style.toggleButton}
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                >
                    {isSidebarVisible ? "Show Map" : "Show Sidebar"}
                </button>
            </div>
            {isSidebarVisible ? (
                <div className={style.toggledSidebar}>
                    {filteredGarages.map((garage) => (
                        <div
                            key={garage.id}
                            className={`${style.garageItem} ${
                                selectedGarageSpotId == garage.id
                                    ? style.selectedGarageItem
                                    : ""
                            }`}
                        >
                            <img
                                src={
                                    garage.garageImages[0] || "/placeholder.png"
                                }
                                alt={garage.locationName}
                                className={style.garageImage}
                            />
                            <div className={style.garageInfo}>
                                <h3 className={style.garageTitle}>
                                    {garage.locationName}
                                </h3>
                                <p className={style.price}>
                                    ${garage.price || "N/A"}
                                </p>
                                <p className={style.price}>
                                    {garage.distance || "N/A"} km
                                </p>
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
            ) : (
                <></>
            )}
        </div>
    );
};

export default DefaultSidebar;
