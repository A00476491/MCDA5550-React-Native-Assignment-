export const API_KEY = "ba54be19d96707cf43191d3e9adbd4f9";

export const fetchWeatherData = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error('Weather data fetch failed');
  }
  return response.json();
}; 


export const fetchCitySuggestions = async (input: string) => {
  if (input.length < 2) return [];

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=5&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((city: any) => `${city.name}, ${city.country}`);

  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};
