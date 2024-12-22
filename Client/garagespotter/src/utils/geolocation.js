import { getBrowserLocation } from "./browserGeolocation";

const MAX_BROWSER_ATTEMPTS = 2;
const BROWSER_TIMEOUT = 10000;

export const getCurrentPosition = async (acceptableAccuracy = 100) => {
    const startTime = Date.now();
    const browserReadings = [];

    for (let i = 0; i < MAX_BROWSER_ATTEMPTS; i++) {
        if (Date.now() - startTime > BROWSER_TIMEOUT) break;

        try {
            const reading = await getBrowserLocation();
            browserReadings.push(reading);

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

    if (browserReadings.length > 0) {
        return browserReadings.reduce((best, current) =>
            current.accuracy < best.accuracy ? current : best
        );
    }

    throw new Error("Unable to get location from any available source");
};
