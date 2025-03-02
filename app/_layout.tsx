import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ADD8E6",
        },
        headerTitleStyle: {
          color: "black",
        },
        headerTitle: "Weather Forecast 🌤️",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Weather Forecast 🌤️"
        }}
      />
      <Stack.Screen
        name="screen2"
        options={{
          title: "Search & Display Weather"
        }}
      />
      <Stack.Screen
        name="screen3"
        options={{
          title: "Saved Locations"
        }}
      />
    </Stack>
  );
}
