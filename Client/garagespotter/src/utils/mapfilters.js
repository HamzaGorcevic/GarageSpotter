import { getDistanceToSpot } from "./distanceUtils";
export const filterSpots = (spots = [], filters = {}, userPosition) => {
    const {
        searchTerm = "",
        distanceFilter = null,
        priceFilter = null,
        chargerTypeFilter = null,
    } = filters;

    return spots
        .filter((spot) => {
            const name = spot.locationName || spot.name;

            const matchesSearchTerm = name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesDistance =
                !distanceFilter ||
                getDistanceToSpot(userPosition, spot) <=
                    parseInt(distanceFilter);
            const matchesPrice =
                !priceFilter || spot.price <= parseInt(priceFilter);
            const matchesChargerType =
                !chargerTypeFilter || spot.chargerType === chargerTypeFilter;

            return (
                matchesSearchTerm &&
                matchesDistance &&
                matchesPrice &&
                matchesChargerType
            );
        })
        .map((spot) => ({
            ...spot,
            distance: userPosition
                ? getDistanceToSpot(userPosition, spot)
                : null,
        }));
};
