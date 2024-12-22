// IP-based geolocation using ipapi.co (free, no API key needed)
export const getLocationFromIP = async () => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("IP Geolocation failed");

        const data = await response.json();
        return {
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            accuracy: 5000, // IP geolocation typically has accuracy within 5-10km
            source: "ip",
        };
    } catch (error) {
        console.error("IP Geolocation error:", error);
        return null;
    }
};
