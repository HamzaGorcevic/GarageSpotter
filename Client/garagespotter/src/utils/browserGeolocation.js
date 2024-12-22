export const getBrowserLocation = (options) => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Browser geolocation not supported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    source: "browser",
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    reject(new Error("Location permission denied"));
                } else {
                    reject(error);
                }
            },
            options
        );
    });
};
