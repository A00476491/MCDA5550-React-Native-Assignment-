import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { Weather } from "../components/Weather";
import { fetchWeatherData } from "../utils/api";
import type { WeatherData, WeatherAPIResponse, LocationCoords } from "../types/weather";
import { Button } from 'react-native-paper'; 
import { useRouter } from "expo-router";

export default function LocalWeather() {
  // isLoading: tracks if we're fetching data
  const [isLoading, setIsLoading] = useState(false);
  // error: stores error messages if something goes wrong
  const [error, setError] = useState<string | null>(null);
  // weatherData: stores the current weather information
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    locationName: "",
    weatherCondition: "",
    conditionIcon: "",
  });

  // useEffect hook runs when the component mounts
  useEffect(() => {
    
    async function getLocation(): Promise<LocationCoords> {
      try {
        const locationPromise = Location.getCurrentPositionAsync({});
        
        // 等待 1 秒，如果还没拿到位置，就返回默认位置
        const location = await Promise.race([
          locationPromise,
          new Promise<LocationCoords>((resolve) => setTimeout(() => resolve({
            coords: { latitude: 44.6488, longitude: -63.5752 }
          }), 1000))
        ]);
    
        return location;
      } catch {
        return { coords: { latitude: 44.6488, longitude: -63.5752 } };
      }
    }

    // Async function to fetch weather data
    const getWeatherData = async () => {
      try {
        // Start loading state
        setIsLoading(true);
        setError(null);

        // Request permission to access device location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        // Get current device location
        const location = await getLocation();
        
        // Fetch weather data using device coordinates
        const weatherResponse: WeatherAPIResponse = await fetchWeatherData(
          location.coords.latitude,
          location.coords.longitude
        );

        // Update state with weather data
        setWeatherData({
          temperature: weatherResponse.main.temp,
          locationName: weatherResponse.name,
          weatherCondition: weatherResponse.weather[0].main,
          conditionIcon: weatherResponse.weather[0].icon,
        });
      } catch (err) {
        // Handle any errors that occur
        setError("Failed to fetch weather data");
        console.error(err);
      } finally {
        // Stop loading state regardless of success/failure
        setIsLoading(false);
      }
    };

    // Call the function when component mounts
    getWeatherData();
  }, []); // Empty dependency array means this runs once when component mounts

  // Render UI based on current state
  const router = useRouter();
  return (
    <View style= {styles.container} >
      <Weather weatherData={weatherData}  />
  
      <View style={styles.buttonContainer}>
        <Button 
            mode="contained" 
            onPress={() => router.push("/screen2")}
        >
            Location Search
        </Button>
      </View>
  
      <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
        <Button 
            mode="contained"
            onPress={() => router.push("/screen3")}
        >
            Saved Weather
        </Button>
      </View>   
    </View>
  );
  }
  
  // Styles for the components
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: "white",
      alignItems: 'center',
      paddingTop: 40, // Add top padding to create space from top
      paddingHorizontal: 20, // Add horizontal padding for content spacing
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    rightButtonContainer: {
      left: 'auto', // cancle left style
      right: 20,
    }
  });
