import { getBrowserLocation } from "./browserGeolocation";
import { getLocationFromIP } from "./ipGeolocation";

const MAX_BROWSER_ATTEMPTS = 3;
const BROWSER_TIMEOUT = 10000; // 50 seconds total maximum

export const getCurrentPosition = async (acceptableAccuracy = 100) => {
    const startTime = Date.now();
    const browserReadings = [];

    // Try to get multiple browser locations for better accuracy
    for (let i = 0; i < MAX_BROWSER_ATTEMPTS; i++) {
        if (Date.now() - startTime > BROWSER_TIMEOUT) break;

        try {
            const reading = await getBrowserLocation();
            browserReadings.push(reading);

            // If we get a very accurate reading, return immediately
            if (reading.accuracy <= acceptableAccuracy) {
                return reading;
            }

            if (browserReadings.length >= 2) {
                const avgAccuracy =
                    browserReadings.reduce((sum, r) => sum + r.accuracy, 0) /
                    browserReadings.length;

                if (avgAccuracy <= acceptableAccuracy * 1.2) {
                    return browserReadings.reduce((best, current) =>
                        current.accuracy < best.accuracy ? current : best
                    );
                }
            }
        } catch (error) {
            console.warn(`Browser location attempt ${i + 1} failed:`, error);
            break;
        }
    }

    try {
        const ipLocation = await getLocationFromIP();
        if (ipLocation) {
            if (browserReadings.length > 0) {
                const bestBrowserReading = browserReadings.reduce(
                    (best, current) =>
                        current.accuracy < best.accuracy ? current : best
                );

                const weight = Math.min(0.8, 100 / bestBrowserReading.accuracy);

                return {
                    lat:
                        bestBrowserReading.lat * weight +
                        ipLocation.lat * (1 - weight),
                    lng:
                        bestBrowserReading.lng * weight +
                        ipLocation.lng * (1 - weight),
                    accuracy: Math.min(
                        bestBrowserReading.accuracy,
                        ipLocation.accuracy
                    ),
                    source: "browser+ip",
                    city: ipLocation.city,
                    country: ipLocation.country,
                };
            }

            return ipLocation;
        }
    } catch (error) {
        console.error("IP location failed:", error);
    }

    // If we have any browser readings, return the best one even if not perfect
    if (browserReadings.length > 0) {
        return browserReadings.reduce((best, current) =>
            current.accuracy < best.accuracy ? current : best
        );
    }

    throw new Error("Unable to get location from any available source");
};
