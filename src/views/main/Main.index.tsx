import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useGetForecastQuery } from "../../services/weatherApi";
import * as Location from "expo-location";

import styles from "./Main.styles";

import { LinearGradient } from 'expo-linear-gradient';


const Main = () => {
  const [queryLocation, setQueryLocation] = useState<string>("");
  const {
    data: forecastData,
    error: forecastError,
    isLoading: isForecastLoading,
  } = useGetForecastQuery(queryLocation, {
    skip: !queryLocation,
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const coordinates =
        location?.coords.latitude + "," + location?.coords.longitude;

      setQueryLocation(coordinates);
    }

    getCurrentLocation();
  }, []);

  return (
    <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]}
    style={styles.container}>
      {isForecastLoading && <Text>Loading forecast...</Text>}
      {forecastError && (
        <Text>
          Error:
          {"status" in forecastError
            ? forecastError.status
            : "message" in forecastError
            ? forecastError.message
            : "data" in forecastError && typeof forecastError.data === "string"
            ? forecastError.data
            : "An unknown error occurred"}
        </Text>
      )}

      {forecastData && (
        <>
          <Text style={styles.location}>{forecastData.location.name}</Text>
          <Text style={styles.temperature}>{forecastData.current.temp_c}°C</Text>
          <Text style={styles.feelslike}>Feels like: {forecastData.current.feelslike_c}°C</Text>
          <Text>Current Weather: {forecastData.current.condition.text}</Text>
          <Image
            source={{
              uri: `https:${forecastData.current.condition.icon}`,
            }}
            style={{ width: 50, height: 50 }}
          />
          <Text>
            Forecast: {forecastData.forecast.forecastday[0].day.condition.text}
          </Text>
        </>
      )}

      <TouchableOpacity onPress={() => console.log(forecastData)}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Main;
