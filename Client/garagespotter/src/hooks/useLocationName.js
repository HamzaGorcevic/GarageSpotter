const getLatLngFromCountry = async (countryName) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(
                countryName
            )}&format=json&accept-language=en`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }

        const results = await response.json();
        if (results.length === 0) {
            throw new Error("No results found for the specified country");
        }

        const { lat, lon, display_name } = results[0];

        const standardizedCountryName = display_name.split(",")[0];

        return {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            name: standardizedCountryName,
        };
    } catch (error) {
        console.error("Error fetching lat/lng:", error);
        return { lat: null, lon: null, name: countryName }; // Fallback to original name
    }
};

export default getLatLngFromCountry;
