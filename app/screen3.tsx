import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { getDatabaseInstance } from "../utils/database";
import type { WeatherData, WeatherData2 } from "../types/weather";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";

export default function SavedWeather() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | { transaction: () => { executeSql: () => void } } | null>(null);
  const [cityWeather, setCityWeather] = useState<WeatherData2[]>([]);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await getDatabaseInstance();
        setDb(database);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    initDb();
  }, []);
  
  useEffect(() => {
    if (db && "runAsync" in db) {
      selectData();
    }
  }, [db]); // 确保 selectData 在 db 初始化后执行
  
  const selectData = async () => {

    if (!db || !('runAsync' in db)) return;
    try {
      if ('getAllAsync' in db) {
        const result = await db.getAllAsync<WeatherData2>('SELECT * FROM Cities');
        console.log(result);
        setCityWeather(result);
      }
    } catch (error) {
      console.error('Error select:', error);
    }
  };

  const deleteData = async (cityName: string) => {
    if (!db || !("runAsync" in db)) return;
    try {
      await db.runAsync("DELETE FROM Cities WHERE name = ?", [cityName]);
      setCityWeather((prev) => prev.filter((item) => item.name !== cityName));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.dataContainer}>
        {cityWeather.length > 0 ? (
          cityWeather.map((item) => (
            <View key={item.name} style={styles.dataItem}>
              <View style={styles.dataTextContainer}>
                <Text style={styles.dataText}>City: {item.name}</Text>
                <Text style={styles.dataText}>Temperature: {item.temperature}°C</Text>
                <Text style={styles.dataText}>Condition: {item.weatherCondition}</Text>
              </View>
              <Button mode="contained" onPress={() => deleteData(item.name)} style={styles.deleteButton}>
                Delete
              </Button>
            </View>
          ))
        ) : (
          <Text style={styles.placeholderText}>No saved weather data.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => router.push("/")}>Local Weather</Button>
      </View>

      <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
        <Button mode="contained" onPress={() => router.push("/screen2")}>Location Search</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  dataContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataText: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  rightButtonContainer: {
    left: "auto",
    right: 20,
  },
});

  
