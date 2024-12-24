import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGetWeatherQuery, useGetForecastQuery } from "../../services/weatherApi";
import * as Location from "expo-location";

import styles from "./Main.styles";

const Main = () => {
  const [queryLocation, setQueryLocation] = useState<string>(""); 
  const { data: weatherData, error: weatherError, isLoading: isWeatherLoading } = useGetWeatherQuery(queryLocation, {
    skip: !queryLocation,
  });
  
  const { data: forecastData, error: forecastError, isLoading: isForecastLoading } = useGetForecastQuery(queryLocation, {
    skip: !queryLocation,
  });  
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coordinateString, setCoordinateString] = useState<string | null>(null);

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
      setCoordinateString(coordinates);

      setQueryLocation(coordinates); 
    }

    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {isWeatherLoading && <Text>Loading weather...</Text>}
      {weatherError && (
        <Text>
          Weather Error:
          {"status" in weatherError
            ? weatherError.status
            : "message" in weatherError
            ? weatherError.message
            : "data" in weatherError && typeof weatherError.data === "string"
            ? weatherError.data
            : "An unknown error occurred"}
        </Text>
      )}

      {weatherData && <Text>Weather: {weatherData.current.condition.text}</Text>}

      {isForecastLoading && <Text>Loading forecast...</Text>}
      {forecastError && (
        <Text>
          Forecast Error:
          {"status" in forecastError
            ? forecastError.status
            : "message" in forecastError
            ? forecastError.message
            : "data" in forecastError && typeof forecastError.data === "string"
            ? forecastError.data
            : "An unknown error occurred"}
        </Text>
      )}

      {forecastData && <Text>Forecast: {forecastData.forecast.forecastday[0].day.condition.text}</Text>}

      <TouchableOpacity onPress={() => console.log(forecastData)}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Main;
