export interface WeatherData {
  temperature: number;
  locationName: string;
  weatherCondition: string;
  conditionIcon: string;
}

export interface WeatherData2 {
  name: string;
  temperature: number;
  weatherCondition: string;
}

export interface WeatherProps {
  weatherData: WeatherData;
}

export interface WeatherAPIResponse {
  main: {
    temp: number;
  };
  name: string;
  weather: Array<{
    main: string;
    icon: string;
  }>;
} 

export interface RowNumber {
  rowNumber: number;
}

export interface LocationCoords {
  coords: {
    latitude: number;
    longitude: number;
  };
}