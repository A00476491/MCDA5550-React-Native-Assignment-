import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Weather } from "../components/Weather";
import { fetchWeatherData } from "../utils/api";
import { getDatabaseInstance } from "../utils/database";
import type { WeatherData, WeatherAPIResponse, RowNumber } from "../types/weather";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";


export default function LocationSearch() {
  const router = useRouter();
  const [city, setCity] = useState<string>("");
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | { transaction: () => { executeSql: () => void } } | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await getDatabaseInstance();
        setDb(database);
        }
      catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    initDb();
  }, []);

  // 查询城市天气
  const fetchCityWeather = async () => {
    if (!city.trim()) {
      setCityError("Please enter a city name.");
      return;
    }

    try {
      setIsLoading(true);
      setCityError(null);

      const location = await fetchCityCoordinates(city);
      if (!location) {
        setCityError("City not found. Please enter a valid city name.");
        setCityWeather(null);
        return;
      }

      const weatherResponse: WeatherAPIResponse = await fetchWeatherData(
        location.latitude,
        location.longitude
      );

      setCityWeather({
        temperature: weatherResponse.main.temp,
        locationName: weatherResponse.name,
        weatherCondition: weatherResponse.weather[0].main,
        conditionIcon: weatherResponse.weather[0].icon,
      });
    } catch (err) {
      setCityError("Failed to fetch weather data.");
      console.error(err);
      setCityWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 保存天气数据到 SQLite
  const saveWeatherToDB = async () => {
    if (!db || !('runAsync' in db)) return;

    if (!cityWeather) {
      setCityError("No weather data to save.");
      return;
    }

    try {
      const result = await db.getAllAsync<RowNumber>(`SELECT COUNT(*) as rowNumber FROM Cities`);
      // console.log(result[0]['rowNumber']);
      if (result[0]['rowNumber'] >= 3) {
        console.log("Exceed limit of saved cities");
        return;
      }
    } catch (error) {
      console.error("Error checking weather data:", error);
    }

    try {
      const result = await db.runAsync(
        `INSERT OR REPLACE INTO Cities (name, temperature, weatherCondition) VALUES (?, ?, ?)`,
        [
          cityWeather.locationName,
          cityWeather.temperature,
          cityWeather.weatherCondition,
        ]
      );
      console.log("Weather data saved successfully!");
      setCityError(null);
    } catch (error) {
      console.error("Error saving weather data:", error);
      setCityError("Failed to save weather data.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 输入框 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />
        <Button
          mode="contained"
          onPress={fetchCityWeather}
          style={styles.searchButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </Button>
      </View>

      <View style={styles.saveButtonContainer}>
        {cityWeather && (
          <Button 
            mode="contained" 
            onPress={saveWeatherToDB} 
            style={styles.saveButton}
            // buttonColor="#00008B"
          >
            Save City
          </Button>
        )}
      </View>

      {/* 天气展示 */}
      <View style={styles.weatherContainer}>
        {cityWeather ? (
          <>
            <Weather weatherData={cityWeather} />
          </>
        ) : (
          <Text style={styles.placeholderText}>Enter a city to check the weather</Text>
        )}
        {cityError && <Text style={styles.errorText}>{cityError}</Text>}
      </View>

      {/* 页面跳转按钮 */}
      <View style={styles.navigationContainer}>
        <Button mode="contained" onPress={() => router.push("/")}>
          Local Weather
        </Button>
        <Button mode="contained" onPress={() => router.push("/screen3")}>
          Saved Weather
        </Button>
      </View>
    </View>
  );
}

// 通过城市名称获取经纬度
const fetchCityCoordinates = async (city: string) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
    };
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    return null;
  }
};

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    height: 40,
  },
  weatherContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "gray",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 20,
  },
  saveButtonContainer: {
    width: "100%",
    alignItems: "flex-end", 
    marginTop: 2,
    paddingRight: 8,
  },
  saveButton: {
    minWidth: 75,
    paddingHorizontal: 10,
  },
  
});
