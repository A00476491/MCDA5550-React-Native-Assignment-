import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { WeatherProps } from "../types/weather";

export function Weather({ weatherData }: WeatherProps) {
  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: `http://openweathermap.org/img/wn/${weatherData.conditionIcon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
        <Text style={styles.tempText}>{weatherData.locationName}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>{weatherData.temperature}˚</Text>
        <Text style={styles.subtitle}>{weatherData.weatherCondition}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,

    width: "100%",
    marginTop: 90,
    marginBottom: 55,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  tempText: {
    fontSize: 48,
    color: "black",
    marginTop: 5,
  },
  bodyContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    paddingLeft: 0,
  },
  title: {
    fontSize: 48,
    color: "black",
    textAlign: "center", 
  },
  subtitle: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
  },
}); 