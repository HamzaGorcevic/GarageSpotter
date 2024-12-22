export const getBrowserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Browser geolocation not supported"));
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (position.coords.accuracy <= 100) {
                    navigator.geolocation.clearWatch(watchId);
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        source: "browser",
                        timestamp: position.timestamp,
                    });
                }
            },
            (error) => {
                navigator.geolocation.clearWatch(watchId);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // 50 seconds timeout
                maximumAge: 0,
            }
        );

        setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
            reject(
                new Error(
                    "Geolocation timeout - couldn't get accurate position"
                )
            );
        }, 50000);
    });
};
