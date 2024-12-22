import React, { useState } from "react";
import { MapPin, DollarSign, Car, BatteryCharging } from "lucide-react";
import style from "./defaultSidebar.module.scss";
import noGarageImage from "../../../../assets/images/no-garages.jpg";
import defaultChargerImage from "../../../../assets/images/defaultChargerImage.png";
import { filterSpots } from "../../../../utils/mapfilters";

const CHARGER_IMAGES = {
    "type-1":
        "https://www.iqlaad.com/wp-content/uploads/2020/12/Adapter-T1-T2-car-side.jpg",
    "type-2":
        "https://www.evexpert.eu/resize/e/1200/1200/files/products/adapter-t2-t1---t1-t2/adapter-typ-1-typ-2.png",
    chademo: "https://m.media-amazon.com/images/I/71qUQ+YPKKL.jpg",
    "ccs-combo-1":
        "https://m.media-amazon.com/images/I/71W57yjz6PL._AC_UF894,1000_QL80_.jpg",
    "ccs-combo-2":
        "https://evniculus.eu/cdn/shop/files/Untitleddesign_12.png?v=1693570974",
};

const DefaultSidebar = ({
    userPosition,
    showGarageSpots,
    setShowGarageSpots,
    setSidebarOpen,
    setSelectedGarageSpotId,
    setIsGarageSpot,
    setClearRoutes,
    countDistanceToSpot,
    selectedGarageSpotId,
    filters,
    setFilters,
    garageSpots,
    chargers,
}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const { searchTerm, distanceFilter, priceFilter, chargerTypeFilter } =
        filters;
    const filteredSpots = showGarageSpots
        ? filterSpots(garageSpots, filters, userPosition)
        : filterSpots(chargers, filters, userPosition);

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);

    const formatDistance = (distance) => `${Math.round(distance)} km`;

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
                    onChange={(e) =>
                        setFilters({ ...filters, searchTerm: e.target.value })
                    }
                    className={style.searchGarageName}
                />

                {!showGarageSpots && (
                    <select
                        value={chargerTypeFilter}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                chargerTypeFilter: e.target.value,
                            })
                        }
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
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                distanceFilter: e.target.value,
                            })
                        }
                        className={style.filterSelect}
                    >
                        <option value="">All Distances</option>
                        <option value="50">Within 50 km</option>
                        <option value="100">Within 100 km</option>
                        <option value="200">Within 200 km</option>
                    </select>

                    <select
                        value={priceFilter}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                priceFilter: e.target.value,
                            })
                        }
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
                    {filteredSpots.length === 0 ? (
                        <div className={style.noGaragesContainer}>
                            <img
                                src={noGarageImage}
                                alt="No Spots Available"
                                className={style.noGaragesImage}
                            />
                            <p className={style.noGaragesText}>
                                No spots found
                            </p>
                        </div>
                    ) : (
                        filteredSpots.map((spot) => (
                            <div
                                key={spot.id}
                                className={`${style.garageItem} ${
                                    selectedGarageSpotId === spot.id
                                        ? style.selectedGarageItem
                                        : ""
                                }`}
                                onClick={() => {
                                    setClearRoutes(false);
                                    setSidebarOpen(true);
                                    setIsGarageSpot(showGarageSpots);
                                    setSelectedGarageSpotId(spot.id);
                                    countDistanceToSpot(spot);
                                }}
                            >
                                <div className={style.imageContainer}>
                                    <img
                                        src={
                                            showGarageSpots
                                                ? spot.garageImages?.[0] ||
                                                  "/placeholder.png"
                                                : CHARGER_IMAGES[
                                                      spot.chargerType
                                                  ] || defaultChargerImage
                                        }
                                        alt={spot.locationName || spot.name}
                                        className={style.garageImage}
                                    />
                                    <span className={style.statusBadge}>
                                        {
                                            spot?.totalSpots?.filter(
                                                (spot) => spot.isAvailable
                                            ).length
                                        }{" "}
                                        spots
                                    </span>
                                </div>

                                <div className={style.garageInfo}>
                                    <h3 className={style.garageTitle}>
                                        {spot.locationName || spot.name}
                                    </h3>

                                    <div className={style.infoGrid}>
                                        <div className={style.infoItem}>
                                            <DollarSign
                                                size={16}
                                                className={style.icon}
                                            />
                                            {formatPrice(spot.price)}
                                        </div>
                                        <div className={style.infoItem}>
                                            <MapPin
                                                size={16}
                                                className={style.icon}
                                            />
                                            {formatDistance(spot.distance)}
                                        </div>
                                        <div className={style.infoItem}>
                                            {showGarageSpots ? (
                                                <Car
                                                    size={16}
                                                    className={style.icon}
                                                />
                                            ) : (
                                                <BatteryCharging
                                                    size={16}
                                                    className={style.icon}
                                                />
                                            )}
                                            {showGarageSpots
                                                ? `${spot.totalSpots.length} total spots`
                                                : spot.chargerType}
                                        </div>
                                    </div>

                                    <button className={style.reserveButton}>
                                        {showGarageSpots
                                            ? "Reserve Spot"
                                            : "View Details"}
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
