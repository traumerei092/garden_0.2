import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lng: number;
}

export async function getCoordinatesFromAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
}