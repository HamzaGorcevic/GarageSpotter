import React, { useState } from "react";
import style from "./defaultSidebar.module.scss";
import noGarageImage from "../../../../assets/images/no-garages.jpg";
import defaultChargerImage from "../../../../assets/images/defaultChargerImage.png";

const DefaultSidebar = ({
    filteredGarages,
    filteredChargers,
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
    showGarageSpots,
    setShowGarageSpots,
    setChargerTypeFilter,
    chargerTypeFilter,
    setIsGarageSpot,
}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    return (
        <div className={style.sidebarContainer}>
            <div className={style.alwaysVisible}>
                <input
                    type="text"
                    placeholder={
                        showGarageSpots
                            ? "Search Garage by Name"
                            : "Search Charger by Name"
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={style.searchGarageName}
                />

                <div className={style.filtersContainer}>
                    {/* Distance Filter */}
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

                    {/* Charger Type Filter */}
                    {!showGarageSpots && (
                        <select
                            value={chargerTypeFilter}
                            onChange={(e) =>
                                setChargerTypeFilter(e.target.value)
                            }
                            className={style.filterSelect}
                        >
                            <option value="">All Charger Types</option>
                            <option value="Type1">Type 1</option>
                            <option value="Type2">Type 2</option>
                            <option value="Fast">Fast Charger</option>
                        </select>
                    )}
                </div>

                <button
                    className={style.toggleButton}
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                >
                    {isSidebarVisible ? "Show Map" : "Show Sidebar"}
                </button>
                <button
                    className={`${style.toggleButton} ${style.open}`}
                    onClick={() => setShowGarageSpots(!showGarageSpots)}
                >
                    {showGarageSpots ? "Show Chargers" : "Show Garage Spots"}
                </button>
            </div>

            {isSidebarVisible ? (
                <div className={style.toggledSidebar}>
                    {showGarageSpots ? (
                        filteredGarages.length === 0 ? (
                            <div className={style.noGaragesContainer}>
                                <img
                                    src={noGarageImage}
                                    alt="No Garages"
                                    className={style.noGaragesImage}
                                />
                            </div>
                        ) : (
                            filteredGarages.map((garage) => (
                                <div
                                    key={garage.id}
                                    className={`${style.garageItem} ${
                                        selectedGarageSpotId === garage.id
                                            ? style.selectedGarageItem
                                            : ""
                                    }`}
                                >
                                    <img
                                        src={
                                            garage.garageImages[0] ||
                                            "/placeholder.png"
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
                                                          (spot) =>
                                                              spot.isAvailable
                                                      ).length
                                                  } available spots`
                                                : "No spots"}
                                        </p>
                                        <button
                                            className={style.reserveButton}
                                            onClick={() => {
                                                setSidebarOpen(true);
                                                setIsGarageSpot(true);
                                                setSelectedGarageSpotId(
                                                    garage.id
                                                );
                                                countDistanceToSpot(garage);
                                            }}
                                        >
                                            Reserve spot
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : filteredChargers.length === 0 ? (
                        <div className={style.noGaragesContainer}>
                            <img
                                src={noGarageImage}
                                alt="No Chargers"
                                className={style.noGaragesImage}
                            />
                        </div>
                    ) : (
                        filteredChargers.map((charger) => (
                            <div
                                key={charger.id}
                                className={`${style.garageItem} ${
                                    selectedGarageSpotId === charger.id
                                        ? style.selectedGarageItem
                                        : ""
                                }`}
                            >
                                <img
                                    src={defaultChargerImage}
                                    alt={charger.name}
                                    className={style.garageImage}
                                />
                                <div className={style.garageInfo}>
                                    <h3 className={style.garageTitle}>
                                        {charger.name}
                                    </h3>
                                    <p className={style.price}>
                                        ${charger.price || "N/A"}
                                    </p>
                                    <p className={style.price}>
                                        {charger.distance || "N/A"} km
                                    </p>
                                    <p className={style.availableSpots}>
                                        {charger.availableSpots + " spots" ||
                                            "No spots"}
                                    </p>
                                    <button
                                        className={style.reserveButton}
                                        onClick={() => {
                                            setSidebarOpen(true);
                                            setIsGarageSpot(false);
                                            setSelectedGarageSpotId(charger.id);
                                            countDistanceToSpot(charger);
                                        }}
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default DefaultSidebar;
