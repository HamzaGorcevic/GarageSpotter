import getDistance from "geolib/es/getDistance";
import convertDistance from "geolib/es/convertDistance";

export const getDistanceToSpot = (userPosition, spot) => {
    if (!userPosition || !spot) {
        return false;
    }
    const distance = getDistance(
        { latitude: userPosition.lat, longitude: userPosition.lng },
        { latitude: spot.latitude, longitude: spot.longitude }
    );
    return convertDistance(distance, "km").toFixed(2);
};
