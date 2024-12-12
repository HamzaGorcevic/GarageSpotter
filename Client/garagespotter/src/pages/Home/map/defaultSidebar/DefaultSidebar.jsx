import React, { useState } from "react";
import { MapPin, DollarSign, Car, BatteryCharging } from "lucide-react";
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
    setClearRoutes,
}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const formatDistance = (distance) => {
        return `${Math.round(distance)} km`;
    };

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

                {!showGarageSpots && (
                    <select
                        value={chargerTypeFilter}
                        onChange={(e) => setChargerTypeFilter(e.target.value)}
                        className={style.filterSelect}
                    >
                        <option value="">All Charger Types</option>
                        <option value="type-1">Type 1</option>
                        <option value="type-2">Type 2</option>
                        <option value="chademo">CHAdeMO</option>
                        <option value="ccs-combo-1">CCS Combo Type 1</option>
                        <option value="ccs-combo-2">CCS Combo Type 2</option>
                    </select>
                )}

                <div className={style.filtersContainer}>
                    <select
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                        className={style.filterSelect}
                    >
                        <option value="">All Distances</option>
                        <option value="50">Within 50 km</option>
                        <option value="100">Within 100 km</option>
                        <option value="200">Within 200 km</option>
                    </select>

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
                    {isSidebarVisible ? "Show Map" : "Show List"}
                </button>
                <button
                    className={`${style.toggleButton} ${style.open}`}
                    onClick={() => setShowGarageSpots(!showGarageSpots)}
                >
                    {showGarageSpots ? "Show Chargers" : "Show Garages"}
                </button>
            </div>

            {isSidebarVisible && (
                <div className={style.toggledSidebar}>
                    {showGarageSpots ? (
                        filteredGarages.length === 0 ? (
                            <div className={style.noGaragesContainer}>
                                <img
                                    src={noGarageImage}
                                    alt="No Garages Available"
                                    className={style.noGaragesImage}
                                />
                                <p className={style.noGaragesText}>
                                    No garages found
                                </p>
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
                                    onClick={() => {
                                        setClearRoutes(false);
                                        setSidebarOpen(true);
                                        setIsGarageSpot(true);
                                        setSelectedGarageSpotId(garage.id);
                                        countDistanceToSpot(garage);
                                    }}
                                >
                                    <div className={style.imageContainer}>
                                        <img
                                            src={
                                                garage.garageImages[0] ||
                                                "/placeholder.png"
                                            }
                                            alt={garage.locationName}
                                            className={style.garageImage}
                                        />
                                        <span className={style.statusBadge}>
                                            {
                                                garage.totalSpots.filter(
                                                    (spot) => spot.isAvailable
                                                ).length
                                            }{" "}
                                            spots
                                        </span>
                                    </div>

                                    <div className={style.garageInfo}>
                                        <h3 className={style.garageTitle}>
                                            {garage.locationName}
                                        </h3>

                                        <div className={style.infoGrid}>
                                            <div className={style.infoItem}>
                                                <DollarSign
                                                    size={16}
                                                    className={style.icon}
                                                />
                                                {formatPrice(garage.price)}
                                            </div>
                                            <div className={style.infoItem}>
                                                <MapPin
                                                    size={16}
                                                    className={style.icon}
                                                />
                                                {formatDistance(
                                                    garage.distance
                                                )}
                                            </div>
                                            <div className={style.infoItem}>
                                                <Car
                                                    size={16}
                                                    className={style.icon}
                                                />
                                                {garage.totalSpots.length} total
                                                spots
                                            </div>
                                        </div>

                                        <button className={style.reserveButton}>
                                            Reserve Spot
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : filteredChargers.length === 0 ? (
                        <div className={style.noGaragesContainer}>
                            <img
                                src={noGarageImage}
                                alt="No Chargers Available"
                                className={style.noGaragesImage}
                            />
                            <p className={style.noGaragesText}>
                                No chargers found
                            </p>
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
                                onClick={() => {
                                    setClearRoutes(false);
                                    setSidebarOpen(true);
                                    setIsGarageSpot(false);
                                    setSelectedGarageSpotId(charger.id);
                                    countDistanceToSpot(charger);
                                }}
                            >
                                <div className={style.imageContainer}>
                                    <img
                                        src={defaultChargerImage}
                                        alt={charger.name}
                                        className={style.garageImage}
                                    />
                                    <span className={style.statusBadge}>
                                        {charger.availableSpots} available
                                    </span>
                                </div>

                                <div className={style.garageInfo}>
                                    <h3 className={style.garageTitle}>
                                        {charger.name}
                                    </h3>

                                    <div className={style.infoGrid}>
                                        <div className={style.infoItem}>
                                            <DollarSign
                                                size={16}
                                                className={style.icon}
                                            />
                                            {formatPrice(charger.price)}
                                        </div>
                                        <div className={style.infoItem}>
                                            <MapPin
                                                size={16}
                                                className={style.icon}
                                            />
                                            {formatDistance(charger.distance)}
                                        </div>
                                        <div className={style.infoItem}>
                                            <BatteryCharging
                                                size={16}
                                                className={style.icon}
                                            />
                                            {charger.chargerType}
                                        </div>
                                    </div>

                                    <button className={style.reserveButton}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default DefaultSidebar;
