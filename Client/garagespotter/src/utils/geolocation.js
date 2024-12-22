// Simple geolocation utility that handles permissions properly
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                // Provide more user-friendly error messages
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(
                            new Error(
                                "Please allow location access in your browser settings"
                            )
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(
                            new Error("Location information is unavailable")
                        );
                        break;
                    case error.TIMEOUT:
                        reject(new Error("Location request timed out"));
                        break;
                    default:
                        reject(new Error("An unknown error occurred"));
                }
            },
            options
        );
    });
};
